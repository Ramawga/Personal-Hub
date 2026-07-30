import { useMemo, useState } from 'react'
import type { FinanceChartPoint } from '../../../types/finances'
import { ChartControls } from './ChartControls'
import { ColumnChart } from './ColumnChart'
import { HorizontalBarChart } from './HorizontalBarChart'
import { LineChart } from './LineChart'
import { PieChart } from './PieChart'
import { getMaxAmount, getPieBackground } from './chartHelpers'
import type { ChartDimension, ChartType } from './types'

type ExpenseBarChartProps = {
  emptyText: string
  tagChartData: FinanceChartPoint[]
  timeChartData: FinanceChartPoint[]
}

export function ExpenseBarChart({ emptyText, tagChartData, timeChartData }: ExpenseBarChartProps) {
  const [chartType, setChartType] = useState<ChartType>('line')
  const [chartDimension, setChartDimension] = useState<ChartDimension>('time')
  const selectedChartData = chartDimension === 'time' ? timeChartData : tagChartData
  const chartData = chartType === 'line' ? timeChartData : chartType === 'pie' ? tagChartData : selectedChartData
  const visibleChartData = chartType === 'line' ? chartData : chartData.filter((item) => item.amount > 0)
  const chartTotal = chartData.reduce((total, item) => total + item.amount, 0)
  const maxAmount = getMaxAmount(chartData)
  const hasData = chartData.some((item) => item.amount > 0)
  const pieBackground = useMemo(() => getPieBackground(tagChartData, chartTotal), [chartTotal, tagChartData])
  const showDimensionSwitcher = chartType === 'bar' || chartType === 'column'
  const chartTitle = chartType === 'pie' ? 'Gastos por tag' : 'Evolucao de gastos'

  function renderChart() {
    if (!hasData) {
      return <p>{emptyText}</p>
    }

    if (chartType === 'line') {
      return <LineChart data={timeChartData} maxAmount={maxAmount} />
    }

    if (chartType === 'pie') {
      return <PieChart background={pieBackground} data={tagChartData} />
    }

    if (chartType === 'column') {
      return <ColumnChart data={visibleChartData} maxAmount={maxAmount} />
    }

    return <HorizontalBarChart data={visibleChartData} maxAmount={maxAmount} />
  }

  return (
    <article className="finance-chart finance-chart--bars">
      <header className="finance-chart__header">
        <h2>{chartTitle}</h2>
        <ChartControls
          chartDimension={chartDimension}
          chartType={chartType}
          onChartDimensionChange={setChartDimension}
          onChartTypeChange={setChartType}
          showDimensionSwitcher={showDimensionSwitcher}
        />
      </header>
      {renderChart()}
    </article>
  )
}
