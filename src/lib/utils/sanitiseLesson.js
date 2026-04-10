// ─────────────────────────────────────────────────────────────────────────────
// sanitiseLesson.js — Validates and cleans every generated lesson before save
// Run on ALL lessons after generation, before any database write.
// ─────────────────────────────────────────────────────────────────────────────

function stripDashes(obj) {
  if (typeof obj === 'string') {
    return obj.replace(/\s*[—–]\s*/g, ': ').trim()
  }
  if (Array.isArray(obj)) return obj.map(stripDashes)
  if (typeof obj === 'object' && obj !== null) {
    return Object.fromEntries(Object.entries(obj).map(([k, v]) => [k, stripDashes(v)]))
  }
  return obj
}

export function sanitiseLesson(lesson) {
  // 1. Validate required top-level fields
  const required = ['lessonId', 'topicId', 'subtopicTitle', 'subject', 'classLevel', 'slides']
  for (const field of required) {
    if (!lesson[field]) throw new Error(`Missing required field: ${field}`)
  }

  // 2. Slides array must have at least 4 slides
  if (!Array.isArray(lesson.slides) || lesson.slides.length < 4) {
    throw new Error('Lesson must have at least 4 slides')
  }

  // 3. First slide must be topic_intro
  if (lesson.slides[0].type !== 'topic_intro') {
    throw new Error('First slide must be topic_intro')
  }

  // 4. Last slide must be lesson_complete
  const last = lesson.slides[lesson.slides.length - 1]
  if (last.type !== 'lesson_complete') {
    throw new Error('Last slide must be lesson_complete')
  }

  // 5. All practice questions must have wrongExplanation on wrong options
  for (const slide of lesson.slides) {
    if (slide.type === 'practice_question') {
      if (!Array.isArray(slide.options)) throw new Error(`practice_question missing options array`)
      for (const opt of slide.options) {
        if (!opt.isCorrect && !opt.wrongExplanation) {
          throw new Error(`Missing wrongExplanation on option ${opt.id} in: "${slide.question}"`)
        }
      }
      const correctCount = slide.options.filter(o => o.isCorrect).length
      if (correctCount !== 1) {
        throw new Error(`practice_question must have exactly 1 correct option, found ${correctCount}`)
      }
    }
  }

  // 6. Strip all em-dashes and en-dashes from all string content
  return stripDashes(lesson)
}

// Extract all imagePrompts from a lesson for the admin image management panel
export function extractImagePrompts(lesson) {
  const slots = []
  lesson.slides?.forEach((slide, i) => {
    if (slide.imagePrompt) {
      slots.push({
        slideIndex:  i,
        slideType:   slide.type,
        prompt:      slide.imagePrompt,
        imageUrl:    slide.imageUrl || null,
        status:      slide.imageUrl ? 'uploaded' : 'pending',
      })
    }
  })
  return slots
}

// Extract all interactivityPrompts from a lesson
export function extractInteractivityPrompts(lesson) {
  const slots = []
  lesson.slides?.forEach((slide, i) => {
    if (slide.interactivityPrompt) {
      slots.push({
        slideIndex:  i,
        slideType:   slide.type,
        prompt:      slide.interactivityPrompt,
        status:      'not_started',
      })
    }
  })
  return slots
}