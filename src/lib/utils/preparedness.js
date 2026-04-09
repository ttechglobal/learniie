// src/lib/utils/preparedness.js

export function calculatePreparednessScore(lessonsCompleted, totalLessons, questionsCorrect, questionsAttempted) {
  const lessonRate   = totalLessons       > 0 ? lessonsCompleted / totalLessons       : 0
  const accuracyRate = questionsAttempted >= 3 ? questionsCorrect / questionsAttempted : 0
  return Math.min(100, Math.max(0, Math.round(((lessonRate * 0.5) + (accuracyRate * 0.5)) * 100)))
}

export function getPreparednessLabel(score) {
  if (score <= 20) return { label:'Not Started',    variant:'notStarted'    }
  if (score <= 40) return { label:'Just Beginning', variant:'justBeginning' }
  if (score <= 60) return { label:'Getting There',  variant:'gettingThere'  }
  if (score <= 80) return { label:'On Track',       variant:'onTrack'       }
  return               { label:'Exam Ready',        variant:'examReady'     }
}