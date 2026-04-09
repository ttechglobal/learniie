'use client'
import { useRouter } from 'next/navigation'
import { MOCK_LESSON_FLOW } from '@/lib/mock/data'
import { LessonFlow } from '@/components/lesson/flow/LessonFlow'

export default function LessonPage() {
  const router = useRouter()
  return (
    <LessonFlow
      lesson={MOCK_LESSON_FLOW}
      onComplete={() => router.push('/learn')}
    />
  )
}