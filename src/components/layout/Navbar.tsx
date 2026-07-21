import { NavLink } from 'react-router-dom'
import raccoonLogo from '@/assets/mascot/raccoon-logo.png'
import { useHomeStats } from '@/hooks/useHomeStats'

const navItems = [
  { to: '/', label: 'Home' },
  { to: '/everyday', label: 'Everyday', accent: 'everyday' as const },
  { to: '/tech', label: 'Tech', accent: 'tech' as const },
  { to: '/dashboard', label: 'Dashboard' },
]

const activeClasses: Record<'everyday' | 'tech' | 'default', string> = {
  everyday: 'bg-accent-everyday text-white',
  tech: 'bg-accent-tech text-white',
  default: 'bg-accent-everyday text-white',
}

export function Navbar() {
  const { dayStreak } = useHomeStats()

  return (
    <header className="sticky top-0 z-50 border-b-2 border-text-primary bg-surface">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-6 px-6">
        <div className="flex items-center gap-2.5">
          <img src={raccoonLogo} alt="SpeakDev mascot" className="h-10 w-auto" />
          <span className="text-2xl font-extrabold tracking-tight">
            Speak<span className="text-accent-everyday">Dev</span>
          </span>
        </div>

        <ul className="flex items-center gap-2">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  [
                    'rounded-xl px-4 py-2 text-sm font-bold transition-colors',
                    isActive
                      ? activeClasses[item.accent ?? 'default']
                      : 'text-text-secondary hover:bg-bg',
                  ].join(' ')
                }
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2">
          {/* Indicador de streak real, vindo do progresso do usuário */}
          <div className="flex items-center gap-1 rounded-full border-2 border-streak bg-streak/10 px-3 py-1.5">
            <span className="text-base">🔥</span>
            <span className="text-sm font-extrabold text-text-primary">{dayStreak}</span>
          </div>

          {/* Avatar do usuário */}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-everyday text-sm font-extrabold text-white">
            G
          </div>
        </div>
      </nav>
    </header>
  )
}