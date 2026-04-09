'use client'
import { useEffect, useRef, useState } from 'react'
import C  from './constants.jsx'
import { TopBar } from './TopBar'
import { MascotPlaceholder } from './ImagePlaceholder'
import { PrimaryButton } from './PrimaryButton'

export function MascotHook({ slide, onNext, onBack, totalSlides, slideIndex }) {
  const [displayedText, setDisplayedText] = useState('')
  const [showSub,       setShowSub]       = useState(false)
  const [showBtn,       setShowBtn]       = useState(false)
  const [showCursor,    setShowCursor]    = useState(true)
  const intervalRef = useRef(null)
  const fullText    = slide.hookText

  useEffect(() => {
    setDisplayedText(''); setShowSub(false); setShowBtn(false); setShowCursor(true)
    let i = 0
    intervalRef.current = setInterval(() => {
      if (i < fullText.length) {
        setDisplayedText(fullText.slice(0, ++i))
      } else {
        clearInterval(intervalRef.current)
        setShowCursor(false)
        setTimeout(() => { setShowSub(true); setShowBtn(true) }, 400)
      }
    }, 38)
    return () => clearInterval(intervalRef.current)
  }, [fullText])

  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:C.cream }}>
      <TopBar onBack={onBack} total={totalSlides} current={slideIndex} />
      <div style={{ display:'flex', flexDirection:'column', alignItems:'center', padding:'12px 24px 0', gap:'4px' }}>
        <MascotPlaceholder size={120} />
        <div style={{ fontSize:'13px', fontWeight:800, color:'#888', marginTop:'6px', fontFamily:'Nunito, sans-serif' }}>
          {slide.mascotName} • Your Guide
        </div>
      </div>
      <div style={{
        background:C.white, borderRadius:'24px', margin:'16px 24px 0',
        padding:'24px', boxShadow:C.shadow, position:'relative', flex:1,
      }}>
        <div style={{
          position:'absolute', top:'-10px', left:'40px', width:'20px', height:'20px',
          background:C.white, transform:'rotate(45deg)', borderRadius:'4px',
        }} />
        <div style={{
          fontSize:'11px', fontWeight:800, color:C.greenDark, textTransform:'uppercase',
          letterSpacing:'1px', marginBottom:'10px', fontFamily:'Nunito, sans-serif',
        }}>✦ Did you know?</div>
        <div style={{ fontSize:'20px', fontWeight:800, color:C.text, lineHeight:1.4, minHeight:'80px', fontFamily:'Nunito, sans-serif' }}>
          {displayedText}
          {showCursor && (
            <span style={{
              display:'inline-block', width:'2px', height:'22px', background:C.green,
              marginLeft:'2px', verticalAlign:'middle', animation:'lessonCursorBlink 0.8s infinite',
            }} />
          )}
        </div>
        <div style={{
          marginTop:'14px', fontSize:'14px', fontWeight:600, color:'#777',
          lineHeight:1.6, fontFamily:'Nunito, sans-serif',
          opacity: showSub ? 1 : 0, transition:'opacity 0.5s',
        }}>
          {slide.subText}
        </div>
      </div>
      <PrimaryButton onClick={onNext} disabled={!showBtn}
        style={{ opacity: showBtn ? 1 : 0, pointerEvents: showBtn ? 'auto' : 'none' }}>
        Let&apos;s Go! →
      </PrimaryButton>
      <style>{`@keyframes lessonCursorBlink{0%,100%{opacity:1}50%{opacity:0}}`}</style>
    </div>
  )
}