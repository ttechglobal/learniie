'use client'
import { AnimatePresence, motion } from 'motion/react'
import { useMascot } from './MascotProvider'

const AVATARS = {
  ade:   { bg: '#5046E5', emoji: '👦🏾' },
  emeka: { bg: '#F05A28', emoji: '👧🏾' },
  musa:  { bg: '#0FA968', emoji: '👦🏽' },
}

const EXPRESSION_OVERLAY = {
  welcoming:'😊', celebrating:'🎉', encouraging:'💪',
  motivating:'🔥', focused:'🎯', disappointed:'😔', thinking:'🤔',
}

export function MascotDisplay({ size=80, showDialogue=true }) {
  const { activeMascot, expression, dialogue, isVisible } = useMascot()
  const avatar = AVATARS[activeMascot] || AVATARS.ade

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity:0, scale:0.7, y:12 }}
          animate={{ opacity:1, scale:1, y:0 }}
          exit={{ opacity:0, scale:0.7, y:12 }}
          transition={{ type:'spring', stiffness:320, damping:28 }}
          className="flex flex-col items-end gap-2"
        >
          {showDialogue && dialogue && (
            <motion.div
              initial={{ opacity:0, x:8 }}
              animate={{ opacity:1, x:0 }}
              className="mr-2 max-w-[160px] bg-white rounded-2xl rounded-br-none px-3 py-2 shadow-card border border-border text-xs font-semibold text-textPrimary"
            >
              {dialogue}
            </motion.div>
          )}
          <motion.div
            animate={{ y:[0,-5,0] }}
            transition={{ duration:3, repeat:Infinity, ease:'easeInOut' }}
            className="relative flex items-center justify-center rounded-full shadow-green select-none"
            style={{ width:size, height:size, background:avatar.bg }}
          >
            <span style={{ fontSize: size * 0.52 }}>{avatar.emoji}</span>
            <span
              className="absolute -bottom-1 -right-1 flex items-center justify-center rounded-full bg-white shadow"
              style={{ fontSize: size * 0.28, width: size * 0.42, height: size * 0.42 }}
            >
              {EXPRESSION_OVERLAY[expression]}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}