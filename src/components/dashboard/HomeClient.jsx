'use client'

// ─────────────────────────────────────────────────────────────────────────────
// HomeClient.jsx — Learniie Homepage Redesign
//
// 7 sections:
//   1. TopBar — greeting + avatar
//   2. Streak + XP Row
//   3. Mascot Hero Card — contextual, emotional
//   4. Today's Goal Card
//   5. Continue Learning Card
//   6. Subjects Row
//   7. Weekly Progress Strip
// ─────────────────────────────────────────────────────────────────────────────

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  cream:      '#FAF0DC',
  white:      '#FFFFFF',
  surface:    '#F7F8FA',
  blue:       '#2D3CE6',
  blueLt:     '#EEF0FF',
  green:      '#6DC77A',
  greenDk:    '#52B362',
  greenLt:    '#EBF9EE',
  dark:       '#1A1A1A',
  text:       '#1A1A1A',
  muted:      '#AAAAAA',
  border:     '#F0F0F0',
  amber:      '#F5C842',
  amberLt:    '#FFF3E0',
  amberDk:    '#C47B00',
}
const F = "'Nunito', sans-serif"

// ─── MOCK DATA ────────────────────────────────────────────────────────────────
// Replace with live data when backend ready

const DEMO_STREAK = 4
const DEMO_XP     = 1240
const DEMO_WEEK   = [true, true, true, true, false, false, false] // Mon–Sun

const DEMO_IN_PROGRESS = {
  subject:        'Physics',
  subjectEmoji:   '⚡',
  subjectColor:   '#2D3CE6',
  chapter:        'Chapter 3',
  topicName:      'Velocity & Acceleration',
  lessonNumber:   2,
  totalLessons:   4,
  progressPercent:45,
  href:           '/learn/physics/velocity/lesson/physics-velocity-1',
}

const DEMO_GOAL = { target: 3, completed: 2, isComplete: false }

const DEMO_SUBJECTS = [
  { id:'s1', name:'Physics',     emoji:'⚡',  bg:'#2D3CE6', tc:'#FFFFFF', totalLessons:16, completedLessons:6,  pct:38, locked:false, slug:'physics'     },
  { id:'s2', name:'Maths',       emoji:'📐',  bg:'#6DC77A', tc:'#FFFFFF', totalLessons:18, completedLessons:12, pct:68, locked:false, slug:'mathematics' },
  { id:'s3', name:'Chemistry',   emoji:'🧪',  bg:'#7B3F2E', tc:'#FFFFFF', totalLessons:14, completedLessons:6,  pct:43, locked:false, slug:'chemistry'   },
  { id:'s4', name:'Biology',     emoji:'🌿',  bg:'#F5C842', tc:'#1A1A1A', totalLessons:20, completedLessons:2,  pct:10, locked:false, slug:'biology'     },
  { id:'s5', name:'Economics',   emoji:'📊',  bg:'#FF6B6B', tc:'#FFFFFF', totalLessons:12, completedLessons:0,  pct:0,  locked:true,  slug:'economics'   },
]

// ─── MASCOT LOGIC ─────────────────────────────────────────────────────────────

const EMOTION_EMOJI = {
  happy:       '😊',
  excited:     '🤩',
  celebrating: '🥳',
  encouraging: '💪',
  focused:     '😤',
  curious:     '🤔',
}

function getMascotContext(inProgress, streakDays) {
  if (inProgress) return {
    emotion:  'excited',
    message:  `You were on "${inProgress.topicName}"! Ready to finish it?`,
    ctaLabel: 'Keep Going →',
    ctaHref:  inProgress.href,
  }
  if (streakDays >= 3) return {
    emotion:  'celebrating',
    message:  `${streakDays}-day streak! Keep that fire going 🔥`,
    ctaLabel: 'Continue →',
    ctaHref:  '/learn',
  }
  const h = new Date().getHours()
  const timeLabel = h < 12 ? 'morning' : h < 17 ? 'afternoon' : 'evening'
  return {
    emotion:  'happy',
    message:  `Good ${timeLabel}! What are we learning today?`,
    ctaLabel: "Let's Learn →",
    ctaHref:  '/learn',
  }
}

// ─── COUNT-UP HOOK ────────────────────────────────────────────────────────────
// Animates a number from 0 → target over ~600ms on first mount

function useCountUp(target, duration = 600) {
  const [val, setVal]   = useState(0)
  const rafRef          = useRef(null)
  const startRef        = useRef(null)

  useEffect(() => {
    if (target === 0) return
    startRef.current = null
    function step(ts) {
      if (!startRef.current) startRef.current = ts
      const elapsed = ts - startRef.current
      const progress = Math.min(elapsed / duration, 1)
      // ease-out cubic
      const eased = 1 - Math.pow(1 - progress, 3)
      setVal(Math.round(eased * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(step)
    }
    rafRef.current = requestAnimationFrame(step)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration])

  return val
}

// ─── PROGRESS BAR ─────────────────────────────────────────────────────────────
// Animates width from 0 → pct on mount

function AnimBar({ pct, height = 5, bg = C.blue, track = C.border, radius = 50 }) {
  const [width, setWidth] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 80)
    return () => clearTimeout(t)
  }, [pct])
  return (
    <div style={{ height, background: track, borderRadius: radius, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${width}%`, background: bg, borderRadius: radius, transition: 'width 0.5s ease-out' }} />
    </div>
  )
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function initials(n = '') { return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) }

function greet() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 1 — TOP BAR
// ─────────────────────────────────────────────────────────────────────────────

function TopBar({ student }) {
  const first = student?.display_name?.split(' ')[0] || 'there'
  const inits  = initials(student?.display_name || 'S')
  const hasNotif = false // wire to real notification state

  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'20px 20px 12px', background: C.cream }}>
      {/* Left — greeting + name */}
      <div>
        <div style={{ fontSize:'11px', fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'1px', fontFamily:F, marginBottom:'3px' }}>
          {greet()} 👋
        </div>
        <div style={{ fontSize:'22px', fontWeight:900, color:C.text, fontFamily:F, lineHeight:1 }}>
          {first}
        </div>
      </div>

      {/* Centre — wordmark */}
      <div style={{ display:'flex', alignItems:'center', gap:'4px', background: C.blueLt, borderRadius:'20px', padding:'5px 14px' }}>
        <span style={{ fontSize:'14px', fontWeight:900, color: C.blue, fontFamily:F, letterSpacing:'-0.3px' }}>learniie</span>
      </div>

      {/* Right — avatar */}
      <div style={{ position:'relative' }}>
        <div style={{ width:'40px', height:'40px', borderRadius:'14px', background: C.blue, color:'#fff', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:900, fontFamily:F }}>
          {inits}
        </div>
        {hasNotif && (
          <div style={{ position:'absolute', top:'-3px', right:'-3px', width:'10px', height:'10px', borderRadius:'50%', background:'#E63946', border:`2px solid ${C.cream}` }} />
        )}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 2 — STREAK + XP ROW
// ─────────────────────────────────────────────────────────────────────────────

function StreakXPRow({ streakDays, totalXP }) {
  const animStreak = useCountUp(streakDays)
  const animXP     = useCountUp(totalXP)

  return (
    <div style={{ display:'flex', gap:'10px', margin:'0 20px 16px' }}>
      {/* Streak */}
      <div style={{ flex:1, background: C.amberLt, border:`1.5px solid ${C.amber}`, borderRadius:'14px', padding:'12px 14px', display:'flex', alignItems:'center', gap:'10px' }}>
        <span style={{ fontSize:'20px', lineHeight:1 }}>🔥</span>
        <div>
          <div style={{ fontSize:'20px', fontWeight:900, color: C.amberDk, fontFamily:F, lineHeight:1 }}>
            {streakDays === 0 ? '—' : animStreak}
          </div>
          <div style={{ fontSize:'10px', fontWeight:700, color:`${C.amberDk}BB`, fontFamily:F, marginTop:'2px' }}>
            {streakDays === 0 ? 'Start today' : 'day streak'}
          </div>
        </div>
      </div>

      {/* XP */}
      <div style={{ flex:1, background: C.blueLt, border:`1.5px solid ${C.blue}`, borderRadius:'14px', padding:'12px 14px', display:'flex', alignItems:'center', gap:'10px' }}>
        <span style={{ fontSize:'20px', lineHeight:1 }}>⭐</span>
        <div>
          <div style={{ fontSize:'20px', fontWeight:900, color: C.blue, fontFamily:F, lineHeight:1 }}>
            {animXP.toLocaleString()}
          </div>
          <div style={{ fontSize:'10px', fontWeight:700, color:`${C.blue}99`, fontFamily:F, marginTop:'2px' }}>
            total XP
          </div>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 3 — MASCOT HERO CARD
// ─────────────────────────────────────────────────────────────────────────────

function MascotHeroCard({ ctx }) {
  const { emotion, message, ctaLabel, ctaHref } = ctx
  const emoji = EMOTION_EMOJI[emotion] || '😊'

  return (
    <div style={{ margin:'0 20px 16px', background: C.blue, borderRadius:'28px', minHeight:'148px', position:'relative', overflow:'hidden', display:'flex' }}>
      {/* Decorative circles */}
      <div style={{ position:'absolute', width:'130px', height:'130px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', top:'-50px', right:'20px' }} />
      <div style={{ position:'absolute', width:'70px', height:'70px', borderRadius:'50%', background:'rgba(109,199,122,0.18)', bottom:'16px', right:'60px' }} />

      {/* Left content */}
      <div style={{ flex:1, padding:'18px 16px 20px 20px', display:'flex', flexDirection:'column', justifyContent:'space-between', position:'relative', zIndex:1 }}>
        {/* Mode badge */}
        <div style={{ display:'inline-flex', alignSelf:'flex-start', background:'rgba(255,255,255,0.14)', borderRadius:'8px', padding:'4px 10px' }}>
          <span style={{ fontSize:'10px', fontWeight:800, color:'#fff', fontFamily:F, textTransform:'uppercase', letterSpacing:'0.8px' }}>
            ✦ SCHOOL MODE · SS2
          </span>
        </div>

        {/* Speech bubble */}
        <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'10px', padding:'9px 12px', marginTop:'10px' }}>
          <div style={{ fontSize:'13px', fontWeight:700, color:'#fff', fontFamily:F, lineHeight:1.5 }}>
            {message}
          </div>
        </div>

        {/* CTA button */}
        <Link href={ctaHref} style={{ textDecoration:'none', alignSelf:'flex-start' }}>
          <div className="pressable" style={{ background: C.green, borderRadius:'12px', padding:'9px 18px', marginTop:'12px', display:'inline-flex' }}>
            <span style={{ fontSize:'13px', fontWeight:800, color:'#fff', fontFamily:F }}>{ctaLabel}</span>
          </div>
        </Link>
      </div>

      {/* Right — mascot */}
      <div style={{ width:'96px', alignSelf:'flex-end', flexShrink:0, position:'relative', zIndex:1 }}>
        <div style={{ width:'96px', height:'120px', borderRadius:'18px 18px 0 0', background:'linear-gradient(160deg,#FFE5B4,#FFDDA0)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'5px' }}>
          <span style={{ fontSize:'38px', lineHeight:1 }}>{emoji}</span>
          <span style={{ fontSize:'9px', fontWeight:800, color:'#C8943A', fontFamily:F, textTransform:'uppercase', letterSpacing:'0.3px' }}>Sparky</span>
        </div>
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 4 — TODAY'S GOAL CARD
// ─────────────────────────────────────────────────────────────────────────────

function TodaysGoalCard({ goal }) {
  const pct = Math.min((goal.completed / goal.target) * 100, 100)

  if (goal.isComplete) {
    return (
      <div style={{ margin:'0 20px 16px', background: C.green, borderRadius:'22px', padding:'16px 18px' }}>
        <div style={{ fontSize:'15px', fontWeight:900, color:'#fff', fontFamily:F }}>
          Goal smashed! 🎉
        </div>
        <div style={{ fontSize:'13px', fontWeight:700, color:'rgba(255,255,255,0.75)', fontFamily:F, marginTop:'4px' }}>
          Come back tomorrow for a fresh challenge.
        </div>
      </div>
    )
  }

  return (
    <div style={{ margin:'0 20px 16px', background: C.dark, borderRadius:'22px', padding:'16px 18px' }}>
      {/* Top row */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'5px' }}>
        <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.4)', textTransform:'uppercase', letterSpacing:'1px', fontFamily:F }}>
          TODAY&apos;S GOAL
        </div>
        <div style={{ fontSize:'11px', fontWeight:800, color: C.green, fontFamily:F }}>
          {goal.completed} / {goal.target} done
        </div>
      </div>

      {/* Goal label */}
      <div style={{ fontSize:'15px', fontWeight:900, color:'#fff', fontFamily:F, marginBottom:'12px' }}>
        Complete {goal.target} lessons today
      </div>

      {/* Progress bar */}
      <div style={{ height:'6px', background:'rgba(255,255,255,0.1)', borderRadius:'50px', overflow:'hidden', marginBottom:'10px' }}>
        <div style={{ height:'100%', width:`${pct}%`, background: C.green, borderRadius:'50px', transition:'width 0.5s ease-out' }} />
      </div>

      {/* Dot indicators */}
      <div style={{ display:'flex', gap:'8px' }}>
        {Array.from({ length: goal.target }).map((_, i) => (
          <div key={i} style={{
            width:'28px', height:'28px', borderRadius:'50%',
            background: i < goal.completed ? C.green : 'rgba(255,255,255,0.1)',
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:'12px', color:'#fff',
            transition:'all 0.2s',
          }}>
            {i < goal.completed ? '✓' : null}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 5 — CONTINUE LEARNING CARD
// ─────────────────────────────────────────────────────────────────────────────

function ContinueLearningCard({ lesson }) {
  if (!lesson) return null

  return (
    <div style={{ margin:'0 20px 16px' }}>
      {/* Section header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'10px' }}>
        <div style={{ fontSize:'17px', fontWeight:900, color: C.text, fontFamily:F }}>Continue Learning</div>
        <Link href="/learn" style={{ textDecoration:'none' }}>
          <span style={{ fontSize:'13px', fontWeight:800, color: C.green, fontFamily:F }}>See all</span>
        </Link>
      </div>

      <Link href={lesson.href} style={{ textDecoration:'none' }}>
        <div className="pressable" style={{ background: C.white, borderRadius:'22px', padding:'16px', border:`2px solid ${C.blue}`, display:'flex', alignItems:'center', gap:'14px' }}>
          {/* Subject icon */}
          <div style={{ width:'52px', height:'52px', borderRadius:'16px', background: lesson.subjectColor, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px', flexShrink:0 }}>
            {lesson.subjectEmoji}
          </div>

          {/* Info */}
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ fontSize:'10px', fontWeight:700, color: C.muted, textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:F, marginBottom:'3px' }}>
              {lesson.subject} · {lesson.chapter}
            </div>
            <div style={{ fontSize:'15px', fontWeight:900, color: C.text, fontFamily:F, lineHeight:1.2, marginBottom:'2px', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {lesson.topicName}
            </div>
            <div style={{ fontSize:'11px', fontWeight:600, color: C.muted, fontFamily:F, marginBottom:'8px' }}>
              Lesson {lesson.lessonNumber} of {lesson.totalLessons}
            </div>
            <AnimBar pct={lesson.progressPercent} height={5} bg={C.blue} track={C.border} />
            <div style={{ fontSize:'10px', fontWeight:700, color: C.muted, fontFamily:F, marginTop:'4px' }}>
              {lesson.progressPercent}% complete
            </div>
          </div>

          {/* Arrow */}
          <div style={{ width:'36px', height:'36px', borderRadius:'50%', background: C.blue, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, fontSize:'20px', color:'#fff' }}>›</div>
        </div>
      </Link>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 6 — SUBJECTS ROW
// ─────────────────────────────────────────────────────────────────────────────

function SubjectsRow({ subjects }) {
  return (
    <div style={{ marginBottom:'16px' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 20px', marginBottom:'12px' }}>
        <div style={{ fontSize:'17px', fontWeight:900, color: C.text, fontFamily:F }}>My Subjects</div>
        <Link href="/subjects" style={{ textDecoration:'none' }}>
          <span style={{ fontSize:'13px', fontWeight:800, color: C.green, fontFamily:F }}>Edit</span>
        </Link>
      </div>

      {/* Horizontal scroll */}
      <div style={{ display:'flex', gap:'10px', overflowX:'auto', scrollbarWidth:'none', WebkitOverflowScrolling:'touch', paddingLeft:'20px', paddingRight:'12px', paddingBottom:'4px' }}>
        {subjects.map(s => (
          <Link key={s.id} href={`/learn/${s.slug}`} style={{ textDecoration:'none', flexShrink:0 }}>
            <div className="pressable" style={{
              width:'110px', height:'110px', borderRadius:'20px',
              background: s.bg, padding:'14px',
              display:'flex', flexDirection:'column', justifyContent:'space-between',
              opacity: s.locked ? 0.55 : 1,
              position:'relative',
              overflow:'hidden',
            }}>
              {/* Lock overlay */}
              {s.locked && (
                <div style={{ position:'absolute', inset:0, borderRadius:'20px', display:'flex', alignItems:'center', justifyContent:'center', background:'rgba(0,0,0,0.08)', fontSize:'18px' }}>
                  🔒
                </div>
              )}
              <div>
                <div style={{ fontSize:'24px', lineHeight:1 }}>{s.emoji}</div>
                <div style={{ fontSize:'13px', fontWeight:900, color: s.tc, fontFamily:F, marginTop:'5px', lineHeight:1.2 }}>{s.name}</div>
                <div style={{ fontSize:'11px', fontWeight:700, color: s.tc === '#1A1A1A' ? 'rgba(0,0,0,0.4)' : 'rgba(255,255,255,0.6)', fontFamily:F, marginTop:'2px' }}>
                  {s.completedLessons}/{s.totalLessons}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ height:'4px', background: s.tc === '#1A1A1A' ? 'rgba(0,0,0,0.15)' : 'rgba(255,255,255,0.2)', borderRadius:'2px', overflow:'hidden' }}>
                <div style={{ height:'100%', width:`${s.pct}%`, background: s.tc === '#1A1A1A' ? 'rgba(0,0,0,0.55)' : 'rgba(255,255,255,0.75)', borderRadius:'2px' }} />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// SECTION 7 — WEEKLY PROGRESS STRIP
// ─────────────────────────────────────────────────────────────────────────────

function WeeklyProgressStrip({ weekActivity, streakDays }) {
  const doneCount  = weekActivity.filter(Boolean).length
  const todayIdx   = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1 // 0=Mon

  return (
    <div style={{ margin:'0 20px 8px', background: C.white, borderRadius:'20px', padding:'14px 16px', border:`1.5px solid ${C.border}` }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'14px' }}>
        <div style={{ fontSize:'14px', fontWeight:900, color: C.text, fontFamily:F }}>This Week</div>
        <div style={{ fontSize:'12px', fontWeight:700, color: C.green, fontFamily:F }}>{doneCount} / 7 days</div>
      </div>

      {/* Day dots */}
      <div style={{ display:'flex', justifyContent:'space-between' }}>
        {DAY_LABELS.map((day, i) => {
          const done    = weekActivity[i] === true
          const isToday = i === todayIdx
          const todayDone = done && isToday

          return (
            <div key={i} style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:'5px' }}>
              <div style={{ fontSize:'9px', fontWeight:700, color: C.muted, fontFamily:F }}>{day}</div>
              <div style={{
                width:'28px', height:'28px', borderRadius:'50%',
                background: done ? C.green : 'transparent',
                border: isToday && !done ? `2px solid ${C.blue}` : done ? 'none' : `1.5px solid ${C.border}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontSize:'12px', color: done ? '#fff' : 'transparent',
                animation: isToday && !done ? 'pulse 2s ease-in-out infinite' : 'none',
              }}>
                {done ? '✓' : null}
              </div>
            </div>
          )
        })}
      </div>

      {/* Motivational line */}
      <div style={{ textAlign:'center', marginTop:'10px', fontSize:'11px', fontWeight:700, color: C.muted, fontFamily:F }}>
        {streakDays >= 1
          ? `${streakDays}-day streak! Don't break it 🔥`
          : 'Start your streak today!'}
      </div>

      <style>{`
        @keyframes pulse { 0%,100% { transform:scale(1); } 50% { transform:scale(1.12); } }
        @media (prefers-reduced-motion: reduce) { * { animation:none!important; transition:none!important; } }
      `}</style>
    </div>
  )
}

// ─── ROOT COMPONENT ───────────────────────────────────────────────────────────

export function HomeClient({ student, topics = [], subjects = [] }) {
  const mascotCtx = getMascotContext(DEMO_IN_PROGRESS, DEMO_STREAK)

  return (
    <div style={{ background: C.cream, minHeight:'100vh', fontFamily:F, maxWidth:'480px', margin:'0 auto', paddingBottom:'90px' }}>

      {/* 1 — Top bar */}
      <TopBar student={student} />

      {/* 2 — Streak + XP */}
      <StreakXPRow streakDays={DEMO_STREAK} totalXP={DEMO_XP} />

      {/* 3 — Mascot hero */}
      <MascotHeroCard ctx={mascotCtx} />

      {/* 4 — Today's goal */}
      <TodaysGoalCard goal={DEMO_GOAL} />

      {/* 5 — Continue learning */}
      <ContinueLearningCard lesson={DEMO_IN_PROGRESS} />

      {/* 6 — Subjects */}
      <SubjectsRow subjects={DEMO_SUBJECTS} />

      {/* 7 — Weekly progress */}
      <WeeklyProgressStrip weekActivity={DEMO_WEEK} streakDays={DEMO_STREAK} />
    </div>
  )
}