// pages/RegisterPage.jsx
// Copy of HomePage.jsx with only REGISTER button

const homeButtonClass =
  'rounded-full border border-[#2DFF9A]/40 bg-black/60 px-5 py-2.5 text-center text-sm uppercase text-[#2DFF9A] backdrop-blur-sm transition hover:bg-[#2DFF9A]/10 disabled:cursor-wait disabled:opacity-60 sm:px-7 sm:py-3'

const homeButtonStyle = {
  fontFamily: 'Orbitron, sans-serif',
  letterSpacing: '0.15em',
  textShadow: '0 0 8px rgba(45,255,154,0.7)',
}

export default function RegisterPage({ onNav }) {
  
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

          {/* REGISTER */}
          <a
            href="https://example.com"
            target="_blank"
            rel="noopener noreferrer"
            className={`w-full sm:w-auto ${homeButtonClass}`}
            style={homeButtonStyle}
          >
            REGISTER
          </a>

        </div>
      </div>
    </div>
  )
}