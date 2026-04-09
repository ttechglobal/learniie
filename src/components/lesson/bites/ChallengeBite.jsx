import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
export function ChallengeBite({ content }) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background:'linear-gradient(135deg, #1A2A4A 0%, #0D1A30 100%)' }}>
      <div className="px-4 pt-4 pb-2 flex items-center gap-3">
        <LearniiBuddy size={56} expression="question" />
        <div>
          <p className="text-xs font-bold uppercase tracking-widest" style={{ color:'rgba(245,166,35,0.7)' }}>Challenge Question</p>
          <p className="font-heading font-black text-white text-sm leading-tight">{content.title}</p>
        </div>
      </div>
      <div className="px-4 pb-4">
        <div className="bg-white/8 rounded-xl p-4 mb-3">
          <p className="text-white/90 text-sm leading-relaxed">{content.scenario}</p>
        </div>
        {content.hint && (
          <div className="flex items-start gap-2 bg-amber/10 rounded-xl px-3 py-2.5 border border-amber/20">
            <span className="text-amber text-sm">💡</span>
            <p className="text-amber/90 text-xs leading-relaxed"><span className="font-bold">Hint: </span>{content.hint}</p>
          </div>
        )}
      </div>
    </div>
  )
}
