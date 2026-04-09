import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
export function SummaryBite({ content }) {
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-card">
      <div className="flex items-center gap-3 mb-4">
        <LearniiBuddy size={60} expression={content.mascot_expression || 'proud'} />
        <div>
          <p className="text-xs font-bold text-inkLight uppercase tracking-widest mb-1">Lesson Complete</p>
          <p className="font-heading font-black text-ink text-base">{content.title || 'What we learned'}</p>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {content.points.map((point, i) => (
          <div key={i} className="flex gap-3 items-start">
            <span className="w-5 h-5 rounded-full bg-brand flex items-center justify-center flex-shrink-0 mt-0.5">
              <span className="text-white text-[10px] font-black">✓</span>
            </span>
            <p className="text-sm text-inkMid leading-relaxed">{point}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
