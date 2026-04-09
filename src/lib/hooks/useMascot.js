// lib/hooks/useMascot.js
'use client'

import { useMascot as useMascotContext } from '@/components/mascot/MascotProvider'

// Re-export for convenience — import from here instead of from the provider directly
export { useMascotContext as useMascot }
