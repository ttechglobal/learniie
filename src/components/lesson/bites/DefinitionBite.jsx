// components/lesson/bites/DefinitionBite.jsx
export function DefinitionBite({ content }) {
  return (
    <div className="border-l-4 border-indigo bg-indigo/5 rounded-r-2xl p-4">
      <p className="text-xs font-bold uppercase tracking-wide text-indigo mb-1">
        Definition
      </p>
      <p className="font-bold text-textPrimary">{content.term}</p>
      <p className="text-sm text-textSecondary mt-1 leading-relaxed">{content.text}</p>
    </div>
  )
}
