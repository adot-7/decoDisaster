import { useEffect, useState } from 'react'
import { useUser } from '../context/AuthContext'
import { useApi } from '../hooks/useApi'
import { Alert, Spinner } from '../components/UI'
import Timer from '../components/Timer'

function formatTime(totalSeconds) {
  const safe = Number(totalSeconds || 0)
  const hours = Math.floor(safe / 3600)
  const minutes = Math.floor((safe % 3600) / 60)
  const seconds = safe % 60

  if (hours > 0) {
    return `${hours}h ${minutes}m ${seconds}s`
  }

  return `${minutes}m ${seconds}s`
}

export default function LeaderboardPage() {
  const api = useApi()
  const { user } = useUser()

  const [entries, setEntries] = useState([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState(null)
  const [availableAt, setAvailableAt] = useState(null)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalEntries, setTotalEntries] = useState(0)
  const [myRank, setMyRank] = useState(null) // Single source of truth for user rank

  // Load leaderboard data
  const loadLeaderboard = async (isRefresh = false, newPage = page) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const result = await api.get(`/api/leaderboard?page=${newPage}&limit=20`)
      console.log('Leaderboard response:', result);
      
      setEntries(result?.data || [])
      setTotalPages(result?.totalPages || 1)
      setTotalEntries(result?.totalEntries || 0)

      setAvailableAt(
        result?.availableAt
          ? new Date(result.availableAt)
          : null
      )

      setError(null)
    } catch (err) {
      setError(err.message)
      setEntries([])
      setAvailableAt(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Load current user's rank
  const loadMyRank = async () => {
    try {
      const result = await api.get('/api/leaderboard/me')
      console.log('My rank response:', result);
      if (result?.status && result?.isAvailable) {
        setMyRank(result)
      } else {
        setMyRank(null)
      }
    } catch (err) {
      console.error('Failed to load my rank:', err.message)
      setMyRank(null)
    }
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return
    setPage(newPage)
    loadLeaderboard(false, newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Jump to the page containing the current user
  const goToMyRankPage = () => {
    if (myRank?.userPage) {
      setPage(myRank.userPage)
      loadLeaderboard(false, myRank.userPage)
      setTimeout(() => {
        const userRow = document.getElementById(`user-${myRank.userId}`)
        if (userRow) {
          userRow.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }, 100)
    }
  }

  useEffect(() => {
    // Load both in parallel
    Promise.all([loadLeaderboard(), loadMyRank()])
  }, [])

  useEffect(() => {
    if (!availableAt || entries.length > 0) {
      return
    }

    const now = new Date()
    const msLeft = availableAt.getTime() - now.getTime()

    if (msLeft <= 0) {
      loadLeaderboard(true)
      return
    }

    const timeout = setTimeout(() => {
      loadLeaderboard(true)
    }, msLeft + 1000)

    return () => clearTimeout(timeout)
  }, [availableAt])

  const credits = [
    {
      name: "Akash Parashar",
      url: "https://www.linkedin.com/in/itsaakaash"
    },
    {
      name: "Rachit Talwar",
      url: "https://www.linkedin.com/in/rachit-talwar-32013531a"
    },
    {
      name: "Rishi Ramani",
      url: "https://www.linkedin.com/in/rishi-ramani-6635692b5"
    },
    {
      name: "Arnav Jain",
      url: "https://www.linkedin.com/in/arnav-jain-820522322/"
    },
    {
      name: "Lipika Aggarwal",
      url: "https://www.linkedin.com/in/lipikaaggarwal/"
    },
    {
      name: "Aditya Soin",
      url: "https://www.linkedin.com/in/aditya-soin-75970b277"
    },
    {
      name: "Jiya Aggarwal",
      url: "https://www.linkedin.com/in/jiya-agrawal-24460537a"
    },
    {
      name: "Vishesh Verma",
      url: "https://github.com/vishesh1111"
    },
    {
      name: "Bhavay Mahore",
      url: "https://www.instagram.com/piilkox/"
    }
  ]

  if (loading && page === 1) {
    return (
      <div className="flex justify-center py-24">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="relative px-4 sm:px-8">

      {/* 🌌 Background */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_10%,rgba(45,255,154,0.08),transparent_40%),radial-gradient(circle_at_50%_90%,rgba(255,0,0,0.08),transparent_40%),#000]" />

      {/* HEADER */}
      <div className="mb-12 flex items-center justify-between flex-wrap gap-4">
        <div>
          <div
            className="text-xl sm:text-2xl font-bold tracking-[0.45em] text-[#2DFF9A]"
            style={{ fontFamily: "Orbitron, sans-serif" }}
          >
            LEADERBOARD
          </div>
          <div className="mt-1 text-sm text-slate-400 tracking-wide">
            cumulative standings • {totalEntries} participants
          </div>
        </div>

        <button
          onClick={() => loadLeaderboard(true, page)}
          className="rounded-full border border-[#2DFF9A]/40 bg-black/60 px-5 py-2 text-sm text-[#2DFF9A] backdrop-blur-sm transition hover:bg-[#2DFF9A]/10"
          style={{
            fontFamily: "Orbitron, sans-serif",
            letterSpacing: "0.15em",
            textShadow: "0 0 8px rgba(45,255,154,0.7)"
          }}
        >
          {refreshing ? "..." : "REFRESH"}
        </button>
      </div>

      {error && <Alert type="error">{error}</Alert>}

      {/* ✅ USER CARD - Using myRank data */}
      {myRank && myRank.isAvailable &&
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#2DFF9A]/20 bg-[#2DFF9A]/10 backdrop-blur-md shadow-[0_0_60px_rgba(45,255,154,0.08)]">
          <div className="grid grid-cols-[100px_1fr_140px_140px] items-center px-6 py-5">
            <div
              className="text-2xl font-bold text-[#2DFF9A]"
              style={{ textShadow: "0 0 12px rgba(45,255,154,0.6)" }}
            >
              #{myRank.rank}
            </div>

            <div className="flex items-center gap-4">
              <div>
                <div className="flex items-center gap-3">
                  <div className="text-white font-medium text-lg">
                    {myRank.name}
                  </div>
                  <div
                    className="rounded-full border border-[#2DFF9A]/40 bg-[#2DFF9A]/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#2DFF9A]"
                    style={{
                      fontFamily: "Orbitron, sans-serif",
                      textShadow: "0 0 10px rgba(45,255,154,0.6)"
                    }}
                  >
                    You
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right text-slate-300">
              {formatTime(myRank.totalTime)}
            </div>

            <div className="text-right text-2xl font-bold text-[#2DFF9A] drop-shadow-[0_0_10px_rgba(45,255,154,0.6)]">
              {myRank.totalPoints}
            </div>
          </div>

          {/* Show "Go to my rank" button if user is not on current page */}
          {myRank.userPage && myRank.userPage !== page && (
            <div className="px-6 pb-4">
              <button
                onClick={goToMyRankPage}
                className="w-full py-2 rounded-lg bg-[#2DFF9A]/20 text-[#2DFF9A] hover:bg-[#2DFF9A]/30 transition text-sm"
              >
                Jump to your rank (Page {myRank.userPage}) →
              </button>
            </div>
          )}
        </div>
      }

      {/* 🔥 MAIN PANEL */}
      <div className="rounded-[2rem] border border-[#2DFF9A]/20 bg-black/50 backdrop-blur-md shadow-[0_0_80px_rgba(45,255,154,0.08)] overflow-hidden relative">

        {/* HEADER */}
        <div className="grid grid-cols-[80px_1fr_120px_120px] px-6 py-5 text-xs uppercase tracking-[0.35em] text-[#2DFF9A]/70 border-b border-[#2DFF9A]/10">
          <div>Rank</div>
          <div>Participant</div>
          <div className="text-right">Time</div>
          <div className="text-right">Points</div>
        </div>

        {entries.length === 0 && !loading ? (
          <div className="relative min-h-[620px] overflow-hidden">
            <div className="relative flex min-h-[620px] flex-col items-center justify-center px-8 text-center">
              <div
                className="text-xs tracking-[0.7em] text-[#2DFF9A]/75 uppercase"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                ACCESS RESTRICTED
              </div>
              <div className="mt-5 h-px w-48 bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />
              <p className="mt-10 max-w-3xl text-lg leading-10 text-slate-300/85">
                Temporal records remain sealed.
                Synchronization with the
                central timeline is incomplete —
                premature access may destabilize
                recorded outcomes.
              </p>
              <div className="mt-16">
                <div
                  className="mb-6 text-[10px] tracking-[0.5em] text-slate-500 uppercase"
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  Timeline Unlock In
                </div>
                <div className="relative inline-flex items-center justify-center">
                  <div className="absolute inset-0 scale-150 blur-3xl bg-[#2DFF9A]/20" />
                  <div
                    className="relative text-6xl sm:text-7xl tracking-[0.22em] text-[#2DFF9A]"
                    style={{
                      fontFamily: "Orbitron, sans-serif",
                      textShadow: "0 0 30px rgba(45,255,154,0.65)"
                    }}
                  >
                    <Timer targetTime={availableAt} label="" />
                  </div>
                </div>
              </div>
              <div className="mt-14 h-[3px] w-80 overflow-hidden rounded-full bg-[#2DFF9A]/10">
                <div className="h-full w-1/2 animate-pulse rounded-full bg-[#2DFF9A] shadow-[0_0_20px_rgba(45,255,154,0.95)]" />
              </div>
              <div
                className="mt-10 text-[10px] tracking-[0.45em] text-slate-600 uppercase"
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                Timeline Stabilization In Progress
              </div>
            </div>
          </div>
        ) : (
          <>
            {entries.map((entry) => {
              const isTop1 = entry.rank === 1
              const isTop2 = entry.rank === 2
              const isTop3 = entry.rank === 3
              const isCurrentUser = myRank && myRank.userId === entry.userId

              return (
                <div
                  id={`user-${entry.userId}`}
                  key={entry.userId}
                  className={`grid grid-cols-[80px_1fr_120px_120px] px-6 py-5 items-center border-b border-white/5 transition-all duration-200 hover:bg-[#2DFF9A]/5 ${
                    isCurrentUser ? 'bg-[#2DFF9A]/20 border-l-4 border-l-[#2DFF9A]' : ''
                  }`}
                >
                  <div
                    className={`text-xl font-bold ${
                      isTop1
                        ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]'
                        : isTop2
                        ? 'text-slate-300'
                        : isTop3
                        ? 'text-orange-400'
                        : isCurrentUser
                        ? 'text-[#2DFF9A]'
                        : 'text-white'
                    }`}
                  >
                    #{entry.rank}
                  </div>

                  <div className="flex items-center gap-2">
                    <div className={`font-medium text-lg ${
                      isCurrentUser ? 'text-[#2DFF9A]' : 'text-white'
                    }`}>
                      {entry.name}
                    </div>
                    {isCurrentUser && (
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#2DFF9A]/20 text-[#2DFF9A]">
                        You
                      </span>
                    )}
                  </div>

                  <div className="text-right text-slate-300">
                    {formatTime(entry.totalTime)}
                  </div>

                  <div
                    className={`text-right text-2xl font-bold ${
                      isTop1
                        ? 'text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]'
                        : 'text-[#2DFF9A] drop-shadow-[0_0_10px_rgba(45,255,154,0.6)]'
                    }`}
                  >
                    {entry.totalPoints}
                  </div>
                </div>
              )
            })}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-6 py-5 border-t border-[#2DFF9A]/10">
                <button
                  onClick={() => handlePageChange(page - 1)}
                  disabled={page === 1 || refreshing}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    page === 1 || refreshing
                      ? 'bg-[#2DFF9A]/10 text-[#2DFF9A]/30 cursor-not-allowed'
                      : 'bg-[#2DFF9A]/20 text-[#2DFF9A] hover:bg-[#2DFF9A]/30'
                  }`}
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  ← PREV
                </button>
                
                <div className="flex items-center gap-3">
                  <span className="text-slate-400 text-sm">
                    Page {page} of {totalPages}
                  </span>
                  
                  <select
                    value={page}
                    onChange={(e) => handlePageChange(Number(e.target.value))}
                    className="bg-black/50 border border-[#2DFF9A]/30 rounded-lg px-2 py-1 text-[#2DFF9A] text-sm"
                    style={{ fontFamily: "Orbitron, sans-serif" }}
                  >
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                      <option key={p} value={p}>Go to {p}</option>
                    ))}
                  </select>
                </div>
                
                <button
                  onClick={() => handlePageChange(page + 1)}
                  disabled={page === totalPages || refreshing}
                  className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                    page === totalPages || refreshing
                      ? 'bg-[#2DFF9A]/10 text-[#2DFF9A]/30 cursor-not-allowed'
                      : 'bg-[#2DFF9A]/20 text-[#2DFF9A] hover:bg-[#2DFF9A]/30'
                  }`}
                  style={{ fontFamily: "Orbitron, sans-serif" }}
                >
                  NEXT →
                </button>
              </div>
            )}
            
            {/* Loading indicator for page changes */}
            {refreshing && (
              <div className="absolute inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center rounded-[2rem]">
                <Spinner size="md" />
              </div>
            )}
          </>
        )}
      </div>

      {/* CREDITS SECTION */}
      <div className="mt-40 text-center">
        <div
          className="text-sm sm:text-base uppercase tracking-[0.6em] text-[#2DFF9A] mb-4 drop-shadow-[0_0_10px_rgba(45,255,154,0.6)]"
          style={{ fontFamily: "Orbitron, sans-serif" }}
        >
          TIMELINE ARCHITECTS
        </div>

        <h2 className="text-xl sm:text-2xl font-medium text-slate-300 mb-12 tracking-wide">
          ACM Web Team
        </h2>

        <div className="max-w-md mx-auto space-y-5">
          {credits.map((person, index) => {
            const hasLink = person.url && person.url.trim() !== ""
            return (
              <div
                key={`${person.name}-${index}`}
                onClick={() => {
                  if (hasLink) {
                    window.open(person.url, "_blank")
                  }
                }}
                className={`group relative text-slate-400 transition-all duration-300 hover:text-[#2DFF9A] ${
                  hasLink ? "cursor-pointer" : "cursor-default"
                }`}
                style={{ fontFamily: "Orbitron, sans-serif" }}
              >
                <span className="absolute left-1/2 -translate-x-1/2 bottom-0 h-px w-0 bg-[#2DFF9A] transition-all duration-300 group-hover:w-24" />
                <span className="tracking-wide group-hover:tracking-[0.12em] transition-all">
                  {person.name}
                </span>
              </div>
            )
          })}
        </div>

        <div className="mt-14 text-xs text-slate-500 tracking-wide">
          Deco Disaster 6.0 — Doomsday Protocol
        </div>
      </div>

    </div>
  )
}
