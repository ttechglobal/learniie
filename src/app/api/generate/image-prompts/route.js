// app/api/generate/image-prompts/route.js
import { NextResponse } from 'next/server'
import { claude } from '@/lib/claude/client'
import { IMAGE_PROMPT_SYSTEM } from '@/lib/claude/prompts/imagePrompts'
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

  const { data: lesson } = await supabase
    .from('lessons')
    .select('title, lesson_bites(*)')
    .eq('id', lessonId)
    .single()

  const response = await claude.messages.create({
    model:      'claude-sonnet-4-5',
    max_tokens: 1000,
    system:     IMAGE_PROMPT_SYSTEM,
    messages:   [{
      role: 'user',
      content: `Generate 2 image prompts for this lesson: "${lesson.title}"\n\nKey content: ${lesson.lesson_bites.slice(0, 3).map((b) => JSON.stringify(b.content_json)).join('\n')}`,
    }],
  })

  let parsed
  try {
    parsed = JSON.parse(response.content[0].text)
  } catch {
    return NextResponse.json({ error: 'Invalid JSON from Claude' }, { status: 500 })
  }

  await supabase.from('lessons').update({ image_prompts: parsed.prompts }).eq('id', lessonId)

  return NextResponse.json({ success: true, prompts: parsed.prompts })
}
