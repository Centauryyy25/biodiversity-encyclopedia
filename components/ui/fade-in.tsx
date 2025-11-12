"use client"

import { motion } from 'framer-motion'
import type { ReactNode } from 'react'

export function FadeIn({ children, className = '', delay = 0, y = 8 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeInOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function FadeInOnView({ children, className = '', delay = 0, y = 8 }: { children: ReactNode; className?: string; delay?: number; y?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.3, ease: 'easeInOut', delay }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

