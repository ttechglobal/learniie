'use client'
import { useState } from 'react'
import { MOCK_PRACTICE_QUESTIONS, MOCK_CHALLENGE } from '@/lib/mock/data'
import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { clsx } from 'clsx'
 
export default function PracticePage() {
  const [tab,        setTab]        = useState('practice')
  const [started,    setStarted]    = useState(false)
  const [idx,        setIdx]        = useState(0)
  const [selected,   setSelected]   = useState(null)
  const [showResult, setShowResult] = useState(false)
  const [score,      setScore]      = useState(0)
  const [finished,   setFinished]   = useState(false)
 
  const questions = MOCK_PRACTICE_QUESTIONS
  const q         = questions[idx]
  const pct       = Math.round((score / questions.length) * 100)
 
  function confirm() {
    if (selected === null) return
    if (selected === q.correct_index) setScore(s => s+1)
    setShowResult(true)
  }
  function next() {
    setShowResult(false); setSelected(null)
    if (idx+1 >= questions.length) setFinished(true)
    else setIdx(i => i+1)
  }
  function restart() {
    setStarted(false); setIdx(0); setSelected(null)
    setShowResult(false); setScore(0); setFinished(false)
  }
 
  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="font-heading text-2xl font-black text-ink mb-1">Practice</h1>
 
      <div className="flex gap-2 mb-5">
        {[{ id:'practice', label:'Past Questions' }, { id:'challenge', label:'Challenge Questions' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={clsx('px-4 py-2 rounded-full text-sm font-bold transition-all',
              tab === t.id ? 'bg-brand text-white shadow-brand' : 'bg-surface border border-border text-inkMid hover:border-brand/30')}>
            {t.label}
          </button>
        ))}
      </div>
 
      {/* ── CHALLENGE TAB ── */}
      {tab === 'challenge' && (
        <div>
          <div className="rounded-3xl overflow-hidden mb-4" style={{ background:'linear-gradient(135deg, #1A2A4A 0%, #0D1A30 100%)' }}>
            <div className="px-5 pt-5 pb-3 flex items-center gap-4">
              <div className="animate-bounce-gentle flex-shrink-0"><LearniiBuddy size={80} expression="question" /></div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color:'rgba(245,166,35,0.7)' }}>Challenge Question</p>
                <p className="font-heading font-black text-white text-base leading-tight">{MOCK_CHALLENGE.title}</p>
                <p className="text-white/40 text-xs mt-1">Topic: {MOCK_CHALLENGE.topic}</p>
              </div>
            </div>
            <div className="px-5 pb-5">
              <div className="bg-white/8 rounded-2xl p-4 mb-3">
                <p className="text-white/90 text-sm leading-relaxed">{MOCK_CHALLENGE.scenario}</p>
              </div>
              <div className="flex items-start gap-2 bg-amber/10 rounded-xl px-3 py-2.5 border border-amber/20 mb-4">
                <span className="text-amber text-sm flex-shrink-0">💡</span>
                <p className="text-amber/90 text-xs leading-relaxed"><span className="font-bold">Hint: </span>{MOCK_CHALLENGE.hint}</p>
              </div>
              <div className="bg-white/8 rounded-2xl p-4">
                <p className="text-white/50 text-xs font-bold uppercase tracking-wide mb-2">Your working</p>
                <textarea placeholder="Show your working here..." rows={4}
                  className="w-full bg-transparent text-white/90 text-sm resize-none focus:outline-none placeholder:text-white/25" />
              </div>
            </div>
          </div>
          <p className="text-xs text-inkLight text-center">More challenge questions unlock as you complete topics.</p>
        </div>
      )}
 
      {/* ── PRACTICE: start screen ── */}
      {tab === 'practice' && !started && !finished && (
        <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
          <div className="px-4 py-3 bg-surface2 border-b border-border flex items-center justify-between">
            <p className="font-heading font-bold text-ink">Quadratic Equations</p>
            <Badge variant="default">{questions.length} questions</Badge>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-3 mb-5">
              <LearniiBuddy size={64} expression="encouraging" />
              <p className="text-sm text-inkMid leading-relaxed">Test yourself on past WAEC, JAMB and NECO questions. Learniiebuddy will guide you through each one!</p>
            </div>
            <div className="grid grid-cols-3 gap-2 mb-5">
              {[['Easy','#22C55E'],['Medium','#F5A623'],['Hard','#F04E37']].map(([d,c]) => (
                <div key={d} className="bg-surface2 rounded-xl py-3 text-center">
                  <div className="w-2.5 h-2.5 rounded-full mx-auto mb-1.5" style={{ background:c }} />
                  <p className="font-bold text-xs text-inkMid">{d}</p>
                </div>
              ))}
            </div>
            <Button onClick={() => setStarted(true)} className="w-full">Start Practice →</Button>
          </div>
        </div>
      )}
 
      {/* ── PRACTICE: question ── */}
      {tab === 'practice' && started && !finished && (
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <p className="font-heading font-bold text-ink">Q{idx+1} <span className="text-inkLight font-normal">of {questions.length}</span></p>
            <div className="flex items-center gap-2">
              <Badge variant={q.difficulty === 'easy' ? 'easy' : q.difficulty === 'medium' ? 'medium' : 'hard'}>{q.difficulty}</Badge>
              <div className="flex items-center gap-1 bg-brandLight rounded-full px-2.5 py-1">
                <span className="font-black text-brand text-xs">{score}</span>
                <span className="text-brand/60 text-xs">correct</span>
              </div>
            </div>
          </div>
          <div className="h-1.5 bg-surface2 rounded-full overflow-hidden">
            <div className="h-full bg-brand rounded-full transition-all duration-500" style={{ width:`${(idx/questions.length)*100}%` }} />
          </div>
 
          <div className="bg-surface rounded-2xl shadow-card overflow-hidden">
            {q.source_label && (
              <div className="px-4 py-2 bg-surface2 border-b border-border">
                <p className="text-[11px] font-bold text-inkLight uppercase tracking-widest">{q.source_label}</p>
              </div>
            )}
            <div className="p-4">
              <p className="font-semibold text-ink mb-4 leading-relaxed">{q.question}</p>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, i) => {
                  const isSel  = selected === i
                  const isCorr = i === q.correct_index
                  return (
                    <button key={i} onClick={() => !showResult && setSelected(i)} disabled={showResult}
                      className={clsx('w-full text-left px-4 py-3 rounded-xl border-[1.5px] text-sm font-medium transition-all',
                        !showResult && !isSel  && 'border-border hover:border-brand/40 hover:bg-brandLight/30',
                        !showResult &&  isSel  && 'border-brand bg-brandLight',
                        showResult && isCorr                && 'border-brand bg-brandLight text-brand font-bold',
                        showResult && isSel && !isCorr     && 'border-red-400 bg-red-50 text-red-700',
                        showResult && !isSel && !isCorr    && 'border-border opacity-40',
                      )}>
                      <span className="flex items-center gap-3">
                        <span className={clsx('w-6 h-6 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0',
                          !showResult && isSel ? 'bg-brand text-white' : 'bg-surface2 text-inkLight',
                          showResult && isCorr ? 'bg-brand text-white' : '',
                          showResult && isSel && !isCorr ? 'bg-red-500 text-white' : '',
                        )}>
                          {showResult && isCorr ? '✓' : showResult && isSel && !isCorr ? '✗' : String.fromCharCode(65+i)}
                        </span>
                        {opt}
                      </span>
                    </button>
                  )
                })}
              </div>
              {showResult && (
                <div className={clsx('mt-4 rounded-xl p-3 flex gap-3 items-start', selected === q.correct_index ? 'bg-brandLight' : 'bg-red-50')}>
                  <LearniiBuddy size={36} expression={selected === q.correct_index ? 'celebrating' : 'encouraging'} />
                  <div>
                    <p className={clsx('font-bold text-sm mb-0.5', selected === q.correct_index ? 'text-brand' : 'text-red-700')}>
                      {selected === q.correct_index ? 'Correct! 🎉' : 'Not quite — here\'s why:'}
                    </p>
                    <p className={clsx('text-xs leading-relaxed', selected === q.correct_index ? 'text-brand/80' : 'text-red-600')}>{q.explanation}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
 
          {!showResult
            ? <Button disabled={selected === null} onClick={confirm} className="w-full">Confirm Answer</Button>
            : <Button onClick={next} className="w-full">{idx+1 >= questions.length ? 'See Results' : 'Next Question →'}</Button>
          }
        </div>
      )}
 
      {/* ── PRACTICE: results ── */}
      {tab === 'practice' && finished && (
        <div className="flex flex-col items-center text-center py-8">
          <LearniiBuddy size={120} expression={pct>=70?'celebrating':'encouraging'} className="animate-bounce-gentle mb-4" />
          <h2 className="font-heading text-5xl font-black text-ink mb-1">{pct}%</h2>
          <p className="text-inkMid mb-1">{score} of {questions.length} correct</p>
          <p className="text-sm text-inkLight mb-8">{pct>=70 ? 'Excellent work! You are ready for this topic.' : 'Keep practising — you are making progress!'}</p>
          <div className="flex flex-col gap-3 w-full max-w-xs">
            <Button onClick={restart} className="w-full">Try Again</Button>
            <Button variant="secondary" onClick={() => { setFinished(false); setStarted(false) }} className="w-full">Back to Practice</Button>
          </div>
        </div>
      )}
    </div>
  )
}
