// stores/mascotStore.js
import { create } from 'zustand'

export const useMascotStore = create((set) => ({
  activeMascot: 'ade',       // 'ade' | 'emeka' | 'musa'
  expression:   'welcoming',
  dialogue:     '',
  isVisible:    true,

  setMascot:     (mascot)     => set({ activeMascot: mascot }),
  setExpression: (expression) => set({ expression }),
  setDialogue:   (dialogue)   => set({ dialogue }),
  setVisible:    (isVisible)  => set({ isVisible }),
}))
