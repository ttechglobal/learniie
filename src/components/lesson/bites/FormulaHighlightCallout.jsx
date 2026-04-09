// components/lesson/bites/FormulaHighlightCallout.jsx
export function FormulaHighlightCallout({ content }) {
  return (
    <div className="border-l-4 border-amber bg-amber/10 rounded-r-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-amber mb-2">
        Formula
      </p>
      <p className="font-mono text-lg text-textPrimary">{content.expression}</p>
      {content.note && (
        <p className="text-xs text-textSecondary mt-2">{content.note}</p>
      )}
    </div>
  )
}
