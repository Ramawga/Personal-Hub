import { chartDimensions, chartTypes } from '../chartOptions'
import type { ChartDimension, ChartType } from '../types'

type ChartControlsProps = {
  chartDimension: ChartDimension
  chartType: ChartType
  onChartDimensionChange: (dimension: ChartDimension) => void
  onChartTypeChange: (type: ChartType) => void
  showDimensionSwitcher: boolean
}

export function ChartControls({
  chartDimension,
  chartType,
  onChartDimensionChange,
  onChartTypeChange,
  showDimensionSwitcher,
}: ChartControlsProps) {
  return (
    <div className="finance-chart__actions">
      {showDimensionSwitcher && (
        <div className="finance-chart__dimension-switcher" aria-label="Base do grafico">
          {chartDimensions.map((dimension) => (
            <button
              className={chartDimension === dimension.value ? 'is-active' : ''}
              key={dimension.value}
              onClick={() => onChartDimensionChange(dimension.value)}
              type="button"
            >
              {dimension.label}
            </button>
          ))}
        </div>
      )}

      <div className="finance-chart__switcher" aria-label="Tipo de grafico">
        {chartTypes.map((type) => {
          const Icon = type.icon

          return (
            <button
              aria-label={`Exibir grafico de ${type.label.toLowerCase()}`}
              className={chartType === type.value ? 'is-active' : ''}
              key={type.value}
              onClick={() => onChartTypeChange(type.value)}
              title={type.label}
              type="button"
            >
              <Icon size={17} />
            </button>
          )
        })}
      </div>
    </div>
  )
}
