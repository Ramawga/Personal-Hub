import { ChartBar, ChartColumn, ChartLine, ChartPie } from 'lucide-react'
import type { ChartDimension, ChartTypeOption } from './types'

export const chartTypes: ChartTypeOption[] = [
  { icon: ChartLine, label: 'Linha', value: 'line' },
  { icon: ChartColumn, label: 'Coluna', value: 'column' },
  { icon: ChartBar, label: 'Barra', value: 'bar' },
  { icon: ChartPie, label: 'Pizza', value: 'pie' },
]

export const chartDimensions: Array<{ label: string; value: ChartDimension }> = [
  { label: 'Tempo', value: 'time' },
  { label: 'Tags', value: 'tags' },
]
