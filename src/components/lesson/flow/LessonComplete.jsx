'use client'
import { useEffect, useState } from 'react'
import  C from './constants.jsx'
import { TopBar } from './TopBar'
import { PrimaryButton } from './PrimaryButton'

function Star({ delay }) {
  const [popped, setPopped] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setPopped(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  return (
    <span style={{ fontSize:'28px', display:'inline-block', transform: popped?'scale(1)':'scale(0)', opacity: popped?1:0, transition:`transform 0.4s cubic-bezier(.175,.885,.32,1.275) ${delay}ms, opacity 0.2s ease ${delay}ms` }}>⭐</span>
  )
}

export function LessonComplete({ lesson, onNext, onBack, totalSlides }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:C.cream }}>
      <TopBar onBack={onBack} total={totalSlides} current={totalSlides - 1} />
      <div style={{ background:C.blue, margin:'12px 24px 0', borderRadius:'28px', padding:'32px 24px', textAlign:'center', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', width:'200px', height:'200px', borderRadius:'50%', background:'rgba(255,255,255,0.06)', top:'-80px', right:'-60px' }} />
        <div style={{ position:'absolute', width:'140px', height:'140px', borderRadius:'50%', background:'rgba(109,199,122,0.15)', bottom:'-50px', left:'-30px' }} />
        <div style={{ fontSize:'56px', marginBottom:'10px', position:'relative', zIndex:1 }}>🏆</div>
        <div style={{ fontSize:'24px', fontWeight:900, color:'white', lineHeight:1.2, position:'relative', zIndex:1, fontFamily:'Nunito, sans-serif' }}>Lesson Complete!</div>
        <div style={{ fontSize:'14px', fontWeight:600, color:'rgba(255,255,255,0.7)', marginTop:'6px', position:'relative', zIndex:1, fontFamily:'Nunito, sans-serif' }}>You crushed it, keep going!</div>
        <div style={{ display:'flex', justifyContent:'center', gap:'8px', marginTop:'16px', position:'relative', zIndex:1 }}>
          <Star delay={100} /><Star delay={250} /><Star delay={400} />
        </div>
      </div>
      <div style={{ margin:'14px 24px 0', background:C.white, borderRadius:'24px', padding:'20px', boxShadow:C.shadow }}>
        <div style={{ fontSize:'14px', fontWeight:800, color:'#888', marginBottom:'12px', textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:'Nunito, sans-serif' }}>What You Learned</div>
        {lesson.summaryPoints.map((point, i) => (
          <div key={i} style={{ display:'flex', alignItems:'center', gap:'10px', padding:'8px 0', borderBottom: i < lesson.summaryPoints.length-1 ? '1px solid #F5F5F5' : 'none' }}>
            <div style={{ width:'10px', height:'10px', borderRadius:'50%', background:C.green, flexShrink:0 }} />
            <div style={{ fontSize:'14px', fontWeight:700, color:C.text, fontFamily:'Nunito, sans-serif' }}>{point}</div>
          </div>
        ))}
      </div>
      <div style={{ margin:'12px 24px 0', background:'#FFF8E7', border:`2px solid ${C.yellow}`, borderRadius:'20px', padding:'16px', display:'flex', alignItems:'center', gap:'14px' }}>
        <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:C.yellow, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'22px', flexShrink:0 }}>
          {lesson.nextLesson.icon}
        </div>
        <div>
          <div style={{ fontSize:'11px', fontWeight:800, color:'#9A7200', textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:'Nunito, sans-serif' }}>Up Next</div>
          <div style={{ fontSize:'15px', fontWeight:900, color:C.text, marginTop:'2px', fontFamily:'Nunito, sans-serif' }}>{lesson.nextLesson.title}</div>
        </div>
      </div>
      <PrimaryButton onClick={onNext} style={{ marginTop:'auto' }}>Next Lesson →</PrimaryButton>
    </div>
  )
}