'use client'

// ─────────────────────────────────────────────────────────────────────────────
// Practice page  /practice
// Session builder + performance dashboard
// Design tokens match the app's Nunito / white / blue system
// ─────────────────────────────────────────────────────────────────────────────

import { useRef, useState } from 'react'
import Link from 'next/link'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
import { MOCK_STUDENT, MOCK_SUBJECTS, MOCK_PRACTICE_QUESTIONS } from '@/lib/mock/data'

// ─── TOKENS ──────────────────────────────────────────────────────────────────
const C = {
  white:    '#FFFFFF',
  page:     '#F7F8FA',
  surface:  '#F7F8FA',
  blue:     '#4361ee',
  blueLt:   '#eef4fd',
  green:    '#3B6D11',
  greenLt:  '#eaf3de',
  amber:    '#BA7517',
  amberLt:  '#faeeda',
  red:      '#E24B4A',
  redLt:    '#fcebeb',
  text:     '#1a1a2e',
  muted:    '#888888',
  border:   '#e8e8e8',
}
const F = "'Nunito', sans-serif"

// ─── MOCK DATA ────────────────────────────────────────────────────────────────

const TOPICS_BY_SUBJECT = {
  mathematics: [
    { id:'m1', title:'Quadratic Equations',    questionCount:24, selected:true  },
    { id:'m2', title:'Simultaneous Equations', questionCount:18, selected:false },
    { id:'m3', title:'Indices & Logarithms',   questionCount:32, selected:false },
    { id:'m4', title:'Sequences & Series',     questionCount:14, selected:false },
    { id:'m5', title:'Mensuration',            questionCount:20, selected:false },
  ],
  physics: [
    { id:'p1', title:'Motion & Velocity',      questionCount:28, selected:false },
    { id:'p2', title:"Newton's Laws",          questionCount:16, selected:false },
    { id:'p3', title:'Work & Energy',          questionCount:22, selected:false },
    { id:'p4', title:'Waves',                  questionCount:19, selected:false },
  ],
  chemistry: [
    { id:'c1', title:'Atomic Theory',          questionCount:21, selected:false },
    { id:'c2', title:'Periodic Table',         questionCount:17, selected:false },
    { id:'c3', title:'Chemical Bonding',       questionCount:25, selected:false },
  ],
  biology: [
    { id:'b1', title:'Cell Structure',         questionCount:18, selected:false },
    { id:'b2', title:'Cell Division',          questionCount:14, selected:false },
    { id:'b3', title:'Genetics',               questionCount:22, selected:false },
  ],
}

const PERFORMANCE = {
  averageScore:            72,
  totalQuestionsAnswered:  847,
  sessionCount:            34,
  bestTopicScore:          94,
  weakTopics: [
    { title:'Simultaneous Equations', scorePercent:48 },
    { title:'Wave Motion',            scorePercent:54 },
    { title:'Chemical Bonding',       scorePercent:61 },
  ],
}

const QUESTION_COUNTS = [10, 15, 20, 30, 50]
const TIMER_OPTIONS   = [null, 15, 20, 30, 45, 60]
const DIFFICULTIES    = [
  { id:'easy',   label:'Easy',   bg:'#eaf3de', border:'#3B6D11', text:'#3B6D11' },
  { id:'medium', label:'Medium', bg:'#faeeda', border:'#BA7517', text:'#BA7517' },
  { id:'hard',   label:'Hard',   bg:'#fcebeb', border:'#E24B4A', text:'#E24B4A' },
  { id:'mix',    label:'Mix',    bg:C.blueLt,  border:C.blue,    text:C.blue    },
]

// ─── SHARED TINY COMPONENTS ───────────────────────────────────────────────────

function SectionLabel({ children }) {
  return <div style={{ fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'1px', fontFamily:F, marginBottom:'10px' }}>{children}</div>
}

function Card({ children, style = {} }) {
  return (
    <div style={{ background:C.white, borderRadius:'14px', border:`0.5px solid ${C.border}`, overflow:'hidden', ...style }}>
      {children}
    </div>
  )
}

// ─── BOTTOM SHEET ────────────────────────────────────────────────────────────

function BottomSheet({ title, children, onClose }) {
  return (
    <>
      <div onClick={onClose} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.35)', zIndex:100 }} />
      <div style={{
        position:'fixed', bottom:0, left:'50%', transform:'translateX(-50%)',
        width:'100%', maxWidth:'480px', background:C.white,
        borderRadius:'20px 20px 0 0', zIndex:101, padding:'20px',
        animation:'sheetUp 0.25s ease both',
      }}>
        <style>{`@keyframes sheetUp{from{transform:translateX(-50%) translateY(100%)}to{transform:translateX(-50%) translateY(0)}}`}</style>
        <div style={{ width:'40px', height:'4px', background:'#E8E8E8', borderRadius:'2px', margin:'0 auto 16px' }} />
        <div style={{ fontSize:'16px', fontWeight:800, color:C.text, fontFamily:F, marginBottom:'16px', textAlign:'center' }}>{title}</div>
        {children}
      </div>
    </>
  )
}

// ─── MASCOT NUDGE ────────────────────────────────────────────────────────────

function MascotNudge({ weakTopics, onDrillWeak }) {
  const msg = weakTopics.length > 0
    ? `Your weakest area right now is "${weakTopics[0].title}". Want to drill it?`
    : "Ready to test yourself? Pick some topics and let's go!"
  const hasCta = weakTopics.length > 0

  return (
    <div style={{ margin:'0 20px', background:C.greenLt, border:`1px solid #97c459`, borderRadius:'14px', padding:'14px', display:'flex', gap:'12px', alignItems:'center' }}>
      <div style={{ flexShrink:0 }}><LearniiBuddy size={52} expression="encouraging" /></div>
      <div style={{ flex:1 }}>
        <div style={{ fontSize:'14px', fontWeight:700, color:'#2A4A0A', fontFamily:F, lineHeight:1.5, marginBottom:hasCta?'8px':'0' }}>{msg}</div>
        {hasCta && (
          <button onClick={onDrillWeak} style={{ padding:'5px 14px', borderRadius:'20px', background:C.green, color:C.white, fontFamily:F, fontWeight:800, fontSize:'12px', border:'none', cursor:'pointer' }}>
            Drill it →
          </button>
        )}
      </div>
    </div>
  )
}

// ─── STATS GRID ──────────────────────────────────────────────────────────────

function StatsGrid({ perf }) {
  const stats = [
    { label:'Avg score',  value:`${perf.averageScore}%`,              color:C.blue,  bg:C.blueLt  },
    { label:'Qs answered',value:perf.totalQuestionsAnswered.toLocaleString(), color:C.green, bg:C.greenLt },
    { label:'Best score', value:`${perf.bestTopicScore}%`,            color:C.amber, bg:C.amberLt },
    { label:'Sessions',   value:perf.sessionCount,                    color:C.red,   bg:C.redLt   },
  ]
  return (
    <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'10px' }}>
      {stats.map(s => (
        <div key={s.label} style={{ background:C.white, borderRadius:'12px', padding:'14px', border:`0.5px solid ${C.border}`, textAlign:'center' }}>
          <div style={{ fontSize:'22px', fontWeight:800, color:s.color, fontFamily:F }}>{s.value}</div>
          <div style={{ fontSize:'11px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'3px' }}>{s.label}</div>
        </div>
      ))}
    </div>
  )
}

// ─── WEAK TOPIC CARD ─────────────────────────────────────────────────────────

function WeakTopicCard({ topic, onSelect }) {
  return (
    <div onClick={onSelect} style={{ background:C.white, borderRadius:'12px', padding:'12px 14px', border:'0.5px solid #f0997b', cursor:'pointer', marginBottom:'8px' }}>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'7px' }}>
        <div style={{ fontSize:'13px', fontWeight:700, color:C.text, fontFamily:F }}>{topic.title}</div>
        <div style={{ fontSize:'13px', fontWeight:800, color:'#E24B4A', fontFamily:F }}>{topic.scorePercent}%</div>
      </div>
      <div style={{ height:'4px', background:'#fde8e0', borderRadius:'2px', overflow:'hidden' }}>
        <div style={{ height:'100%', width:`${topic.scorePercent}%`, background:'#E24B4A', borderRadius:'2px' }} />
      </div>
    </div>
  )
}

// ─── MAIN PAGE ────────────────────────────────────────────────────────────────

export default function PracticePage() {
  const [subject,       setSubject]       = useState('mathematics')
  const [topics,        setTopics]        = useState(TOPICS_BY_SUBJECT)
  const [qCount,        setQCount]        = useState(20)
  const [timerMin,      setTimerMin]      = useState(30)
  const [difficulty,    setDifficulty]    = useState('mix')
  const [sheetType,     setSheetType]     = useState(null) // 'qcount' | 'timer'
  const topPickerRef = useRef(null)

  const currentTopics  = topics[subject] || []
  const selectedTopics = currentTopics.filter(t => t.selected)
  const canStart       = selectedTopics.length > 0

  const isExamMode = MOCK_STUDENT.mode === 'exam' || MOCK_STUDENT.mode === 'school_exam'
  const allSelected = currentTopics.every(t => t.selected)

  function toggleTopic(id) {
    setTopics(prev => ({
      ...prev,
      [subject]: prev[subject].map(t => t.id === id ? { ...t, selected: !t.selected } : t),
    }))
  }

  function toggleAll() {
    const next = !allSelected
    setTopics(prev => ({
      ...prev,
      [subject]: prev[subject].map(t => ({ ...t, selected: next })),
    }))
  }

  function drillWeak() {
    const weak = PERFORMANCE.weakTopics[0]
    // Find and select the matching topic in any subject
    setTopics(prev => {
      const next = { ...prev }
      Object.keys(next).forEach(s => {
        next[s] = next[s].map(t => ({
          ...t,
          selected: t.title.toLowerCase().includes(weak.title.toLowerCase().split(' ')[0]) ? true : t.selected,
        }))
      })
      return next
    })
    topPickerRef.current?.scrollIntoView({ behavior:'smooth' })
  }

  return (
    <div style={{ background:C.page, minHeight:'100vh', fontFamily:F, maxWidth:'480px', margin:'0 auto', paddingBottom:'100px' }}>

      {/* ── HEADER */}
      <div style={{ background:C.white, padding:'20px 20px 16px', borderBottom:`1px solid ${C.border}` }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
          <div style={{ fontSize:'24px', fontWeight:900, color:C.text, fontFamily:F }}>
            Let&apos;s <span style={{ color:C.blue }}>practise!</span>
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:'5px', background:C.blueLt, borderRadius:'50px', padding:'6px 12px', border:`1.5px solid #cbd5f8` }}>
            <span style={{ fontSize:'13px' }}>⭐</span>
            <span style={{ fontSize:'13px', fontWeight:900, color:C.blue, fontFamily:F }}>{MOCK_STUDENT.xp.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* ── MASCOT NUDGE */}
      <div style={{ paddingTop:'16px' }}>
        <MascotNudge weakTopics={PERFORMANCE.weakTopics} onDrillWeak={drillWeak} />
      </div>

      {/* ── SUBJECT TABS */}
      <div style={{ padding:'16px 0 0', overflowX:'auto', scrollbarWidth:'none' }}>
        <div style={{ display:'flex', gap:'8px', paddingLeft:'20px', paddingRight:'20px' }}>
          {MOCK_SUBJECTS.map(s => {
            const act = subject === s.slug
            return (
              <button key={s.slug} onClick={() => setSubject(s.slug)} style={{
                padding:'8px 18px', borderRadius:'20px', border:'none', cursor:'pointer', flexShrink:0,
                background: act ? C.blue : '#EBEBEB',
                color:      act ? C.white : C.muted,
                fontFamily:F, fontWeight:800, fontSize:'13px', transition:'all 0.15s',
              }}>
                {s.emoji} {s.name}
              </button>
            )
          })}
        </div>
      </div>

      {/* ── TOPIC PICKER */}
      <div ref={topPickerRef} style={{ padding:'20px 20px 0' }}>
        <SectionLabel>Pick topics</SectionLabel>
        <Card>
          {/* Select all row */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'11px 16px', borderBottom:`1px solid ${C.border}` }}>
            <span style={{ fontSize:'12px', fontWeight:700, color:C.muted, fontFamily:F }}>
              {selectedTopics.length} selected
            </span>
            <button onClick={toggleAll} style={{ fontSize:'12px', fontWeight:800, color:C.blue, fontFamily:F, background:'none', border:'none', cursor:'pointer' }}>
              {allSelected ? 'Deselect all' : 'Select all'}
            </button>
          </div>

          {currentTopics.map((t, i) => (
            <div key={t.id} onClick={() => toggleTopic(t.id)} style={{
              display:'flex', alignItems:'center', gap:'12px', padding:'13px 16px',
              borderBottom: i < currentTopics.length - 1 ? `1px solid ${C.border}` : 'none',
              cursor:'pointer', background:t.selected ? '#F8F9FF' : C.white,
              transition:'background 0.15s',
            }}>
              {/* Custom checkbox */}
              <div style={{
                width:'18px', height:'18px', borderRadius:'5px', flexShrink:0,
                background: t.selected ? C.blue : C.white,
                border: `2px solid ${t.selected ? C.blue : '#C8C8C8'}`,
                display:'flex', alignItems:'center', justifyContent:'center',
                transition:'all 0.15s',
              }}>
                {t.selected && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <span style={{ flex:1, fontSize:'14px', fontWeight:600, color:C.text, fontFamily:F }}>{t.title}</span>
              <span style={{ fontSize:'11px', fontWeight:600, color:C.muted, fontFamily:F }}>{t.questionCount} Qs</span>
            </div>
          ))}
        </Card>
      </div>

      {/* ── SESSION CONFIGURATOR */}
      <div style={{ padding:'20px 20px 0' }}>
        <SectionLabel>Configure session</SectionLabel>
        <Card>
          {/* Question count row */}
          <div onClick={() => setSheetType('qcount')} style={{ display:'flex', alignItems:'center', padding:'14px 16px', borderBottom:`1px solid ${C.border}`, cursor:'pointer' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'14px', fontWeight:700, color:C.text, fontFamily:F }}>Questions</div>
              <div style={{ fontSize:'12px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'2px' }}>How many to answer</div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontSize:'14px', fontWeight:800, color:C.blue, fontFamily:F }}>{qCount}</span>
              <span style={{ fontSize:'14px', color:C.muted }}>›</span>
            </div>
          </div>

          {/* Timer row */}
          <div onClick={() => setSheetType('timer')} style={{ display:'flex', alignItems:'center', padding:'14px 16px', borderBottom:`1px solid ${C.border}`, cursor:'pointer' }}>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'14px', fontWeight:700, color:C.text, fontFamily:F }}>Timer</div>
              <div style={{ fontSize:'12px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'2px' }}>
                {timerMin === null ? 'No timer — take your time.' : `${timerMin} minutes`}
              </div>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
              <span style={{ fontSize:'14px', fontWeight:800, color:C.blue, fontFamily:F }}>
                {timerMin === null ? 'Off' : `${timerMin}m`}
              </span>
              <span style={{ fontSize:'14px', color:C.muted }}>›</span>
            </div>
          </div>

          {/* Difficulty */}
          <div style={{ padding:'14px 16px' }}>
            <div style={{ fontSize:'13px', fontWeight:700, color:C.text, fontFamily:F, marginBottom:'10px' }}>Difficulty</div>
            <div style={{ display:'flex', gap:'8px' }}>
              {DIFFICULTIES.map(d => (
                <button key={d.id} onClick={() => setDifficulty(d.id)} style={{
                  flex:1, padding:'8px 0', borderRadius:'20px', border:`1.5px solid ${difficulty === d.id ? d.border : C.border}`,
                  background: difficulty === d.id ? d.bg : C.white,
                  color: difficulty === d.id ? d.text : C.muted,
                  fontFamily:F, fontWeight:800, fontSize:'12px', cursor:'pointer', transition:'all 0.15s',
                }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* ── EXAM QUESTIONS BANNER */}
      {isExamMode && (
        <div style={{ margin:'16px 20px 0', background:'#fff3e0', border:'1px solid #EF9F27', borderRadius:'12px', padding:'12px 14px', display:'flex', gap:'12px', alignItems:'center' }}>
          <span style={{ fontSize:'22px', flexShrink:0 }}>🏆</span>
          <div>
            <div style={{ fontSize:'13px', fontWeight:800, color:'#7C4B00', fontFamily:F }}>WAEC past questions included</div>
            <div style={{ fontSize:'12px', fontWeight:600, color:'#A0600A', fontFamily:F, marginTop:'2px' }}>Exam mode is active — real exam Qs enabled</div>
          </div>
        </div>
      )}

      {/* ── START BUTTON */}
      <div style={{ padding:'20px 20px 0' }}>
        <button
          disabled={!canStart}
          style={{
            width:'100%', padding:'16px', borderRadius:'14px', border:'none',
            background: canStart ? C.blue : '#CCCCCC',
            color: C.white, fontFamily:F, fontWeight:800, fontSize:'16px',
            cursor: canStart ? 'pointer' : 'not-allowed',
            transition:'background 0.2s, transform 0.1s',
          }}
          onMouseDown={e => { if (canStart) e.currentTarget.style.transform = 'scale(0.98)' }}
          onMouseUp={e => { e.currentTarget.style.transform = 'scale(1)' }}
        >
          Start practice session →
        </button>
      </div>

      {/* ── PERFORMANCE DASHBOARD */}
      <div style={{ padding:'28px 20px 0' }}>
        <SectionLabel>Your performance</SectionLabel>
        <StatsGrid perf={PERFORMANCE} />
      </div>

      {/* ── WEAK TOPICS */}
      {PERFORMANCE.weakTopics.length > 0 && (
        <div style={{ padding:'20px 20px 0' }}>
          <SectionLabel>Needs improvement</SectionLabel>
          {PERFORMANCE.weakTopics.map(t => (
            <WeakTopicCard key={t.title} topic={t} onSelect={() => { drillWeak() }} />
          ))}
        </div>
      )}

      {/* ── BOTTOM SHEETS */}
      {sheetType === 'qcount' && (
        <BottomSheet title="Number of questions" onClose={() => setSheetType(null)}>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {QUESTION_COUNTS.map(n => (
              <button key={n} onClick={() => { setQCount(n); setSheetType(null) }} style={{
                padding:'14px 16px', borderRadius:'12px',
                border: `1.5px solid ${qCount === n ? C.blue : C.border}`,
                background: qCount === n ? C.blueLt : C.white,
                color: qCount === n ? C.blue : C.text,
                fontFamily:F, fontWeight:800, fontSize:'15px', cursor:'pointer',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span>{n} questions</span>
                {qCount === n && <span style={{ fontSize:'16px', color:C.blue }}>✓</span>}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}

      {sheetType === 'timer' && (
        <BottomSheet title="Session timer" onClose={() => setSheetType(null)}>
          <div style={{ display:'flex', flexDirection:'column', gap:'8px' }}>
            {TIMER_OPTIONS.map(n => (
              <button key={n ?? 'none'} onClick={() => { setTimerMin(n); setSheetType(null) }} style={{
                padding:'14px 16px', borderRadius:'12px',
                border: `1.5px solid ${timerMin === n ? C.blue : C.border}`,
                background: timerMin === n ? C.blueLt : C.white,
                color: timerMin === n ? C.blue : C.text,
                fontFamily:F, fontWeight:800, fontSize:'15px', cursor:'pointer',
                display:'flex', justifyContent:'space-between', alignItems:'center',
              }}>
                <span>{n === null ? 'No timer' : `${n} minutes`}</span>
                {timerMin === n && <span style={{ fontSize:'16px', color:C.blue }}>✓</span>}
              </button>
            ))}
          </div>
        </BottomSheet>
      )}
    </div>
  )
}