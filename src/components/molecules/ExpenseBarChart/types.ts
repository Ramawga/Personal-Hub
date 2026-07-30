import type { ChartBar, ChartLine } from 'lucide-react'

export type ChartDimension = 'tags' | 'time'
export type ChartType = 'bar' | 'column' | 'line' | 'pie'

export type ChartTypeOption = {
  icon: typeof ChartLine | typeof ChartBar
  label: string
  value: ChartType
}
