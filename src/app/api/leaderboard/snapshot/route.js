// app/api/leaderboard/snapshot/route.js
// Called by Vercel Cron every hour — see vercel.json
import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Service role client — bypasses RLS for admin operations
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
)

export async function GET(request) {
  // Verify this is called by Vercel Cron
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const start = Date.now()
  const contexts = await buildLeaderboardContexts()
  const results = []

  for (const context of contexts) {
    try {
      await computeAndSaveSnapshot(context)
      results.push({ context: context.key, status: 'success' })
    } catch (error) {
      results.push({ context: context.key, status: 'failed', error: error.message })
    }
  }

  return NextResponse.json({
    computed:    results.length,
    duration_ms: Date.now() - start,
    results,
  })
}

async function buildLeaderboardContexts() {
  const contexts = []

  const { data: exams } = await supabaseAdmin
    .from('exam_bodies').select('id, code').eq('is_active', true)

  for (const exam of exams || []) {
    contexts.push({ type: 'exam_type', key: `exam:${exam.code}`, examBodyId: exam.id })
  }

  const { data: schools } = await supabaseAdmin
    .from('schools').select('id, canonical_name').gt('student_count', 0)

  for (const school of schools || []) {
    const keyword = school.canonical_name.split(' ')[0]
    contexts.push({ type: 'school_all', key: `school:${keyword}`, schoolId: school.id })
    const classes = ['JSS1','JSS2','JSS3','SS1','SS2','SS3']
    for (const cls of classes) {
      contexts.push({ type: 'school_class', key: `${cls}:${keyword}`, schoolId: school.id, classLevel: cls })
    }
  }

  return contexts
}

async function computeAndSaveSnapshot(context) {
  let query = supabaseAdmin
    .from('students')
    .select('id, display_name, weekly_xp, monthly_xp, xp, class_level')

  if (context.type === 'exam_type') {
    const { data: enrolled } = await supabaseAdmin
      .from('student_exams').select('student_id').eq('exam_body_id', context.examBodyId).eq('status', 'active')
    const ids = (enrolled || []).map((e) => e.student_id)
    if (ids.length === 0) return
    query = query.in('id', ids)
  } else if (context.type === 'school_all') {
    query = query.eq('school_id', context.schoolId)
  } else if (context.type === 'school_class') {
    query = query.eq('school_id', context.schoolId).eq('class_level', context.classLevel)
  }

  const { data: students } = await query
  if (!students || students.length === 0) return

  const periods = [
    { period: 'weekly',   scoreField: 'weekly_xp'  },
    { period: 'monthly',  scoreField: 'monthly_xp' },
    { period: 'all_time', scoreField: 'xp'         },
  ]

  for (const { period, scoreField } of periods) {
    const ranked = [...students]
      .sort((a, b) => (b[scoreField] || 0) - (a[scoreField] || 0))
      .map((student, index) => ({
        snapshot_type: context.type,
        period,
        context_key:   context.key,
        student_id:    student.id,
        rank:          index + 1,
        score:         student[scoreField] || 0,
        display_name:  student.display_name,
        class_level:   student.class_level,
        computed_at:   new Date().toISOString(),
      }))

    await supabaseAdmin.from('leaderboard_snapshots')
      .delete().eq('context_key', context.key).eq('period', period)

    if (ranked.length > 0) {
      await supabaseAdmin.from('leaderboard_snapshots').insert(ranked)
    }
  }
}
