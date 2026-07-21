interface StatCardProps {
  icon: string
  label: string
  value: string | number
  color: 'everyday' | 'tech' | 'streak'
}

const colorClasses: Record<StatCardProps['color'], string> = {
  everyday: 'bg-accent-everyday',
  tech: 'bg-accent-tech',
  streak: 'bg-streak',
}

export function StatCard({ icon, label, value, color }: StatCardProps) {
  return (
    <div
      className={`rounded-2xl border-2 border-text-primary p-5 text-white shadow-[0_4px_0_0_rgba(43,42,40,1)] ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-extrabold uppercase tracking-wide opacity-90">{label}</p>
        <span className="text-2xl">{icon}</span>
      </div>
      <p className="mt-2 text-3xl font-extrabold">{value}</p>
    </div>
  )
}