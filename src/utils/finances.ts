import type { CalendarDay, PaymentMethod, SummaryFilter, Transaction, TransactionType } from '../types/finances'

export const financesApiPath = '/api/finances'
export const defaultTagColors = ['#64d2a6', '#ff6b6b', '#f4c95d', '#74a7ff', '#c99bff', '#ff9f6e']
export const weekdayLabels = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sab']

export const currencyFormatter = new Intl.NumberFormat('pt-BR', {
  currency: 'BRL',
  style: 'currency',
})

export const monthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'long',
  year: 'numeric',
})

export function toDateKey(date: Date) {
  const year = date.getFullYear()
  const month = `${date.getMonth() + 1}`.padStart(2, '0')
  const day = `${date.getDate()}`.padStart(2, '0')

  return `${year}-${month}-${day}`
}

export function buildCalendarDays(visibleDate: Date): CalendarDay[] {
  const year = visibleDate.getFullYear()
  const month = visibleDate.getMonth()
  const firstDay = new Date(year, month, 1)
  const startDate = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)

    return {
      date,
      dateKey: toDateKey(date),
      isCurrentMonth: date.getMonth() === month,
    }
  })
}

export function getPeriodRange(
  filter: SummaryFilter,
  visibleDate: Date,
  customStart: string,
  customEnd: string,
  currentDateKey: string,
) {
  const year = visibleDate.getFullYear()
  const month = visibleDate.getMonth()

  if (filter === 'daily') {
    return { end: currentDateKey, start: currentDateKey }
  }

  if (filter === 'yearly') {
    return {
      end: toDateKey(new Date(year, 11, 31)),
      start: toDateKey(new Date(year, 0, 1)),
    }
  }

  if (filter === 'period') {
    return {
      end: customEnd || currentDateKey,
      start: customStart || currentDateKey,
    }
  }

  return {
    end: toDateKey(new Date(year, month + 1, 0)),
    start: toDateKey(new Date(year, month, 1)),
  }
}

export function createTagsFromTransactions(transactions: Transaction[]) {
  return Array.from(new Set(transactions.map((transaction) => transaction.tag).filter(Boolean))).map((tag, index) => ({
    color: defaultTagColors[index % defaultTagColors.length],
    name: tag,
  }))
}

export function getPaymentMethodLabel(paymentMethod?: PaymentMethod) {
  if (paymentMethod === 'pix') {
    return 'Pix'
  }

  if (paymentMethod === 'cash') {
    return 'Dinheiro'
  }

  if (paymentMethod === 'card') {
    return 'Cartao'
  }

  return ''
}

export function sumTransactions(transactions: Transaction[], type: TransactionType) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0)
}
