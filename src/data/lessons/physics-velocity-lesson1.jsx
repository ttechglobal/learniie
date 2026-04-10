// ─────────────────────────────────────────────────────────────────────────────
// physics-velocity-lesson1.js
// CPA lesson: Understanding Speed  (updated for v4 engine)
//
// Math expression syntax for LessonEngine v4:
//   [num/den]  →  vertical fraction (blackboard style)
//   ^n         →  superscript
//   plain text →  rendered as-is
//
// Steps can prefix with "math:" to render as MathExpr
// ─────────────────────────────────────────────────────────────────────────────

export const velocityLesson1 = {
  id:            'physics-velocity-1',
  topicId:       'physics-velocity',
  subtopicTitle: 'Understanding Speed',
  subject:       'physics',
  gradeLevel:    'SS1',
  xpReward:      60,

  slides: [

    // ── 1. Topic intro: typewriter fires on mascotLine
    {
      id: 's1', type: 'topic_intro',
      content: {
        topicTitle: 'Understanding Speed',
        mascotLine: "Today we're learning about Speed.",
      },
    },

    // ── 2. Hook: immersive scenario, feedback pushed below options
    {
      id: 's2', type: 'hook',
      content: {
        scenario: 'Chidi and Amaka both leave school at the same time heading to the same bus stop, 600 m away. Chidi walks and arrives in 10 minutes. Amaka jogs and arrives in 6 minutes.',
        question: 'Who was moving faster?',
        options: [
          { id: 'a', label: 'Chidi',
            explanation: 'Chidi took longer to cover the same distance. That means he was moving slower, not faster.' },
          { id: 'b', label: 'Amaka',
            explanation: 'Amaka covered the same distance in less time. More distance in less time means higher speed. That is exactly what speed measures.' },
          { id: 'c', label: 'They moved at the same speed',
            explanation: 'Same distance but different times means different speeds. Same distance divided by different time gives different speed.' },
        ],
      },
    },

    // ── 3. Definition: "What is Speed?", image placeholder, NO example here
    {
      id: 's3', type: 'definition',
      content: {
        term:            'Speed',
        plainDefinition: 'Speed is the distance an object travels per unit of time. The greater the speed, the more distance is covered in the same amount of time.',
      },
    },

    // ── 4. Concept: real-world example lives here (not on definition slide)
    {
      id: 's4', type: 'concept',
      content: {
        heading: 'Speed in everyday life',
        body:    'Speed connects distance and time. Two objects can travel the same route: the one that arrives first was moving faster.',
        callout: 'Speed does NOT depend on direction. Whether a danfo is going north or south at 60 km/h, its speed is 60 km/h.',
        example: 'A danfo travelling at 60 km/h covers 60 km in one hour. A motorcycle at 80 km/h covers 80 km in the same hour: it is faster because it covers more ground in the same time.',
      },
    },

    // ── 5. Formula: blackboard-style fractions
    {
      id: 's5', type: 'formula',
      content: {
        formula: 'S = [D/T]',
        formulaVariants: [
          'S = [D/T]',
          'D = S × T',
          'T = [D/S]',
        ],
        componentBreakdown: [
          { symbol: 'S', meaning: 'Speed: measured in km/h or m/s' },
          { symbol: 'D', meaning: 'Distance: measured in km or metres (m)' },
          { symbol: 'T', meaning: 'Time: measured in hours (h) or seconds (s)' },
        ],
      },
    },

    // ── 6. Worked example 1: easy, formatted steps
    {
      id: 's6', type: 'worked_example',
      content: {
        exampleNumber: 1,
        difficulty:    'easy',
        problem:       'A keke napep travels 30 km in 1 hour. What is its speed?',
        formula:       'S = [D/T]',
        steps: [
          { label: 'Write the formula',      line: 'math:S = [D/T]' },
          { label: 'Identify values',        line: 'D = 30 km,   T = 1 hour' },
          { label: 'Substitute',             line: 'math:S = [30/1]' },
          { label: 'Calculate',              line: 'S = 30 km/h  ✓' },
        ],
        answer: '30 km/h',
      },
    },

    // ── 7. Worked example 2: medium difficulty
    {
      id: 's7', type: 'worked_example',
      content: {
        exampleNumber: 2,
        difficulty:    'medium',
        problem:       'A Lagos bus covers 240 km on the Lagos–Ibadan road. The journey takes 3 hours. What is the average speed of the bus?',
        formula:       'S = [D/T]',
        steps: [
          { label: 'Write the formula',      line: 'math:S = [D/T]' },
          { label: 'Identify Distance',      line: 'D = 240 km' },
          { label: 'Identify Time',          line: 'T = 3 hours' },
          { label: 'Substitute',             line: 'math:S = [240/3]' },
          { label: 'Calculate',              line: 'S = 80 km/h  ✓' },
        ],
        answer: '80 km/h',
      },
    },

    // ── 8. Try it: solution reveals BottomBar Continue (Req. 8)
    {
      id: 's8', type: 'try_it',
      content: {
        difficulty: 'medium',
        problem:    'Bola cycles 36 km in 2 hours. What is her average speed?',
        formula:    'S = [D/T]',
        hint:       'You already have Distance (36 km) and Time (2 hours). Plug them into S = D ÷ T.',
        steps: [
          { label: 'Write the formula',      line: 'math:S = [D/T]' },
          { label: 'Identify Distance',      line: 'D = 36 km' },
          { label: 'Identify Time',          line: 'T = 2 hours' },
          { label: 'Substitute',             line: 'math:S = [36/2]' },
          { label: 'Calculate',              line: 'S = 18 km/h  ✓' },
        ],
        answer: '18 km/h',
      },
    },

    // ── 9. Practice question 1: with structured explanation + working steps
    {
      id: 's9', type: 'practice_question',
      content: {
        question:    'A train travels 450 km in 3 hours. What is its average speed?',
        xpValue:     15,
        explanation: 'Use S = D ÷ T. Distance is 450 km, Time is 3 hours. Divide to find speed.',
        options: [
          { id: 'a', label: '100 km/h', isCorrect: false,
            wrongExplanation: 'Check your division. 450 ÷ 3 ≠ 100. Try again.' },
          { id: 'b', label: '150 km/h', isCorrect: true,
            workSteps: [
              { label: 'Formula',       line: 'math:S = [D/T]'  },
              { label: 'Substitute',    line: 'math:S = [450/3]' },
              { label: 'Answer',        line: 'S = 150 km/h  ✓' },
            ],
          },
          { id: 'c', label: '1350 km/h', isCorrect: false,
            wrongExplanation: '1350 comes from multiplying 450 × 3: but the formula says DIVIDE Distance by Time.' },
          { id: 'd', label: '50 km/h', isCorrect: false,
            wrongExplanation: '50 is too small. Check: 50 × 3 = 150, not 450. Divide 450 by 3.' },
        ],
      },
    },

    // ── 10. Practice question 2: rearranged formula (finds distance)
    {
      id: 's10', type: 'practice_question',
      content: {
        question:    'A car travels at 80 km/h for 2.5 hours. How far does it travel?',
        xpValue:     15,
        explanation: 'This time we need Distance. Rearrange: D = S × T. Multiply speed by time.',
        options: [
          { id: 'a', label: '32 km', isCorrect: false,
            wrongExplanation: 'You need D = S × T, not D = S ÷ T. Multiply 80 by 2.5.' },
          { id: 'b', label: '160 km', isCorrect: false,
            wrongExplanation: '160 km is correct for exactly 2 hours (80 × 2). But the journey is 2.5 hours. Try 80 × 2.5.' },
          { id: 'c', label: '200 km', isCorrect: true,
            workSteps: [
              { label: 'Formula (rearranged)', line: 'D = S × T'          },
              { label: 'Substitute',           line: 'D = 80 × 2.5'       },
              { label: 'Answer',               line: 'D = 200 km  ✓'      },
            ],
          },
          { id: 'd', label: '82.5 km', isCorrect: false,
            wrongExplanation: '82.5 looks like you added 80 + 2.5 instead of multiplying. Use D = Speed × Time.' },
        ],
      },
    },

    // ── 11. Lesson complete
    {
      id: 's11', type: 'lesson_complete',
      content: {
        completionMessage: "You nailed Speed! You can now calculate speed, distance, and time using S = D ÷ T: and you know how to rearrange it too. That formula is yours to keep. 🎉",
        nextLessonTitle:   'Velocity: Speed with Direction',
      },
    },
  ],
}