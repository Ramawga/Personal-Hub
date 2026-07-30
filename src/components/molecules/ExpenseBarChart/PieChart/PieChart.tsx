import type { CSSProperties } from 'react'
import type { FinanceChartPoint } from '../../../../types/finances'
import { currencyFormatter } from '../../../../utils/finances'

type PieChartProps = {
  background?: string
  data: FinanceChartPoint[]
}

export function PieChart({ background, data }: PieChartProps) {
  return (
    <div className="finance-chart__radial">
      <div aria-label="Grafico de pizza por tags" className="finance-chart__pie" style={{ background }} />
      <ul>
        {data.map((item) => (
          <li key={item.label}>
            <span style={{ '--tag-color': item.color } as CSSProperties} />
            {item.label}
            <strong>{currencyFormatter.format(item.amount)}</strong>
          </li>
        ))}
      </ul>
    </div>
  )
}
