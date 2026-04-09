'use client'

// ─────────────────────────────────────────────────────────────────────────────
// LessonEngine.jsx  v4  — All 9 spec improvements
//
// 1.  Navbar hidden: lesson layout uses zIndex:9999, confirmed working
// 2.  Button visibility: BottomBar always outside scroll; no button ever
//     hidden under the bar — safe-area-inset-bottom respected
// 3.  Typewriter: SlideTopicIntro animates mascotLine char-by-char
// 4.  Hook slide: scenario styled as immersive card; feedback pushed BELOW
//     full options list, never colliding
// 5.  Definition: title "What is [term]?", image placeholder, NO example
// 6.  Slide order: definition → (example on concept slide) → formula
// 7.  Math formatting: fraction component renders numerator/bar/denominator
//     blackboard-style; formulas use FractionDisplay, superscripts
// 8.  TryIt: after Review Solution, BottomBar Continue is shown
// 9.  Practice explanations: structured layout — result badge + explanation
//     text + formatted working steps
// ─────────────────────────────────────────────────────────────────────────────

import { useState, useEffect, useRef } from 'react'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  white:   '#FFFFFF',
  surface: '#F7F8FA',
  green:   '#6DC77A',
  greenDk: '#52B362',
  greenLt: '#EBF9EE',
  blue:    '#2D3CE6',
  blueLt:  '#EEF0FF',
  dark:    '#1A1A1A',
  text:    '#1A1A1A',
  body:    '#1F1F1F',
  muted:   '#888888',
  border:  '#EBEBEB',
  bgPill:  '#EFEFEF',
  red:     '#E63946',
  redLt:   '#FFF0F1',
  amber:   '#F59E0B',
  amberLt: '#FFFBEA',
}
const F = "'Nunito', sans-serif"
const LETTERS = ['A', 'B', 'C', 'D']

const SLIDE_EMOTION = {
  topic_intro: 'excited', hook: 'curious', definition: 'teaching',
  concept: 'teaching', visual: 'curious', formula: 'teaching',
  worked_example: 'teaching', try_it: 'thinking',
  practice_question: 'thinking', lesson_complete: 'celebrating',
}

const SUCCESS_MSGS = [
  "Yes! Exactly right! 🎉",
  "That's it! You've got it. ✨",
  "Perfect — you nailed that! 🔥",
  "Brilliant thinking. 💡",
  "Nailed it! Keep going! ⚡",
]
const WRONG_MSGS = [
  "Not quite — but you're close. Try again.",
  "Almost! Think carefully and try once more.",
  "That's okay — let's think again. You've got this!",
]

// ─────────────────────────────────────────────────────────────────────────────
// MATH RENDERING — Blackboard-style fractions & expressions  (Req. 7)
// No external library — pure CSS vertical fraction layout.
// ─────────────────────────────────────────────────────────────────────────────

// Vertical fraction: numerator / horizontal bar / denominator
function Fraction({ num, den, size = 'md' }) {
  const numSize  = size === 'lg' ? '22px' : size === 'sm' ? '14px' : '17px'
  const barH     = size === 'lg' ? '2.5px' : '2px'
  const barColor = C.dark
  return (
    <span style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', verticalAlign: 'middle', margin: '0 4px', gap: '1px' }}>
      <span style={{ fontSize: numSize, fontWeight: 700, fontFamily: F, color: C.body, lineHeight: 1.2, textAlign: 'center' }}>{num}</span>
      <span style={{ width: '100%', minWidth: '32px', height: barH, background: barColor, borderRadius: '1px', display: 'block' }} />
      <span style={{ fontSize: numSize, fontWeight: 700, fontFamily: F, color: C.body, lineHeight: 1.2, textAlign: 'center' }}>{den}</span>
    </span>
  )
}

// Superscript exponent
function Sup({ children }) {
  return <sup style={{ fontSize: '70%', fontWeight: 700, verticalAlign: 'super' }}>{children}</sup>
}

// Render a formula string using a simple token parser.
// Supports:  [num/den]  → vertical fraction
//            ^n         → superscript (single char after caret)
//            plain text → rendered as-is
function MathExpr({ expr, size = 'md', color = C.body }) {
  if (!expr) return null
  const fontSize = size === 'lg' ? '26px' : size === 'sm' ? '15px' : '20px'

  // Tokenise: split into fraction tokens [a/b], sup tokens ^x, and plain text
  const tokens = []
  let remaining = expr
  while (remaining.length > 0) {
    // Check for [num/den]
    const frac = remaining.match(/^\[([^\]\/]+)\/([^\]]+)\]/)
    if (frac) {
      tokens.push({ type: 'frac', num: frac[1], den: frac[2] })
      remaining = remaining.slice(frac[0].length)
      continue
    }
    // Check for ^x (single char superscript)
    const sup = remaining.match(/^\^(.)/)
    if (sup) {
      tokens.push({ type: 'sup', val: sup[1] })
      remaining = remaining.slice(sup[0].length)
      continue
    }
    // Plain char
    tokens.push({ type: 'text', val: remaining[0] })
    remaining = remaining.slice(1)
  }

  // Merge consecutive text tokens
  const merged = []
  for (const t of tokens) {
    if (t.type === 'text' && merged.length > 0 && merged[merged.length - 1].type === 'text') {
      merged[merged.length - 1].val += t.val
    } else {
      merged.push({ ...t })
    }
  }

  return (
    <span style={{ fontSize, fontWeight: 700, fontFamily: F, color, display: 'inline-flex', alignItems: 'center', flexWrap: 'wrap', gap: '2px' }}>
      {merged.map((t, i) => {
        if (t.type === 'frac') return <Fraction key={i} num={t.num} den={t.den} size={size} />
        if (t.type === 'sup')  return <Sup key={i}>{t.val}</Sup>
        return <span key={i}>{t.val}</span>
      })}
    </span>
  )
}

// A "blackboard" formula display block — dark bg, prominent fraction rendering
function FormulaBlock({ label, expr, variants = [], children }) {
  return (
    <div style={{ background: '#1a1a2e', borderRadius: '18px', padding: '20px 22px', textAlign: 'center' }}>
      {label && (
        <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: F, marginBottom: '14px' }}>{label}</div>
      )}
      {expr && (
        <div style={{ marginBottom: variants.length ? '16px' : '0' }}>
          <MathExpr expr={expr} size="lg" color="#FFFFFF" />
        </div>
      )}
      {children}
      {variants.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: expr ? '0' : '0' }}>
          {variants.map((v, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.10)', borderRadius: '10px', padding: '10px 14px', textAlign: 'center' }}>
              <MathExpr expr={v} size="sm" color="rgba(255,255,255,0.9)" />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// Formatted step line — renders any math expressions inside a step
function MathStepLine({ line }) {
  return <MathExpr expr={line} size="md" color={C.body} />
}

// ─── SHARED PRIMITIVES ────────────────────────────────────────────────────────

function Body({ children, style = {} }) {
  return (
    <div style={{ fontSize: '18px', fontWeight: 700, color: C.body, lineHeight: 1.8, fontFamily: F, ...style }}>
      {children}
    </div>
  )
}

function Label({ children }) {
  return (
    <div style={{ fontSize: '11px', fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '1.1px', fontFamily: F, marginBottom: '8px' }}>
      {children}
    </div>
  )
}

function Callout({ children }) {
  return (
    <div style={{ background: C.blueLt, borderLeft: `4px solid ${C.blue}`, borderRadius: '0 14px 14px 0', padding: '14px 16px', margin: '12px 0' }}>
      <div style={{ fontSize: '16px', fontWeight: 800, color: C.dark, fontFamily: F, lineHeight: 1.65 }}>{children}</div>
    </div>
  )
}

// Step card: supports string lines or MathExpr lines (prefixed with 'math:')
function StepCard({ step, index }) {
  const isObj   = typeof step === 'object' && step !== null
  const line    = isObj ? step.line : step
  const lbl     = isObj ? step.label : `Step ${index + 1}`
  const isMath  = typeof line === 'string' && line.startsWith('math:')
  const display = isMath ? line.slice(5) : line

  return (
    <div style={{ background: C.white, borderRadius: '14px', padding: '12px 14px', marginBottom: '8px', border: `1px solid ${C.border}` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
        <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: C.green, color: C.white, fontSize: '12px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: F }}>
          {index + 1}
        </div>
        <div style={{ fontSize: '11px', fontWeight: 800, color: C.greenDk, textTransform: 'uppercase', letterSpacing: '0.6px', fontFamily: F }}>{lbl}</div>
      </div>
      <div style={{ background: C.surface, borderRadius: '10px', padding: '10px 14px', marginLeft: '36px', lineHeight: 1.6, minHeight: '38px', display: 'flex', alignItems: 'center' }}>
        {isMath
          ? <MathExpr expr={display} size="md" color={C.body} />
          : <span style={{ fontSize: '17px', fontWeight: 700, color: C.body, fontFamily: F }}>{display}</span>
        }
      </div>
    </div>
  )
}

// Image placeholder block — labelled, dashed border
function ImagePlaceholder({ label = 'Image coming soon' }) {
  return (
    <div style={{ borderRadius: '16px', height: '160px', background: 'linear-gradient(135deg, #F0FFF4, #E8F5FF)', border: '2px dashed #C0D8F0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
      <svg width="32" height="32" fill="none" viewBox="0 0 24 24">
        <rect x="3" y="5" width="18" height="14" rx="3" stroke="#90B0C8" strokeWidth="1.5"/>
        <circle cx="9" cy="10" r="2" stroke="#90B0C8" strokeWidth="1.5"/>
        <path d="M3 16l4-3 3 2.5 4-5 5 5.5" stroke="#90B0C8" strokeWidth="1.5" strokeLinejoin="round"/>
      </svg>
      <span style={{ fontSize: '12px', fontWeight: 700, color: '#90B0C8', fontFamily: F, letterSpacing: '0.3px' }}>[ {label} ]</span>
    </div>
  )
}

// ─── TOP BAR ─────────────────────────────────────────────────────────────────

function TopBar({ current, total, onBack, onClose, xp }) {
  const btn = { width: '38px', height: '38px', borderRadius: '11px', border: 'none', background: C.bgPill, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: F, fontSize: '16px', color: C.dark, transition: 'background 0.15s' }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '14px 20px 10px', background: C.white, borderBottom: `1px solid ${C.border}`, position: 'sticky', top: 0, zIndex: 20 }}>
      <button style={btn} onClick={onBack} aria-label="Previous"
        onMouseEnter={e => e.currentTarget.style.background = '#E2E2E2'}
        onMouseLeave={e => e.currentTarget.style.background = C.bgPill}
      >←</button>

      <div style={{ flex: 1, display: 'flex', gap: '4px' }}>
        {Array.from({ length: total }).map((_, i) => (
          <div key={i} style={{ flex: i === current ? 2 : 1, height: '5px', borderRadius: '3px', background: i < current ? C.green : i === current ? C.blue : C.bgPill, transition: 'all 0.3s ease' }} />
        ))}
      </div>

      {xp > 0 && (
        <div style={{ background: C.blueLt, borderRadius: '50px', padding: '4px 10px', fontSize: '12px', fontWeight: 800, color: C.blue, fontFamily: F, flexShrink: 0 }}>
          ⭐ {xp}
        </div>
      )}

      <button style={{ ...btn, fontWeight: 700 }} onClick={onClose} aria-label="Close lesson"
        onMouseEnter={e => e.currentTarget.style.background = '#E2E2E2'}
        onMouseLeave={e => e.currentTarget.style.background = C.bgPill}
      >✕</button>
    </div>
  )
}

// ─── BOTTOM BAR ───────────────────────────────────────────────────────────────
// Audio button always left. Continue/Complete always right.
// hideNext suppresses the right button for slides that own their flow.

function BottomBar({ onNext, isLast, hideNext = false }) {
  const [audioTip, setAudioTip] = useState(false)

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center', padding: '14px 20px', paddingBottom: 'max(28px, env(safe-area-inset-bottom, 28px))', background: C.white, borderTop: `1px solid ${C.border}`, position: 'sticky', bottom: 0, zIndex: 20, flexShrink: 0 }}>
      {/* 🎙 Audio */}
      <div style={{ position: 'relative', flexShrink: 0 }}>
        <button onClick={() => { setAudioTip(true); setTimeout(() => setAudioTip(false), 2400) }}
          aria-label="Listen to this lesson"
          style={{ width: '54px', height: '54px', borderRadius: '27px', background: C.dark, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'opacity 0.15s' }}
          onMouseEnter={e => e.currentTarget.style.opacity = '0.8'}
          onMouseLeave={e => e.currentTarget.style.opacity = '1'}
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
            <path d="M3 9.5C3 5.91 7.03 3 12 3s9 2.91 9 6.5v5c0 1.38-1.12 2.5-2.5 2.5H17a1.5 1.5 0 0 1-1.5-1.5v-3A1.5 1.5 0 0 1 17 11h1.5V9.5C18.5 7.01 15.59 5 12 5S5.5 7.01 5.5 9.5V11H7a1.5 1.5 0 0 1 1.5 1.5v3A1.5 1.5 0 0 1 7 17H5.5A2.5 2.5 0 0 1 3 14.5v-5z" fill="white"/>
          </svg>
        </button>
        {audioTip && (
          <div style={{ position: 'absolute', bottom: '62px', left: '50%', transform: 'translateX(-50%)', background: C.dark, color: C.white, fontFamily: F, fontWeight: 700, fontSize: '11px', padding: '7px 13px', borderRadius: '8px', whiteSpace: 'nowrap', zIndex: 30 }}>
            🎙️ Audio coming soon
            <div style={{ position: 'absolute', bottom: '-4px', left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: C.dark, clipPath: 'polygon(0 0,100% 0,50% 100%)' }} />
          </div>
        )}
      </div>

      {/* Continue / Complete */}
      {!hideNext && (
        <button onClick={onNext} style={{ flex: 1, height: '54px', borderRadius: '16px', border: 'none', background: isLast ? C.blue : C.green, color: C.white, fontFamily: F, fontWeight: 900, fontSize: '16px', cursor: 'pointer', letterSpacing: '0.2px', transition: 'background 0.2s, transform 0.1s' }}
          onMouseDown={e => e.currentTarget.style.transform = 'scale(0.98)'}
          onMouseUp={e => e.currentTarget.style.transform = 'scale(1)'}
          onMouseEnter={e => e.currentTarget.style.background = isLast ? '#1E2BC0' : C.greenDk}
          onMouseLeave={e => e.currentTarget.style.background = isLast ? C.blue : C.green}
        >
          {isLast ? 'Complete Lesson ✓' : 'Continue →'}
        </button>
      )}
    </div>
  )
}

// ─── MASCOT COMPANION ─────────────────────────────────────────────────────────

function MascotCompanion({ emotion, message }) {
  const expr = { excited: 'excited', teaching: 'proud', curious: 'question', encouraging: 'encouraging', celebrating: 'celebrating', thinking: 'thinking' }[emotion] || 'excited'
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
      <div style={{ flexShrink: 0, transition: 'all 0.3s ease' }}>
        <LearniiBuddy size={60} expression={expr} />
      </div>
      {message && (
        <div style={{ background: C.surface, borderRadius: '0 16px 16px 16px', padding: '12px 15px', flex: 1, border: `1.5px solid ${C.border}` }}>
          <div style={{ fontSize: '14px', fontWeight: 700, color: '#333', fontFamily: F, lineHeight: 1.55 }}>{message}</div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 1 — TOPIC INTRO  (Req. 3: typewriter animation on mascotLine)
// ─────────────────────────────────────────────────────────────────────────────

function SlideTopicIntro({ slide }) {
  const { topicTitle, mascotLine } = slide.content
  const [displayed, setDisplayed]  = useState('')
  const [done,      setDone]       = useState(false)
  const timerRef = useRef(null)
  const fullText = mascotLine || ''

  useEffect(() => {
    setDisplayed(''); setDone(false)
    let i = 0
    timerRef.current = setInterval(() => {
      i++
      setDisplayed(fullText.slice(0, i))
      if (i >= fullText.length) { clearInterval(timerRef.current); setDone(true) }
    }, 28)
    return () => clearInterval(timerRef.current)
  }, [fullText])

  return (
    <div style={{ padding: '28px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div>
        <div style={{ fontSize: '12px', fontWeight: 900, color: C.muted, textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: F, marginBottom: '10px' }}>
          Today&apos;s Lesson
        </div>
        <div style={{ fontSize: '32px', fontWeight: 900, color: C.text, fontFamily: F, lineHeight: 1.2 }}>
          {topicTitle}
        </div>
      </div>

      {/* Mascot + typewriter bubble */}
      <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
        <div style={{ flexShrink: 0 }}>
          <LearniiBuddy size={60} expression="excited" />
        </div>
        <div style={{ background: C.surface, borderRadius: '0 16px 16px 16px', padding: '14px 16px', flex: 1, border: `1.5px solid ${C.border}`, minHeight: '60px' }}>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#333', fontFamily: F, lineHeight: 1.6 }}>
            {displayed}
            {!done && (
              <span style={{ display: 'inline-block', width: '2px', height: '16px', background: C.blue, marginLeft: '2px', verticalAlign: 'middle', animation: 'twBlink 0.7s infinite' }} />
            )}
          </div>
        </div>
      </div>

      <style>{`@keyframes twBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
      <div style={{ flex: 1 }} />
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 2 — HOOK  (Req. 4: styled scenario + feedback BELOW all options)
// ─────────────────────────────────────────────────────────────────────────────

function SlideHook({ slide, onNext }) {
  const { scenario, question, options } = slide.content
  const [selected, setSelected] = useState(null)
  const selectedOpt = options.find(o => o.id === selected)

  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <MascotCompanion emotion="curious" message="Look at this real-life situation — there's no wrong answer, just thinking!" />

      {/* Immersive scenario card — darker, left-accent (Req. 4) */}
      <div style={{ background: '#1E2A3A', borderRadius: '18px', padding: '18px 20px', borderLeft: `5px solid ${C.blue}`, position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-30px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: 'rgba(45,60,230,0.15)' }} />
        <div style={{ fontSize: '10px', fontWeight: 900, color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: '1.2px', fontFamily: F, marginBottom: '10px' }}>
          Real-Life Scenario
        </div>
        <div style={{ fontSize: '16px', fontWeight: 700, color: 'rgba(255,255,255,0.92)', fontFamily: F, lineHeight: 1.75, position: 'relative', zIndex: 1 }}>
          {scenario}
        </div>
      </div>

      <div style={{ fontSize: '18px', fontWeight: 800, color: C.text, fontFamily: F }}>{question}</div>

      {/* Options — tapping only selects, does NOT expand feedback inline */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {options.map((opt, i) => (
          <div key={opt.id} onClick={() => setSelected(opt.id)} style={{
            borderRadius: '14px', padding: '14px 16px', cursor: 'pointer',
            background: selected === opt.id ? C.blueLt : C.surface,
            border: `1.5px solid ${selected === opt.id ? C.blue : C.border}`,
            display: 'flex', gap: '12px', alignItems: 'center', transition: 'all 0.2s',
          }}>
            <div style={{ width: '30px', height: '30px', borderRadius: '9px', background: selected === opt.id ? C.blue : C.bgPill, color: selected === opt.id ? C.white : '#555', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900, fontFamily: F, flexShrink: 0 }}>
              {LETTERS[i]}
            </div>
            <Body style={{ fontSize: '16px' }}>{opt.label}</Body>
          </div>
        ))}
      </div>

      {/* Feedback block — BELOW all options, always, never colliding (Req. 4) */}
      {selectedOpt && (
        <div style={{ background: C.surface, borderRadius: '16px', padding: '16px 18px', border: `1.5px solid ${C.blue}44`, marginTop: '4px' }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: C.blue, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: F, marginBottom: '8px' }}>
            💬 Here&apos;s what that means
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#333', fontFamily: F, lineHeight: 1.65 }}>
            {selectedOpt.explanation}
          </div>
        </div>
      )}

      {selected && (
        <button onClick={onNext} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: C.green, color: C.white, fontFamily: F, fontWeight: 900, fontSize: '16px', cursor: 'pointer', width: '100%' }}>
          Continue →
        </button>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 3 — DEFINITION  (Req. 5: "What is X?", image placeholder, NO example)
// ─────────────────────────────────────────────────────────────────────────────

function SlideDefinition({ slide }) {
  const { term, plainDefinition } = slide.content
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <MascotCompanion emotion="teaching" message={`Let me explain exactly what "${term}" means.`} />

      {/* Title: "What is [term]?" */}
      <div style={{ fontSize: '26px', fontWeight: 900, color: C.text, fontFamily: F, lineHeight: 1.2 }}>
        What is <span style={{ color: C.blue }}>{term}</span>?
      </div>

      {/* Image placeholder immediately after title */}
      <ImagePlaceholder label={`${term} — concept image`} />

      {/* Definition text — no example here */}
      <div style={{ background: C.white, borderRadius: '16px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Body>{plainDefinition}</Body>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 4 — CONCEPT  (real-world example lives here, Req. 6)
// ─────────────────────────────────────────────────────────────────────────────

function SlideConcept({ slide }) {
  const { heading, body, callout, example } = slide.content
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <MascotCompanion emotion="teaching" message="Here's a key idea I want you to understand well." />
      <div style={{ fontSize: '24px', fontWeight: 900, color: C.text, fontFamily: F, lineHeight: 1.25 }}>{heading}</div>
      <Body>{body}</Body>
      {callout && <Callout>{callout}</Callout>}

      {/* Example lives on the concept slide — separate from definition */}
      {example && (
        <div style={{ background: C.amberLt, borderRadius: '14px', padding: '14px 16px', border: `1.5px solid #F59E0B55` }}>
          <div style={{ fontSize: '11px', fontWeight: 900, color: C.amber, textTransform: 'uppercase', letterSpacing: '1px', fontFamily: F, marginBottom: '8px' }}>
            🌍 Real-world example
          </div>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#5C3A00', fontFamily: F, lineHeight: 1.65 }}>{example}</div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 5 — FORMULA  (Req. 7: blackboard fractions, proper math layout)
// ─────────────────────────────────────────────────────────────────────────────

function SlideFormula({ slide }) {
  const { formula, formulaVariants = [], componentBreakdown = [] } = slide.content

  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <MascotCompanion emotion="teaching" message="Here's the formula — learn all its forms, not just one." />

      {/* Blackboard-style formula block */}
      <FormulaBlock label="The Formula" expr={formula} variants={formulaVariants} />

      {componentBreakdown.length > 0 && (
        <div>
          <Label>What each part means</Label>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {componentBreakdown.map((c, i) => (
              <div key={i} style={{ display: 'flex', gap: '12px', alignItems: 'center', background: C.surface, borderRadius: '12px', padding: '12px 14px', border: `1px solid ${C.border}` }}>
                <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: C.blue, color: C.white, fontSize: '17px', fontWeight: 900, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontFamily: F }}>{c.symbol}</div>
                <div style={{ fontSize: '15px', fontWeight: 700, color: C.body, fontFamily: F, lineHeight: 1.5 }}>{c.meaning}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 6 — WORKED EXAMPLE  (Req. 7: math steps, Req. 8: Next always visible)
// ─────────────────────────────────────────────────────────────────────────────

function SlideWorkedExample({ slide }) {
  const { exampleNumber, problem, steps, answer, difficulty, formula } = slide.content

  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <MascotCompanion emotion="teaching" message="Let's look at this together — follow each step carefully." />

      <div style={{ display: 'flex', gap: '8px' }}>
        <div style={{ background: C.blueLt, borderRadius: '50px', padding: '4px 14px', fontSize: '11px', fontWeight: 800, color: C.blue, fontFamily: F }}>Example {exampleNumber}</div>
        <div style={{ background: difficulty === 'easy' ? C.greenLt : C.blueLt, borderRadius: '50px', padding: '4px 14px', fontSize: '11px', fontWeight: 800, color: difficulty === 'easy' ? C.greenDk : C.blue, fontFamily: F }}>
          {difficulty === 'easy' ? 'Straightforward' : 'Medium'}
        </div>
      </div>

      {/* Problem card */}
      <div style={{ background: C.surface, borderRadius: '18px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Label>Problem</Label>
        <Body style={{ fontSize: '17px' }}>{problem}</Body>
      </div>

      {/* Applicable formula reminder */}
      {formula && (
        <FormulaBlock label="Formula to use" expr={formula} />
      )}

      {/* Steps — each with optional math: prefix for formula rendering */}
      <div>
        <Label>Solution — Step by Step</Label>
        {steps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
      </div>

      {/* Answer box */}
      <div style={{ background: C.greenLt, borderRadius: '14px', padding: '14px 18px', display: 'flex', alignItems: 'center', gap: '14px', border: `1.5px solid ${C.green}` }}>
        <div style={{ fontSize: '24px' }}>✓</div>
        <div>
          <Label>Answer</Label>
          <div style={{ fontSize: '20px', fontWeight: 900, color: C.text, fontFamily: F }}>
            {answer && answer.startsWith('math:')
              ? <MathExpr expr={answer.slice(5)} size="lg" color={C.text} />
              : answer}
          </div>
        </div>
      </div>
      {/* NOTE: BottomBar Continue button is always visible after this slide — Req. 8 */}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 7 — TRY IT  (Req. 8: after Review Solution, BottomBar Next shows)
// ─────────────────────────────────────────────────────────────────────────────

function SlideTryIt({ slide, onNext, onMascotEmotion, onPracticeReady }) {
  const { problem, hint, steps, answer, formula } = slide.content
  const [showHint,     setShowHint]     = useState(false)
  const [showSolution, setShowSolution] = useState(false)

  function handleReview() {
    setShowSolution(true)
    onMascotEmotion('celebrating')
    onPracticeReady?.(true)   // tell root: BottomBar Continue can appear
  }

  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <MascotCompanion
        emotion={showSolution ? 'celebrating' : 'thinking'}
        message={showSolution ? "Well done for working through it! Study each step carefully." : "Now you try! Take your time — tap the hint if you need a nudge."}
      />

      <div style={{ background: C.surface, borderRadius: '18px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Label>Your Problem</Label>
        <Body style={{ fontSize: '17px' }}>{problem}</Body>
      </div>

      {!showHint ? (
        <button onClick={() => setShowHint(true)} style={{ padding: '13px 16px', borderRadius: '14px', border: `1.5px dashed ${C.muted}`, background: 'transparent', fontSize: '15px', fontWeight: 700, color: C.muted, fontFamily: F, cursor: 'pointer', textAlign: 'left' }}>
          💡 Need a hint? Tap here
        </button>
      ) : (
        <div style={{ background: C.amberLt, borderRadius: '14px', padding: '14px 16px', border: `1.5px solid #FFD700` }}>
          <Label>Hint</Label>
          <div style={{ fontSize: '16px', fontWeight: 700, color: '#5C4400', fontFamily: F, lineHeight: 1.65 }}>{hint}</div>
        </div>
      )}

      {/* Show Review button ONLY before solution revealed */}
      {!showSolution && (
        <button onClick={handleReview} style={{ padding: '16px', borderRadius: '16px', border: 'none', background: C.blue, color: C.white, fontFamily: F, fontWeight: 900, fontSize: '16px', cursor: 'pointer', width: '100%' }}>
          Review Full Solution →
        </button>
      )}

      {/* After solution revealed — steps shown, BottomBar Next button appears (Req. 8) */}
      {showSolution && (
        <>
          {formula && <FormulaBlock label="Formula" expr={formula} />}
          <Label>Full Solution</Label>
          {steps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
          <div style={{ background: C.greenLt, borderRadius: '14px', padding: '14px 16px', display: 'flex', gap: '12px', alignItems: 'center', border: `1.5px solid ${C.green}` }}>
            <div style={{ fontSize: '22px' }}>✓</div>
            <div>
              <Label>Answer</Label>
              <div style={{ fontSize: '18px', fontWeight: 900, color: C.text, fontFamily: F }}>{answer}</div>
            </div>
          </div>
          {/* BottomBar Continue is active — see isTryIt logic in root */}
        </>
      )}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SLIDE 8 — PRACTICE QUESTION  (Req. 9: structured explanation layout)
// ─────────────────────────────────────────────────────────────────────────────

function SlidePracticeQuestion({ slide, onNext, onXP, onMascotEmotion, onPracticeReady }) {
  const { question, options, xpValue, explanation: globalExplanation } = slide.content
  const [selected, setSelected] = useState(null)
  const [attempts, setAttempts] = useState(0)
  const [revealed, setRevealed] = useState(false)
  const [awarded,  setAwarded]  = useState(false)

  const correctOpt = options.find(o => o.isCorrect)
  const isCorrect  = selected?.isCorrect
  const wrongOpt   = selected && !selected.isCorrect ? selected : null
  const showSeeAns = attempts >= 2 && !isCorrect && !revealed

  useEffect(() => {
    onPracticeReady?.(isCorrect || revealed)
  }, [isCorrect, revealed])

  function handleSelect(opt) {
    if (awarded || revealed) return
    setSelected(opt); setAttempts(a => a + 1)
    if (opt.isCorrect) { onMascotEmotion('celebrating'); onXP(xpValue); setAwarded(true) }
    else onMascotEmotion('encouraging')
  }

  function handleSeeAnswer() {
    setRevealed(true); setSelected(correctOpt); onMascotEmotion('teaching')
    if (!awarded) { onXP(Math.floor(xpValue / 2)); setAwarded(true) }
  }

  const successMsg = SUCCESS_MSGS[attempts % SUCCESS_MSGS.length]
  const wrongMsg   = WRONG_MSGS[Math.min(attempts - 1, WRONG_MSGS.length - 1)]

  function optBg(opt)     { const s = selected?.id === opt.id; if (!selected) return C.surface; if (opt.isCorrect) return C.greenLt; if (s && !opt.isCorrect) return '#FFF0F1'; return C.surface }
  function optBorder(opt) { const s = selected?.id === opt.id; if (!selected) return `1.5px solid ${C.border}`; if (opt.isCorrect) return `2px solid ${C.green}`; if (s && !opt.isCorrect) return `2px solid ${C.red}`; return `1.5px solid ${C.border}` }
  function badgeBg(opt)   { const s = selected?.id === opt.id; if (!selected) return C.bgPill; if (opt.isCorrect) return C.green; if (s && !opt.isCorrect) return C.red; return C.bgPill }
  function badgeColor(opt){ const s = selected?.id === opt.id; if (!selected) return '#555'; if (opt.isCorrect || (s && !opt.isCorrect)) return C.white; return '#AAA' }

  // Explanation to display — per-option wrongExplanation or global explanation
  const showExplanation  = isCorrect || revealed
  const explanation      = (wrongOpt && !revealed) ? wrongOpt.wrongExplanation : (globalExplanation || correctOpt?.explanation || '')
  const correctWorkSteps = (correctOpt?.workSteps) || []

  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '14px' }}>
      <MascotCompanion
        emotion={isCorrect ? 'celebrating' : attempts > 0 ? 'encouraging' : 'thinking'}
        message={isCorrect ? successMsg : attempts > 0 ? wrongMsg : "Time to test yourself! Pick the answer you think is right."}
      />

      <div style={{ background: C.surface, borderRadius: '16px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Body style={{ fontSize: '17px' }}>{question}</Body>
      </div>

      {/* Options */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '9px' }}>
        {options.map((opt, i) => (
          <div key={opt.id} onClick={() => !awarded && !revealed && !selected && handleSelect(opt)} style={{
            borderRadius: '14px', padding: '14px 16px', display: 'flex', gap: '12px',
            alignItems: 'center', cursor: awarded || revealed || selected ? 'default' : 'pointer',
            transition: 'all 0.2s', background: optBg(opt), border: optBorder(opt),
            opacity: selected && !opt.isCorrect && selected.id !== opt.id ? 0.45 : 1,
          }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', fontWeight: 900, flexShrink: 0, fontFamily: F, transition: 'all 0.2s', background: badgeBg(opt), color: badgeColor(opt) }}>
              {LETTERS[i]}
            </div>
            <Body style={{ fontSize: '16px' }}>{opt.label}</Body>
          </div>
        ))}
      </div>

      {/* Wrong answer feedback — inline hint only (NOT full explanation) */}
      {wrongOpt && !revealed && wrongOpt.wrongExplanation && (
        <div style={{ background: '#FFF0F1', borderRadius: '14px', padding: '13px 16px', border: `1.5px solid ${C.red}33` }}>
          <div style={{ fontSize: '14px', fontWeight: 800, color: C.red, fontFamily: F, marginBottom: '4px' }}>Not quite…</div>
          <div style={{ fontSize: '15px', fontWeight: 700, color: '#C0222A', fontFamily: F, lineHeight: 1.6 }}>{wrongOpt.wrongExplanation}</div>
        </div>
      )}

      {/* Partial XP reveal note */}
      {revealed && (
        <div style={{ background: C.amberLt, borderRadius: '12px', padding: '10px 14px', border: `1px solid #FFD70088`, fontSize: '13px', fontWeight: 700, color: '#7A4A00', fontFamily: F }}>
          You earned {Math.floor(xpValue / 2)} XP — aim to get it first time next session!
        </div>
      )}

      {/* Structured explanation — only after correct or revealed (Req. 9) */}
      {showExplanation && explanation && (
        <div style={{ background: C.white, borderRadius: '16px', border: `1.5px solid ${isCorrect ? C.green : C.blue}`, overflow: 'hidden' }}>
          {/* Result header */}
          <div style={{ background: isCorrect ? C.greenLt : C.blueLt, padding: '12px 16px', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>{isCorrect ? '✅' : '📖'}</span>
            <div>
              <div style={{ fontSize: '13px', fontWeight: 900, color: isCorrect ? C.greenDk : C.blue, fontFamily: F }}>
                {isCorrect ? 'Correct!' : 'Here\'s the correct answer'}
              </div>
              <div style={{ fontSize: '12px', fontWeight: 700, color: C.muted, fontFamily: F, marginTop: '2px' }}>
                {LETTERS[options.indexOf(correctOpt)]} — {correctOpt?.label}
              </div>
            </div>
          </div>
          {/* Explanation body */}
          <div style={{ padding: '14px 16px' }}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#333', fontFamily: F, lineHeight: 1.65, marginBottom: correctWorkSteps.length ? '12px' : '0' }}>
              {explanation}
            </div>
            {/* Formatted working steps (Req. 9) */}
            {correctWorkSteps.length > 0 && (
              <>
                <Label>Working</Label>
                {correctWorkSteps.map((step, i) => <StepCard key={i} step={step} index={i} />)}
              </>
            )}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        {selected && !isCorrect && !revealed && (
          <button onClick={() => setSelected(null)} style={{ padding: '14px', borderRadius: '14px', border: `1.5px solid ${C.border}`, background: C.white, fontFamily: F, fontWeight: 800, fontSize: '15px', color: C.dark, cursor: 'pointer' }}>
            Try Again
          </button>
        )}
        {showSeeAns && (
          <button onClick={handleSeeAnswer} style={{ padding: '14px', borderRadius: '14px', border: 'none', background: C.blue, color: C.white, fontFamily: F, fontWeight: 900, fontSize: '15px', cursor: 'pointer' }}>
            See Answer (partial XP)
          </button>
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
  useEffect(() => { const t = setTimeout(() => setOn(true), delay); return () => clearTimeout(t) }, [delay])
  return <span style={{ fontSize: '28px', display: 'inline-block', transform: on ? 'scale(1)' : 'scale(0)', opacity: on ? 1 : 0, transition: `transform 0.4s cubic-bezier(.175,.885,.32,1.275) ${delay}ms, opacity 0.2s ${delay}ms` }}>⭐</span>
}

function SlideLessonComplete({ slide, totalXP }) {
  const { completionMessage, nextLessonTitle } = slide.content
  return (
    <div style={{ padding: '20px 20px 32px', flex: 1, display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <MascotCompanion emotion="celebrating" message="You did it! I'm so proud of you. Lesson complete! 🎉" />
      <div style={{ background: C.blue, borderRadius: '24px', padding: '28px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', width: '160px', height: '160px', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', top: '-60px', right: '-40px' }} />
        <div style={{ fontSize: '52px', marginBottom: '8px', position: 'relative', zIndex: 1 }}>🏆</div>
        <div style={{ fontSize: '24px', fontWeight: 900, color: C.white, fontFamily: F, marginBottom: '6px', position: 'relative', zIndex: 1 }}>Lesson Complete!</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '14px', position: 'relative', zIndex: 1 }}>
          <PopStar delay={100} /><PopStar delay={260} /><PopStar delay={420} />
        </div>
        <div style={{ background: 'rgba(255,255,255,0.18)', borderRadius: '14px', padding: '12px 16px', position: 'relative', zIndex: 1 }}>
          <div style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.75)', fontFamily: F }}>XP earned</div>
          <div style={{ fontSize: '28px', fontWeight: 900, color: C.white, fontFamily: F }}>+{totalXP} XP ⭐</div>
        </div>
      </div>
      <div style={{ background: C.surface, borderRadius: '18px', padding: '16px 18px', border: `1px solid ${C.border}` }}>
        <Body style={{ fontSize: '16px' }}>{completionMessage}</Body>
      </div>
      {nextLessonTitle && (
        <div style={{ background: C.surface, borderRadius: '16px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px', border: `1px solid ${C.border}` }}>
          <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: C.blueLt, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', flexShrink: 0 }}>⚡</div>
          <div>
            <Label>Up Next</Label>
            <div style={{ fontSize: '16px', fontWeight: 900, color: C.text, fontFamily: F }}>{nextLessonTitle}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// ─── SLIDE ROUTER ─────────────────────────────────────────────────────────────

function SlideRenderer({ slide, onNext, onBack, onXP, onMascotEmotion, totalXP, onPracticeReady }) {
  const props = { slide, onNext, onBack, onXP, onMascotEmotion, totalXP, onPracticeReady }
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
    default: return <div style={{ padding: '40px 20px', fontFamily: F, color: C.muted, textAlign: 'center' }}>Unknown: {slide.type}</div>
  }
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────

export function LessonEngine({ lesson, onComplete }) {
  const [idx,           setIdx]           = useState(0)
  const [xp,            setXp]            = useState(0)
  const [emotion,       setEmotion]       = useState('excited')
  const [animKey,       setAnimKey]       = useState(0)
  const [dir,           setDir]           = useState(1)
  const [practiceReady, setPracticeReady] = useState(false)

  const total  = lesson.slides.length
  const slide  = lesson.slides[idx]
  const isLast = idx === total - 1

  const isPractice = slide.type === 'practice_question'
  const isHook     = slide.type === 'hook'
  const isTryIt    = slide.type === 'try_it'

  // hideNext: hook owns its button; practice+tryIt hide until practiceReady signal fires
  const hideNext = isHook || ((isPractice || isTryIt) && !practiceReady)

  useEffect(() => {
    setEmotion(SLIDE_EMOTION[slide.type] || 'excited')
    setPracticeReady(false)
  }, [idx, slide.type])

  function navigate(delta) {
    const next = idx + delta
    if (next < 0 || next >= total) return
    setDir(delta); setIdx(next); setAnimKey(k => k + 1)
  }

  function goNext() {
    if (isLast) { onComplete?.(); return }
    navigate(1)
  }

  function goBack() {
    if (idx === 0) { onComplete?.(); return }
    navigate(-1)
  }

  const animClass = dir > 0 ? 'lf_slideRight' : 'lf_slideLeft'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxHeight: '100dvh', background: C.white, fontFamily: F, maxWidth: '640px', margin: '0 auto', overflow: 'hidden' }}>
      <TopBar current={idx} total={total} onBack={goBack} onClose={onComplete} xp={xp} />

      <div key={animKey} className={animClass} style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
        <SlideRenderer
          slide={slide}
          onNext={goNext}
          onBack={goBack}
          onXP={pts => setXp(x => x + pts)}
          onMascotEmotion={setEmotion}
          totalXP={xp}
          onPracticeReady={ready => setPracticeReady(ready)}
        />
      </div>

      {/* BottomBar always rendered (audio always accessible).
          hideNext controls whether the Continue button appears.
          For TryIt: parent sets tryItDone by triggering a re-render via
          onMascotEmotion which already fires on handleReview. We detect it
          by watching isTryIt + emotion === 'celebrating'. */}
      <BottomBar
        onNext={goNext}
        isLast={isLast}
        hideNext={hideNext}
      />
    </div>
  )
}