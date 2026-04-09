// ─────────────────────────────────────────────────────────────────────────────
// physics-velocity-lesson1.js
// CPA lesson: Velocity & Acceleration — Subtopic 1: Understanding Speed
// Subject-agnostic engine — this data drives everything.
// ─────────────────────────────────────────────────────────────────────────────

export const velocityLesson1 = {
  id:             'physics-velocity-1',
  topicId:        'physics-velocity',
  subtopicTitle:  'Understanding Speed',
  subject:        'physics',
  gradeLevel:     'SS1',
  xpReward:       60,

  slides: [

    // ── 1. Topic intro
    {
      id: 's1', type: 'topic_intro',
      content: {
        topicTitle:  'Understanding Speed',
        mascotLine:  "Today we're learning about Speed — and guess what? You already know this from real life! Every time you say a car is going 'fast' or 'slow', you're already thinking about speed. 🚗",
        ctaLabel:    "Let's go!",
      },
    },

    // ── 2. Hook — real-world Nigerian scenario
    {
      id: 's2', type: 'hook',
      content: {
        scenario: 'Chidi and Amaka both leave school at the same time. Chidi walks to the bus stop 600m away and arrives in 10 minutes. Amaka jogs the same route and arrives in 6 minutes.',
        imageUrl: null,
        question: 'Who was moving faster?',
        options: [
          { id: 'a', label: 'Chidi', explanation: 'Chidi took longer to cover the same distance — so he was actually moving slower, not faster.' },
          { id: 'b', label: 'Amaka', explanation: 'Exactly right! Amaka covered the same distance in less time, which means she was moving faster. This is what speed is all about — how quickly you cover a distance.' },
          { id: 'c', label: 'They moved at the same speed', explanation: "They covered the same distance, but in different amounts of time — so their speeds were different. Same distance + different time = different speed." },
        ],
      },
    },

    // ── 3. Definition — plain language
    {
      id: 's3', type: 'definition',
      content: {
        term:            'Speed',
        plainDefinition: 'Speed is how far an object travels in a given amount of time. A higher speed means more distance covered in the same time.',
        simpleExample:   "A danfo travelling at 60 km/h will cover 60 kilometres in one hour. A motorcycle at 80 km/h covers 80 km in the same hour — it's faster.",
        imageUrl:        null,
      },
    },

    // ── 4. Concept — the formula introduced visually
    {
      id: 's4', type: 'concept',
      content: {
        heading: 'The Speed Triangle',
        body:    "There are three quantities that are always linked together: Speed (S), Distance (D), and Time (T). When you know any two of them, you can always find the third.",
        imageUrl: null,
        callout: 'Cover the quantity you want to find, and the triangle shows you what to do with the other two.',
      },
    },

    // ── 5. Formula — all variants
    {
      id: 's5', type: 'formula',
      content: {
        formula: 'S = D ÷ T',
        formulaVariants: [
          'Speed = Distance ÷ Time',
          'Distance = Speed × Time',
          'Time = Distance ÷ Speed',
        ],
        componentBreakdown: [
          { symbol: 'S', meaning: 'Speed — measured in km/h or m/s' },
          { symbol: 'D', meaning: 'Distance — measured in km or m' },
          { symbol: 'T', meaning: 'Time — measured in hours (h) or seconds (s)' },
        ],
      },
    },

    // ── 6. Worked example 1 — easy
    {
      id: 's6', type: 'worked_example',
      content: {
        exampleNumber: 1,
        difficulty:    'easy',
        problem:       'A keke napep travels 30 km in 1 hour. What is its speed?',
        steps: [
          { label: 'Write the formula',         line: 'Speed = Distance ÷ Time' },
          { label: 'Identify the values',       line: 'Distance = 30 km,  Time = 1 hour' },
          { label: 'Substitute',                line: 'Speed = 30 ÷ 1' },
          { label: 'Calculate',                 line: 'Speed = 30 km/h  ✓' },
        ],
        answer: '30 km/h',
      },
    },

    // ── 7. Worked example 2 — medium
    {
      id: 's7', type: 'worked_example',
      content: {
        exampleNumber: 2,
        difficulty:    'medium',
        problem:       'A Lagos bus covers 240 km between Lagos and Ibadan. The journey takes 3 hours. What is the average speed of the bus?',
        steps: [
          { label: 'Write the formula',         line: 'Speed = Distance ÷ Time' },
          { label: 'Identify Distance',         line: 'Distance = 240 km' },
          { label: 'Identify Time',             line: 'Time = 3 hours' },
          { label: 'Substitute',                line: 'Speed = 240 ÷ 3' },
          { label: 'Calculate',                 line: 'Speed = 80 km/h  ✓' },
        ],
        answer: '80 km/h',
      },
    },

    // ── 8. Try It — student attempts with hint available
    {
      id: 's8', type: 'try_it',
      content: {
        difficulty: 'medium',
        problem:    'Bola cycles 36 km in 2 hours. What is her average speed?',
        hint:       'Use Speed = Distance ÷ Time. You already have both the Distance (36 km) and the Time (2 hours).',
        steps: [
          { label: 'Write the formula',         line: 'Speed = Distance ÷ Time' },
          { label: 'Identify Distance',         line: 'Distance = 36 km' },
          { label: 'Identify Time',             line: 'Time = 2 hours' },
          { label: 'Substitute',                line: 'Speed = 36 ÷ 2' },
          { label: 'Calculate',                 line: 'Speed = 18 km/h  ✓' },
        ],
        answer: '18 km/h',
      },
    },

    // ── 9. Practice question 1
    {
      id: 's9', type: 'practice_question',
      content: {
        question: 'A train travels 450 km in 3 hours. What is its average speed?',
        xpValue:  15,
        options: [
          { id: 'a', label: '100 km/h', isCorrect: false,
            wrongExplanation: "100 km/h is not right — check your division. 450 ÷ 3 is not 100. Try again." },
          { id: 'b', label: '150 km/h', isCorrect: true },
          { id: 'c', label: '1350 km/h', isCorrect: false,
            wrongExplanation: "1350 km/h comes from multiplying 450 × 3 — but the formula asks you to DIVIDE Distance by Time, not multiply." },
          { id: 'd', label: '50 km/h', isCorrect: false,
            wrongExplanation: "50 km/h is too small. Check: 50 × 3 = 150, not 450. Divide 450 by 3." },
        ],
      },
    },

    // ── 10. Practice question 2
    {
      id: 's10', type: 'practice_question',
      content: {
        question: 'A car travels at 80 km/h for 2.5 hours. How far does it travel?',
        xpValue:  15,
        options: [
          { id: 'a', label: '32 km', isCorrect: false,
            wrongExplanation: "32 km is not right. You need Distance = Speed × Time. Multiply 80 by 2.5, not divide." },
          { id: 'b', label: '160 km', isCorrect: false,
            wrongExplanation: "160 km would be correct for exactly 2 hours (80 × 2 = 160) — but the journey is 2.5 hours. Try again with 80 × 2.5." },
          { id: 'c', label: '200 km', isCorrect: true },
          { id: 'd', label: '82.5 km', isCorrect: false,
            wrongExplanation: "82.5 km looks like you added Speed and Time (80 + 2.5) instead of multiplying. Use Distance = Speed × Time." },
        ],
      },
    },

    // ── 11. Lesson complete
    {
      id: 's11', type: 'lesson_complete',
      content: {
        completionMessage: "You just nailed Speed! You can now calculate speed, distance, and time like a pro. The formula S = D ÷ T is yours forever. 🎉",
        nextLessonTitle:   'Velocity — Speed with Direction',
      },
    },
  ],
}


// ```
// I mean, it's super amazing. I can't lie, honestly, this is amazing, right? So here's the thing, right? So this is my landing page, right? So I'm trying to... So this is my landing page. I'm trying to see how best that we can actually come up with something super, super, super interesting. So across all there. So this is the landing page. So I want you to just have a look at it, all right? Have a look at it. So this is like a landing page. We have like different, you know, we have for school, we have the school mode for those who are in school and want to learn school by school, class by class, you know, and those who are preparing for exams, who are focused on exams, so you can switch between modes. So I want you to like critique it and give your review and come up with, if you think it's okay or you can improve it, either way. But at the end of the day, I want you to give me a prompt, just like you did for the lesson flow, so give me a very, very good prompt to actually implement it. So you could feel free to give improvements along any direction because this is the landing page and I really want it to look, you know, because this is the page that precedes the lesson flow page, the lesson page. So it should look inviting, it should be well done, basically. It should be done very well, very well. So that's why I want you to look at it and give me a prompt to bring this to life, all right? Yes.
// ```