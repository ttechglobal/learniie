// lib/utils/cn.js
// Utility to safely merge Tailwind class names
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
