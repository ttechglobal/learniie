'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'motion/react'

const MODES = [
  { id:'school',      emoji:'🏫', label:"I'm in School",           sub:'Follow your school curriculum term by term',              color:'#0FA968' },
  { id:'exam',        emoji:'📋', label:'Preparing for an Exam',   sub:'Focus on WAEC, JAMB, BECE or NECO',                      color:'#5046E5' },
  { id:'school_exam', emoji:'🎯', label:'Both — School & Exams',   sub:'Track school progress and exam readiness together',       color:'#F05A28' },
]

export default function OnboardingModePage() {
  const router = useRouter()
  const [selected, setSelected] = useState(null)
  const [loading,  setLoading]  = useState(false)

  async function handleContinue() {
    if (!selected) return
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    await supabase.from('students').update({ mode: selected }).eq('id', user.id)

    if (selected === 'exam') {
      router.push('/onboarding/exam')       // exam only — skip class
    } else {
      router.push('/onboarding/class')      // school or both — pick class first
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:'linear-gradient(160deg, #0A7A4C 0%, #111D15 60%)' }}>
      <div className="px-6 pt-8 pb-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-white/80 font-bold text-sm tracking-wide">LearnInByte</span>
        </div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <p className="text-white/60 text-sm font-semibold mb-1">Step 1 of 2</p>
          <h1 className="font-heading text-3xl font-black text-white leading-tight mb-2">How are you<br/>studying?</h1>
          <p className="text-white/60 text-sm">Choose the one that fits you best.</p>
        </motion.div>
      </div>

      <div className="flex-1 px-6 mt-8 flex flex-col gap-3 pb-8">
        {MODES.map((mode, i) => (
          <motion.button key={mode.id}
            initial={{ opacity:0, x:-20 }} animate={{ opacity:1, x:0 }} transition={{ delay: i * 0.1 + 0.3 }}
            onClick={() => setSelected(mode.id)}
            className="relative overflow-hidden rounded-2xl p-5 text-left transition-all duration-200"
            style={{
              background: selected === mode.id ? 'white' : 'rgba(255,255,255,0.08)',
              border: selected === mode.id ? `2px solid ${mode.color}` : '2px solid rgba(255,255,255,0.12)',
              transform: selected === mode.id ? 'scale(1.02)' : 'scale(1)',
            }}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                style={{ background: selected === mode.id ? mode.color + '20' : 'rgba(255,255,255,0.1)' }}>
                {mode.emoji}
              </div>
              <div className="flex-1">
                <p className="font-heading font-black text-base"
                  style={{ color: selected === mode.id ? '#111D15' : 'white' }}>{mode.label}</p>
                <p className="text-sm mt-0.5"
                  style={{ color: selected === mode.id ? '#4A6355' : 'rgba(255,255,255,0.55)' }}>{mode.sub}</p>
              </div>
              <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: selected === mode.id ? mode.color : 'rgba(255,255,255,0.1)', border: selected === mode.id ? 'none' : '2px solid rgba(255,255,255,0.2)' }}>
                {selected === mode.id && <span className="text-white text-xs font-black">✓</span>}
              </div>
            </div>
          </motion.button>
        ))}

        <motion.button initial={{ opacity:0 }} animate={{ opacity: selected ? 1 : 0.4 }}
          disabled={!selected || loading} onClick={handleContinue}
          className="mt-4 w-full py-4 rounded-2xl font-heading font-black text-base transition-all duration-200"
          style={{ background: selected ? 'white' : 'rgba(255,255,255,0.2)', color: selected ? '#111D15' : 'rgba(255,255,255,0.5)', cursor: selected ? 'pointer' : 'not-allowed' }}>
          {loading ? 'Saving...' : 'Continue →'}
        </motion.button>
      </div>
    </div>
  )
}