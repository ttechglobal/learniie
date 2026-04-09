// lib/hooks/useProgress.js
'use client'

import { useQuery } from '@tanstack/react-query'
import { createClient } from '@/lib/supabase/client'

export function useTopicProgress(topicId) {
  const supabase = createClient()

  return useQuery({
    queryKey: ['progress', topicId],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase
        .from('student_topic_progress')
        .select('*')
        .eq('student_id', user.id)
        .eq('topic_id', topicId)
        .single()
      return data
    },
    enabled: !!topicId,
  })
}
