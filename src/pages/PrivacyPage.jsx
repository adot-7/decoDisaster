export default function PrivacyPage({ onNav }) {
  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-black">
      <img
        src="/backgrounds/home-hero.png"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/30" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(45,255,154,0.12),transparent_26%),radial-gradient(circle_at_left,rgba(45,255,154,0.08),transparent_24%)] opacity-80" />

      <main className="relative mx-auto flex min-h-screen w-full max-w-4xl items-center px-6 py-12 text-slate-100 sm:px-8">
        <div className="w-full rounded-[1.5rem] border border-[#2DFF9A]/20 bg-black/65 p-6 shadow-[0_0_60px_rgba(0,0,0,0.6)] backdrop-blur-xl sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1
                className="text-4xl font-black uppercase tracking-[0.24em] text-[#E8F6FF] sm:text-5xl"
                style={{ fontFamily: 'Oxanium, sans-serif' }}
              >
                Privacy Policy
              </h1>

              <p className="mt-3 max-w-2xl text-sm text-slate-300 sm:text-base">
                We respect your privacy. This page explains how your data is used while using Deco Disaster.
              </p>
            </div>
          </div>

          <div className="mt-10 space-y-8 text-slate-200">
            <section>
              <h2
                className="text-2xl font-semibold text-[#A5FFD0]"
                style={{ fontFamily: 'Oxanium, sans-serif' }}
              >
                What we collect
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                We collect only the information required to provide the experience,
                including authentication details, game progress, and answer submissions.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-semibold text-[#A5FFD0]"
                style={{ fontFamily: 'Oxanium, sans-serif' }}
              >
                How we use it
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                Your data is used to verify access, save your round progress,
                and personalize the experience. We do not sell your data.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-semibold text-[#A5FFD0]"
                style={{ fontFamily: 'Oxanium, sans-serif' }}
              >
                Sharing and security
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                We do not share your personal data with third parties except where
                required for authentication or to comply with legal requirements.
              </p>
            </section>

            <section>
              <h2
                className="text-2xl font-semibold text-[#A5FFD0]"
                style={{ fontFamily: 'Oxanium, sans-serif' }}
              >
                Your choices
              </h2>

              <p className="mt-3 text-sm leading-7 text-slate-300">
                You can choose not to sign in or participate, and your data will
                only be stored for the duration of the game session and user account access.
              </p>
            </section>
          </div>

          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => onNav('home')}
              className="rounded-full border border-[#2DFF9A]/40 bg-black/70 px-6 py-3 text-sm uppercase text-[#2DFF9A] backdrop-blur-sm transition hover:bg-[#2DFF9A]/10"
              style={{
                fontFamily: 'Orbitron, sans-serif',
                letterSpacing: '0.15em',
              }}
            >
              Return
            </button>
          </div>
        </div>
      </main>
    </div>
  )
}