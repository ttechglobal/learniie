// components/lesson/bites/KeyTermsBite.jsx
export function KeyTermsBite({ content }) {
  return (
    <div className="bg-surface border border-border rounded-2xl overflow-hidden">
      <p className="text-xs font-bold uppercase tracking-wide text-textMuted px-4 py-2 bg-surfaceSecondary">
        Key Terms
      </p>
      <div className="divide-y divide-border">
        {content.terms.map((t, i) => (
          <div key={i} className="flex gap-4 px-4 py-3">
            <p className="font-bold text-sm text-textPrimary w-32 flex-shrink-0">{t.term}</p>
            <p className="text-sm text-textSecondary leading-relaxed">{t.definition}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
