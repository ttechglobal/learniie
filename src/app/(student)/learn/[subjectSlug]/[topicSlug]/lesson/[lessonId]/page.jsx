'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Lesson page — routes to the correct engine based on lesson type.
//
// URL: /learn/[subjectSlug]/[topicSlug]/lesson/[lessonId]
//
// If lessonId starts with a CPA-format id (e.g. 'physics-velocity-1'),
// the CPA LessonEngine is used.
// Otherwise the legacy LessonFlow is used (for the existing mock lessons).
//
// To add a new CPA lesson: create a file in /data/lessons/ and add its id
// to the LESSON_MAP below.
// ─────────────────────────────────────────────────────────────────────────────

import { useRouter, useParams } from 'next/navigation'
import { LessonEngine } from '@/components/lesson/cpa/LessonEngine'
import { LessonFlow }   from '@/components/lesson/flow/LessonFlow'
import { velocityLesson1 } from '@/data/lessons/physics-velocity-lesson1'
import { MOCK_LESSON_FLOW } from '@/lib/mock/data'

// Map lessonId → lesson data object
// Add new CPA lessons here as they are created
const CPA_LESSONS = {
  'physics-velocity-1': velocityLesson1,
}

export default function LessonPage() {
  const router = useRouter()
  const params = useParams()
  const lessonId = params?.lessonId || 'lesson-1'

  const onComplete = () => router.push('/learn')

  // CPA lesson
  if (CPA_LESSONS[lessonId]) {
    return (
      <LessonEngine
        lesson={CPA_LESSONS[lessonId]}
        onComplete={onComplete}
      />
    )
  }

  // Legacy LessonFlow (existing slides)
  return (
    <LessonFlow
      lesson={MOCK_LESSON_FLOW}
      onComplete={onComplete}
    />
  )
}