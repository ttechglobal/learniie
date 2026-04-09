'use client'
import C  from './constants.jsx'
import { TopBar } from './TopBar'
import { ConceptImagePlaceholder } from './ImagePlaceholder'
import { PrimaryButton } from './PrimaryButton'

export function LessonContent({ slide, onNext, onBack, totalSlides, slideIndex }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:C.white }}>
      <TopBar onBack={onBack} total={totalSlides} current={slideIndex} />
      <div style={{ padding:'8px 24px 16px' }}>
        <div style={{
          fontSize:'11px', fontWeight:800, color:C.greenDark, textTransform:'uppercase',
          letterSpacing:'1px', marginBottom:'6px', fontFamily:'Nunito, sans-serif',
        }}>📌 Concept {slide.conceptIndex} of {slide.conceptTotal}</div>
        <h2 style={{ fontSize:'22px', fontWeight:900, color:C.text, lineHeight:1.25, fontFamily:'Nunito, sans-serif' }}>
          {slide.title}
        </h2>
      </div>
      <ConceptImagePlaceholder height={160} />
      <div style={{ padding:'0 24px', flex:1 }}>
        <p style={{ fontSize:'15px', fontWeight:600, color:'#444', lineHeight:1.75, fontFamily:'Nunito, sans-serif' }}>
          {slide.bodyParts.map((part, i) => (
            typeof part === 'string'
              ? <span key={i}>{part}</span>
              : <strong key={i} style={{ color:C.text }}>{part.bold}</strong>
          ))}
        </p>
        {slide.highlight && (
          <div style={{
            background:'#FFF8E7', borderLeft:`4px solid ${C.yellow}`,
            borderRadius:'0 14px 14px 0', padding:'14px 16px', margin:'16px 0',
          }}>
            <p style={{ fontSize:'14px', fontWeight:700, color:'#7A5C00', lineHeight:1.5, fontFamily:'Nunito, sans-serif', margin:0 }}>
              {slide.highlight}
            </p>
          </div>
        )}
        {slide.bodyParts2 && (
          <p style={{ fontSize:'15px', fontWeight:600, color:'#444', lineHeight:1.75, fontFamily:'Nunito, sans-serif' }}>
            {slide.bodyParts2.map((part, i) => (
              typeof part === 'string'
                ? <span key={i}>{part}</span>
                : <strong key={i} style={{ color:C.text }}>{part.bold}</strong>
            ))}
          </p>
        )}
      </div>
      <PrimaryButton onClick={onNext}>Continue →</PrimaryButton>
    </div>
  )
}