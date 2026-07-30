import type { FinanceChartPoint } from '../../../../types/finances'
import { currencyFormatter } from '../../../../utils/finances'

type HorizontalBarChartProps = {
  data: FinanceChartPoint[]
  maxAmount: number
}

export function HorizontalBarChart({ data, maxAmount }: HorizontalBarChartProps) {
  return (
    <div className="finance-chart__horizontal-bars">
      {data.map((item) => (
        <div className="finance-chart__horizontal-bar-item" key={item.label}>
          <span>{item.label}</span>
          <div>
            <i style={{ width: `${Math.max((item.amount / maxAmount) * 100, 8)}%` }} />
          </div>
          <strong>{currencyFormatter.format(item.amount)}</strong>
        </div>
      ))}
    </div>
  )
}
