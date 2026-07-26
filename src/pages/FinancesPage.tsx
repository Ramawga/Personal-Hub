import { WalletCards } from 'lucide-react'
import { type FormEvent, useCallback, useEffect, useMemo, useState } from 'react'
import { FinanceCalendar } from '../components/organisms/FinanceCalendar'
import { FinanceDayModal } from '../components/organisms/FinanceDayModal'
import { FinanceSummary } from '../components/organisms/FinanceSummary'
import { useFinancesData } from '../hooks/useFinancesData'
import { routeLabels } from '../routes/routeLabels'
import type { FinanceTag, PaymentMethod, SummaryFilter, Transaction, TransactionType } from '../types/finances'
import {
  buildCalendarDays,
  currencyFormatter,
  defaultTagColors,
  getPeriodRange,
  sumTransactions,
  toDateKey,
} from '../utils/finances'
import './FinancesPage.scss'

export function FinancesPage() {
  const { addTransaction, dataError, deleteTransaction, isLoadingData, isSavingData, tags, transactions } =
    useFinancesData()
  const [currentDateKey, setCurrentDateKey] = useState(toDateKey(new Date()))
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
  const [formType, setFormType] = useState<TransactionType>('expense')
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethod>('pix')
  const [formAmount, setFormAmount] = useState('')
  const [formTag, setFormTag] = useState('')
  const [formTagColor, setFormTagColor] = useState(defaultTagColors[0])
  const [formDescription, setFormDescription] = useState('')

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

  const filteredTransactions = useMemo(
    () =>
      transactions.filter(
        (transaction) => transaction.date >= periodRange.start && transaction.date <= periodRange.end,
      ),
    [periodRange.end, periodRange.start, transactions],
  )

  const selectedDateTransactions = useMemo(
    () => transactions.filter((transaction) => transaction.date === selectedDateKey),
    [selectedDateKey, transactions],
  )

  const expenseTotal = sumTransactions(filteredTransactions, 'expense')
  const incomeTotal = sumTransactions(filteredTransactions, 'income')
  const balance = incomeTotal - expenseTotal
  const generalBalance = sumTransactions(transactions, 'income') - sumTransactions(transactions, 'expense')

  const getTagColor = useCallback(
    (tagName: string, fallbackIndex = 0) =>
      tags.find((tag) => tag.name.toLowerCase() === tagName.toLowerCase())?.color ?? defaultTagColors[
        fallbackIndex % defaultTagColors.length
      ],
    [tags],
  )

  const expensesByTag = useMemo(() => {
    const grouped = filteredTransactions
      .filter((transaction) => transaction.type === 'expense')
      .reduce<Record<string, number>>((accumulator, transaction) => {
        accumulator[transaction.tag] = (accumulator[transaction.tag] ?? 0) + transaction.amount

        return accumulator
      }, {})

    return Object.entries(grouped)
      .map(([tag, amount], index) => ({
        amount,
        color: getTagColor(tag, index),
        tag,
      }))
      .sort((current, next) => next.amount - current.amount)
  }, [filteredTransactions, getTagColor])

  function changeMonth(direction: -1 | 1) {
    setVisibleDate(new Date(visibleDate.getFullYear(), visibleDate.getMonth() + direction, 1))
  }

  function closeModal() {
    setSelectedDateKey(null)
    setFormAmount('')
    setFormTag('')
    setFormDescription('')
    setFormType('expense')
    setFormPaymentMethod('pix')
  }

  function handleTagNameChange(tagName: string) {
    const existingTag = tags.find((tag) => tag.name.toLowerCase() === tagName.trim().toLowerCase())

    setFormTag(tagName)

    if (existingTag) {
      setFormTagColor(existingTag.color)
    }
  }

  function selectTag(tag: FinanceTag) {
    setFormTag(tag.name)
    setFormTagColor(tag.color)
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedDateKey || !formAmount || !formTag.trim() || isSavingData) {
      return
    }

    const newTransaction: Transaction = {
      amount: Number(formAmount),
      date: selectedDateKey,
      description: formDescription.trim() || formTag.trim(),
      id: crypto.randomUUID(),
      paymentMethod: formType === 'expense' ? formPaymentMethod : undefined,
      tag: formTag.trim(),
      type: formType,
    }

    if (await addTransaction(newTransaction, formTagColor)) {
      setFormAmount('')
      setFormTag('')
      setFormDescription('')
      setFormType('expense')
      setFormPaymentMethod('pix')
    }
  }

  function getEmptyChartText() {
    if (isLoadingData) {
      return 'Carregando dados...'
    }

    return 'Nenhum gasto no periodo'
  }

  function getEmptyBarText() {
    if (isLoadingData) {
      return 'Carregando dados...'
    }

    return 'Nenhum gasto para comparar.'
  }

  function getEmptyDayText() {
    if (isLoadingData) {
      return 'Carregando'
    }

    return 'Sem lancamentos'
  }

  function getEmptyModalText() {
    if (isLoadingData) {
      return 'Carregando lancamentos...'
    }

    return 'Nenhum lancamento cadastrado para esse dia.'
  }

  return (
    <section className="finances-page">
      <header className="finances-page__header">
        <div>
          <span>Hub pessoal</span>
          <h1>{routeLabels.finances}</h1>
          {dataError && <p className="finances-page__status">{dataError}</p>}
        </div>
        <div className="finances-page__balance">
          <WalletCards size={22} />
          <span>Saldo total</span>
          <strong>{currencyFormatter.format(generalBalance)}</strong>
        </div>
      </header>

      <FinanceSummary
        balance={balance}
        customEnd={customEnd}
        customStart={customStart}
        emptyBarText={getEmptyBarText()}
        emptyChartText={getEmptyChartText()}
        expenseTotal={expenseTotal}
        expensesByTag={expensesByTag}
        incomeTotal={incomeTotal}
        onCustomEndChange={setCustomEnd}
        onCustomStartChange={setCustomStart}
        onSummaryFilterChange={setSummaryFilter}
        summaryFilter={summaryFilter}
      />

      <FinanceCalendar
        calendarDays={calendarDays}
        currentDateKey={currentDateKey}
        emptyDayText={getEmptyDayText()}
        onChangeMonth={changeMonth}
        onSelectDate={setSelectedDateKey}
        transactions={transactions}
        visibleDate={visibleDate}
      />

      {selectedDateKey && (
        <FinanceDayModal
          emptyModalText={getEmptyModalText()}
          formAmount={formAmount}
          formDescription={formDescription}
          formPaymentMethod={formPaymentMethod}
          formTag={formTag}
          formTagColor={formTagColor}
          formType={formType}
          isSavingData={isSavingData}
          onAmountChange={setFormAmount}
          onClose={closeModal}
          onDeleteTransaction={(transactionId) => void deleteTransaction(transactionId)}
          onDescriptionChange={setFormDescription}
          onPaymentMethodChange={setFormPaymentMethod}
          onSelectTag={selectTag}
          onSubmit={handleSubmit}
          onTagChange={handleTagNameChange}
          onTagColorChange={setFormTagColor}
          onTypeChange={setFormType}
          selectedDateKey={selectedDateKey}
          tags={tags}
          transactions={selectedDateTransactions}
        />
      )}
    </section>
  )
}
