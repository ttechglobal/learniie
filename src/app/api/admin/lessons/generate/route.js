// POST /api/admin/lessons/generate — Single lesson generation
import Anthropic from '@anthropic-ai/sdk'
import { LESSON_GENERATION_SYSTEM_PROMPT, buildSubtopicPayload } from '@/lib/prompts/lessonGeneration'
import { sanitiseLesson } from '@/lib/utils/sanitiseLesson'

const anthropic = new Anthropic()

export async function POST(request) {
  try {
    const { subtopic, curriculum } = await request.json()
    if (!subtopic || !curriculum) {
      return Response.json({ error: 'Missing subtopic or curriculum' }, { status: 400 })
    }

    const message = await anthropic.messages.create({
      model:      'claude-sonnet-4-20250514',
      max_tokens: 6000,
      system:     LESSON_GENERATION_SYSTEM_PROMPT,
      messages:   [{ role: 'user', content: JSON.stringify(buildSubtopicPayload(subtopic, curriculum)) }],
    })

    const raw    = message.content[0].text
    const clean  = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    const parsed = JSON.parse(clean)
    const lesson = sanitiseLesson(parsed)

    // TODO: await db.lessons.create({ data: lesson })
    return Response.json({ lesson, usage: message.usage })

  } catch (err) {
    console.error('Lesson generation error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}