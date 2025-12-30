import { motion, useMotionValue } from "framer-motion"

export default function MagneticButton({ children, className, ...props }) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  function handleMove(e) {
    const rect = e.currentTarget.getBoundingClientRect()
    const dx = e.clientX - rect.left - rect.width / 2
    const dy = e.clientY - rect.top - rect.height / 2
    x.set(dx * 0.25)
    y.set(dy * 0.25)
  }

  function handleLeave() {
    x.set(0)
    y.set(0)
  }

  return (
    <motion.button
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 12 }}
      className={className}
      {...props}
    >
      {children}
    </motion.button>
  )
}