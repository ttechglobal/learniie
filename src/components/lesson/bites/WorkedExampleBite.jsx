'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { CheckCircle } from 'lucide-react'
export function WorkedExampleBite({ content }) {
  const [revealed, setRevealed] = useState(1)
  const total = content.steps.length
  const done  = revealed >= total
  return (
    <div className="bg-surface rounded-2xl overflow-hidden shadow-card">
      <div className="px-4 py-3 bg-surface2 border-b border-border">
        <p className="text-xs font-bold text-inkLight uppercase tracking-widest">Worked Example</p>
      </div>
      <div className="p-4">
        <p className="font-semibold text-ink mb-4 leading-relaxed">{content.problem}</p>
        <div className="flex flex-col gap-2 mb-4">
          {content.steps.slice(0, revealed).map((step, i) => (
            <div key={i} className="flex gap-3 items-start animate-fade-up">
              <span className="w-6 h-6 rounded-full bg-brandLight text-brand text-xs font-black flex items-center justify-center flex-shrink-0 mt-0.5">{i+1}</span>
              <p className="text-sm text-inkMid leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
        {done ? (
          <div className="flex items-center gap-3 bg-brandLight border border-brand/20 rounded-xl p-3 animate-scale-in">
            <CheckCircle size={18} className="text-brand flex-shrink-0" />
            <div>
              <p className="text-xs font-bold text-brand uppercase tracking-wide mb-0.5">Answer</p>
              <p className="font-heading font-black text-brand">{content.answer}</p>
            </div>
          </div>
        ) : (
          <Button variant="secondary" size="sm" onClick={() => setRevealed(r => Math.min(r+1,total))} className="w-full">
            Next Step →
          </Button>
        )}
      </div>
    </div>
  )
}
