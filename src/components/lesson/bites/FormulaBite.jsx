// components/lesson/bites/FormulaBite.jsx
export function FormulaBite({ content }) {
  return (
    <div className="bg-gray-900 rounded-2xl p-5">
      <p className="text-xs font-bold uppercase tracking-wide text-amber mb-3">
        Formula
      </p>
      <p className="font-mono text-xl text-white text-center mb-4 leading-relaxed">
        {content.expression}
      </p>
      {content.variables && content.variables.length > 0 && (
        <div className="flex flex-col gap-1.5 border-t border-white/10 pt-3">
          {content.variables.map((v) => (
            <div key={v.symbol} className="flex gap-3 text-sm">
              <span className="font-mono text-amber font-bold w-8 flex-shrink-0">{v.symbol}</span>
              <span className="text-gray-300">{v.meaning}</span>
            </div>
          ))}
        </div>
      )}
      {content.notes && (
        <p className="text-xs text-gray-400 mt-3">{content.notes}</p>
      )}
    </div>
  )
}
