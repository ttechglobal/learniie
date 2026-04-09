// components/mascot/MascotTriggers.jsx
// Helper component — wrap any element to trigger a mascot event on mount or on click.
'use client'

import { useEffect } from 'react'
import { useMascot } from './MascotProvider'

/**
 * Fires a mascot trigger when this component mounts.
 * Useful for page-level events like opening a new topic.
 *
 * Usage:
 *   <MascotOnMount type="new_topic" dialogue="Let's go!" />
 */
export function MascotOnMount({ type, dialogue }) {
  const { dispatch } = useMascot()
  useEffect(() => {
    dispatch({ type, dialogueOverride: dialogue })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return null
}
