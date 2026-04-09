'use client'

// ─────────────────────────────────────────────────────────────────────────────
// HomeClient.jsx — Learniie Homepage
//
// COLOUR SPEC:
//   Page bg:   #FFFFFF white
//   Cards:     #F7F8FA surface
//   Hero card: #2D3CE6 blue (the only place cream/colour bg is used inside it)
//   Green:     #6DC77A
//   Dark:      #1A1A1A
//   No orange, no cream as full-page bg
// ─────────────────────────────────────────────────────────────────────────────

import Link from 'next/link'
import { useState } from 'react'
import { ModeToggle, useModeView } from '@/components/dashboard/ModeToggle'

const C = {
  white:   '#FFFFFF',
  surface: '#F7F8FA',
  green:   '#6DC77A',
  greenDk: '#52B362',
  blue:    '#2D3CE6',
  dark:    '#1A1A1A',
  text:    '#1A1A1A',
  muted:   '#AAAAAA',
  border:  '#F0F0F0',
}
const F = "'Nunito', sans-serif"

const SUBJECT_CFG = {
  mathematics: { bg:'#6DC77A', tc:'#FFFFFF', name:'Maths',     emoji:'➕' },
  physics:     { bg:'#2D3CE6', tc:'#FFFFFF', name:'Physics',   emoji:'⚡' },
  chemistry:   { bg:'#7B3F2E', tc:'#FFFFFF', name:'Chemistry', emoji:'🔬' },
  biology:     { bg:'#F5C842', tc:'#1A1A1A', name:'Biology',   emoji:'🌿' },
}

const ICON_BG = {
  mathematics: '#FFF5E0',
  physics:     '#2D3CE6',
  chemistry:   '#7B3F2E',
  biology:     '#F5C842',
}

function greet() {
  const h = new Date().getHours()
  return h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening'
}

function initials(n = '') {
  return n.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2)
}

// ── TOP BAR ───────────────────────────────────────────────────────────────────

function TopBar({ student, isSchoolExam }) {
  const first = student.display_name?.split(' ')[0] || 'there'
  return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'22px 22px 0' }}>
      <div>
        <div style={{ fontSize:'11px', fontWeight:700, color:C.muted, textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:F, marginBottom:'3px' }}>
          {greet()} 👋
        </div>
        <div style={{ fontSize:'21px', fontWeight:900, color:C.text, fontFamily:F, lineHeight:1 }}>
          {first}
        </div>
      </div>
      <div style={{ display:'flex', alignItems:'center', gap:'10px' }}>
        {isSchoolExam && (
          <div style={{ transform:'scale(0.8)', transformOrigin:'right center' }}><ModeToggle /></div>
        )}
        {/* Avatar — 40×40, border radius 14, bg #2D3CE6, white Nunito 900 initials */}
        <div style={{ width:'40px', height:'40px', borderRadius:'14px', background:C.blue, color:C.white, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:900, fontFamily:F, flexShrink:0, letterSpacing:'0.5px' }}>
          {initials(student.display_name)}
        </div>
      </div>
    </div>
  )
}

// ── HERO BANNER ───────────────────────────────────────────────────────────────

function HeroBanner() {
  return (
    <div style={{ margin:'18px 22px 0', background:C.blue, borderRadius:'28px', padding:'22px 0 0 22px', display:'flex', overflow:'hidden', position:'relative', minHeight:'150px' }}>
      {/* Decorative orb */}
      <div style={{ position:'absolute', width:'130px', height:'130px', borderRadius:'50%', background:'rgba(255,255,255,0.07)', top:'-35px', right:'70px', pointerEvents:'none' }}/>

      {/* Left */}
      <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'space-between', paddingBottom:'22px', zIndex:1 }}>
        <div>
          <div style={{ display:'inline-flex', background:'rgba(255,255,255,0.18)', borderRadius:'50px', padding:'4px 12px', fontSize:'11px', fontWeight:800, color:C.white, fontFamily:F, marginBottom:'10px' }}>
            Learn in Bites
          </div>
          <div style={{ fontSize:'18px', fontWeight:900, color:C.white, lineHeight:1.3, fontFamily:F, marginBottom:'16px', maxWidth:'180px' }}>
            Every big idea starts with{' '}
            <span style={{ color:C.green }}>one bite.</span>
          </div>
        </div>
        <Link href="/learn" style={{ textDecoration:'none', alignSelf:'flex-start' }}>
          <div className="pressable" style={{ display:'inline-flex', alignItems:'center', background:C.green, borderRadius:'12px', padding:'11px 18px', fontSize:'13px', fontWeight:800, color:C.white, fontFamily:F, cursor:'pointer' }}>
            Keep Learning →
          </div>
        </Link>
      </div>

      {/* Mascot placeholder — swap inner for <img src="/mascot.png" /> when ready */}
      <div style={{ width:'100px', display:'flex', alignItems:'flex-end', flexShrink:0 }}>
        <div style={{ width:'100px', height:'128px', borderRadius:'20px 20px 0 0', background:'linear-gradient(160deg,#FFE5B4,#FFDDA0)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', gap:'6px' }}>
          <div style={{ width:'50px', height:'50px', borderRadius:'50%', background:'rgba(200,148,58,0.2)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="#C8943A" strokeWidth="1.5"/>
              <circle cx="9.5" cy="10.5" r="1.2" fill="#C8943A"/>
              <circle cx="14.5" cy="10.5" r="1.2" fill="#C8943A"/>
              <path d="M8.5 15c1 1.2 6 1.2 7 0" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
          <div style={{ fontSize:'9px', fontWeight:800, color:'#C8943A', textTransform:'uppercase', letterSpacing:'0.4px', fontFamily:F, textAlign:'center' }}>
            Mascot Image
          </div>
        </div>
      </div>
    </div>
  )
}

// ── CONTINUE LEARNING ─────────────────────────────────────────────────────────

function ContinueCard({ topics, subjects }) {
  const active  = topics.find(t => t.status === 'in_progress')
  const subj    = subjects[0]
  if (!active) return null

  const slug    = subj?.slug || 'mathematics'
  const cfg     = SUBJECT_CFG[slug] || SUBJECT_CFG.mathematics
  const iconBg  = ICON_BG[slug] || C.blue
  const pct     = active.preparedness || 40
  const href    = `/learn/${slug}/${active.slug}/lesson/lesson-1`

  return (
    <div style={{ margin:'22px 22px 0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ fontSize:'16px', fontWeight:900, color:C.text, fontFamily:F }}>Continue Learning</div>
        <Link href="/learn" style={{ fontSize:'13px', fontWeight:800, color:C.green, fontFamily:F, textDecoration:'none' }}>See all</Link>
      </div>

      <Link href={href} style={{ textDecoration:'none' }}>
        <div className="pressable" style={{ background:C.dark, borderRadius:'22px', padding:'18px', cursor:'pointer' }}>
          <div style={{ display:'flex', alignItems:'flex-start', gap:'14px' }}>
            {/* Subject icon */}
            <div style={{ width:'52px', height:'52px', borderRadius:'16px', background:iconBg, flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px' }}>
              {cfg.emoji}
            </div>
            <div style={{ flex:1, minWidth:0 }}>
              <div style={{ fontSize:'10px', fontWeight:700, color:'rgba(255,255,255,0.45)', textTransform:'uppercase', letterSpacing:'0.8px', fontFamily:F, marginBottom:'4px' }}>
                {cfg.name} · Chapter 3
              </div>
              <div style={{ fontSize:'15px', fontWeight:900, color:C.white, fontFamily:F, lineHeight:1.25, marginBottom:'3px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>
                {active.title}
              </div>
              <div style={{ fontSize:'12px', fontWeight:600, color:'rgba(255,255,255,0.38)', fontFamily:F, marginBottom:'12px' }}>
                Lesson 2 of {active.lessonCount}
              </div>
              {/* Progress bar */}
              <div style={{ height:'5px', background:'rgba(255,255,255,0.12)', borderRadius:'50px', overflow:'hidden', marginBottom:'5px' }}>
                <div style={{ height:'100%', width:`${pct}%`, background:C.green, borderRadius:'50px', transition:'width 0.6s ease' }}/>
              </div>
              <div style={{ fontSize:'11px', fontWeight:700, color:'rgba(255,255,255,0.35)', fontFamily:F }}>{pct}% complete</div>
            </div>
            <div style={{ width:'26px', height:'26px', borderRadius:'50%', background:'rgba(255,255,255,0.08)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0, marginTop:'2px', fontSize:'15px', color:'rgba(255,255,255,0.25)', fontWeight:700, fontFamily:F }}>›</div>
          </div>
        </div>
      </Link>
    </div>
  )
}

// ── QUICK ACTIONS ─────────────────────────────────────────────────────────────

function QuickActions() {
  return (
    <div style={{ margin:'22px 22px 0' }}>
      <div style={{ fontSize:'16px', fontWeight:900, color:C.text, fontFamily:F, marginBottom:'12px' }}>Quick Actions</div>
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'12px' }}>
        {/* Disabled */}
        <div style={{ background:C.surface, borderRadius:'22px', padding:'16px', position:'relative', opacity:0.6, cursor:'not-allowed' }}>
          <div style={{ position:'absolute', top:'12px', right:'12px', background:C.dark, color:C.white, fontSize:'9px', fontWeight:800, textTransform:'uppercase', letterSpacing:'0.5px', padding:'3px 8px', borderRadius:'50px', fontFamily:F }}>
            Coming Soon
          </div>
          <div style={{ width:'36px', height:'36px', borderRadius:'12px', background:'#E0E0E0', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', marginBottom:'10px' }}>⬇</div>
          <div style={{ fontSize:'14px', fontWeight:900, color:C.muted, fontFamily:F, marginBottom:'3px' }}>Download Offline</div>
          <div style={{ fontSize:'11px', fontWeight:600, color:'#BBBBBB', fontFamily:F }}>Save for later</div>
        </div>
        {/* Active */}
        <Link href="/subjects" style={{ textDecoration:'none' }}>
          <div className="pressable" style={{ background:'#EBF9EE', borderRadius:'22px', padding:'16px', cursor:'pointer', height:'100%' }}>
            <div style={{ width:'36px', height:'36px', borderRadius:'12px', background:C.green, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'18px', marginBottom:'10px' }}>📚</div>
            <div style={{ fontSize:'14px', fontWeight:900, color:C.text, fontFamily:F, marginBottom:'3px' }}>My Subjects</div>
            <div style={{ fontSize:'11px', fontWeight:600, color:'#888', fontFamily:F }}>Choose what to learn</div>
          </div>
        </Link>
      </div>
    </div>
  )
}

// ── SUBJECTS ROW ──────────────────────────────────────────────────────────────

function SubjectsRow({ subjects }) {
  return (
    <div style={{ margin:'22px 0 0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', padding:'0 22px', marginBottom:'12px' }}>
        <div style={{ fontSize:'16px', fontWeight:900, color:C.text, fontFamily:F }}>Subjects</div>
        <Link href="/subjects" style={{ fontSize:'13px', fontWeight:800, color:C.green, fontFamily:F, textDecoration:'none' }}>See all</Link>
      </div>
      <div style={{ display:'flex', gap:'10px', paddingLeft:'22px', paddingRight:'12px', paddingBottom:'4px', overflowX:'auto', scrollbarWidth:'none', WebkitOverflowScrolling:'touch' }}>
        {subjects.map(s => {
          const cfg = SUBJECT_CFG[s.slug] || SUBJECT_CFG.mathematics
          return (
            <Link key={s.id} href={`/learn/${s.slug}`} style={{ textDecoration:'none', flexShrink:0 }}>
              <div className="pressable" style={{ borderRadius:'18px', minWidth:'108px', padding:'14px 15px', background:cfg.bg, cursor:'pointer' }}>
                <div style={{ fontSize:'24px', marginBottom:'8px', lineHeight:1 }}>{cfg.emoji}</div>
                <div style={{ fontSize:'13px', fontWeight:900, fontFamily:F, color:cfg.tc, marginBottom:'3px', lineHeight:1.2 }}>{cfg.name}</div>
                <div style={{ fontSize:'11px', fontWeight:600, fontFamily:F, color:cfg.tc, opacity:cfg.bg==='#F5C842'?0.55:0.65 }}>
                  {s.total_lessons} lessons
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}

// ── TERM PATH ─────────────────────────────────────────────────────────────────

function TermPath({ topics }) {
  if (!topics.length) return null
  return (
    <div style={{ margin:'24px 22px 0' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'12px' }}>
        <div style={{ fontSize:'16px', fontWeight:900, color:C.text, fontFamily:F }}>This Term</div>
        <Link href="/learn/mathematics" style={{ fontSize:'13px', fontWeight:800, color:C.green, fontFamily:F, textDecoration:'none' }}>See all →</Link>
      </div>
      <div style={{ display:'flex', flexDirection:'column', gap:'9px' }}>
        {topics.map((t, i) => {
          const done   = t.status === 'complete'
          const active = t.status === 'in_progress'
          const locked = t.status === 'locked'
          return (
            <div key={t.id} className={locked?'':' pressable'} style={{ display:'flex', alignItems:'center', gap:'12px', background:active?'#EEF0FF':C.white, border:`${active?'2':' 1.5'}px solid ${active?C.blue:C.border}`, borderRadius:'16px', padding:'13px 14px', opacity:locked?0.4:1, cursor:locked?'not-allowed':'pointer' }}>
              <div style={{ width:'30px', height:'30px', borderRadius:'50%', flexShrink:0, background:done?C.green:active?C.blue:C.surface, color:done||active?C.white:C.muted, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'13px', fontWeight:900, fontFamily:F }}>
                {done?'✓':active?'▶':locked?'🔒':String(i+1)}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:'14px', fontWeight:800, color:C.text, fontFamily:F, lineHeight:1.2 }}>{t.title}</div>
                <div style={{ fontSize:'11px', fontWeight:600, color:C.muted, fontFamily:F, marginTop:'2px' }}>
                  {t.lessonCount} lessons
                  {done && <span style={{ color:C.greenDk, marginLeft:'6px' }}>· Done ✓</span>}
                </div>
              </div>
              {active && (
                <div style={{ fontSize:'11px', fontWeight:900, color:C.white, background:C.blue, borderRadius:'50px', padding:'5px 12px', fontFamily:F, flexShrink:0 }}>
                  Continue →
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ── ROOT ──────────────────────────────────────────────────────────────────────

export function HomeClient({ student, topics = [], subjects = [] }) {
  const isSchoolExam = student.mode === 'school_exam'
  const view         = useModeView(student.mode)

  return (
    <div style={{ background:C.white, minHeight:'100vh', fontFamily:F, maxWidth:'520px', margin:'0 auto', paddingBottom:'100px' }}>
      <TopBar student={student} isSchoolExam={isSchoolExam} />
      <HeroBanner />
      <ContinueCard topics={topics} subjects={subjects} />
      <QuickActions />
      <SubjectsRow subjects={subjects} />
      {view !== 'exam' && <TermPath topics={topics} />}
    </div>
  )
}