// pages/SignInPage.jsx
// Replaces Clerk's <SignIn> with a Google OAuth redirect button

export default function SignInPage({ authError }) {
  const handleGoogleLogin = () => {
    // Redirects to your backend which starts the OAuth flow
    const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
    window.location.href = backendUrl + '/api/auth/login'
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[300px] sm:w-[400px] md:w-[600px] h-[300px] sm:h-[400px] md:h-[600px] bg-[#2DFF9A]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-[200px] sm:w-[300px] md:w-[400px] h-[200px] sm:h-[300px] md:h-[400px] bg-[#2DFF9A]/3 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center mb-6 sm:mb-8 fade-up">
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-display font-bold text-white tracking-tight">
          Deco<span className="text-[#2DFF9A]">Disaster</span>
        </h1>
        <p className="text-[#6b6b7a] mt-2 text-sm sm:text-base">Sign in to DecoDisaster</p>
      </div>

      <div className="relative z-10 fade-up-1 w-full max-w-md">
        <div className="rounded-2xl border border-[#2DFF9A]/20 bg-black/60 backdrop-blur-md p-8 flex flex-col items-center gap-6">
          <p className="text-slate-400 text-sm text-center">
            Sign in with your Google account to continue.
            Only registered participants may access the quiz.
          </p>

          <button
            onClick={handleGoogleLogin}
            className="flex items-center gap-3 w-full justify-center rounded-full border border-white/20 bg-white/5 px-6 py-3 text-sm text-white transition hover:bg-white/10 hover:border-white/40"
            style={{ fontFamily: 'Orbitron, sans-serif', letterSpacing: '0.1em' }}
          >
            {/* Google "G" icon */}
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
              <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            CONTINUE WITH GOOGLE
          </button>
        </div>

        {/* Error from OAuth redirect (e.g. ?error=oauth_failed in URL) */}
        {authError && (
          <div className="mt-4 rounded-2xl border border-red-400/25 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            {authError}
          </div>
        )}
      </div>
    </div>
  )
}