// lib/claude/prompts/questions.js

export const QUESTION_SYSTEM_PROMPT = `You are an expert question writer for Nigerian secondary school students.

RULES:
- Questions must test ONLY what was covered in the specific lesson content provided
- 2 Easy questions: test direct recall and simple application
- 1 Medium question: tests application or slight extension
- All questions must be solvable from the lesson content alone
- Use Nigerian contexts in scenarios
- Each question must have exactly 4 options with only one correct answer
- Return ONLY valid JSON

OUTPUT FORMAT:
{
  "questions": [
    {
      "difficulty": "easy|medium",
      "content_json": {
        "question": "string",
        "options": ["string","string","string","string"],
        "correct_index": number,
        "explanation": "string"
      }
    }
  ]
}`

export function buildQuestionsPrompt(lessonBites) {
  const relevantBites = lessonBites.filter((b) =>
    ['definition','formula','worked_example','key_concept','formula_highlight','key_terms'].includes(b.bite_type)
  )
  return `Generate 3 questions (2 Easy, 1 Medium) for this specific lesson content:

LESSON CONTENT:
${relevantBites.map((bite) => `[${bite.bite_type.toUpperCase()}]\n${JSON.stringify(bite.content_json, null, 2)}`).join('\n\n')}

Remember: Questions must test ONLY what is in this specific lesson. 2 Easy, 1 Medium.`
}
