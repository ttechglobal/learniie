'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, CheckCircle, ChevronRight, Clock } from 'lucide-react'

const META = {
  mathematics: { emoji:'📐', color:'#F5A623', bg:'#FEF3C7', name:'Mathematics' },
  physics:     { emoji:'⚡', color:'#3A7BD5', bg:'#DBEAFE', name:'Physics'     },
  chemistry:   { emoji:'🧪', color:'#7C3AED', bg:'#EDE9FE', name:'Chemistry'   },
  biology:     { emoji:'🌿', color:'#D97706', bg:'#FEF3C7', name:'Biology'     },
}
const LESSONS = [
  { id:'lesson-0', title:'What is a Quadratic Equation?', mins:8,  done:true          },
  { id:'lesson-1', title:'Solving by Factorisation',       mins:12, done:false, active:true },
  { id:'lesson-2', title:'The Quadratic Formula',          mins:15, done:false          },
  { id:'lesson-3', title:'Completing the Square',          mins:14, done:false          },
]

export default function TopicPage() {
  const { subjectSlug, topicSlug } = useParams()
  const meta = META[subjectSlug] || META.mathematics
  const done = LESSONS.filter(l => l.done).length
  const pct  = Math.round((done / LESSONS.length) * 100)

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white flex flex-col">
      <div className="px-5 pt-14 pb-6 border-b border-[#E8E0D4]">
        <Link href={`/learn/${subjectSlug}`}
          className="inline-flex items-center gap-2 text-sm font-semibold mb-5"
          style={{ color:'#5C4F3A' }}>
          <ArrowLeft size={16} /> {meta.name}
        </Link>
        <div className="flex items-start gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0"
            style={{ background:meta.bg }}>{meta.emoji}</div>
          <div className="flex-1">
            <h1 className="font-heading text-xl font-black text-[#1A1209] leading-tight capitalize">
              {topicSlug.replace(/-/g,' ')}
            </h1>
            <p className="text-sm mt-0.5" style={{ color:'#9A8C78' }}>
              {LESSONS.length} lessons · {done} complete
            </p>
          </div>
        </div>
        <div className="h-2 rounded-full overflow-hidden mb-1.5" style={{ background:'#F3EFE8' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width:`${pct}%`, background:meta.color }} />
        </div>
        <p className="text-xs font-semibold" style={{ color:'#9A8C78' }}>{pct}% complete</p>
      </div>

      <div className="flex-1 px-5 py-5 flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'#9A8C78' }}>Lessons</p>
        {LESSONS.map((lesson, i) => (
          <Link key={lesson.id} href={`/learn/${subjectSlug}/${topicSlug}/lesson/${lesson.id}`}>
            <div className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
              style={{
                background:  lesson.active ? '#E8F5EE' : lesson.done ? '#F9F6F0' : '#fff',
                borderColor: lesson.active ? '#0D5C2E' : '#E8E0D4',
                borderWidth: lesson.active ? '1.5px'   : '1px',
                boxShadow:   lesson.active ? '0 4px 16px rgba(13,92,46,0.15)' : '0 2px 8px rgba(26,18,9,0.04)',
              }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 font-heading font-black text-sm"
                style={{
                  background: lesson.done || lesson.active ? '#0D5C2E' : '#F3EFE8',
                  color:      lesson.done || lesson.active ? '#fff'    : '#9A8C78',
                }}>
                {lesson.done ? <CheckCircle size={17} /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-[15px] truncate"
                  style={{ color: lesson.done ? '#5C4F3A' : '#1A1209' }}>{lesson.title}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <Clock size={10} style={{ color:'#9A8C78' }} />
                  <p className="text-xs" style={{ color:'#9A8C78' }}>{lesson.mins} min</p>
                  {lesson.done && <span className="text-[10px] font-bold" style={{ color:'#0D5C2E' }}>· Done</span>}
                </div>
              </div>
              <ChevronRight size={16} style={{ color:'#9A8C78' }} />
            </div>
          </Link>
        ))}
      </div>

      <div className="px-5 pb-10 pt-2">
        <Link href={`/learn/${subjectSlug}/${topicSlug}/lesson/lesson-1`}>
          <button className="w-full h-14 rounded-2xl font-heading font-black text-base text-white transition-all active:scale-[0.98]"
            style={{ background:'#0D5C2E', boxShadow:'0 4px 16px rgba(13,92,46,0.30)' }}>
            {done > 0 ? 'Continue →' : "Let's Start →"}
          </button>
        </Link>
      </div>
    </div>
  )
}