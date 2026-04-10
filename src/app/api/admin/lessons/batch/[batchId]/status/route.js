// GET /api/admin/batch/[batchId]/status — Poll batch status, retrieve results when done
import Anthropic from '@anthropic-ai/sdk'
import { sanitiseLesson } from '@/lib/utils/sanitiseLesson'

const anthropic = new Anthropic()

export async function GET(request, { params }) {
  const { batchId } = await params

  try {
    const batch = await anthropic.beta.messages.batches.retrieve(batchId)
    const res = {
      batchId:       batch.id,
      status:        batch.processing_status,
      requestCounts: batch.request_counts,
      createdAt:     batch.created_at,
      endedAt:       batch.ended_at,
    }

    if (batch.processing_status === 'ended') {
      const lessons = [], errors = []
      for await (const result of await anthropic.beta.messages.batches.results(batchId)) {
        if (result.result.type === 'succeeded') {
          try {
            const raw   = result.result.message.content[0].text
            const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
            const lesson = sanitiseLesson(JSON.parse(clean))
            // TODO: await db.lessons.create({ data: lesson })
            lessons.push({ subtopicId: result.custom_id, lessonId: lesson.lessonId, status: 'generated' })
          } catch(e) {
            errors.push({ subtopicId: result.custom_id, error: e.message, status: 'failed' })
          }
        } else {
          errors.push({ subtopicId: result.custom_id, error: result.result.error?.message || 'Failed', status: 'failed' })
        }
      }
      // TODO: await db.batchJobs.update({ where: { batchId }, data: { status:'complete', completed: lessons.length, failed: errors.length } })
      res.lessons = lessons
      res.errors  = errors
    }

    return Response.json(res)

  } catch (err) {
    console.error('Batch status error:', err)
    return Response.json({ error: err.message }, { status: 500 })
  }
}