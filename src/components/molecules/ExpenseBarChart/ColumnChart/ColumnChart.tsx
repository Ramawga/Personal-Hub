import type { FinanceChartPoint } from '../../../../types/finances'
import { currencyFormatter } from '../../../../utils/finances'

type ColumnChartProps = {
  data: FinanceChartPoint[]
  maxAmount: number
}

export function ColumnChart({ data, maxAmount }: ColumnChartProps) {
  return (
    <div className="finance-chart__bars">
      {data.map((item) => (
        <div className="finance-chart__bar-item" key={item.label}>
          <span>{currencyFormatter.format(item.amount)}</span>
          <div>
            <i style={{ height: `${Math.max((item.amount / maxAmount) * 100, 8)}%` }} />
          </div>
          <strong>{item.label}</strong>
        </div>
      ))}
    </div>
  )
}
