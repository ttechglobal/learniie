'use client'

// ─────────────────────────────────────────────────────────────────────────────
// /admin/lessons/[lessonId]/preview
// Renders the lesson in the student-facing LessonEngine for admin review.
// Admin can approve+publish or send back for regeneration.
// ─────────────────────────────────────────────────────────────────────────────

import { useParams, useRouter } from 'next/navigation'
import { useState } from 'react'
import { LessonEngine } from '@/components/lesson/cpa/LessonEngine'
import { velocityLesson1 } from '@/data/lessons/physics-velocity-lesson1'

const F = "'Nunito', sans-serif"
const C = { white:'#FFFFFF', blue:'#2D3CE6', green:'#6DC77A', dark:'#1A1A1A', muted:'#888', red:'#E63946', border:'#EBEBEB', surface:'#F7F8FA' }

// In production: fetch lesson from DB by lessonId param
// For now: use the velocity lesson as demo
const DEMO_LESSONS = {
  'speed-distance':    velocityLesson1,
  'physics-velocity-1': velocityLesson1,
}

export default function LessonPreviewPage() {
  const params  = useParams()
  const router  = useRouter()
  const lessonId = params?.lessonId

  const lesson = DEMO_LESSONS[lessonId] || velocityLesson1

  const [published,  setPublished]  = useState(false)
  const [publishing, setPublishing] = useState(false)
  const [showLesson, setShowLesson] = useState(false)

  async function handlePublish() {
    setPublishing(true)
    // In production: PATCH /api/lessons/[id] → { status: 'published' }
    await new Promise(r => setTimeout(r, 800))
    setPublished(true)
    setPublishing(false)
  }

  if (showLesson) {
    return (
      <div style={{ position:'relative' }}>
        {/* Admin overlay bar — floats above the lesson */}
        <div style={{ position:'fixed', top:0, left:0, right:0, zIndex:10000, background:'rgba(26,26,46,0.95)', padding:'10px 20px', display:'flex', alignItems:'center', justifyContent:'space-between', backdropFilter:'blur(6px)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
            <button onClick={() => setShowLesson(false)} style={{ padding:'6px 14px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', background:'transparent', color:'rgba(255,255,255,0.7)', fontFamily:F, fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
              ← Exit Preview
            </button>
            <span style={{ fontSize:'12px', fontWeight:700, color:'rgba(255,255,255,0.5)', fontFamily:F }}>
              Admin Preview — {lesson.subtopicTitle}
            </span>
          </div>
          <div style={{ display:'flex', gap:'10px' }}>
            <button onClick={handlePublish} disabled={published||publishing} style={{ padding:'7px 18px', borderRadius:'8px', border:'none', background:published?C.green:publishing?C.muted:C.blue, color:'#fff', fontFamily:F, fontWeight:800, fontSize:'12px', cursor:'pointer' }}>
              {published ? '✓ Published' : publishing ? 'Publishing...' : 'Publish Lesson'}
            </button>
            <button onClick={() => router.push('/admin/lessons/generate')} style={{ padding:'7px 14px', borderRadius:'8px', border:'1px solid rgba(255,255,255,0.2)', background:'transparent', color:'rgba(255,255,255,0.7)', fontFamily:F, fontWeight:700, fontSize:'12px', cursor:'pointer' }}>
              Regenerate
            </button>
          </div>
        </div>

        {/* The actual lesson — student view */}
        <div style={{ paddingTop:'52px' }}>
          <LessonEngine
            lesson={lesson}
            onComplete={() => setShowLesson(false)}
          />
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth:'640px', margin:'0 auto', padding:'32px 24px', fontFamily:F }}>
      <div style={{ marginBottom:'24px' }}>
        <button onClick={() => router.back()} style={{ fontSize:'13px', fontWeight:700, color:C.muted, background:'none', border:'none', cursor:'pointer', fontFamily:F, marginBottom:'12px', display:'flex', alignItems:'center', gap:'6px' }}>
          ← Back to generation
        </button>
        <div style={{ fontSize:'11px', fontWeight:800, color:C.muted, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'6px' }}>Admin Preview</div>
        <h1 style={{ fontSize:'24px', fontWeight:900, color:C.dark, margin:0 }}>{lesson.subtopicTitle}</h1>
        <p style={{ fontSize:'14px', color:C.muted, marginTop:'6px' }}>
          {lesson.subject} · {lesson.gradeLevel} · {lesson.slides?.length} slides · {lesson.xpReward} XP
        </p>
      </div>

      {/* Slide overview */}
      <div style={{ background:C.white, borderRadius:'14px', border:`1px solid ${C.border}`, marginBottom:'20px', overflow:'hidden' }}>
        <div style={{ padding:'12px 18px', background:C.surface, borderBottom:`1px solid ${C.border}` }}>
          <div style={{ fontSize:'13px', fontWeight:900, color:C.dark, fontFamily:F }}>Slide Overview</div>
        </div>
        {lesson.slides?.map((slide, i) => (
          <div key={slide.id || i} style={{ padding:'11px 18px', borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:'12px' }}>
            <div style={{ width:'24px', height:'24px', borderRadius:'6px', background:C.surface, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'11px', fontWeight:900, color:C.muted, flexShrink:0, fontFamily:F }}>
              {i + 1}
            </div>
            <div style={{ flex:1 }}>
              <span style={{ fontSize:'12px', fontWeight:800, color:C.blue, textTransform:'uppercase', letterSpacing:'0.5px', fontFamily:F }}>
                {slide.type.replace('_', ' ')}
              </span>
              {slide.content?.topicTitle && <span style={{ fontSize:'13px', color:C.dark, fontFamily:F, marginLeft:'10px', fontWeight:600 }}>{slide.content.topicTitle}</span>}
              {slide.content?.term && <span style={{ fontSize:'13px', color:C.dark, fontFamily:F, marginLeft:'10px', fontWeight:600 }}>{slide.content.term}</span>}
              {slide.content?.question && <span style={{ fontSize:'13px', color:C.dark, fontFamily:F, marginLeft:'10px', fontWeight:600 }}>{slide.content.question.slice(0, 60)}...</span>}
            </div>
          </div>
        ))}
      </div>

      {/* Actions */}
      <div style={{ display:'flex', gap:'12px' }}>
        <button onClick={() => setShowLesson(true)} style={{ flex:1, padding:'14px', borderRadius:'12px', border:'none', background:C.blue, color:'#fff', fontFamily:F, fontWeight:900, fontSize:'15px', cursor:'pointer' }}>
          Preview as Student →
        </button>
        <button onClick={handlePublish} disabled={published || publishing} style={{ flex:1, padding:'14px', borderRadius:'12px', border:'none', background:published?C.green:C.dark, color:'#fff', fontFamily:F, fontWeight:900, fontSize:'15px', cursor:published?'default':'pointer' }}>
          {published ? '✓ Published!' : publishing ? 'Publishing...' : 'Publish Lesson'}
        </button>
      </div>

      {published && (
        <div style={{ marginTop:'14px', background:'#EBF9EE', borderRadius:'12px', padding:'12px 16px', border:`1px solid ${C.green}`, fontSize:'14px', fontWeight:700, color:'#2A5A1A', fontFamily:F, textAlign:'center' }}>
          ✓ Lesson published! Students can now access it.
        </div>
      )}
    </div>
  )
}