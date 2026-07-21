import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import type { PracticeSessionRow } from '@/types/practice'

interface AccuracyChartProps {
  sessions: PracticeSessionRow[]
}

interface ChartPoint {
  date: string
  everyday: number | null
  tech: number | null
}

// Agrupa as sessões por dia e calcula a acurácia média de cada trilha
// naquele dia, formatando os dados no shape que o Recharts espera.
function buildChartData(sessions: PracticeSessionRow[]): ChartPoint[] {
  const byDate = new Map<string, { everyday: number[]; tech: number[] }>()

  // Ordena do mais antigo para o mais recente, para o gráfico ler da esquerda para a direita
  const sorted = [...sessions].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  for (const session of sorted) {
    if (session.accuracy === null) continue

    const date = new Date(session.created_at).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    })

    if (!byDate.has(date)) {
      byDate.set(date, { everyday: [], tech: [] })
    }

    byDate.get(date)![session.track].push(session.accuracy)
  }

  return Array.from(byDate.entries()).map(([date, values]) => ({
    date,
    everyday: values.everyday.length
      ? Math.round(values.everyday.reduce((a, b) => a + b, 0) / values.everyday.length)
      : null,
    tech: values.tech.length
      ? Math.round(values.tech.reduce((a, b) => a + b, 0) / values.tech.length)
      : null,
  }))
}

export function AccuracyChart({ sessions }: AccuracyChartProps) {
  const data = buildChartData(sessions)

  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center rounded-2xl border-2 border-border bg-surface text-text-secondary">
        Complete some exercises to see your progress here.
      </div>
    )
  }

  return (
    <div className="rounded-2xl border-2 border-border bg-surface p-4">
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data} margin={{ top: 10, right: 10, bottom: 0, left: -20 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e8e4db" />
          <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#736f68' }} />
          <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#736f68' }} />
          <Tooltip
            contentStyle={{
  borderRadius: 12,
  border: '2px solid #262628',
  fontFamily: 'Nunito, sans-serif',
}}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="everyday"
            name="Everyday"
            stroke="#58cc02"
            strokeWidth={3}
            dot={{ r: 4 }}
            connectNulls
          />
          <Line
            type="monotone"
            dataKey="tech"
            name="Tech"
            stroke="#1cb0f6"
            strokeWidth={3}
            dot={{ r: 4 }}
            connectNulls
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}