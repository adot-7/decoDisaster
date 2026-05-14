// pages/HomePage.jsx
// Replaced: import { useAuth } from '@clerk/clerk-react'
// With:     import { useAuth } from '../context/AuthContext'

import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'

const homeButtonClass =
  'rounded-full border border-[#2DFF9A]/40 bg-black/60 px-5 py-2.5 text-center text-sm uppercase text-[#2DFF9A] backdrop-blur-sm transition hover:bg-[#2DFF9A]/10 disabled:cursor-wait disabled:opacity-60 sm:px-7 sm:py-3'

const homeButtonStyle = {
  fontFamily: 'Orbitron, sans-serif',
  letterSpacing: '0.15em',
  textShadow: '0 0 8px rgba(45,255,154,0.7)',
}

export default function HomePage({ onNav, userRole, userAllowed, allowedLoading }) {
  
  const { isSignedIn, signOut } = useAuth()
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)

  useEffect(() => {
    if (window.localStorage.getItem('decoPrivacyModalShown') !== 'true') {
      setShowPrivacyModal(true)
    }
  }, [])

  const hidePrivacyModal = () => {
    window.localStorage.setItem('decoPrivacyModalShown', 'true')
    setShowPrivacyModal(false)
  }

  const goToPrivacy = () => {
    hidePrivacyModal()
    onNav('privacy')
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      {/* Hero background */}
      <img
        src="/backgrounds/home-hero.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/40" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-transparent h-32" />

      {showPrivacyModal && (
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/70 px-4 py-6">
          <div className="w-full max-w-md rounded-[2rem] border border-[#2DFF9A]/30 bg-[#071610]/95 p-8 text-slate-100 shadow-[0_0_80px_rgba(0,0,0,0.65)] backdrop-blur-xl">
            <h2 className="text-2xl font-black uppercase tracking-[0.18em] text-[#E8F6FF] sm:text-3xl">
              Privacy Notice
            </h2>
            <p className="mt-4 text-sm leading-7 text-slate-300">
              We use your data to verify access, save progress, and improve your experience. Please review our privacy policy before you continue.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={hidePrivacyModal}
                className="rounded-full border border-[#2DFF9A]/40 bg-black/60 px-5 py-3 text-sm uppercase text-[#2DFF9A] backdrop-blur-sm transition hover:bg-[#2DFF9A]/10"
                style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.15em' }}
              >
                Dismiss
              </button>
              <button
                type="button"
                onClick={goToPrivacy}
                className="rounded-full border border-[#2DFF9A]/40 bg-[#2DFF9A]/10 px-5 py-3 text-sm uppercase text-white transition hover:bg-[#2DFF9A]/20"
                style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.15em' }}
              >
                View Privacy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ACM logo */}
      <a href='https://usict.acm.org' target='_blank' rel='noreferrer'>
        <img
          src="/images/acm-logo.png"
          alt="ACM"
          className="absolute top-5 left-5 z-20 h-20 w-20 object-contain sm:h-28 sm:w-28 drop-shadow-lg"
        />
      </a>

      {/* College logo */}
      <a href='https://usict.acm.org' target='_blank' rel='noreferrer'>
        <img
          src="/images/college-logo.png"
          alt="College"
          className="absolute top-5 right-5 z-20 h-20 w-20 object-contain sm:h-28 sm:w-28 drop-shadow-lg"
        />
      </a>



      {/* Logo */}
      <div className="absolute inset-0 z-10 flex items-center justify-center pb-32 sm:pb-40">
        <img
          src="/images/DecoIcon.png"
          alt="Deco Disaster"
          className="w-[260px] sm:w-[380px] md:w-[480px] lg:w-[580px] object-contain animate-pulse-slow"
          style={{
            filter:
              'drop-shadow(0 0 60px rgba(255, 255, 255, 0.3)) drop-shadow(0 0 120px rgba(178, 133, 133, 0.2))',
          }}
        />
      </div>

      {/* 🔥 Navigation buttons */}
      <div className="absolute bottom-12 sm:bottom-16 md:bottom-20 left-0 right-0 z-20">
        <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center gap-3 px-6 sm:px-4 sm:gap-5">

          {/* START / REGISTER */}
          {allowedLoading && isSignedIn ? (
            <button
              disabled
              className={`w-full sm:w-auto ${homeButtonClass}`}
              style={homeButtonStyle}
            >
              CHECKING
            </button>
          ) : userAllowed && (
            <button
              onClick={() => onNav('round')}
              className={`w-full sm:w-auto ${homeButtonClass}`}
              style={homeButtonStyle}
            >
              START
            </button>
          ) }

          {/* ABOUT */}
          <button
            onClick={() => onNav('about')}
            className={`w-full sm:w-auto ${homeButtonClass}`}
            style={homeButtonStyle}
          >
            ABOUT
          </button>

          {/* LEADERBOARD */}
          <button
            onClick={() => onNav('leaderboard')}
            className={`w-full sm:w-auto ${homeButtonClass}`}
            style={homeButtonStyle}
          >
            LEADERBOARD
          </button>

          {/* 🔐 LOGIN / SIGNOUT */}
          {isSignedIn ? (
            <button
              onClick={() => signOut()}
              className={`w-full sm:w-auto ${homeButtonClass}`}
              style={homeButtonStyle}
            >
              SIGN OUT
            </button>
          ) : (
            <button
              onClick={() => onNav('signin')}
              className={`w-full sm:w-auto ${homeButtonClass}`}
              style={homeButtonStyle}
            >
              LOGIN
            </button>
          )}

          {/* 🛠 ADMIN */}
          {userRole === 'ORGANIZER' && (
            <button
              onClick={() => onNav('admin')}
              className={`w-full sm:w-auto ${homeButtonClass}`}
              style={homeButtonStyle}
            >
              ADMIN
            </button>
          )}

        </div>
      </div>
    </div>
  )
}