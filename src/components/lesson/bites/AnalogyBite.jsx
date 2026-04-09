// components/lesson/bites/AnalogyBite.jsx
export function AnalogyBite({ content }) {
  return (
    <div className="bg-amber/10 border border-amber/20 rounded-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-amber mb-2">
        Real World
      </p>
      <p className="text-sm text-textPrimary leading-relaxed">{content.setup}</p>
      {content.nigerian_context && (
        <p className="text-sm text-textSecondary mt-2 leading-relaxed italic">
          🇳🇬 {content.nigerian_context}
        </p>
      )}
      {content.connection && (
        <p className="text-sm font-semibold text-textPrimary mt-3 pt-3 border-t border-amber/20">
          {content.connection}
        </p>
      )}
    </div>
  )
}
