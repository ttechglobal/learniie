'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'motion/react'

const DEPTS = [
  { id:'Science',    emoji:'⚗️', subjects:'Physics · Chemistry · Biology · Further Maths', color:'#0FA968' },
  { id:'Arts',       emoji:'🎭', subjects:'Government · Literature · History · CRS/IRS',   color:'#5046E5' },
  { id:'Commercial', emoji:'📈', subjects:'Accounting · Commerce · Economics',             color:'#F5A623' },
]

export default function OnboardingDepartmentPage() {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [mode,     setMode]     = useState(null)
  const [loading,  setLoading]  = useState(false)

  useEffect(() => {
    async function fetchMode() {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      const { data } = await supabase.from('students').select('mode').eq('id', user.id).single()
      setMode(data?.mode)
    }
    fetchMode()
  }, [])

  async function handleContinue() {
    if (!selected) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('students').update({ department: selected }).eq('id', user.id)
    router.push(mode === 'school_exam' ? '/onboarding/exam' : '/home')
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:'linear-gradient(160deg, #0A7A4C 0%, #111D15 60%)' }}>
      <div className="px-6 pt-8 pb-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-white/80 font-bold text-sm">LearnInByte</span>
        </div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }}>
          <h1 className="font-heading text-3xl font-black text-white leading-tight mb-2">Which<br/>department?</h1>
          <p className="text-white/60 text-sm">Your subjects are matched to your department.</p>
        </motion.div>
      </div>

      <div className="flex-1 px-6 mt-8 flex flex-col gap-3 pb-8">
        {DEPTS.map((dept, i) => (
          <motion.button key={dept.id}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.1 + 0.3 }}
            onClick={() => setSelected(dept.id)}
            className="relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200"
            style={{ background: selected===dept.id ? 'white' : 'rgba(255,255,255,0.08)', border: selected===dept.id ? `2px solid ${dept.color}` : '2px solid rgba(255,255,255,0.12)', transform: selected===dept.id ? 'scale(1.02)' : 'scale(1)' }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: selected===dept.id ? dept.color+'20' : 'rgba(255,255,255,0.1)' }}>
                {dept.emoji}
              </div>
              <div className="flex-1">
                <p className="font-heading font-black text-base" style={{ color: selected===dept.id ? '#111D15' : 'white' }}>{dept.id}</p>
                <p className="text-xs mt-0.5" style={{ color: selected===dept.id ? '#4A6355' : 'rgba(255,255,255,0.5)' }}>{dept.subjects}</p>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: selected===dept.id ? dept.color : 'rgba(255,255,255,0.1)', border: selected===dept.id ? 'none' : '2px solid rgba(255,255,255,0.2)' }}>
                {selected===dept.id && <span className="text-white text-xs font-black">✓</span>}
              </div>
            </div>
          </motion.button>
        ))}

        <button disabled={!selected || loading} onClick={handleContinue}
          className="mt-4 w-full py-4 rounded-2xl font-heading font-black text-base transition-all"
          style={{ background: selected ? 'white' : 'rgba(255,255,255,0.2)', color: selected ? '#111D15' : 'rgba(255,255,255,0.5)', cursor: selected ? 'pointer' : 'not-allowed' }}>
          {loading ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}