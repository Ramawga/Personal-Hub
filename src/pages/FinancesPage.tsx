import { CreditCard, WalletCards } from 'lucide-react'
import { useMemo } from 'react'
import { FinanceCardsModal } from '../components/organisms/FinanceCardsModal'
import { FinanceCalendar } from '../components/organisms/FinanceCalendar'
import { FinanceDayModal } from '../components/organisms/FinanceDayModal'
import { FinanceSummary } from '../components/organisms/FinanceSummary'
import { useFinanceCardForm } from '../hooks/useFinanceCardForm'
import { useFinancePageState } from '../hooks/useFinancePageState'
import { useFinancesData } from '../hooks/useFinancesData'
import { useFinanceTransactionForm } from '../hooks/useFinanceTransactionForm'
import { routeLabels } from '../routes/routeLabels'
import {
  currencyFormatter,
  buildExpenseTimeSeries,
  getAccountedTransactions,
  getTransactionsInRange,
  groupExpensesByTag,
  mapTagsToChartPoints,
  sumTransactions,
} from '../utils/finances'
import './FinancesPage.scss'

export function FinancesPage() {
  const financesData = useFinancesData()
  const {
    addCard,
    addTransaction,
    addTransactions,
    cards,
    dataError,
    deleteTransaction,
    isLoadingData,
    isSavingData,
    tags,
    transactions,
  } = financesData
  const pageState = useFinancePageState(transactions)
  const {
    calendarDays,
    changeMonth,
    currentDateKey,
    customEnd,
    customStart,
    isCardsModalOpen,
    periodRange,
    selectedDateKey,
    selectedDateTransactions,
    setCustomEnd,
    setCustomStart,
    setIsCardsModalOpen,
    setSelectedDateKey,
    setSummaryFilter,
    summaryFilter,
    visibleDate,
  } = pageState
  const cardForm = useFinanceCardForm({ addCard, isSavingData })
  const transactionForm = useFinanceTransactionForm({
    addTransaction,
    addTransactions,
    cards,
    isSavingData,
    selectedDateKey,
    tags,
  })

  const accountedTransactions = useMemo(
    () => getAccountedTransactions(transactions, currentDateKey),
    [currentDateKey, transactions],
  )
  const filteredTransactions = useMemo(
    () => getTransactionsInRange(accountedTransactions, periodRange.start, periodRange.end),
    [accountedTransactions, periodRange.end, periodRange.start],
  )

  const expenseTotal = sumTransactions(filteredTransactions, 'expense')
  const incomeTotal = sumTransactions(filteredTransactions, 'income')
  const balance = incomeTotal - expenseTotal
  const generalBalance =
    sumTransactions(accountedTransactions, 'income') - sumTransactions(accountedTransactions, 'expense')
  const expensesByTag = useMemo(
    () => groupExpensesByTag(filteredTransactions, tags),
    [filteredTransactions, tags],
  )
  const tagChartData = useMemo(() => mapTagsToChartPoints(expensesByTag), [expensesByTag])
  const timeChartData = useMemo(
    () => buildExpenseTimeSeries(accountedTransactions, summaryFilter, visibleDate, periodRange),
    [accountedTransactions, periodRange, summaryFilter, visibleDate],
  )

  function closeDayModal() {
    setSelectedDateKey(null)
    transactionForm.resetTransactionForm()
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
        <button className="finances-page__cards-button" onClick={() => setIsCardsModalOpen(true)} type="button">
          <CreditCard size={20} />
          Cartoes
        </button>
      </header>

      <FinanceSummary
        balance={balance}
        customEnd={customEnd}
        customStart={customStart}
        emptyBarText={isLoadingData ? 'Carregando dados...' : 'Nenhum gasto para comparar.'}
        emptyChartText={isLoadingData ? 'Carregando dados...' : 'Nenhum gasto no periodo'}
        expenseTotal={expenseTotal}
        incomeTotal={incomeTotal}
        onCustomEndChange={setCustomEnd}
        onCustomStartChange={setCustomStart}
        onSummaryFilterChange={setSummaryFilter}
        summaryFilter={summaryFilter}
        tagChartData={tagChartData}
        timeChartData={timeChartData}
        transactions={filteredTransactions}
      />

      <FinanceCalendar
        calendarDays={calendarDays}
        currentDateKey={currentDateKey}
        emptyDayText={isLoadingData ? 'Carregando' : 'Sem lancamentos'}
        onChangeMonth={changeMonth}
        onSelectDate={setSelectedDateKey}
        transactions={transactions}
        visibleDate={visibleDate}
      />

      {isCardsModalOpen && (
        <FinanceCardsModal
          cardLimit={cardForm.cardLimit}
          cardName={cardForm.cardName}
          cardStatementDay={cardForm.cardStatementDay}
          cardType={cardForm.cardType}
          cards={cards}
          currentDateKey={currentDateKey}
          isSavingData={isSavingData}
          onCardLimitChange={cardForm.setCardLimit}
          onCardNameChange={cardForm.setCardName}
          onCardStatementDayChange={cardForm.setCardStatementDay}
          onCardTypeChange={cardForm.setCardType}
          onClose={() => setIsCardsModalOpen(false)}
          onSubmit={cardForm.handleCardSubmit}
          transactions={transactions}
        />
      )}

      {selectedDateKey && (
        <FinanceDayModal
          cards={cards}
          emptyModalText={isLoadingData ? 'Carregando lancamentos...' : 'Nenhum lancamento cadastrado para esse dia.'}
          formAmount={transactionForm.formAmount}
          formCardId={transactionForm.formCardId}
          formDescription={transactionForm.formDescription}
          formInstallments={transactionForm.formInstallments}
          formPaymentMethod={transactionForm.formPaymentMethod}
          formTag={transactionForm.formTag}
          formTagColor={transactionForm.formTagColor}
          formType={transactionForm.formType}
          isSavingData={isSavingData}
          onAmountChange={transactionForm.setFormAmount}
          onCardChange={transactionForm.setFormCardId}
          onClose={closeDayModal}
          onDeleteTransaction={(transactionId) => void deleteTransaction(transactionId)}
          onDescriptionChange={transactionForm.setFormDescription}
          onInstallmentsChange={transactionForm.setFormInstallments}
          onPaymentMethodChange={transactionForm.handlePaymentMethodChange}
          onSelectTag={transactionForm.selectTag}
          onSubmit={transactionForm.handleSubmit}
          onTagChange={transactionForm.handleTagNameChange}
          onTagColorChange={transactionForm.setFormTagColor}
          onTypeChange={transactionForm.setFormType}
          selectedDateKey={selectedDateKey}
          tags={tags}
          transactions={selectedDateTransactions}
        />
      )}
    </section>
  )
}
