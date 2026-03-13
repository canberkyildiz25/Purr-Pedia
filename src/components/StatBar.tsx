interface StatBarProps {
  label: string
  value: number
  max?: number
  color?: string
}

export default function StatBar({ label, value, max = 5, color = 'bg-purr-500' }: StatBarProps) {
  const percent = (value / max) * 100

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center">
        <span className="text-xs font-medium text-gray-600">{label}</span>
        <span className="text-xs font-bold text-gray-700">{value}/{max}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  )
}
