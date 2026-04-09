// app/api/generate/questions/route.js
import { NextResponse } from 'next/server'
import { claude } from '@/lib/claude/client'
import { QUESTION_SYSTEM_PROMPT, buildQuestionsPrompt } from '@/lib/claude/prompts/questions'
import { createServerSupabaseClient } from '@/lib/supabase/server'
import { z } from 'zod'

const requestSchema = z.object({
  lessonId: z.string().uuid(),
})

export async function POST(request) {
  const supabase = await createServerSupabaseClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { lessonId } = requestSchema.parse(await request.json())

  // Fetch lesson bites to use as context
  const { data: bites } = await supabase
    .from('lesson_bites')
    .select('*')
    .eq('lesson_id', lessonId)
    .order('order_index')

  if (!bites || bites.length === 0) {
    return NextResponse.json({ error: 'No bites found for this lesson' }, { status: 404 })
  }

  const response = await claude.messages.create({
    model:      'claude-sonnet-4-5',
    max_tokens: 2000,
    system:     QUESTION_SYSTEM_PROMPT,
    messages:   [{ role: 'user', content: buildQuestionsPrompt(bites) }],
  })

  let parsed
  try {
    parsed = JSON.parse(response.content[0].text)
  } catch {
    return NextResponse.json({ error: 'Claude returned invalid JSON' }, { status: 500 })
  }

  // Delete existing lesson questions and insert fresh ones
  await supabase.from('lesson_questions').delete().eq('lesson_id', lessonId)
  const rows = parsed.questions.map((q) => ({
    lesson_id:    lessonId,
    difficulty:   q.difficulty,
    content_json: q.content_json,
  }))
  await supabase.from('lesson_questions').insert(rows)

  return NextResponse.json({ success: true, count: rows.length })
}
