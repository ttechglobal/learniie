// lib/mock/data.js — Learniie mock data
 
export const MOCK_STUDENT = {
  id:             'mock-1',
  display_name:   'Temi Adeyemi',
  mode:           'school_exam',
  mascot:         'learniiebuddy',
  xp:             1240,
  weekly_xp:      340,
  streak_days:    7,
  lessons_done:   18,
  questions_done: 64,
  school: { canonical_name: "King's College Lagos" },
}
 
export const MOCK_SUBJECTS = [
  { id:'s1', slug:'mathematics', name:'Mathematics', emoji:'📐', color:'#F5A623', bg:'#FFF5E0', progress:68, lessons_done:12, total_lessons:18 },
  { id:'s2', slug:'physics',     name:'Physics',     emoji:'⚡', color:'#3A7BD5', bg:'#E0EEFF', progress:34, lessons_done:6,  total_lessons:16 },
  { id:'s3', slug:'chemistry',   name:'Chemistry',   emoji:'🧪', color:'#0D5C2E', bg:'#E8F5EE', progress:45, lessons_done:8,  total_lessons:14 },
  { id:'s4', slug:'biology',     name:'Biology',     emoji:'🌿', color:'#E04A30', bg:'#FFE8E5', progress:12, lessons_done:2,  total_lessons:20 },
]
 
export const MOCK_TOPICS = [
  { id:'t1', title:'Quadratic Equations',    slug:'quadratic',    lessonCount:4, status:'complete',    preparedness:78 },
  { id:'t2', title:'Simultaneous Equations', slug:'simultaneous', lessonCount:3, status:'in_progress', preparedness:40 },
  { id:'t3', title:'Indices & Logarithms',   slug:'indices',      lessonCount:5, status:'unlocked',    preparedness:0  },
  { id:'t4', title:'Sequences & Series',     slug:'sequences',    lessonCount:4, status:'locked',      preparedness:0  },
  { id:'t5', title:'Mensuration',            slug:'mensuration',  lessonCount:4, status:'locked',      preparedness:0  },
]
 
export const MOCK_LESSON = {
  id: 'lesson-1',
  title: 'Solving Quadratic Equations by Factorisation',
  subject: 'Mathematics',
  topic: 'Quadratic Equations',
  xp_reward: 15,
  lesson_bites: [
    {
      id:'b1', order_index:0, bite_type:'welcome',
      content_json:{
        greeting: "Let's go! 🎯",
        message: 'Today we are learning how to solve quadratic equations by factorisation — one of the most useful skills in all of mathematics.',
        mascot_expression: 'excited',
      }
    },
    {
      id:'b2', order_index:1, bite_type:'hook',
      content_json:{
        question: 'A farmer in Oyo State has 40 metres of fencing and wants to enclose a rectangular plot of exactly 96 m². What are the dimensions?',
        teaser: 'Quadratic equations are how you solve this — let\'s learn how.',
      }
    },
    {
      id:'b3', order_index:2, bite_type:'concept',
      content_json:{
        title: 'What is factorisation?',
        body: 'Factorisation means rewriting an expression as a product of its factors.\n\nFor a quadratic x² + bx + c = 0, we look for two numbers that:\n• Multiply together to give c\n• Add together to give b',
        highlight: 'Multiply → c   |   Add → b',
      }
    },
    {
      id:'b4', order_index:3, bite_type:'worked_example',
      content_json:{
        problem: 'Solve: x² + 5x + 6 = 0',
        steps: [
          'We need two numbers that multiply to 6 AND add to 5.',
          'Try 2 and 3: 2 × 3 = 6 ✓ and 2 + 3 = 5 ✓',
          'Write as brackets: (x + 2)(x + 3) = 0',
          'Use Zero Product Rule: if A × B = 0, then A = 0 OR B = 0',
          'x + 2 = 0 → x = −2',
          'x + 3 = 0 → x = −3',
        ],
        answer: 'x = −2  or  x = −3',
      }
    },
    {
      id:'b5', order_index:4, bite_type:'emphasis',
      content_json:{
        type: 'key_rule',
        title: 'The Zero Product Rule',
        body: 'If A × B = 0, then either A = 0 OR B = 0. This single rule is the foundation of solving by factorisation.',
      }
    },
    {
      id:'b6', order_index:5, bite_type:'practice',
      content_json:{
        question: 'Solve x² + 7x + 12 = 0 by factorisation.',
        options: ['x = 3 or x = 4', 'x = −3 or x = −4', 'x = −3 or x = 4', 'x = 3 or x = −4'],
        correct_index: 1,
        explanation: 'We need two numbers that multiply to 12 and add to 7. That\'s 3 and 4. So (x + 3)(x + 4) = 0, giving x = −3 or x = −4.',
      }
    },
    {
      id:'b7', order_index:6, bite_type:'practice',
      content_json:{
        question: 'Which factorisation is correct for x² − 5x + 6?',
        options: ['(x + 2)(x + 3)', '(x − 2)(x − 3)', '(x − 1)(x − 6)', '(x + 1)(x − 6)'],
        correct_index: 1,
        explanation: 'We need two numbers that multiply to +6 and add to −5. That\'s −2 and −3. So (x − 2)(x − 3).',
      }
    },
    {
      id:'b8', order_index:7, bite_type:'summary',
      content_json:{
        title: 'What we learned today',
        points: [
          'Factorisation rewrites a quadratic as two brackets multiplied together.',
          'Find two numbers that multiply to c and add to b.',
          'Apply the Zero Product Rule to find both values of x.',
          'Always check by expanding the brackets back out.',
        ],
        mascot_expression: 'proud',
      }
    },
  ]
}
 
export const MOCK_CHALLENGE = {
  id: 'challenge-1',
  topic: "Quadratic Equations",
  title: "The Farmer's Field",
  scenario: "A farmer in Oyo State wants to fence a rectangular plot of land. He has 40 metres of fencing. He wants the area to be exactly 96 square metres. What should the length and width be? (There are two possible answers — find both.)",
  hint: "Let the width be x metres. Express the length using the perimeter formula. Then form a quadratic equation using the area. You should get x² − 20x + 96 = 0.",
  difficulty: 'hard',
}
 
export const MOCK_PRACTICE_QUESTIONS = [
  {
    id:'q1', difficulty:'easy', source_label:'WAEC 2022 · Q4',
    question: 'Solve x² − 5x + 6 = 0',
    options: ['x = 2 or x = 3', 'x = −2 or x = −3', 'x = 1 or x = 6', 'x = −1 or x = −6'],
    correct_index: 0,
    explanation: 'Factors of 6 that add to −5: use −2 and −3. So (x−2)(x−3) = 0, giving x = 2 or x = 3.',
  },
  {
    id:'q2', difficulty:'medium', source_label:'JAMB 2023 · Q11',
    question: 'The roots of 2x² − 5x − 3 = 0 are:',
    options: ['x = 3 or x = −½', 'x = −3 or x = ½', 'x = 3 or x = ½', 'x = −3 or x = −½'],
    correct_index: 0,
    explanation: '2x² − 5x − 3 = (2x + 1)(x − 3) = 0. So 2x = −1 → x = −½ or x = 3.',
  },
  {
    id:'q3', difficulty:'easy', source_label:'NECO 2023 · Q2',
    question: 'Which of these is a quadratic equation?',
    options: ['3x + 5 = 0', 'x³ − 2x + 1 = 0', 'x² − 4 = 0', '2/x + 1 = 0'],
    correct_index: 2,
    explanation: 'A quadratic has highest power 2. Only x² − 4 = 0 qualifies.',
  },
  {
    id:'q4', difficulty:'hard', source_label:'WAEC 2021 · Q8',
    question: 'The sum of the roots of 3x² − 12x + 9 = 0 is:',
    options: ['4', '−4', '3', '−3'],
    correct_index: 0,
    explanation: 'Sum of roots = −b/a = −(−12)/3 = 4.',
  },
  {
    id:'q5', difficulty:'easy', source_label:'WAEC 2022 · Q1',
    question: 'Solve x² = 25',
    options: ['x = 5 only', 'x = −5 only', 'x = 5 or x = −5', 'x = 12.5'],
    correct_index: 2,
    explanation: 'Taking square roots: x = ±√25 = ±5. Always include both positive and negative roots.',
  },
]
 
export const MOCK_LEADERBOARD = [
  { student_id:'u2',    display_name:'Chidi Okonkwo',  score:1820, rank:1, streak:12 },
  { student_id:'u3',    display_name:'Amaka Eze',       score:1640, rank:2, streak:9  },
  { student_id:'mock-1',display_name:'Temi Adeyemi',    score:1240, rank:3, streak:7  },
  { student_id:'u4',    display_name:'Babatunde Sule',  score:1100, rank:4, streak:5  },
  { student_id:'u5',    display_name:'Ngozi Ibe',        score:980,  rank:5, streak:3  },
  { student_id:'u6',    display_name:'Yusuf Bello',      score:760,  rank:6, streak:2  },
  { student_id:'u7',    display_name:'Sade Fashola',     score:620,  rank:7, streak:1  },
]
 
export const MOCK_TUTOR_RESPONSES = [
  { role:'buddy', text:"Great question! Let me break that down. 👇" },
  { role:'buddy', text:'Think of it this way — factorising reverses expansion. If you expanded two brackets and got the quadratic, factorising just finds those brackets again. The trick is the two numbers that multiply to c and add to b.' },
]


export const MOCK_LESSON_FLOW = {
  id:          'flow-lesson-1',
  title:       'How Does Motion Work?',
  subject:     'Physics',
  chapter:     'Chapter 3',
  description: 'Learn how objects move, what causes them to speed up or slow down, and how to calculate velocity and acceleration.',
  duration:    '8 min',
  slideCount:  6,
  xpReward:    50,
  summaryPoints: [
    'Motion means change in position over time',
    'Speed = Distance ÷ Time',
    'Motion is always relative to a reference point',
  ],
  nextLesson: { icon:'⚡', title:'Velocity & Acceleration' },
  slides: [
    { type:'cover' },
    {
      type:'hook', mascotName:'Tunde',
      hookText:"Have you ever wondered why a ball you throw always comes back down? 🤔",
      subText:"In this lesson, we'll break down the science of motion — step by step, in a way that actually makes sense!",
    },
    {
      type:'content', conceptIndex:1, conceptTotal:2, title:'What is Motion?',
      bodyParts:['An object is said to be in ',{bold:'motion'},' when it changes its position over time relative to a reference point.'],
      highlight:"💡 Think of it this way: if you're sitting in a moving bus, you are in motion relative to someone standing outside — but still relative to the person sitting next to you!",
      bodyParts2:['Motion can be measured by looking at ',{bold:'distance'},', ',{bold:'speed'},', ',{bold:'velocity'},', and ',{bold:'acceleration'},'.'],
    },
    {
      type:'example',
      problem:'A car travels 120 km in 2 hours. What is its average speed?',
      formula:'Speed = Distance ÷ Time',
      steps:[
        'Identify what we know: Distance = 120 km, Time = 2 hours',
        'Plug into the formula: Speed = 120 ÷ 2',
        'Answer: Speed = 60 km/h ✓',
      ],
    },
    {
      type:'practice', questionNumber:1, questionTotal:2,
      question:'A cyclist covers 45 km in 3 hours. What is their average speed?',
      options:['10 km/h','20 km/h','15 km/h','135 km/h'],
      correctIndex:2,
    },
    { type:'complete' },
  ],
}