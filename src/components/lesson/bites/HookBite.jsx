export function HookBite({ content }) {
  return (
    <div className="relative overflow-hidden rounded-2xl px-5 py-5" style={{ background:'linear-gradient(135deg, #0D5C2E 0%, #093D1E 100%)' }}>
      <div className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-10" style={{ background:'#F5A623', transform:'translate(30%,-30%)' }}/>
      <p className="text-xs font-bold text-white/50 uppercase tracking-widest mb-3">🤔 Think about this</p>
      <p className="font-heading font-black text-white text-lg leading-snug mb-3">{content.question}</p>
      {content.teaser && <p className="text-sm text-white/60 italic">{content.teaser}</p>}
    </div>
  )
}
