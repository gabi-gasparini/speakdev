import type { ReactNode } from 'react'
import { Navbar } from './Navbar'


interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-bg text-text-primary">
      <Navbar />
      <main className="mx-auto max-w-6xl px-6 py-10">{children}</main>
    </div>
  )
}