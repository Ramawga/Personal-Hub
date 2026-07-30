import type { FinanceChartPoint } from '../../../types/finances'

export function getMaxAmount(chartData: FinanceChartPoint[]) {
  return Math.max(...chartData.map((item) => item.amount), 0)
}

export function getLinePoints(chartData: FinanceChartPoint[], maxAmount: number) {
  return chartData
    .map((item, index) => {
      const x = chartData.length === 1 ? 50 : (index / (chartData.length - 1)) * 100
      const y = maxAmount > 0 ? 92 - (item.amount / maxAmount) * 80 : 92

      return `${x},${y}`
    })
    .join(' ')
}

export function getPieBackground(chartData: FinanceChartPoint[], chartTotal: number) {
  if (chartTotal <= 0) {
    return undefined
  }

  return `conic-gradient(${chartData
    .map((item, index) => {
      const previousTotal = chartData.slice(0, index).reduce((total, current) => total + current.amount, 0)
      const start = (previousTotal / chartTotal) * 100
      const end = ((previousTotal + item.amount) / chartTotal) * 100

      return `${item.color} ${start}% ${end}%`
    })
    .join(', ')})`
}

export function shouldShowAxisLabel(totalItems: number, index: number) {
  return totalItems <= 12 || index === 0 || index === totalItems - 1 || (index + 1) % 5 === 0
}
