// POST /api/admin/lessons/batch — Batch lesson generation via Anthropic Batches API
import Anthropic from '@anthropic-ai/sdk'
import { LESSON_GENERATION_SYSTEM_PROMPT, buildSubtopicPayload } from '@/lib/prompts/lessonGeneration'

const anthropic = new Anthropic()

export async function POST(request) {
  try {
    const { subtopics, curriculum } = await request.json()
    if (!subtopics?.length || !curriculum) {
      return Response.json({ error: 'Missing subtopics or curriculum' }, { status: 400 })
    }

    const requests = subtopics.map(sub => ({
      custom_id: sub.subtopicId,
      params: {
        model:      'claude-sonnet-4-20250514',
        max_tokens: 6000,
        system:     LESSON_GENERATION_SYSTEM_PROMPT,
        messages:   [{ role: 'user', content: JSON.stringify(buildSubtopicPayload(sub, curriculum)) }],
      },
    }))

    const batch = await anthropic.beta.messages.batches.create({ requests })

    // TODO: await db.batchJobs.create({ data: { batchId: batch.id, curriculumId: curriculum.id, ... } })
    return Response.json({ batchId: batch.id, status: batch.processing_status, total: subtopics.length })

  } catch (err) {
    console.error('Batch generation error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}