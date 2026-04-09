'use client'
import C  from './constants.jsx'
import { TopBar } from './TopBar'
import { PrimaryButton } from './PrimaryButton'

export function WorkedExample({ slide, onNext, onBack, totalSlides, slideIndex }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:C.white }}>
      <TopBar onBack={onBack} total={totalSlides} current={slideIndex} />
      <div style={{ padding:'8px 24px 4px' }}>
        <h2 style={{ fontSize:'22px', fontWeight:900, color:C.text, lineHeight:1.25, fontFamily:'Nunito, sans-serif' }}>
          Worked Example
        </h2>
      </div>
      <div style={{
        display:'inline-flex', alignItems:'center', gap:'6px', background:'#EEF0FF',
        color:C.blue, fontSize:'12px', fontWeight:800, padding:'6px 16px',
        borderRadius:'50px', margin:'8px 24px 14px', textTransform:'uppercase',
        letterSpacing:'0.5px', fontFamily:'Nunito, sans-serif', alignSelf:'flex-start',
      }}>
        📐 Let&apos;s See It In Action
      </div>
      <div style={{ margin:'0 24px', background:C.blue, borderRadius:'24px', padding:'22px', color:'white' }}>
        <h3 style={{ fontSize:'16px', fontWeight:900, marginBottom:'12px', opacity:0.85, fontFamily:'Nunito, sans-serif' }}>
          Problem
        </h3>
        <p style={{ fontSize:'14px', fontWeight:600, lineHeight:1.7, opacity:0.9, fontFamily:'Nunito, sans-serif', margin:0 }}>
          {slide.problem}
        </p>
        <div style={{
          background:'rgba(255,255,255,0.15)', borderRadius:'14px', padding:'14px 18px',
          marginTop:'14px', fontSize:'20px', fontWeight:900, textAlign:'center',
          letterSpacing:'1px', fontFamily:'Nunito, sans-serif',
        }}>
          {slide.formula}
        </div>
      </div>
      <div style={{ margin:'16px 24px 0', display:'flex', flexDirection:'column', gap:'10px', flex:1 }}>
        {slide.steps.map((step, i) => (
          <div key={i} style={{ display:'flex', alignItems:'flex-start', gap:'12px', background:C.bgPill, borderRadius:'16px', padding:'12px 16px' }}>
            <div style={{
              width:'28px', height:'28px', borderRadius:'50%', background:C.green,
              color:'white', fontSize:'13px', fontWeight:900,
              display:'flex', alignItems:'center', justifyContent:'center',
              flexShrink:0, fontFamily:'Nunito, sans-serif',
            }}>{i + 1}</div>
            <div style={{ fontSize:'13px', fontWeight:700, color:'#444', lineHeight:1.5, fontFamily:'Nunito, sans-serif' }}>
              {step}
            </div>
          </div>
        ))}
      </div>
      <PrimaryButton onClick={onNext} color={C.blue}>I&apos;ve Got It! →</PrimaryButton>
    </div>
  )
}