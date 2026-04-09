// lib/hooks/useMode.js
'use client'

import { useModeStore } from '@/stores/modeStore'

export function useMode() {
  const { activeView, activeExamId, setActiveView, setActiveExam } = useModeStore()
  return { activeView, activeExamId, setActiveView, setActiveExam }
}
