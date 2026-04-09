// stores/mockSessionStore.js
import { create } from 'zustand'

export const useMockSessionStore = create((set, get) => ({
  sessionId:     null,
  questions:     [],
  answers:       {}, // { [questionId]: selectedOptionIndex }
  currentIndex:  0,
  timeRemaining: 0,
  isSubmitted:   false,

  setSession: (sessionId, questions, duration) => set({
    sessionId,
    questions,
    timeRemaining: duration,
    answers: {},
    currentIndex: 0,
    isSubmitted: false,
  }),

  answerQuestion: (questionId, answerIndex) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answerIndex },
    })),

  goToQuestion: (index) => set({ currentIndex: index }),

  tickTimer: () =>
    set((state) => ({
      timeRemaining: Math.max(0, state.timeRemaining - 1),
    })),

  submit: () => set({ isSubmitted: true }),
}))
