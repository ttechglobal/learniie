'use client'

// ─────────────────────────────────────────────────────────────────────────────
// LessonEngine.jsx — CPA (Concrete → Pictorial → Abstract) Lesson Engine
//
// Self-contained single file. All slide components, mascot system, and XP
// logic live here. Uses LearniiBuddy for the animated mascot companion.
//
// SLIDE TYPES:
//   topic_intro | hook | definition | concept | visual |
//   formula | worked_example | try_it | practice_question | lesson_complete
//
// MASCOT EMOTIONS:
//   excited | teaching | curious | encouraging | celebrating | thinking
//
// USAGE:
//   <LessonEngine lesson={lessonData} onComplete={() => router.push('/learn')} />
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'

// ─── DESIGN TOKENS (matches the rest of the app) ─────────────────────────────
const C = {
  white:   '#FFFFFF',
  surface: '#F7F8FA',
  green:   '#6DC77A',
  greenDk: '#52B362',
  blue:    '#2D3CE6',
  dark:    '#1A1A1A',
  text:    '#1A1A1A',
  muted:   '#999999',
  border:  '#F0F0F0',
  bgPill:  '#F0F0F0',
  red:     '#FF5A5A',
  redLight:'#FFF0F0',
  greenLt: '#EBF9EE',
  blueLt:  '#EEF0FF',
}
const F = "'Nunito', sans-serif"
const LETTERS = ['A', 'B', 'C', 'D']

// Map slide type → mascot emotion
const SLIDE_EMOTION = {
  topic_intro:       'excited',
  hook:              'curious',
  definition:        'teaching',
  concept:           'teaching',
  visual:            'curious',
  formula:           'teaching',
  worked_example:    'teaching',
  try_it:            'thinking',
  practice_question: 'thinking',
  lesson_complete:   'celebrating',
}

// Randomised success messages
const SUCCESS_MSGS = [
  "Yes! Exactly right! 🎉",
  "That's it! You've got it. ✨",
  "Perfect — you used the formula correctly! 🔥",
  "Brilliant! That's the right thinking. 💡",
  "Nailed it! Keep that energy going! ⚡",
]
const WRONG_MSGS = [
  "Not quite yet — but you're close. Read the hint and try again.",
  "Almost! Think carefully about what the formula is asking you to do.",
  "That's okay — let's think about this again. You've got this!",
]

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────

// Blue highlight box (key concept)
function Callout({ children }) {
  return (
    <div style={{ background:C.blueLt, borderLeft:`4px solid ${C.blue}`, borderRadius:'0 14px 14px 0', padding:'14px 16px', margin:'14px 0' }}>
      <div style={{ fontSize:'14px', fontWeight:800, color:C.text, fontFamily:F, lineHeight:1.6 }}>{children}</div>
    </div>
  )
}

// Section label
function Label({ children }) {
  return <div style={{ fontSize:'12px', fontWeight:900, color:C.muted, textTransform:'uppercase', letterSpacing:'1px', fontFamily:F, marginBottom:'8px' }}>{children}</div>
}

// Body text
function Body({ children, style = {} }) {
  return <div style={{ fontSize:'17px', fontWeight:600, color:C.text, lineHeight:1.75, fontFamily:F, ...style }}>{children}</div>
}

// Shared CTA button
function Btn({ children, onClick, color, disabled, style = {} }) {
  const bg = disabled ? '#DDD' : (color || C.green)
  return (
    <button onClick={disabled ? undefined : onClick} style={{
      width:'100%', padding:'16px', borderRadius:'16px', border:'none',
      background:bg, color:C.white, fontFamily:F, fontWeight:900, fontSize:'16px',
      cursor:disabled?'not-allowed':'pointer', opacity:disabled?0.5:1,
      transition:'background 0.15s, transform 0.1s', ...style,
    }}
      onMouseDown={e=>{if(!disabled)e.currentTarget.style.transform='scale(0.98)'}}
      onMouseUp={e=>{e.currentTarget.style.transform='scale(1)'}}
      onMouseLeave={e=>{e.currentTarget.style.transform='scale(1)';if(!disabled)e.currentTarget.style.background=bg}}
      onMouseEnter={e=>{if(!disabled)e.currentTarget.style.background= disabled?bg: (color==='#2D3CE6'?'#1E2BC0':color===C.green?C.greenDk:bg)}}
    >
      {children}
    </button>
  )
}

// Step card (used in worked_example and try_it)
function StepCard({ step, index }) {
  const isObj = typeof step === 'object' && step !== null
  return (
    <div style={{ background:C.surface, borderRadius:'14px', padding:'12px 14px', marginBottom:'8px', display:'flex', flexDirection:'column', gap:'6px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ width:'24px', height:'24px', borderRadius:'50%', background:C.green, color:C.white, fontSize:'12px', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:F }}>
          {index + 1}
        </div>
        <div style={{ fontSize:'11px', fontWeight:800, color:C.greenDk, textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:F }}>
          {isObj ? step.label : `Step ${index + 1}`}
        </div>
      </div>
      <div style={{ fontSize:'16px', fontWeight:700, color:C.text, fontFamily:F, background:C.white, borderRadius:'10px', padding:'10px 14px', marginLeft:'34px', lineHeight:1.5 }}>
        {isObj ? step.line : step}
      </div>
    </div>
  )
}

// ─── TOP BAR ─────────────────────────────────────────────────────────────────

function TopBar({ current, total, onClose, onBack, xp }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:'12px', padding:'14px 20px 10px', background:C.white, borderBottom:`1px solid ${C.border}`, position:'sticky', top:0, zIndex:20 }}>
      {/* Back on first slide */}
      {current === 0 && (
        <button onClick={onBack} style={{ width:'36px', height:'36px', borderRadius:'10px', border:'none', background:C.bgPill, fontSize:'16px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:F, flexShrink:0 }}>←</button>
      )}

      {/* Progress segments */}
      <div style={{ flex:1, display:'flex', gap:'4px', alignItems:'center' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{
            flex:1, height:'5px', borderRadius:'3px',
            background: i < current ? C.green : i === current ? C.blue : C.bgPill,
            transition:'background 0.3s',
          }} />
        ))}
      </div>

      {/* XP pill */}
      {xp > 0 && (
        <div style={{ background:C.blueLt, borderRadius:'50px', padding:'4px 12px', fontSize:'12px', fontWeight:800, color:C.blue, fontFamily:F, flexShrink:0 }}>
          ⭐ {xp} XP
        </div>
      )}

      {/* Close */}
      <button onClick={onClose} style={{ width:'36px', height:'36px', borderRadius:'10px', border:'none', background:C.bgPill, fontSize:'14px', fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:C.text, fontFamily:F, flexShrink:0 }}>✕</button>
    </div>
  )
}

// ─── MASCOT COMPANION ─────────────────────────────────────────────────────────
// The mascot appears at the top of every slide with a speech bubble.

function MascotCompanion({ emotion, message }) {
  return (
    <div style={{ display:'flex', gap:'12px', alignItems:'flex-start', padding:'16px 20px 0' }}>
      {/* Mascot with smooth emotion transition */}
      <div style={{ flexShrink:0, transition:'all 0.3s ease' }}>
        <LearniiBuddy size={64} expression={
          // Map CPA emotions → LearniiBuddy expressions
          emotion === 'excited'     ? 'excited'     :
          emotion === 'teaching'    ? 'proud'        :
          emotion === 'curious'     ? 'question'     :
          emotion === 'encouraging' ? 'encouraging'  :
          emotion === 'celebrating' ? 'celebrating'  :
          emotion === 'thinking'    ? 'thinking'     : 'excited'
        } />
      </div>
      {/* Speech bubble — border-radius 0 at top-left = pointing to mascot */}
      {message && (
        <div style={{ background:C.surface, borderRadius:'0 16px 16px 16px', padding:'11px 14px', flex:1, border:`1.5px solid ${C.border}` }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:'#444', fontFamily:F, lineHeight:1.5 }}>
            {message}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — TOPIC INTRO
// ─────────────────────────────────────────────────────────────────────────────

function SlideTopicIntro({ slide, onNext }) {
  const { topicTitle, mascotLine, ctaLabel } = slide.content
  return (
    <div style={{ padding:'24px 20px', display:'flex', flexDirection:'column', flex:1, gap:'20px' }}>
      <MascotCompanion emotion="excited" message={mascotLine} />

      <div style={{ flex:1 }}>
        <div style={{ fontSize:'11px', fontWeight:900, color:C.muted, textTransform:'uppercase', letterSpacing:'1px', fontFamily:F, marginBottom:'10px' }}>
          Today&apos;s Lesson
        </div>
        <div style={{ fontSize:'30px', fontWeight:900, color:C.text, fontFamily:F, lineHeight:1.2, marginBottom:'16px' }}>
          {topicTitle}
        </div>
        <div style={{ display:'flex', gap:'10px', flexWrap:'wrap' }}>
          {['Singapore CPA method', 'Step-by-step', 'Practice included'].map(tag => (
            <div key={tag} style={{ background:C.blueLt, borderRadius:'50px', padding:'5px 14px', fontSize:'12px', fontWeight:700, color:C.blue, fontFamily:F }}>
              {tag}
            </div>
          ))}
        </div>
      </div>

      <Btn onClick={onNext}>{ctaLabel || "Let's go!"} →</Btn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — HOOK
// ─────────────────────────────────────────────────────────────────────────────

function SlideHook({ slide, onNext }) {
  const { scenario, question, options } = slide.content
  const [selected, setSelected] = useState(null)

  return (
    <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:'14px' }}>
      <MascotCompanion emotion="curious" message="Look at this real-life situation and see what you think — there's no wrong answer here, just thinking!" />

      {/* Scenario card */}
      <div style={{ background:C.blueLt, borderRadius:'18px', padding:'16px', border:`1.5px solid ${C.blue}22` }}>
        <Label>Real-Life Scenario</Label>
        <Body>{scenario}</Body>
      </div>

      <div style={{ fontWeight:800, fontSize:'16px', color:C.text, fontFamily:F }}>{question}</div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:'8px', flex:1 }}>
        {options.map((opt, i) => (
          <div key={opt.id}>
            <div onClick={() => setSelected(opt.id)} style={{
              borderRadius:'14px', padding:'13px 16px', cursor:'pointer',
              background:selected === opt.id ? C.blueLt : C.surface,
              border:`1.5px solid ${selected===opt.id?C.blue:C.border}`,
              display:'flex', gap:'12px', alignItems:'center',
              transition:'all 0.2s',
            }}>
              <div style={{ width:'28px', height:'28px', borderRadius:'8px', background:selected===opt.id?C.blue:C.bgPill, color:selected===opt.id?C.white:'#666', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'12px', fontWeight:900, fontFamily:F, flexShrink:0 }}>
                {LETTERS[i]}
              </div>
              <div style={{ fontSize:'15px', fontWeight:700, color:C.text, fontFamily:F }}>{opt.label}</div>
            </div>
            {/* Reveal explanation after selection — no right/wrong */}
            {selected === opt.id && (
              <div style={{ background:C.surface, borderRadius:'0 0 14px 14px', padding:'12px 16px', marginTop:'-4px', borderTop:`1px solid ${C.border}` }}>
                <div style={{ fontSize:'13px', fontWeight:600, color:'#444', fontFamily:F, lineHeight:1.6 }}>{opt.explanation}</div>
              </div>
            )}
          </div>
        ))}
      </div>

      {selected && <Btn onClick={onNext}>Continue →</Btn>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — DEFINITION
// ─────────────────────────────────────────────────────────────────────────────

function SlideDefinition({ slide, onNext }) {
  const { term, plainDefinition, simpleExample } = slide.content
  return (
    <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:'16px' }}>
      <MascotCompanion emotion="teaching" message={`Let me explain what "${term}" actually means in simple terms.`} />

      <div>
        <Label>Definition</Label>
        {/* Term in a prominent pill */}
        <div style={{ display:'inline-flex', background:C.blueLt, borderRadius:'12px', padding:'8px 18px', marginBottom:'12px' }}>
          <span style={{ fontSize:'20px', fontWeight:900, color:C.blue, fontFamily:F }}>{term}</span>
        </div>
        <Body>{plainDefinition}</Body>
      </div>

      <div style={{ background:C.surface, borderRadius:'16px', padding:'16px', border:`1.5px solid ${C.border}` }}>
        <Label>Example</Label>
        <Body style={{ fontSize:'15px' }}>{simpleExample}</Body>
      </div>

      <div style={{ flex:1 }} />
      <Btn onClick={onNext}>Got it! Continue →</Btn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — CONCEPT
// ─────────────────────────────────────────────────────────────────────────────

function SlideConcept({ slide, onNext }) {
  const { heading, body, callout } = slide.content
  return (
    <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:'16px' }}>
      <MascotCompanion emotion="teaching" message="Here's a key idea I want you to understand well." />

      <div style={{ fontSize:'22px', fontWeight:900, color:C.text, fontFamily:F, lineHeight:1.25 }}>{heading}</div>
      <Body>{body}</Body>
      {callout && <Callout>{callout}</Callout>}

      <div style={{ flex:1 }} />
      <Btn onClick={onNext}>Continue →</Btn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — FORMULA
// ─────────────────────────────────────────────────────────────────────────────

function SlideFormula({ slide, onNext }) {
  const { formula, formulaVariants, componentBreakdown } = slide.content
  return (
    <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:'16px' }}>
      <MascotCompanion emotion="teaching" message="Here's the formula — I want you to know it in all its forms, not just one." />

      {/* Hero formula */}
      <div style={{ background:C.blue, borderRadius:'22px', padding:'24px', textAlign:'center' }}>
        <Label>The Formula</Label>
        <div style={{ fontSize:'32px', fontWeight:900, color:C.white, fontFamily:F, letterSpacing:'1px', marginBottom:'16px' }}>{formula}</div>
        {/* Variants */}
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {formulaVariants.map((v, i) => (
            <div key={i} style={{ background:'rgba(255,255,255,0.15)', borderRadius:'12px', padding:'10px 14px', fontSize:'15px', fontWeight:700, color:C.white, fontFamily:F }}>
              {v}
            </div>
          ))}
        </div>
      </div>

      {/* Component breakdown */}
      <div>
        <Label>What each part means</Label>
        <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
          {componentBreakdown.map((c, i) => (
            <div key={i} style={{ display:'flex', gap:'12px', alignItems:'center', background:C.surface, borderRadius:'12px', padding:'11px 14px' }}>
              <div style={{ width:'36px', height:'36px', borderRadius:'10px', background:C.blue, color:C.white, fontSize:'16px', fontWeight:900, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontFamily:F }}>
                {c.symbol}
              </div>
              <div style={{ fontSize:'14px', fontWeight:600, color:C.text, fontFamily:F }}>{c.meaning}</div>
            </div>
          ))}
        </div>
      </div>

      <Btn onClick={onNext}>I understand the formula →</Btn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 6 — WORKED EXAMPLE
// ─────────────────────────────────────────────────────────────────────────────

function SlideWorkedExample({ slide, onNext }) {
  const { exampleNumber, problem, steps, answer, difficulty } = slide.content
  return (
    <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:'14px' }}>
      <MascotCompanion emotion="teaching" message="Let's look at this together — follow each step carefully." />

      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        <div style={{ background:C.blueLt, borderRadius:'50px', padding:'4px 14px', fontSize:'11px', fontWeight:800, color:C.blue, fontFamily:F }}>
          Example {exampleNumber}
        </div>
        <div style={{ background:difficulty==='easy'?C.greenLt:C.blueLt, borderRadius:'50px', padding:'4px 14px', fontSize:'11px', fontWeight:800, color:difficulty==='easy'?C.greenDk:C.blue, fontFamily:F }}>
          {difficulty === 'easy' ? 'Straightforward' : 'Medium'}
        </div>
      </div>

      {/* Problem card */}
      <div style={{ background:C.surface, borderRadius:'18px', padding:'16px', border:`1.5px solid ${C.border}` }}>
        <Label>Problem</Label>
        <Body style={{ fontSize:'16px' }}>{problem}</Body>
      </div>

      {/* Steps — all visible */}
      <div>
        <Label>Solution — Step by Step</Label>
        {steps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
      </div>

      {/* Answer */}
      <div style={{ background:C.greenLt, borderRadius:'14px', padding:'13px 16px', display:'flex', alignItems:'center', gap:'10px', border:`1.5px solid ${C.green}` }}>
        <div style={{ fontSize:'20px' }}>✓</div>
        <div style={{ fontFamily:F }}>
          <div style={{ fontSize:'11px', fontWeight:800, color:C.greenDk, textTransform:'uppercase', letterSpacing:'0.5px' }}>Answer</div>
          <div style={{ fontSize:'17px', fontWeight:900, color:C.text }}>{answer}</div>
        </div>
      </div>

      <Btn onClick={onNext}>Next →</Btn>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 7 — TRY IT
// Steps hidden by default. Hint available. "Review Solution" available.
// ─────────────────────────────────────────────────────────────────────────────

function SlideTryIt({ slide, onNext, onMascotEmotion }) {
  const { problem, hint, steps, answer, difficulty } = slide.content
  const [showHint,     setShowHint]     = useState(false)
  const [showSolution, setShowSolution] = useState(false)
  const [done,         setDone]         = useState(false)

  function handleReview() {
    setShowSolution(true)
    onMascotEmotion('celebrating')
    setDone(true)
  }

  return (
    <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:'14px' }}>
      <MascotCompanion emotion={done ? 'celebrating' : 'thinking'}
        message={done ? "Well done for working through it! Look carefully at each step." : "Now you try! Take your time — the hint is there if you need it."}
      />

      <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
        <div style={{ background:C.blueLt, borderRadius:'50px', padding:'4px 14px', fontSize:'11px', fontWeight:800, color:C.blue, fontFamily:F }}>Try It Yourself</div>
        <div style={{ background:difficulty==='easy'?C.greenLt:C.blueLt, borderRadius:'50px', padding:'4px 14px', fontSize:'11px', fontWeight:800, color:difficulty==='easy'?C.greenDk:C.blue, fontFamily:F }}>
          {difficulty === 'easy' ? 'Straightforward' : 'Medium'}
        </div>
      </div>

      <div style={{ background:C.surface, borderRadius:'18px', padding:'16px', border:`1.5px solid ${C.border}` }}>
        <Label>Your Problem</Label>
        <Body style={{ fontSize:'16px' }}>{problem}</Body>
      </div>

      {/* Hint toggle */}
      {!showHint ? (
        <button onClick={() => setShowHint(true)} style={{ padding:'12px 16px', borderRadius:'14px', border:`1.5px dashed ${C.muted}`, background:'transparent', fontSize:'14px', fontWeight:700, color:C.muted, fontFamily:F, cursor:'pointer', textAlign:'left' }}>
          💡 Need a hint? Tap here
        </button>
      ) : (
        <div style={{ background:'#FFFBEA', borderRadius:'14px', padding:'13px 16px', border:`1.5px solid #FFD700` }}>
          <div style={{ fontSize:'12px', fontWeight:800, color:'#7A5C00', textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:F, marginBottom:'5px' }}>Hint</div>
          <div style={{ fontSize:'14px', fontWeight:600, color:'#5C4400', fontFamily:F, lineHeight:1.6 }}>{hint}</div>
        </div>
      )}

      {/* Solution — revealed on demand */}
      {showSolution && (
        <div>
          <Label>Full Solution</Label>
          {steps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
          <div style={{ background:C.greenLt, borderRadius:'14px', padding:'13px 16px', marginTop:'8px', display:'flex', gap:'10px', alignItems:'center', border:`1.5px solid ${C.green}` }}>
            <div style={{ fontSize:'20px' }}>✓</div>
            <div>
              <div style={{ fontSize:'11px', fontWeight:800, color:C.greenDk, textTransform:'uppercase', fontFamily:F }}>Answer</div>
              <div style={{ fontSize:'17px', fontWeight:900, color:C.text, fontFamily:F }}>{answer}</div>
            </div>
          </div>
        </div>
      )}

      {/* Action buttons */}
      {!showSolution ? (
        <Btn onClick={handleReview} color={C.blue}>Review Full Solution →</Btn>
      ) : (
        <Btn onClick={onNext}>Continue →</Btn>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 8 — PRACTICE QUESTION
// 2-attempt logic. Per-wrong-option explanations. Partial XP on "See Answer".
// ─────────────────────────────────────────────────────────────────────────────

function SlidePracticeQuestion({ slide, onNext, onXP, onMascotEmotion }) {
  const { question, options, xpValue } = slide.content

  const [selected,     setSelected]     = useState(null)   // current pick
  const [attempts,     setAttempts]     = useState(0)
  const [revealed,     setRevealed]     = useState(false)  // "See Answer" used
  const [awarded,      setAwarded]      = useState(false)

  const correctOpt  = options.find(o => o.isCorrect)
  const isCorrect   = selected?.isCorrect
  const wrongOpt    = selected && !selected.isCorrect ? selected : null
  const showSeeAns  = attempts >= 2 && !isCorrect && !revealed

  function handleSelect(opt) {
    if (awarded || revealed) return
    setSelected(opt)
    setAttempts(a => a + 1)

    if (opt.isCorrect) {
      onMascotEmotion('celebrating')
      onXP(xpValue)
      setAwarded(true)
    } else {
      onMascotEmotion('encouraging')
    }
  }

  function handleSeeAnswer() {
    setRevealed(true)
    setSelected(correctOpt)
    onMascotEmotion('teaching')
    if (!awarded) {
      onXP(Math.floor(xpValue / 2))  // partial XP
      setAwarded(true)
    }
  }

  function handleTryAgain() {
    setSelected(null)
  }

  function optStyle(opt) {
    const isSel = selected?.id === opt.id
    if (!selected) return { background:C.surface, border:`1.5px solid ${C.border}` }
    if (opt.isCorrect)      return { background:C.greenLt, border:`2px solid ${C.green}` }
    if (isSel && !opt.isCorrect) return { background:C.redLight, border:`2px solid ${C.red}` }
    return { background:C.surface, border:`1.5px solid ${C.border}`, opacity:0.45 }
  }

  function badgeStyle(opt) {
    const isSel = selected?.id === opt.id
    if (!selected) return { background:C.bgPill, color:'#666' }
    if (opt.isCorrect)           return { background:C.green, color:C.white }
    if (isSel && !opt.isCorrect) return { background:C.red, color:C.white }
    return { background:C.bgPill, color:'#AAA' }
  }

  const successMsg = SUCCESS_MSGS[attempts % SUCCESS_MSGS.length]
  const wrongMsg   = WRONG_MSGS[Math.min(attempts - 1, WRONG_MSGS.length - 1)]

  return (
    <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:'12px' }}>
      <MascotCompanion
        emotion={isCorrect ? 'celebrating' : attempts > 0 && !isCorrect ? 'encouraging' : 'thinking'}
        message={
          isCorrect    ? successMsg :
          attempts > 0 ? wrongMsg   :
          "Time to test yourself! Pick the correct answer."
        }
      />

      <div style={{ background:C.surface, borderRadius:'16px', padding:'14px 16px' }}>
        <Label>Question {slide.content.questionNumber ? `${slide.content.questionNumber} of ${slide.content.questionTotal}` : ''}</Label>
        <Body style={{ fontSize:'16px' }}>{question}</Body>
      </div>

      {/* Options */}
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {options.map((opt, i) => (
          <div key={opt.id}
            onClick={() => !awarded && !revealed && !selected && handleSelect(opt)}
            style={{ borderRadius:'14px', padding:'13px 16px', display:'flex', gap:'12px', alignItems:'center', cursor:awarded||revealed||selected?'default':'pointer', transition:'all 0.2s', ...optStyle(opt) }}
          >
            <div style={{ width:'30px', height:'30px', borderRadius:'9px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:900, flexShrink:0, fontFamily:F, transition:'all 0.2s', ...badgeStyle(opt) }}>
              {LETTERS[i]}
            </div>
            <div style={{ fontSize:'15px', fontWeight:700, color:C.text, fontFamily:F }}>{opt.label}</div>
          </div>
        ))}
      </div>

      {/* Wrong explanation */}
      {wrongOpt && !revealed && wrongOpt.wrongExplanation && (
        <div style={{ background:C.redLight, borderRadius:'14px', padding:'13px 16px', border:`1.5px solid ${C.red}22` }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:'#C0222A', fontFamily:F, lineHeight:1.6 }}>{wrongOpt.wrongExplanation}</div>
        </div>
      )}

      {/* Partial XP note on reveal */}
      {revealed && (
        <div style={{ background:C.surface, borderRadius:'14px', padding:'12px 16px', border:`1.5px solid ${C.border}` }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:C.muted, fontFamily:F }}>
            The correct answer is shown above. You earned {Math.floor(xpValue / 2)} XP (partial — try to get it first time next lesson!).
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
        {/* Try Again — shown after wrong attempt */}
        {selected && !isCorrect && !revealed && (
          <Btn onClick={handleTryAgain} color='#555' style={{ background:'#555' }}>Try Again</Btn>
        )}
        {/* See Answer — shown after 2 wrong attempts */}
        {showSeeAns && (
          <Btn onClick={handleSeeAnswer} color={C.blue}>See Answer (partial XP)</Btn>
        )}
        {/* Next — shown when correct or answer revealed */}
        {(isCorrect || revealed) && (
          <Btn onClick={onNext}>Next →</Btn>
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 9 — LESSON COMPLETE
// ─────────────────────────────────────────────────────────────────────────────

function PopStar({ delay }) {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(()=>setOn(true), delay); return()=>clearTimeout(t) }, [delay])
  return <span style={{ fontSize:'28px', display:'inline-block', transform:on?'scale(1)':'scale(0)', opacity:on?1:0, transition:`transform 0.4s cubic-bezier(.175,.885,.32,1.275) ${delay}ms, opacity 0.2s ${delay}ms` }}>⭐</span>
}

function SlideLessonComplete({ slide, totalXP, onNext }) {
  const { completionMessage, nextLessonTitle } = slide.content
  return (
    <div style={{ padding:'20px 20px 24px', flex:1, display:'flex', flexDirection:'column', gap:'16px' }}>
      <MascotCompanion emotion="celebrating" message="You did it! I'm so proud of you. This lesson is complete! 🎉" />

      {/* Trophy card */}
      <div style={{ background:C.blue, borderRadius:'24px', padding:'28px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:'160px', height:'160px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', top:'-60px', right:'-40px' }}/>
        <div style={{ fontSize:'52px', marginBottom:'10px', position:'relative', zIndex:1 }}>🏆</div>
        <div style={{ fontSize:'24px', fontWeight:900, color:C.white, fontFamily:F, marginBottom:'6px', position:'relative', zIndex:1 }}>Lesson Complete!</div>
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginBottom:'14px', position:'relative', zIndex:1 }}>
          <PopStar delay={100}/><PopStar delay={260}/><PopStar delay={420}/>
        </div>
        <div style={{ background:'rgba(255,255,255,0.18)', borderRadius:'14px', padding:'12px 16px', position:'relative', zIndex:1 }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:'rgba(255,255,255,0.75)', fontFamily:F }}>XP earned this lesson</div>
          <div style={{ fontSize:'28px', fontWeight:900, color:C.white, fontFamily:F }}>+{totalXP} XP ⭐</div>
        </div>
      </div>

      {/* Completion message */}
      <div style={{ background:C.surface, borderRadius:'18px', padding:'16px' }}>
        <Body style={{ fontSize:'15px' }}>{completionMessage}</Body>
      </div>

      {/* Next lesson teaser */}
      {nextLessonTitle && (
        <div style={{ background:C.surface, borderRadius:'16px', padding:'14px 16px', display:'flex', alignItems:'center', gap:'12px', border:`1.5px solid ${C.border}` }}>
          <div style={{ width:'40px', height:'40px', borderRadius:'12px', background:C.blueLt, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', flexShrink:0 }}>⚡</div>
          <div>
            <div style={{ fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:F }}>Up Next</div>
            <div style={{ fontSize:'15px', fontWeight:900, color:C.text, fontFamily:F, marginTop:'2px' }}>{nextLessonTitle}</div>
          </div>
        </div>
      )}

      <Btn onClick={onNext} color={C.blue}>
        {nextLessonTitle ? 'Next Lesson →' : 'Back to Topics →'}
      </Btn>
    </div>
  )
}

// ─── SLIDE ROUTER ─────────────────────────────────────────────────────────────

function SlideRenderer({ slide, onNext, onBack, onXP, onMascotEmotion, totalXP }) {
  const props = { slide, onNext, onBack, onXP, onMascotEmotion, totalXP }
  switch (slide.type) {
    case 'topic_intro':       return <SlideTopicIntro       {...props} />
    case 'hook':              return <SlideHook             {...props} />
    case 'definition':        return <SlideDefinition       {...props} />
    case 'concept':           return <SlideConcept          {...props} />
    case 'formula':           return <SlideFormula          {...props} />
    case 'worked_example':    return <SlideWorkedExample    {...props} />
    case 'try_it':            return <SlideTryIt            {...props} />
    case 'practice_question': return <SlidePracticeQuestion {...props} />
    case 'lesson_complete':   return <SlideLessonComplete   {...props} />
    default: return (
      <div style={{ padding:'40px 20px', fontFamily:F, color:C.muted, textAlign:'center' }}>
        Unknown slide type: <strong>{slide.type}</strong>
      </div>
    )
  }
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export function LessonEngine({ lesson, onComplete }) {
  const [idx,     setIdx]     = useState(0)
  const [xp,      setXp]      = useState(0)
  const [emotion, setEmotion] = useState('excited')
  const [animKey, setAnimKey] = useState(0)
  const [dir,     setDir]     = useState(1)

  const total = lesson.slides.length
  const slide = lesson.slides[idx]

  // Auto-update mascot emotion on slide change
  useEffect(() => {
    setEmotion(SLIDE_EMOTION[slide.type] || 'excited')
  }, [idx, slide.type])

  function navigate(delta) {
    const next = idx + delta
    if (next < 0 || next >= total) return
    setDir(delta)
    setIdx(next)
    setAnimKey(k => k + 1)
  }

  function goNext() {
    if (idx === total - 1) {
      // Save progress here — plug into progressStore.completeLesson(...)
      onComplete?.()
    } else {
      navigate(1)
    }
  }

  function goBack() {
    if (idx === 0) { onComplete?.(); return }
    navigate(-1)
  }

  const animClass = dir > 0 ? 'lf_slideRight' : 'lf_slideLeft'

  return (
    <div style={{ display:'flex', flexDirection:'column', height:'100dvh', maxHeight:'100dvh', background:C.white, fontFamily:F, maxWidth:'640px', margin:'0 auto', overflow:'hidden' }}>
      <TopBar current={idx} total={total} onClose={onComplete} onBack={goBack} xp={xp} />

      <div key={animKey} className={animClass} style={{ flex:1, overflowY:'auto', display:'flex', flexDirection:'column' }}>
        <SlideRenderer
          slide={slide}
          onNext={goNext}
          onBack={goBack}
          onXP={pts => setXp(x => x + pts)}
          onMascotEmotion={setEmotion}
          totalXP={xp}
        />
      </div>
    </div>
  )
}