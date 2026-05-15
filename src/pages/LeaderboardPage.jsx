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
  const [infoMessage, setInfoMessage] = useState(null)
  const [availableAt, setAvailableAt] = useState(null)

  const load = async (isRefresh = false) => {
    if (isRefresh) {
      setRefreshing(true)
    } else {
      setLoading(true)
    }

    try {
      const result = await api.get('/api/leaderboard')

      setEntries(result?.data || [])
      setInfoMessage(result?.message || null)

      setAvailableAt(
        result?.availableAt
          ? new Date(result.availableAt)
          : null
      )

      setError(null)
    } catch (err) {
      setError(err.message)
      setEntries([])
      setInfoMessage(null)
      setAvailableAt(null)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
  if (!availableAt || entries.length > 0) {
    return
  }

  const now = new Date()
  const msLeft = availableAt.getTime() - now.getTime()

  if (msLeft <= 0) {
    load(true)
    return
  }

  const timeout = setTimeout(() => {
    load(true)
  }, msLeft + 1000)

  return () => clearTimeout(timeout)

  }, [availableAt])

  const myEmail =
    user?.primaryEmailAddress?.emailAddress

  const currentUser =
    myEmail
      ? entries.find(
          (entry) => entry.email === myEmail
        )
      : null

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
    },
    {
      name: "Harsh Anand",
      url: ""
    }
  ]

  if (loading) {
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
      <div className="mb-12 flex items-center justify-between">

        <div>
          <div
            className="text-xl sm:text-2xl font-bold tracking-[0.45em] text-[#2DFF9A]"
            style={{
              fontFamily: "Orbitron, sans-serif"
            }}
          >
            LEADERBOARD
          </div>

          <div className="mt-1 text-sm text-slate-400 tracking-wide">
            cumulative standings
          </div>
        </div>

        <button
          onClick={() => load(true)}
          className="rounded-full border border-[#2DFF9A]/40 bg-black/60 px-5 py-2 text-sm text-[#2DFF9A] backdrop-blur-sm transition hover:bg-[#2DFF9A]/10"
          style={{
            fontFamily: "Orbitron, sans-serif",
            letterSpacing: "0.15em",
            textShadow:
              "0 0 8px rgba(45,255,154,0.7)"
          }}
        >
          {refreshing ? "..." : "REFRESH"}
        </button>

      </div>

      {error && (
        <Alert type="error">
          {error}
        </Alert>
      )}

      {/* ✅ USER CARD */}
      {currentUser && (
        <div className="mb-8 overflow-hidden rounded-[2rem] border border-[#2DFF9A]/20 bg-[#2DFF9A]/10 backdrop-blur-md shadow-[0_0_60px_rgba(45,255,154,0.08)]">

          <div className="grid grid-cols-[100px_1fr_140px_140px] items-center px-6 py-5">

            <div
              className="text-2xl font-bold text-[#2DFF9A]"
              style={{
                textShadow:
                  "0 0 12px rgba(45,255,154,0.6)"
              }}
            >
              #{currentUser.rank}
            </div>

            <div className="flex items-center gap-4">

              <div>

                <div className="flex items-center gap-3">

                  <div className="text-white font-medium text-lg">
                    {currentUser.name}
                  </div>

                  <div
                    className="rounded-full border border-[#2DFF9A]/40 bg-[#2DFF9A]/10 px-3 py-1 text-[10px] uppercase tracking-[0.28em] text-[#2DFF9A]"
                    style={{
                      fontFamily: "Orbitron, sans-serif",
                      textShadow:
                        "0 0 10px rgba(45,255,154,0.6)"
                    }}
                  >
                    You
                  </div>

                </div>


              </div>

            </div>

            <div className="text-right text-slate-300">
              {formatTime(currentUser.totalTime)}
            </div>

            <div className="text-right text-2xl font-bold text-[#2DFF9A] drop-shadow-[0_0_10px_rgba(45,255,154,0.6)]">
              {currentUser.totalPoints}
            </div>

          </div>

        </div>
      )}

      {/* 🔥 MAIN PANEL */}
      <div className="rounded-[2rem] border border-[#2DFF9A]/20 bg-black/50 backdrop-blur-md shadow-[0_0_80px_rgba(45,255,154,0.08)] overflow-hidden">

        {/* HEADER */}
        <div className="grid grid-cols-[80px_1fr_120px_120px] px-6 py-5 text-xs uppercase tracking-[0.35em] text-[#2DFF9A]/70 border-b border-[#2DFF9A]/10">

          <div>Rank</div>

          <div>Participant</div>

          <div className="text-right">
            Time
          </div>

          <div className="text-right">
            Points
          </div>

        </div>

        {entries.length === 0 ? (
          <div className="relative min-h-[620px] overflow-hidden">

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(45,255,154,0.05),transparent_60%)]" />

            <div className="pointer-events-none absolute inset-0 opacity-[0.025] bg-[linear-gradient(to_bottom,transparent,transparent_2px,white_3px)] bg-[length:100%_4px]" />

            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,0,0,0.04),transparent_35%)]" />

            <div className="relative flex min-h-[620px] flex-col items-center justify-center px-8 text-center">

              <div
                className="text-xs tracking-[0.7em] text-[#2DFF9A]/75 uppercase"
                style={{
                  fontFamily: "Orbitron, sans-serif"
                }}
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
                  style={{
                    fontFamily:
                      "Orbitron, sans-serif"
                  }}
                >
                  Timeline Unlock In
                </div>

                <div className="relative inline-flex items-center justify-center">

                  <div className="absolute inset-0 scale-150 blur-3xl bg-[#2DFF9A]/20" />

                  <div
                    className="relative text-6xl sm:text-7xl tracking-[0.22em] text-[#2DFF9A]"
                    style={{
                      fontFamily:
                        "Orbitron, sans-serif",
                      textShadow:
                        "0 0 30px rgba(45,255,154,0.65)"
                    }}
                  >
                    <Timer
                      targetTime={availableAt}
                      label=""
                    />
                  </div>

                </div>

              </div>

              <div className="mt-14 h-[3px] w-80 overflow-hidden rounded-full bg-[#2DFF9A]/10">

                <div className="h-full w-1/2 animate-pulse rounded-full bg-[#2DFF9A] shadow-[0_0_20px_rgba(45,255,154,0.95)]" />

              </div>

              <div
                className="mt-10 text-[10px] tracking-[0.45em] text-slate-600 uppercase"
                style={{
                  fontFamily:
                    "Orbitron, sans-serif"
                }}
              >
                Timeline Stabilization In Progress
              </div>

            </div>

          </div>
        ) : (
          entries.map((entry) => {
            const isTop1 = entry.rank === 1
            const isTop2 = entry.rank === 2
            const isTop3 = entry.rank === 3

            return (
              <div
                key={entry.userId}
                className={`grid grid-cols-[80px_1fr_120px_120px] px-6 py-5 items-center border-b border-white/5 transition-all duration-200 hover:bg-[#2DFF9A]/5 ${
                  entry.email === myEmail
                    ? 'bg-[#2DFF9A]/10'
                    : ''
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
                      : 'text-white'
                  }`}
                >
                  #{entry.rank}
                </div>

                <div className="text-white font-medium text-lg">
                  {entry.name}
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
          })
        )}

      </div>

      {/* ✅ CREDITS */}
      <div className="mt-40 text-center">

        <div
          className="text-sm sm:text-base uppercase tracking-[0.6em] text-[#2DFF9A] mb-4 drop-shadow-[0_0_10px_rgba(45,255,154,0.6)]"
          style={{
            fontFamily: "Orbitron, sans-serif"
          }}
        >
          TIMELINE ARCHITECTS
        </div>

        <h2 className="text-xl sm:text-2xl font-medium text-slate-300 mb-12 tracking-wide">
          ACM Web Team
        </h2>

        <div className="max-w-md mx-auto space-y-5">

          {credits.map((person, index) => {
            const hasLink =
              person.url &&
              person.url.trim() !== ""

            return (
              <div
                key={`${person.name}-${index}`}
                onClick={() => {
                  if (hasLink) {
                    window.open(
                      person.url,
                      "_blank"
                    )
                  }
                }}
                className={`group relative text-slate-400 transition-all duration-300 hover:text-[#2DFF9A] ${
                  hasLink
                    ? "cursor-pointer"
                    : "cursor-default"
                }`}
                style={{
                  fontFamily:
                    "Orbitron, sans-serif"
                }}
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