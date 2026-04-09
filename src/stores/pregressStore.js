// ─────────────────────────────────────────────────────────────────────────────
// progressStore.js
// Zustand store for lesson progress, XP, and Final Challenge unlock state.
// Integrates with the existing modeStore pattern in this codebase.
// ─────────────────────────────────────────────────────────────────────────────
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useProgressStore = create(
  persist(
    (set, get) => ({
      // { [lessonId]: { complete, xpEarned, usedSeeAnswer } }
      lessonProgress: {},

      // { [topicId]: { totalXP, finalChallengeUnlocked } }
      topicProgress: {},

      totalXP: 0,

      // Mark a lesson as complete and record XP
      completeLesson: (lessonId, topicId, xpEarned, usedSeeAnswer) => {
        const prev = get().lessonProgress[lessonId] || {}
        if (prev.complete) return // already done, don't overwrite

        set(state => ({
          totalXP: state.totalXP + xpEarned,
          lessonProgress: {
            ...state.lessonProgress,
            [lessonId]: { complete: true, xpEarned, usedSeeAnswer, completedAt: Date.now() },
          },
        }))

        // Check if all lessons in this topic are done → unlock final challenge
        // (caller must pass allLessonIds to check)
      },

      // Check if a lesson is complete
      isLessonComplete: (lessonId) => {
        return !!get().lessonProgress[lessonId]?.complete
      },

      // Check if all lessons in a topic are complete (pass array of lessonIds)
      isFinalChallengeUnlocked: (lessonIds) => {
        const prog = get().lessonProgress
        return lessonIds.every(id => prog[id]?.complete)
      },

      reset: () => set({ lessonProgress: {}, topicProgress: {}, totalXP: 0 }),
    }),
    { name: 'learniie-progress' }
  )
)