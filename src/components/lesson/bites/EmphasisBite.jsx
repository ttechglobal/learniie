const STYLES = {
  key_rule: { bg:'bg-brand', text:'text-white',    label:'Key Rule', emoji:'📌', dark:true },
  tip:      { bg:'bg-amberLight', text:'text-amberDark', label:'Tip',      emoji:'💡', dark:false },
  warning:  { bg:'bg-red-50', text:'text-red-700', label:'Watch out', emoji:'⚠️', dark:false },
  recap:    { bg:'bg-surface2', text:'text-inkMid', label:'Recap',    emoji:'🔄', dark:false },
}
export function EmphasisBite({ content }) {
  const style = STYLES[content.type] || STYLES.tip
  return (
    <div className={`${style.bg} rounded-2xl p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-base">{style.emoji}</span>
        <p className={`text-xs font-bold uppercase tracking-widest ${style.dark ? 'text-white/60' : 'text-inkLight'}`}>{style.label}</p>
      </div>
      <p className={`font-heading font-black text-base mb-1 ${style.text}`}>{content.title}</p>
      <p className={`text-sm leading-relaxed ${style.dark ? 'text-white/80' : 'text-inkMid'}`}>{content.body}</p>
    </div>
  )
}
