import type { FinanceChartPoint } from '../../../../types/finances'
import { getLinePoints, shouldShowAxisLabel } from '../chartHelpers'

type LineChartProps = {
  data: FinanceChartPoint[]
  maxAmount: number
}

export function LineChart({ data, maxAmount }: LineChartProps) {
  return (
    <div className="finance-chart__line">
      <div className="finance-chart__line-plot">
        <svg aria-label="Grafico de linha por periodo" preserveAspectRatio="none" role="img" viewBox="0 0 100 100">
          <polyline points={getLinePoints(data, maxAmount)} />
        </svg>
        <div className="finance-chart__line-axis" aria-hidden="true">
          {data.map((item, index) => (
            <span key={item.label}>{shouldShowAxisLabel(data.length, index) ? item.label : ''}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
