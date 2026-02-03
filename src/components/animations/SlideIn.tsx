'use client'

import { motion, useInView } from 'framer-motion'
import { useRef, ReactNode } from 'react'

interface SlideInProps {
  children: ReactNode
  delay?: number
  direction?: 'left' | 'right'
  className?: string
}

export function SlideIn({
  children,
  delay = 0,
  direction = 'left',
  className
}: SlideInProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-50px' })

  const initial = direction === 'left' ? { x: -100 } : { x: 100 }

  return (
    <motion.div
      ref={ref}
      initial={{ ...initial, opacity: 0 }}
      animate={isInView ? { x: 0, opacity: 1 } : {}}
      transition={{
        duration: 0.5,
        delay,
        ease: [0.22, 1, 0.36, 1]
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
