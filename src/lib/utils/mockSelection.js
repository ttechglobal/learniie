// lib/utils/mockSelection.js

/**
 * Select questions for a mock test or mock exam.
 * Mock test:  20 questions — 8 Easy, 8 Medium, 4 Hard
 * Mock exam:  60 questions — 20 Easy, 25 Medium, 15 Hard
 */
export function selectMockQuestions(allQuestions, type = 'test') {
  const targets = type === 'test'
    ? { easy: 8,  medium: 8,  hard: 4  }
    : { easy: 20, medium: 25, hard: 15 }

  function pick(pool, n) {
    const shuffled = [...pool].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, n)
  }

  const easy   = allQuestions.filter((q) => q.difficulty === 'easy')
  const medium = allQuestions.filter((q) => q.difficulty === 'medium')
  const hard   = allQuestions.filter((q) => q.difficulty === 'hard')

  return [
    ...pick(easy,   targets.easy),
    ...pick(medium, targets.medium),
    ...pick(hard,   targets.hard),
  ].sort(() => Math.random() - 0.5)
}
