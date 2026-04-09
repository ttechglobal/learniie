// app/api/generate/lesson/route.js
import { NextResponse } from 'next/server'
import { claude } from '@/lib/claude/client'
import { LESSON_SYSTEM_PROMPT, buildLessonBrief } from '@/lib/claude/prompts/lesson'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

const requestSchema = z.object({
  lessonId: z.string().uuid(),
  curriculumData: z.object({
    topicTitle:               z.string(),
    subtopicTitle:            z.string(),
    subject:                  z.string(),
    classLevel:               z.string(),
    term:                     z.number(),
    lessonPosition:           z.number(),
    totalLessonsInSubtopic:   z.number(),
    precedingLessons:         z.array(z.object({ title: z.string(), keyConcepts: z.array(z.string()) })),
    specificObjectives:       z.array(z.string()),
    contentNotes:             z.string().optional(),
    examRelevance:            z.record(z.object({ frequency: z.string(), section: z.string() })),
    requiredBites:            z.array(z.string()),
    recommendedBites:         z.array(z.string()),
  }),
})

export async function POST(request) {
  const supabase = await createServerSupabaseClient()

  // Verify user is authenticated
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  let parsed
  try {
    parsed = requestSchema.parse(body)
  } catch (err) {
    return NextResponse.json({ error: 'Invalid request', details: err.errors }, { status: 400 })
  }

  const { lessonId, curriculumData } = parsed
  const userMessage = buildLessonBrief(curriculumData)

  let response
  try {
    response = await claude.messages.create({
      model:      'claude-sonnet-4-5',
      max_tokens: 4000,
      system:     LESSON_SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: userMessage }],
    })
  } catch (err) {
    return NextResponse.json({ error: 'Claude API error', message: err.message }, { status: 502 })
  }

  const rawContent = response.content[0].text
  let lessonJSON

  try {
    lessonJSON = JSON.parse(rawContent)
  } catch {
    await supabase.from('lessons').update({
      generation_status: 'review_pending',
      review_notes: 'JSON parse failed: ' + rawContent.slice(0, 200),
    }).eq('id', lessonId)

    return NextResponse.json({ error: 'Claude returned invalid JSON' }, { status: 500 })
  }

  const presentBites   = lessonJSON.bites.map((b) => b.bite_type)
  const missingRequired = curriculumData.requiredBites.filter((b) => !presentBites.includes(b))
  const hasVerifyFlag  = rawContent.includes('[VERIFY]')

  const status = missingRequired.length > 0 || hasVerifyFlag ? 'review_pending' : 'generated'

  // Delete old bites then insert fresh
  await supabase.from('lesson_bites').delete().eq('lesson_id', lessonId)

  const biteRows = lessonJSON.bites.map((bite) => ({
    lesson_id:   lessonId,
    bite_type:   bite.bite_type,
    content_json: bite.content_json,
    order_index: bite.order_index,
    is_required: curriculumData.requiredBites.includes(bite.bite_type),
  }))

  await supabase.from('lesson_bites').insert(biteRows)

  await supabase.from('lessons').update({
    title:             lessonJSON.title,
    generation_status: status,
    generation_model:  'claude-sonnet-4-5',
    generation_tokens_used: response.usage.input_tokens + response.usage.output_tokens,
    generated_at:      new Date().toISOString(),
    review_notes: missingRequired.length > 0
      ? `Missing required bites: ${missingRequired.join(', ')}${hasVerifyFlag ? ' | Contains [VERIFY] flags' : ''}`
      : hasVerifyFlag ? 'Contains [VERIFY] flags — needs fact check' : null,
  }).eq('id', lessonId)

  return NextResponse.json({
    success: true,
    status,
    biteCount: biteRows.length,
    missingRequired,
    hasVerifyFlag,
  })
}
