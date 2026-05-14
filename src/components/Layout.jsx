import { AnimatePresence, motion } from 'framer-motion'

export default function Layout({ children, page, onNav, userRole, roundIntroActive }) {
  const isRound = page === 'round'
  const isHome = page === 'home' || page === 'register' || page === 'privacy'
  const isEnd = page === 'end'

  return (
    <motion.div
      className="min-h-screen text-slate-100"
      animate={roundIntroActive ? { x: [0, -12, 10, -8, 7, -4, 0] } : { x: 0 }}
      transition={roundIntroActive ? { duration: 0.65, ease: 'easeInOut' } : { duration: 0.2 }}
    >
      {!isRound && !isHome && !isEnd && (
        <>
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(45,255,154,0.08),transparent_24%),radial-gradient(circle_at_left,rgba(45,255,154,0.05),transparent_28%),linear-gradient(180deg,#000000_0%,#0B1F18_40%,#000000_100%)]" />
          <div className="fixed inset-0 -z-10 bg-[linear-gradient(rgba(45,255,154,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(45,255,154,0.02)_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:36px_36px] opacity-20" />
        </>
      )}

      {!isRound && !isHome && !isEnd && (
        <div className="fixed left-4 top-4 z-50 sm:left-6 sm:top-6">
          <button
            onClick={() => onNav('home')}
            className="rounded-full border border-[#2DFF9A]/40 bg-black/60 px-5 py-2 text-sm text-[#2DFF9A] backdrop-blur-sm transition hover:bg-[#2DFF9A]/10"
            style={{
              fontFamily: 'Orbitron, sans-serif',
              letterSpacing: '0.15em',
              textShadow: '0 0 8px rgba(45,255,154,0.7)',
            }}
          >
            RETURN
          </button>
        </div>
      )}

      <AnimatePresence mode="wait">
        <motion.main
          key={page}
          className={isRound || isEnd ? 'w-full px-0 pb-0 pt-0' : isHome ? '' : 'mx-auto w-full max-w-7xl px-4 pb-8 pt-24 sm:px-6'}
          initial={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: -8, filter: 'blur(6px)' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.main>
      </AnimatePresence>

      <AnimatePresence>
        {roundIntroActive && (
          <motion.div
            className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, filter: 'blur(10px)' }}
            transition={{ duration: 0.18 }}
          >
            <motion.div
              className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(45,255,154,0.16),transparent_34%),radial-gradient(circle_at_center,rgba(255,0,0,0.18),transparent_58%)]"
              animate={{ scale: [1, 1.18, 1.05], opacity: [0.65, 1, 0.75] }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            />
            <motion.div
              className="relative px-6 text-center text-2xl font-black uppercase tracking-[0.22em] text-[#2DFF9A] drop-shadow-[0_0_28px_rgba(45,255,154,0.9)] sm:text-4xl md:text-5xl"
              style={{ fontFamily: 'Orbitron, sans-serif' }}
              initial={{ opacity: 0, scale: 0.18, filter: 'blur(14px)' }}
              animate={{ opacity: [0, 1, 1], scale: [0.18, 1.12, 1], filter: ['blur(14px)', 'blur(0px)', 'blur(0px)'] }}
              exit={{ opacity: 0, scale: 1.35, filter: 'blur(10px)' }}
              transition={{ duration: 1.15, ease: [0.16, 1, 0.3, 1] }}
            >
              STEP FORWARD....IF YOU DARE
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
