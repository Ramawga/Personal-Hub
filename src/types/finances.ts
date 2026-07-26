export type TransactionType = 'expense' | 'income'
export type SummaryFilter = 'daily' | 'monthly' | 'yearly' | 'period'
export type PaymentMethod = 'card' | 'cash' | 'pix'

export type Transaction = {
  amount: number
  date: string
  description: string
  id: string
  paymentMethod?: PaymentMethod
  tag: string
  type: TransactionType
}

export type FinanceTag = {
  color: string
  name: string
}

export type CalendarDay = {
  date: Date
  dateKey: string
  isCurrentMonth: boolean
}

export type FinancesData = {
  tags: FinanceTag[]
  transactions: Transaction[]
}

export type ExpenseByTag = {
  amount: number
  color: string
  tag: string
}
