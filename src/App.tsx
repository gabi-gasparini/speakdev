import { Routes, Route } from 'react-router-dom'
import { AppShell } from './components/layout/AppShell'
import { HomePage } from './pages/HomePage'
import { EverydayPage } from './pages/EverydayPage'
import { TechPage } from './pages/TechPage'
import { DashboardPage } from './pages/DashboardPage'
import { useAutoLogin } from './hooks/useAutoLogin'
import { Mascot } from './components/common/Mascot'

function App() {
  const { status, errorMessage } = useAutoLogin()

  if (status === 'loading' || status === 'idle') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg">
        <Mascot mood="neutral" size={80} />
        <p className="text-text-secondary">Loading SpeakDev...</p>
      </div>
    )
  }

  if (status === 'error') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
        <Mascot mood="encouraging" size={80} />
        <p className="font-bold text-danger">Could not sign in</p>
        <p className="max-w-sm text-sm text-text-secondary">{errorMessage}</p>
      </div>
    )
  }

  return (
    <AppShell>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/everyday" element={<EverydayPage />} />
        <Route path="/tech" element={<TechPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </AppShell>
  )
}

export default App