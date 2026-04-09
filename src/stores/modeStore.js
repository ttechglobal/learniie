import { create } from 'zustand'
export const useModeStore = create((set) => ({
  activeView:    'school',
  activeExamId:  null,
  setActiveView: (view)   => set({ activeView: view }),
  setActiveExam: (examId) => set({ activeExamId: examId }),
}))
