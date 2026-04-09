// lib/hooks/useAcademicWeek.js
'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useAcademicWeek() {
  const [weekData, setWeekData] = useState({
    currentWeek: null,
    term: null,
    shouldShowMockTestPrompt: false,
    shouldShowMockExamPrompt: false,
    isLoading: true,
  })

  useEffect(() => {
    async function fetchCalendar() {
      const supabase = createClient()
      const { data: calendar } = await supabase
        .from('academic_calendar')
        .select('*')
        .eq('is_active', true)
        .single()

      if (!calendar) {
        setWeekData((prev) => ({ ...prev, isLoading: false }))
        return
      }

      const today = new Date()
      const termStart = new Date(calendar.term_start_date)
      const msPerWeek = 7 * 24 * 60 * 60 * 1000
      const currentWeek = Math.ceil((today - termStart) / msPerWeek)

      setWeekData({
        currentWeek,
        term: calendar.term,
        shouldShowMockTestPrompt:
          currentWeek >= calendar.mock_test_prompt_week &&
          currentWeek <= calendar.mock_test_target_week + 1,
        shouldShowMockExamPrompt:
          currentWeek >= calendar.mock_exam_prompt_week &&
          currentWeek <= calendar.mock_exam_target_week + 1,
        isLoading: false,
      })
    }

    fetchCalendar()
  }, [])

  return weekData
}
