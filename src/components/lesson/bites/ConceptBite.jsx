export function ConceptBite({ content }) {
  return (
    <div className="bg-surface rounded-2xl p-4 shadow-card">
      <p className="font-heading font-black text-ink text-base mb-2">{content.title}</p>
      <p className="text-sm text-inkMid leading-relaxed whitespace-pre-line mb-3">{content.body}</p>
      {content.example && (
        <div className="bg-surface2 rounded-xl px-4 py-3 font-mono text-sm text-brand border-l-4 border-brand">{content.example}</div>
      )}
      {content.highlight && (
        <div className="mt-3 bg-amberLight border border-amber/30 rounded-xl px-4 py-2 text-sm font-bold text-amberDark font-mono">{content.highlight}</div>
      )}
    </div>
  )
}
