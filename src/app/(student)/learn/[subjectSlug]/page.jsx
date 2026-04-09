'use client'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { MOCK_TOPICS } from '@/lib/mock/data'
import { ArrowLeft, CheckCircle, Lock, BookOpen, ChevronRight, Zap } from 'lucide-react'

const META = {
  mathematics: { emoji:'📐', color:'#F5A623', bg:'#FEF3C7', name:'Mathematics' },
  physics:     { emoji:'⚡', color:'#3A7BD5', bg:'#DBEAFE', name:'Physics'     },
  chemistry:   { emoji:'🧪', color:'#7C3AED', bg:'#EDE9FE', name:'Chemistry'   },
  biology:     { emoji:'🌿', color:'#D97706', bg:'#FEF3C7', name:'Biology'     },
}
const STATUS_CONFIG = {
  complete:    { label:'Done',        dotColor:'#22C55E' },
  in_progress: { label:'In progress', dotColor:'#F5A623' },
  unlocked:    { label:'Ready',       dotColor:'#0D5C2E' },
  locked:      { label:'Locked',      dotColor:'#E8E0D4' },
}

export default function SubjectPage() {
  const { subjectSlug } = useParams()
  const meta  = META[subjectSlug] || META.mathematics
  const done  = MOCK_TOPICS.filter(t => t.status === 'complete').length
  const total = MOCK_TOPICS.length
  const pct   = Math.round((done / total) * 100)

  return (
    <div className="max-w-lg mx-auto min-h-screen bg-white flex flex-col">
      <div className="relative overflow-hidden px-5 pt-14 pb-6"
        style={{ background:`linear-gradient(145deg, ${meta.color}18 0%, #fff 100%)` }}>
        <Link href="/learn"
          className="inline-flex items-center gap-2 text-sm font-semibold mb-6"
          style={{ color:'#5C4F3A' }}>
          <ArrowLeft size={16} /> Back to subjects
        </Link>
        <div className="flex items-center gap-4 mb-5">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
            style={{ background:meta.bg }}>{meta.emoji}</div>
          <div>
            <h1 className="font-heading text-[28px] font-black text-[#1A1209] leading-tight">{meta.name}</h1>
            <p className="text-sm font-medium mt-0.5" style={{ color:'#9A8C78' }}>{total} topics · {pct}% complete</p>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background:'#F3EFE8' }}>
          <div className="h-full rounded-full transition-all duration-700"
            style={{ width:`${pct}%`, background:meta.color }} />
        </div>
        <div className="flex justify-between mt-2">
          <p className="text-xs font-semibold" style={{ color:'#9A8C78' }}>{done} complete</p>
          <p className="text-xs font-semibold" style={{ color:'#9A8C78' }}>{total - done} remaining</p>
        </div>
      </div>

      <div className="flex-1 px-5 pb-10 flex flex-col gap-3">
        <p className="text-xs font-bold uppercase tracking-widest mt-2 mb-1" style={{ color:'#9A8C78' }}>Topics</p>
        {MOCK_TOPICS.map(topic => {
          const cfg    = STATUS_CONFIG[topic.status] || STATUS_CONFIG.locked
          const isDone   = topic.status === 'complete'
          const isActive = topic.status === 'in_progress'
          const isLocked = topic.status === 'locked'
          return (
            <div key={topic.id}>
              {isLocked ? (
                <div className="flex items-center gap-4 p-4 rounded-2xl border border-[#E8E0D4] opacity-45">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background:'#F3EFE8' }}>
                    <Lock size={15} style={{ color:'#9A8C78' }} />
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold text-[15px] text-[#1A1209]">{topic.title}</p>
                    <p className="text-xs mt-0.5" style={{ color:'#9A8C78' }}>{topic.lessonCount} lessons</p>
                  </div>
                </div>
              ) : (
                <Link href={`/learn/${subjectSlug}/${topic.slug}`}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl border transition-all duration-150 hover:scale-[1.01] active:scale-[0.99]"
                    style={{
                      background:  isActive ? '#FFF5E0' : '#fff',
                      borderColor: isActive ? '#F5A623' : '#E8E0D4',
                      borderWidth: isActive ? '1.5px'   : '1px',
                      boxShadow:   isActive ? '0 4px 16px rgba(245,166,35,0.2)' : '0 2px 8px rgba(26,18,9,0.04)',
                    }}>
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: isDone ? '#E8F5EE' : isActive ? '#FFF5E0' : '#F3EFE8' }}>
                      {isDone   ? <CheckCircle size={18} style={{ color:'#0D5C2E' }} />
                      : isActive ? <Zap size={18} style={{ color:'#F5A623' }} />
                      :            <BookOpen size={16} style={{ color:'#5C4F3A' }} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-[15px] text-[#1A1209] truncate">{topic.title}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background:cfg.dotColor }} />
                        <p className="text-xs font-medium" style={{ color:'#9A8C78' }}>
                          {cfg.label} · {topic.lessonCount} lessons
                        </p>
                      </div>
                    </div>
                    <ChevronRight size={16} style={{ color:'#9A8C78' }} />
                  </div>
                </Link>
              )}
            </div>
          )
        })}
      </div>

      <div className="px-5 pb-10 pt-2 sticky bottom-20 md:bottom-4">
        <Link href={`/learn/${subjectSlug}/quadratic`}>
          <button className="w-full h-14 rounded-2xl font-heading font-black text-base text-white transition-all active:scale-[0.98]"
            style={{ background:'#0D5C2E', boxShadow:'0 4px 16px rgba(13,92,46,0.30)' }}>
            Continue Learning →
          </button>
        </Link>
      </div>
    </div>
  )
}