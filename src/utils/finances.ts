import type {
  CalendarDay,
  FinanceCard,
  FinanceChartPoint,
  FinanceTag,
  CardType,
  PaymentMethod,
  SummaryFilter,
  Transaction,
  TransactionType,
} from '../types/finances'

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

export const shortMonthFormatter = new Intl.DateTimeFormat('pt-BR', {
  month: 'short',
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

export function getCardTypeLabel(cardType: CardType) {
  if (cardType === 'credit') {
    return 'Credito'
  }

  return 'Debito'
}

export function isTransactionDue(transaction: Transaction, currentDateKey: string) {
  return transaction.date <= currentDateKey
}

export function sumTransactions(transactions: Transaction[], type: TransactionType) {
  return transactions
    .filter((transaction) => transaction.type === type)
    .reduce((total, transaction) => total + transaction.amount, 0)
}

export function getAccountedTransactions(transactions: Transaction[], currentDateKey: string) {
  return transactions.filter((transaction) => isTransactionDue(transaction, currentDateKey))
}

export function getTransactionsInRange(transactions: Transaction[], start: string, end: string) {
  return transactions.filter((transaction) => transaction.date >= start && transaction.date <= end)
}

export function getTagColor(tags: FinanceTag[], tagName: string, fallbackIndex = 0) {
  return (
    tags.find((tag) => tag.name.toLowerCase() === tagName.toLowerCase())?.color ??
    defaultTagColors[fallbackIndex % defaultTagColors.length]
  )
}

export function groupExpensesByTag(transactions: Transaction[], tags: FinanceTag[]) {
  const grouped = transactions
    .filter((transaction) => transaction.type === 'expense')
    .reduce<Record<string, number>>((accumulator, transaction) => {
      accumulator[transaction.tag] = (accumulator[transaction.tag] ?? 0) + transaction.amount

      return accumulator
    }, {})

  return Object.entries(grouped)
    .map(([tag, amount], index) => ({
      amount,
      color: getTagColor(tags, tag, index),
      tag,
    }))
    .sort((current, next) => next.amount - current.amount)
}

export function mapTagsToChartPoints(expensesByTag: Array<{ amount: number; color: string; tag: string }>) {
  return expensesByTag.map((expense) => ({
    amount: expense.amount,
    color: expense.color,
    label: expense.tag,
  }))
}

function getMonthExpenseTransactions(transactions: Transaction[], visibleDate: Date) {
  const monthStart = toDateKey(new Date(visibleDate.getFullYear(), visibleDate.getMonth(), 1))
  const monthEnd = toDateKey(new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 0))

  return getTransactionsInRange(transactions, monthStart, monthEnd)
}

function groupExpensesByDay(transactions: Transaction[], visibleDate: Date): FinanceChartPoint[] {
  const daysInMonth = new Date(visibleDate.getFullYear(), visibleDate.getMonth() + 1, 0).getDate()

  return Array.from({ length: daysInMonth }, (_, index) => {
    const day = index + 1
    const dateKey = toDateKey(new Date(visibleDate.getFullYear(), visibleDate.getMonth(), day))
    const amount = sumTransactions(
      transactions.filter((transaction) => transaction.date === dateKey),
      'expense',
    )

    return {
      amount,
      color: defaultTagColors[index % defaultTagColors.length],
      label: String(day).padStart(2, '0'),
    }
  })
}

function groupExpensesByMonth(transactions: Transaction[], visibleDate: Date): FinanceChartPoint[] {
  const year = visibleDate.getFullYear()

  return Array.from({ length: 12 }, (_, index) => {
    const monthStart = toDateKey(new Date(year, index, 1))
    const monthEnd = toDateKey(new Date(year, index + 1, 0))
    const amount = sumTransactions(getTransactionsInRange(transactions, monthStart, monthEnd), 'expense')

    return {
      amount,
      color: defaultTagColors[index % defaultTagColors.length],
      label: shortMonthFormatter.format(new Date(year, index, 1)),
    }
  })
}

function getDaysBetween(start: string, end: string) {
  const startDate = parseDateKey(start)
  const endDate = parseDateKey(end)
  const millisecondsPerDay = 24 * 60 * 60 * 1000

  return Math.max(Math.round((endDate.getTime() - startDate.getTime()) / millisecondsPerDay), 0)
}

function groupPeriodExpensesByDay(transactions: Transaction[], start: string, end: string): FinanceChartPoint[] {
  const daysBetween = getDaysBetween(start, end)
  const startDate = parseDateKey(start)

  return Array.from({ length: daysBetween + 1 }, (_, index) => {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + index)

    const dateKey = toDateKey(date)
    const amount = sumTransactions(
      transactions.filter((transaction) => transaction.date === dateKey),
      'expense',
    )

    return {
      amount,
      color: defaultTagColors[index % defaultTagColors.length],
      label: `${String(date.getDate()).padStart(2, '0')}/${String(date.getMonth() + 1).padStart(2, '0')}`,
    }
  })
}

function groupPeriodExpensesByMonth(transactions: Transaction[], start: string, end: string): FinanceChartPoint[] {
  const startDate = parseDateKey(start)
  const endDate = parseDateKey(end)
  const points: FinanceChartPoint[] = []
  let cursor = new Date(startDate.getFullYear(), startDate.getMonth(), 1)

  while (cursor <= endDate) {
    const monthStart = toDateKey(new Date(cursor.getFullYear(), cursor.getMonth(), 1))
    const monthEnd = toDateKey(new Date(cursor.getFullYear(), cursor.getMonth() + 1, 0))
    const amount = sumTransactions(getTransactionsInRange(transactions, monthStart, monthEnd), 'expense')

    points.push({
      amount,
      color: defaultTagColors[points.length % defaultTagColors.length],
      label: shortMonthFormatter.format(cursor),
    })
    cursor = new Date(cursor.getFullYear(), cursor.getMonth() + 1, 1)
  }

  return points
}

export function buildExpenseTimeSeries(
  transactions: Transaction[],
  summaryFilter: SummaryFilter,
  visibleDate: Date,
  periodRange: { end: string; start: string },
) {
  if (summaryFilter === 'yearly') {
    return groupExpensesByMonth(transactions, visibleDate)
  }

  if (summaryFilter === 'period') {
    const periodTransactions = getTransactionsInRange(transactions, periodRange.start, periodRange.end)

    if (getDaysBetween(periodRange.start, periodRange.end) > 90) {
      return groupPeriodExpensesByMonth(periodTransactions, periodRange.start, periodRange.end)
    }

    return groupPeriodExpensesByDay(periodTransactions, periodRange.start, periodRange.end)
  }

  return groupExpensesByDay(getMonthExpenseTransactions(transactions, visibleDate), visibleDate)
}

export function getNextStatementDate(dateKey: string, statementDay: number) {
  const [year, month, day] = dateKey.split('-').map(Number)
  const lastDayOfMonth = new Date(year, month, 0).getDate()
  const statementDate = new Date(year, month - 1, Math.min(statementDay, lastDayOfMonth))

  if (day > statementDay) {
    return addMonths(statementDate, 1)
  }

  return statementDate
}

export function parseDateKey(dateKey: string) {
  const [year, month, day] = dateKey.split('-').map(Number)

  return new Date(year, month - 1, day)
}

export function addMonths(date: Date, months: number) {
  const targetMonth = new Date(date.getFullYear(), date.getMonth() + months, 1)
  const lastDayOfTargetMonth = new Date(targetMonth.getFullYear(), targetMonth.getMonth() + 1, 0).getDate()

  return new Date(targetMonth.getFullYear(), targetMonth.getMonth(), Math.min(date.getDate(), lastDayOfTargetMonth))
}

type BuildCardInstallmentTransactionsParams = {
  amount: number
  card: FinanceCard
  dateKey: string
  description: string
  installments: number
  tag: string
}

export function buildCardInstallmentTransactions({
  amount,
  card,
  dateKey,
  description,
  installments,
  tag,
}: BuildCardInstallmentTransactionsParams): Transaction[] {
  const totalInstallments = card.type === 'credit' ? Math.max(installments, 1) : 1
  const installmentAmount = Number((amount / totalInstallments).toFixed(2))
  const firstStatementDate =
    card.type === 'credit' ? getNextStatementDate(dateKey, card.statementDay) : parseDateKey(dateKey)
  const groupId = crypto.randomUUID()

  return Array.from({ length: totalInstallments }, (_, index) => ({
    amount:
      index === totalInstallments - 1
        ? Number((amount - installmentAmount * (totalInstallments - 1)).toFixed(2))
        : installmentAmount,
    cardId: card.id,
    date: toDateKey(addMonths(firstStatementDate, index)),
    description,
    id: crypto.randomUUID(),
    installmentGroupId: groupId,
    installmentNumber: index + 1,
    installments: totalInstallments,
    paymentMethod: 'card',
    tag,
    type: 'expense',
  }))
}
