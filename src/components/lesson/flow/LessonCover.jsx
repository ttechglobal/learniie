'use client'
import C  from './constants.jsx'
import { TopBar } from './TopBar'
import { ImagePlaceholder } from './ImagePlaceholder'
import { PrimaryButton } from './PrimaryButton'

export function LessonCover({ lesson, onNext, onBack, totalSlides }) {
  return (
    <div style={{ display:'flex', flexDirection:'column', flex:1, background:C.white }}>
      <TopBar onBack={onBack} total={totalSlides} current={0} />
      <div style={{ margin:'16px 24px 0' }}>
        <ImagePlaceholder height={220} label="Lesson Image" />
      </div>
      <span style={{
        display:'inline-block', background:'#EBF9EE', color:C.greenDark,
        fontSize:'12px', fontWeight:800, padding:'4px 14px', borderRadius:'50px',
        margin:'20px 24px 6px', letterSpacing:'0.5px', textTransform:'uppercase',
        fontFamily:'Nunito, sans-serif', alignSelf:'flex-start',
      }}>
        {lesson.subject} · {lesson.chapter}
      </span>
      <h1 style={{
        fontSize:'28px', fontWeight:900, color:C.text,
        lineHeight:1.2, padding:'0 24px', fontFamily:'Nunito, sans-serif',
      }}>
        {lesson.title}
      </h1>
      <div style={{ display:'flex', gap:'12px', padding:'14px 24px' }}>
        {[
          { icon:'⏱', label: lesson.duration },
          { icon:'📖', label: `${lesson.slideCount} slides` },
          { icon:'⭐', label: `${lesson.xpReward} pts` },
        ].map(chip => (
          <div key={chip.label} style={{
            display:'flex', alignItems:'center', gap:'6px', background:C.bgPill,
            borderRadius:'50px', padding:'7px 14px', fontSize:'13px',
            fontWeight:700, color:'#555', fontFamily:'Nunito, sans-serif',
          }}>
            {chip.icon} {chip.label}
          </div>
        ))}
      </div>
      <p style={{
        fontSize:'14px', color:'#666', fontWeight:600, lineHeight:1.6,
        padding:'0 24px 24px', flex:1, fontFamily:'Nunito, sans-serif',
      }}>
        {lesson.description}
      </p>
      <PrimaryButton onClick={onNext}>Start Learning →</PrimaryButton>
    </div>
  )
}