import { useCallback, useEffect, useMemo, useState } from 'react'
import { useAuth } from './context/AuthContext'
import { api } from '../api'

import Layout from './components/Layout'
import SignInPage from './pages/SignInPage'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import RegistrationPage from './pages/RegistrationPage'
import RegisterPage from './pages/RegisterPage'
import PrivacyPage from './pages/PrivacyPage'
import RoundPage from './pages/RoundPage'
import WaitingPage from './pages/WaitingPage'
import LeaderboardPage from './pages/LeaderboardPage'
import EndPage from './pages/EndPage'
import AdminPage from './pages/AdminPage'
import RotateOverlay from './components/RotateOverlay'
import CrackTransitionOverlay from './components/CrackTransitionOverlay'

const DEFAULT_PAGE = 'home'
const ROUTES = new Set(['home', 'about', 'registration', 'register', 'privacy', 'signin', 'round', 'waiting', 'leaderboard', 'end', 'admin'])

function pageFromPathname(pathname) {
  const page = pathname.replace(/^\/+|\/+$/g, '').split('/')[0] || DEFAULT_PAGE
  return ROUTES.has(page) ? page : DEFAULT_PAGE
}

function pathForPage(page) {
  return page === DEFAULT_PAGE ? '/' : `/${page}`
}

function getCurrentPage() {
  const hashPage = window.location.hash.replace('#', '').trim()
  if (hashPage) {
    return ROUTES.has(hashPage) ? hashPage : DEFAULT_PAGE
  }

  return pageFromPathname(window.location.pathname)
}

function AuthenticatedApp() {
  const { user, loaded, isSignedIn, signOut, refetch } = useAuth()
  const [page, setPage] = useState(getCurrentPage)
  const [userRole, setUserRole] = useState(null)
  const [authError, setAuthError] = useState(null)
  const [authSynced, setAuthSynced] = useState(false)
  const [userAllowed, setUserAllowed] = useState(false)
  const [allowedLoading, setAllowedLoading] = useState(false)
  const [roundIntroActive, setRoundIntroActive] = useState(false)
  const [toast, setToast] = useState(null)
  const [transitionToWaiting, setTransitionToWaiting] = useState(false)

  useEffect(() => {
    const hashPage = window.location.hash.replace('#', '').trim()
    if (hashPage) {
      const normalizedPage = ROUTES.has(hashPage) ? hashPage : DEFAULT_PAGE
      window.history.replaceState({}, '', pathForPage(normalizedPage))
      setPage(normalizedPage)
    }

    const sync = () => setPage(pageFromPathname(window.location.pathname))
    window.addEventListener('popstate', sync)
    return () => window.removeEventListener('popstate', sync)
  }, [])

  // Auto-dismiss toast after 4 seconds
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [toast])

  useEffect(() => {
    let cancelled = false

    const syncUser = async () => {
      if (!loaded) {
        return
      }

      if (!isSignedIn) {
        setUserRole(null)
        setUserAllowed(false)
        setAllowedLoading(false)
        setAuthError(null)
        setAuthSynced(false)
        return
      }

      setAuthSynced(false)
      setAuthError(null)
      setAllowedLoading(true)

      try {
        const [allowed] = await Promise.all([
          api('/api/auth/allowed', {}),
        ])

        if (cancelled) return

        // If user is not allowed, logout and show toast
        if (!allowed?.allowed) {
          setToast({ message: 'User not authorized', type: 'error' })
          await signOut()
          setUserRole(null)
          setUserAllowed(false)
          setAuthSynced(true)
          setAllowedLoading(false)
          return
        }

        setUserRole(user?.role || null)
        setUserAllowed(Boolean(allowed?.allowed))
        setAuthSynced(true)
        setAllowedLoading(false)

        if (page === 'signin') {
          window.history.replaceState({}, '', pathForPage(DEFAULT_PAGE))
          setPage(DEFAULT_PAGE)
        }
      } catch (err) {
        if (cancelled) return

        setAuthError(err?.data?.message || err?.message || 'Could not access backend.')
        setUserRole('PARTICIPANT')
        setUserAllowed(false)
        setAllowedLoading(false)
        setAuthSynced(false)
      }
    }

    syncUser()
    return () => {
      cancelled = true
    }
  }, [loaded, isSignedIn, page, user, refetch])

  const navigate = useCallback((nextPage) => {
    const requiresSignIn = ['round', 'waiting', 'admin']
    if (requiresSignIn.includes(nextPage) && !isSignedIn) {
      window.history.pushState({}, '', pathForPage('signin'))
      setPage('signin')
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (transitionToWaiting) return

    if (nextPage === 'admin' && userRole !== 'ORGANIZER') {
      return
    }

    const target = nextPage || DEFAULT_PAGE

    if (target === 'waiting' && page !== 'waiting') {
      setTransitionToWaiting(true)
      window.setTimeout(() => {
        window.history.pushState({}, '', pathForPage(target))
        setPage(target)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 320)
      return
    }

    if (target === 'round' && page !== 'round') {
      if (roundIntroActive) return

      setRoundIntroActive(true)
      window.setTimeout(() => {
        window.history.pushState({}, '', pathForPage(target))
        setPage(target)
        setRoundIntroActive(false)
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }, 1400)
      return
    }

    window.history.pushState({}, '', pathForPage(target))
    setPage(target)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [page, roundIntroActive, userRole, isSignedIn, transitionToWaiting])

  const pages = useMemo(
    () => ({
      home: <HomePage onNav={navigate} userRole={userRole} userAllowed={userAllowed} allowedLoading={allowedLoading} />,
      about: <AboutPage onNav={navigate} />,
      registration: <RegistrationPage onNav={navigate} />,
      register: <RegisterPage onNav={navigate} />,
      privacy: <PrivacyPage onNav={navigate} />,
      signin: <SignInPage authError={authError} authSynced={authSynced} />,
      round: <RoundPage onNav={navigate} userRole={userRole} />,
      waiting: <WaitingPage onNav={navigate} userRole={userRole} />,
      leaderboard: <LeaderboardPage />,
      end: <EndPage onNav={navigate} />,
      admin:
        userRole === 'ORGANIZER' ? (
          <AdminPage onNav={navigate} />
        ) : (
          <WaitingPage onNav={navigate} userRole={userRole} forcedMessage="Organizer access is required for the admin panel." />
        ),
    }),
    [navigate, userRole, userAllowed, allowedLoading, authError, authSynced],
  )

  return (
    <>
    <RotateOverlay />
      {page === 'admin' ? (
  pages.admin
) : (
  <Layout
    page={page}
    onNav={navigate}
    userRole={userRole}
    roundIntroActive={roundIntroActive}
  >
    {pages[page] || pages.home}
  </Layout>
)}
      <CrackTransitionOverlay
        isActive={transitionToWaiting}
        onComplete={() => setTransitionToWaiting(false)}
        soundEffect="/voices/wait.mp3"
      />
      
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-6 right-6 px-6 py-3 rounded-lg text-white text-sm font-medium z-[9999] animate-fade-in-out ${
          toast.type === 'error' 
            ? 'bg-red-500/90 backdrop-blur-sm border border-red-400' 
            : 'bg-green-500/90 backdrop-blur-sm border border-green-400'
        }`}>
          {toast.message}
        </div>
      )}
    </>
  )
}

export default function App() {
  return <AuthenticatedApp />
}
