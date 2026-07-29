export type TransactionType = 'expense' | 'income'
export type SummaryFilter = 'daily' | 'monthly' | 'yearly' | 'period'
export type PaymentMethod = 'card' | 'cash' | 'pix'
export type CardType = 'credit' | 'debit'

export type Transaction = {
  amount: number
  cardId?: string
  date: string
  description: string
  id: string
  installmentGroupId?: string
  installmentNumber?: number
  installments?: number
  paymentMethod?: PaymentMethod
  tag: string
  type: TransactionType
}

export type FinanceCard = {
  id: string
  limit: number
  name: string
  statementDay: number
  type: CardType
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
  cards: FinanceCard[]
  tags: FinanceTag[]
  transactions: Transaction[]
}

export type ExpenseByTag = {
  amount: number
  color: string
  tag: string
}
