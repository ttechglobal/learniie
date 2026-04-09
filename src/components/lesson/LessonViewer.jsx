'use client'
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { BiteRenderer } from './BiteRenderer'
import { Button } from '@/components/ui/Button'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
import { ArrowLeft, MessageCircle, Volume2, Send, X, CheckCircle } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { MOCK_TUTOR_RESPONSES } from '@/lib/mock/data'
import { clsx } from 'clsx'
 
export function LessonViewer({ lesson, onComplete }) {
  const router = useRouter()
  const [revealed,    setRevealed]    = useState(1)
  const [done,        setDone]        = useState(false)
  const [chatOpen,    setChatOpen]    = useState(false)
  const [chatMsgs,    setChatMsgs]    = useState([
    { role:'buddy', text:"Hey! I'm here if you have any questions about this lesson. Just ask! 😊" }
  ])
  const [chatInput,   setChatInput]   = useState('')
  const [voiceActive, setVoiceActive] = useState(false)
  const bottomRef  = useRef(null)
  const chatEndRef = useRef(null)
 
  const bites  = lesson.lesson_bites || []
  const isLast = revealed >= bites.length
 
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior:'smooth', block:'end' })
  }, [revealed])
 
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior:'smooth' })
  }, [chatMsgs, chatOpen])
 
  function handleContinue() {
    if (isLast) setDone(true)
    else setRevealed(r => r + 1)
  }
 
  function sendChat(e) {
    e?.preventDefault()
    if (!chatInput.trim()) return
    setChatMsgs(m => [...m, { role:'user', text:chatInput }])
    setChatInput('')
    setTimeout(() => {
      MOCK_TUTOR_RESPONSES.forEach((r, i) => {
        setTimeout(() => setChatMsgs(m => [...m, r]), i * 900)
      })
    }, 500)
  }
 
  if (done) return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center px-4 text-center">
      <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }}
        transition={{ type:'spring', stiffness:260, damping:20 }} className="mb-6">
        <LearniiBuddy size={130} expression="celebrating" className="animate-bounce-gentle" />
      </motion.div>
      <motion.div initial={{ y:20, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.3 }}>
        <p className="text-xs font-bold text-brand uppercase tracking-widest mb-2">Lesson Complete!</p>
        <h2 className="font-heading text-3xl font-black text-ink mb-1">Brilliant work! 🎉</h2>
        <p className="text-inkMid text-sm mb-2">{lesson.title}</p>
        <div className="flex items-center justify-center gap-2 mb-8">
          <span className="text-2xl">⭐</span>
          <span className="font-heading font-black text-xl text-brand">+{lesson.xp_reward || 15} XP earned</span>
        </div>
        <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
          <Button onClick={onComplete} className="w-full">Next Lesson →</Button>
          <Button variant="secondary" onClick={() => router.back()} className="w-full">Back to Topic</Button>
        </div>
      </motion.div>
    </div>
  )
 
  return (
    <div className="flex flex-col min-h-screen bg-cream relative">
      {/* Top bar */}
      <div className="sticky top-0 z-20 bg-surface/95 backdrop-blur-md border-b border-border">
        <div className="flex items-center gap-3 px-4 py-3 max-w-2xl mx-auto">
          <button onClick={() => router.back()} className="text-inkLight hover:text-ink transition-colors flex-shrink-0">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 min-w-0">
            <p className="font-heading font-bold text-ink truncate text-sm">{lesson.title}</p>
            {lesson.subject && <p className="text-[11px] text-inkLight">{lesson.subject}</p>}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button onClick={() => setVoiceActive(v => !v)}
              className={clsx('w-8 h-8 rounded-full flex items-center justify-center transition-all', voiceActive ? 'bg-brand text-white' : 'bg-surface2 text-inkLight hover:text-ink')}>
              <Volume2 size={15} />
            </button>
            <button onClick={() => setChatOpen(o => !o)}
              className="w-8 h-8 rounded-full bg-amberLight border border-amber/30 flex items-center justify-center text-amberDark hover:bg-amber/20 transition-all">
              <MessageCircle size={15} />
            </button>
            <span className="text-xs font-bold text-inkLight w-8 text-right">{revealed}/{bites.length}</span>
          </div>
        </div>
        <div className="h-1 bg-surface2">
          <motion.div className="h-full bg-brand" initial={{ width:0 }}
            animate={{ width:`${(revealed/bites.length)*100}%` }}
            transition={{ duration:0.4, ease:'easeOut' }} />
        </div>
      </div>
 
      {/* Bites */}
      <div className="flex-1 max-w-2xl mx-auto w-full px-4 py-5 flex flex-col gap-5">
        <BiteRenderer bite={null} resetPracticeCount={true} />
        <AnimatePresence initial={false}>
          {bites.slice(0, revealed).map((bite, idx) => (
            <motion.div key={bite.id || idx}
              initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }}
              transition={{ duration:0.25, ease:'easeOut' }}>
              <BiteRenderer bite={bite} />
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} className="h-4" />
      </div>
 
      {/* Bottom action */}
      <div className="sticky bottom-0 bg-surface/95 backdrop-blur-md border-t border-border px-4 py-3"
        style={{ paddingBottom:'calc(env(safe-area-inset-bottom)+12px)' }}>
        <div className="max-w-2xl mx-auto">
          <Button onClick={handleContinue} className="w-full" size="lg">
            {isLast ? '✓ Complete Lesson' : 'Continue →'}
          </Button>
        </div>
      </div>
 
      {/* Voice indicator */}
      <AnimatePresence>
        {voiceActive && (
          <motion.div initial={{ y:-20, opacity:0 }} animate={{ y:0, opacity:1 }} exit={{ y:-20, opacity:0 }}
            className="fixed top-20 left-1/2 -translate-x-1/2 z-50 bg-brand text-white text-xs font-bold px-4 py-2 rounded-full shadow-brand flex items-center gap-2">
            <Volume2 size={14} className="animate-pulse" />
            Voice reading active — tap to stop
          </motion.div>
        )}
      </AnimatePresence>
 
      {/* Chat panel */}
      <AnimatePresence>
        {chatOpen && (
          <>
            <motion.div initial={{ opacity:0 }} animate={{ opacity:0.4 }} exit={{ opacity:0 }}
              className="fixed inset-0 bg-ink z-40" onClick={() => setChatOpen(false)} />
            <motion.div
              initial={{ y:'100%' }} animate={{ y:0 }} exit={{ y:'100%' }}
              transition={{ type:'spring', stiffness:300, damping:30 }}
              className="fixed inset-x-0 bottom-0 z-50 bg-surface rounded-t-3xl border-t border-border shadow-lift flex flex-col"
              style={{ height:'62vh', maxWidth:'640px', margin:'0 auto' }}>
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border flex-shrink-0">
                <LearniiBuddy size={36} expression="thinking" />
                <div className="flex-1">
                  <p className="font-heading font-bold text-ink text-sm">Ask Learniiebuddy</p>
                  <p className="text-[11px] text-inkLight">Ask anything about this lesson</p>
                </div>
                <button onClick={() => setChatOpen(false)} className="text-inkLight hover:text-ink"><X size={20}/></button>
              </div>
              <div className="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-3">
                {chatMsgs.map((msg, i) => (
                  <div key={i} className={clsx('flex gap-2', msg.role === 'user' ? 'flex-row-reverse' : 'flex-row')}>
                    {msg.role === 'buddy' && <div className="flex-shrink-0"><LearniiBuddy size={28} expression="thinking" /></div>}
                    <div className={clsx(
                      'max-w-[75%] rounded-2xl px-3 py-2 text-sm leading-relaxed',
                      msg.role === 'buddy' ? 'bg-surface2 text-inkMid rounded-tl-none' : 'bg-brand text-white rounded-tr-none',
                    )}>
                      {msg.text}
                    </div>
                  </div>
                ))}
                <div ref={chatEndRef} />
              </div>
              <form onSubmit={sendChat} className="flex gap-2 px-4 py-3 border-t border-border flex-shrink-0">
                <input value={chatInput} onChange={e => setChatInput(e.target.value)}
                  placeholder="Ask anything about this lesson..."
                  className="flex-1 h-10 rounded-xl px-3 bg-surface2 border border-border text-sm text-ink placeholder:text-inkLight focus:outline-none focus:border-brand transition-all" />
                <button type="submit" className="w-10 h-10 rounded-xl bg-brand text-white flex items-center justify-center flex-shrink-0 hover:bg-brandDark transition-colors">
                  <Send size={15} />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
