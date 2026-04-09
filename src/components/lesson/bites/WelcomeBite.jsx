import { LearniiBuddy } from '@/components/mascot/LearniiBuddy'
export function WelcomeBite({ content }) {
  return (
    <div className="flex flex-col items-center text-center py-4 gap-4">
      <div className="animate-bounce-gentle">
        <LearniiBuddy size={100} expression={content.mascot_expression || 'excited'} />
      </div>
      <div className="bg-amberLight border border-amber/30 rounded-3xl rounded-tl-none px-5 py-4 max-w-xs">
        <p className="font-heading font-black text-amberDark text-lg mb-1">{content.greeting}</p>
        <p className="text-inkMid text-sm leading-relaxed">{content.message}</p>
      </div>
    </div>
  )
}
