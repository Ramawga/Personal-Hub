import { useEffect, useMemo, useState } from 'react'
import type { SummaryFilter, Transaction } from '../types/finances'
import { buildCalendarDays, getPeriodRange, toDateKey } from '../utils/finances'

export function useFinancePageState(transactions: Transaction[]) {
  const [currentDateKey, setCurrentDateKey] = useState(toDateKey(new Date()))
  const [isBalanceForecastModalOpen, setIsBalanceForecastModalOpen] = useState(false)
  const [isCardsModalOpen, setIsCardsModalOpen] = useState(false)
  const [visibleDate, setVisibleDate] = useState(() => {
    const initialDate = new Date()

    return new Date(initialDate.getFullYear(), initialDate.getMonth(), 1)
  })
  const [selectedDateKey, setSelectedDateKey] = useState<string | null>(null)
  const [summaryFilter, setSummaryFilter] = useState<SummaryFilter>('monthly')
  const [customStart, setCustomStart] = useState(() => {
    const initialDate = new Date()

    return toDateKey(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1))
  })
  const [customEnd, setCustomEnd] = useState(() => toDateKey(new Date()))

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentDateKey(toDateKey(new Date()))
    }, 60000)

    return () => window.clearInterval(intervalId)
  }, [])

  const calendarDays = useMemo(() => buildCalendarDays(visibleDate), [visibleDate])
  const periodRange = useMemo(
    () => getPeriodRange(summaryFilter, visibleDate, customStart, customEnd, currentDateKey),
    [currentDateKey, customEnd, customStart, summaryFilter, visibleDate],
  )
  const selectedDateTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.date === selectedDateKey),
    [selectedDateKey, transactions],
  )

  function changeMonth(direction: -1 | 1) {
    setVisibleDate(new Date(visibleDate.getFullYear(), visibleDate.getMonth() + direction, 1))
  }

  return {
    calendarDays,
    changeMonth,
    currentDateKey,
    customEnd,
    customStart,
    isBalanceForecastModalOpen,
    isCardsModalOpen,
    periodRange,
    selectedDateKey,
    selectedDateTransactions,
    setCustomEnd,
    setCustomStart,
    setIsBalanceForecastModalOpen,
    setIsCardsModalOpen,
    setSelectedDateKey,
    setSummaryFilter,
    summaryFilter,
    visibleDate,
  }
}
