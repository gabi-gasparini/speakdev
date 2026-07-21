interface MiniStatBadgeProps {
  icon: string
  value: string | number
  label: string
}

export function MiniStatBadge({ icon, value, label }: MiniStatBadgeProps) {
  return (
    <div className="flex items-center gap-2 rounded-xl border-2 border-border bg-surface px-3 py-2">
      <span className="text-base">{icon}</span>
      <div className="leading-tight">
        <p className="text-sm font-extrabold text-text-primary">{value}</p>
        <p className="text-[11px] text-text-secondary">{label}</p>
      </div>
    </div>
  )
}