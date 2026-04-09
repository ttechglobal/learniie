'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'motion/react'

const EXAMS = [
  { id:'WAEC', full:'West African Senior School Certificate Examination', color:'#0FA968' },
  { id:'JAMB', full:'Joint Admissions and Matriculation Board',           color:'#5046E5' },
  { id:'BECE', full:'Basic Education Certificate Examination',            color:'#F5A623' },
  { id:'NECO', full:'National Examinations Council',                      color:'#F05A28' },
]

export default function OnboardingExamPage() {
  const router = useRouter()
  const [selected, setSelected] = useState([])
  const [loading,  setLoading]  = useState(false)

  function toggle(id) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleContinue() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (selected.length > 0) {
      await supabase.from('student_exams').insert(
        selected.map(examCode => ({ student_id: user.id, exam_code: examCode, status:'active' }))
      )
    }
    router.push('/home')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:'linear-gradient(160deg, #5046E5 0%, #111D15 60%)' }}>
      <div className="px-6 pt-8 pb-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-white/80 font-bold text-sm">LearnInByte</span>
        </div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <h1 className="font-heading text-3xl font-black text-white leading-tight mb-2">Which exam<br/>are you targeting?</h1>
          <p className="text-white/60 text-sm">Select one or more. You can change this later.</p>
        </motion.div>
      </div>

      <div className="flex-1 px-6 mt-8 pb-8">
        <div className="grid grid-cols-2 gap-3 mb-6">
          {EXAMS.map((exam, i) => {
            const isSel = selected.includes(exam.id)
            return (
              <motion.button key={exam.id}
                initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }} transition={{ delay: i * 0.1 + 0.3 }}
                onClick={() => toggle(exam.id)}
                className="p-4 rounded-2xl text-left transition-all duration-200"
                style={{ background: isSel ? 'white' : 'rgba(255,255,255,0.08)', border: isSel ? `2px solid ${exam.color}` : '2px solid rgba(255,255,255,0.12)', transform: isSel ? 'scale(1.03)' : 'scale(1)' }}>
                <div className="flex items-start justify-between mb-2">
                  <span className="font-heading font-black text-2xl" style={{ color: isSel ? exam.color : 'white' }}>{exam.id}</span>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: isSel ? exam.color : 'rgba(255,255,255,0.15)' }}>
                    {isSel && <span className="text-white text-[10px] font-black">✓</span>}
                  </div>
                </div>
                <p className="text-xs leading-snug" style={{ color: isSel ? '#4A6355' : 'rgba(255,255,255,0.5)' }}>{exam.full}</p>
              </motion.button>
            )
          })}
        </div>

        <button onClick={handleContinue} disabled={loading}
          className="w-full py-4 rounded-2xl font-heading font-black text-base text-textPrimary bg-white transition-all active:scale-[0.98]">
          {loading ? 'Saving...' : selected.length === 0 ? 'Skip for now →' : `Start with ${selected.join(' & ')} →`}
        </button>
      </div>
    </div>
  )
}