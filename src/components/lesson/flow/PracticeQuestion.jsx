'use client'
import { useState } from 'react'
import C  from './constants.jsx'
import { TopBar } from './TopBar'
import { PrimaryButton } from './PrimaryButton'

export function PracticeQuestion({ slide, onNext, onBack, totalSlides, slideIndex }) {
  const [selected, setSelected] = useState(null)
  const letters = ['A','B','C','D']

  function getOptionStyle(i) {
    const isSel  = selected === i
    const isCorr = i === slide.correctIndex
    const base = { display:'flex', alignItems:'center', gap:'12px', borderRadius:'16px', padding:'14px 16px', cursor: selected !== null ? 'default' : 'pointer', transition:'all 0.2s', border:'2px solid transparent', fontFamily:'Nunito, sans-serif' }
    if (selected === null) return { ...base, background:C.bgPill }
    if (isCorr)            return { ...base, background:'#EBF9EE', border:`2px solid ${C.green}` }
    if (isSel && !isCorr)  return { ...base, background:'#FFF0F0', border:'2px solid #FF6B6B' }
    return { ...base, background:C.bgPill, opacity:0.5 }
  }

  function getLetterStyle(i) {
    const isSel  = selected === i
    const isCorr = i === slide.correctIndex
    const base = { width:'32px', height:'32px', borderRadius:'10px', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'14px', fontWeight:900, flexShrink:0, transition:'all 0.2s', fontFamily:'Nunito, sans-serif' }
    if (selected === null) return { ...base, background:'white', color:'#666' }
    if (isCorr)            return { ...base, background:C.green,   color:'white' }
    if (isSel && !isCorr)  return { ...base, background:'#FF6B6B', color:'white' }
    return { ...base, background:'white', color:'#666' }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:C.cream }}>
      <TopBar onBack={onBack} total={totalSlides} current={slideIndex} />
      <div style={{ background:C.white, margin:'12px 24px 0', borderRadius:'24px', padding:'18px', display:'flex', alignItems:'center', gap:'14px', boxShadow:C.shadow }}>
        <div style={{ width:'60px', height:'60px', borderRadius:'16px', background:'linear-gradient(135deg,#FFE5B4,#FFDDA0)', display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', fontSize:'10px', fontWeight:800, color:'#C8943A', textAlign:'center', lineHeight:1.3, flexShrink:0, fontFamily:'Nunito, sans-serif' }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#C8943A" strokeWidth="1.5"/><circle cx="9.5" cy="10.5" r="1.2" fill="#C8943A"/><circle cx="14.5" cy="10.5" r="1.2" fill="#C8943A"/><path d="M8.5 15c1 1.2 6 1.2 7 0" stroke="#C8943A" strokeWidth="1.5" strokeLinecap="round"/></svg>
          Mascot
        </div>
        <div>
          <div style={{ fontSize:'16px', fontWeight:900, color:C.text, fontFamily:'Nunito, sans-serif' }}>Your Turn! 💪</div>
          <div style={{ fontSize:'12px', fontWeight:600, color:'#888', marginTop:'2px', fontFamily:'Nunito, sans-serif' }}>Let&apos;s see what you&apos;ve learned</div>
        </div>
      </div>
      <div style={{ margin:'14px 24px 0', background:C.white, borderRadius:'24px', padding:'22px', boxShadow:C.shadow }}>
        <div style={{ fontSize:'11px', fontWeight:800, color:C.greenDark, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'8px', fontFamily:'Nunito, sans-serif' }}>
          Question {slide.questionNumber} of {slide.questionTotal}
        </div>
        <div style={{ fontSize:'17px', fontWeight:800, color:C.text, lineHeight:1.4, marginBottom:'18px', fontFamily:'Nunito, sans-serif' }}>
          {slide.question}
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:'10px' }}>
          {slide.options.map((option, i) => (
            <div key={i} style={getOptionStyle(i)} onClick={() => selected === null && setSelected(i)}>
              <div style={getLetterStyle(i)}>{letters[i]}</div>
              <div style={{ fontSize:'14px', fontWeight:700, color:C.text, fontFamily:'Nunito, sans-serif' }}>{option}</div>
            </div>
          ))}
        </div>
      </div>
      <PrimaryButton onClick={onNext} disabled={selected === null} style={{ marginTop:'auto' }}>
        Check Answer →
      </PrimaryButton>
    </div>
  )
}