// components/mascot/MascotProvider.jsx
'use client'

import { createContext, useContext, useState, useCallback } from 'react'

const MascotContext = createContext(null)

// Maps a trigger event type to the correct expression
const TRIGGER_TO_EXPRESSION = {
  app_open:        'welcoming',
  lesson_complete: 'encouraging',
  perfect_score:   'celebrating',
  streak_milestone:'celebrating',
  wrong_repeated:  'motivating',
  mock_prompt:     'focused',
  streak_broken:   'disappointed',
  loading:         'thinking',
  new_topic:       'focused',
  xp_milestone:    'celebrating',
}

// Triggers that stay visible until dismissed
const PERSISTENT_TRIGGERS = ['mock_prompt', 'app_open']

export function MascotProvider({ children, defaultMascot = 'ade' }) {
  const [activeMascot, setActiveMascot] = useState(defaultMascot)
  const [expression,   setExpression]   = useState('welcoming')
  const [dialogue,     setDialogue]     = useState('')
  const [isVisible,    setIsVisible]    = useState(true)

  const dispatch = useCallback(({ type, dialogueOverride }) => {
    const newExpression = TRIGGER_TO_EXPRESSION[type] || 'thinking'
    setExpression(newExpression)
    if (dialogueOverride) setDialogue(dialogueOverride)
    setIsVisible(true)

    // Auto-hide after 4 seconds for non-persistent triggers
    if (!PERSISTENT_TRIGGERS.includes(type)) {
      setTimeout(() => setIsVisible(false), 4000)
    }
  }, [])

  return (
    <MascotContext.Provider
      value={{ activeMascot, expression, dialogue, isVisible, dispatch, setActiveMascot }}
    >
      {children}
    </MascotContext.Provider>
  )
}

export function useMascot() {
  const context = useContext(MascotContext)
  if (!context) throw new Error('useMascot must be used within MascotProvider')
  return context
}
