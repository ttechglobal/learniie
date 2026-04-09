'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { motion } from 'motion/react'

const JSS = ['JSS1','JSS2','JSS3']
const SS  = ['SS1','SS2','SS3']

export default function OnboardingClassPage() {
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
    await supabase.from('students').update({ class_level: selected }).eq('id', user.id)

    const isSSLevel = SS.includes(selected)
    if (isSSLevel) {
      router.push('/onboarding/department')   // SS always picks department
    } else if (mode === 'school_exam') {
      router.push('/onboarding/exam')         // JSS + school_exam → exam step
    } else {
      router.push('/home')                    // JSS + school only → done
    }
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background:'linear-gradient(160deg, #0A7A4C 0%, #111D15 60%)' }}>
      <div className="px-6 pt-8 pb-0">
        <div className="flex items-center gap-2 mb-12">
          <div className="w-8 h-8 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-black text-sm">L</span>
          </div>
          <span className="text-white/80 font-bold text-sm">LearnInByte</span>
        </div>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.5 }}>
          <p className="text-white/60 text-sm font-semibold mb-1">Step 2 of 2</p>
          <h1 className="font-heading text-3xl font-black text-white leading-tight mb-2">What class<br/>are you in?</h1>
          <p className="text-white/60 text-sm">We'll align your content to your curriculum.</p>
        </motion.div>
      </div>

      <div className="flex-1 px-6 mt-8 pb-8">
        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Junior Secondary</p>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {JSS.map((cls, i) => (
            <motion.button key={cls}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.07 + 0.3 }}
              onClick={() => setSelected(cls)}
              className="py-4 rounded-2xl font-heading font-black text-base transition-all duration-200"
              style={{ background: selected===cls ? 'white' : 'rgba(255,255,255,0.08)', color: selected===cls ? '#0A7A4C' : 'white', border: selected===cls ? '2px solid white' : '2px solid rgba(255,255,255,0.12)', transform: selected===cls ? 'scale(1.05)' : 'scale(1)' }}>
              {cls}
            </motion.button>
          ))}
        </div>

        <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-3">Senior Secondary</p>
        <div className="grid grid-cols-3 gap-2 mb-8">
          {SS.map((cls, i) => (
            <motion.button key={cls}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay: i * 0.07 + 0.5 }}
              onClick={() => setSelected(cls)}
              className="py-4 rounded-2xl font-heading font-black text-base transition-all duration-200"
              style={{ background: selected===cls ? 'white' : 'rgba(255,255,255,0.08)', color: selected===cls ? '#0A7A4C' : 'white', border: selected===cls ? '2px solid white' : '2px solid rgba(255,255,255,0.12)', transform: selected===cls ? 'scale(1.05)' : 'scale(1)' }}>
              {cls}
            </motion.button>
          ))}
        </div>

        <button disabled={!selected || loading} onClick={handleContinue}
          className="w-full py-4 rounded-2xl font-heading font-black text-base transition-all duration-200"
          style={{ background: selected ? 'white' : 'rgba(255,255,255,0.2)', color: selected ? '#111D15' : 'rgba(255,255,255,0.5)', cursor: selected ? 'pointer' : 'not-allowed' }}>
          {loading ? 'Saving...' : 'Continue →'}
        </button>
      </div>
    </div>
  )
}