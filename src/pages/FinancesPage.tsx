import { CreditCard, TrendingUp, WalletCards } from 'lucide-react'
import { useMemo, useState } from 'react'
import { FinanceBalanceForecastModal } from '../components/organisms/FinanceBalanceForecastModal'
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
  buildBalanceProjection,
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
  const [monthlyIncomeEstimates, setMonthlyIncomeEstimates] = useState<string[]>(Array.from({ length: 12 }, () => ''))

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
  const balanceProjection = useMemo(
    () =>
      buildBalanceProjection(
        generalBalance,
        monthlyIncomeEstimates.map((estimate) => Number(estimate) || 0),
        transactions,
        currentDateKey,
      ),
    [currentDateKey, generalBalance, monthlyIncomeEstimates, transactions],
  )

  function closeDayModal() {
    setSelectedDateKey(null)
    transactionForm.resetTransactionForm()
  }

  function handleIncomeEstimateChange(index: number, value: string) {
    setMonthlyIncomeEstimates((currentEstimates) =>
      currentEstimates.map((estimate, estimateIndex) => (estimateIndex === index ? value : estimate)),
    )
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
        <div className="finances-page__actions">
          <button className="finances-page__action-button" onClick={() => setIsCardsModalOpen(true)} type="button">
            <CreditCard size={20} />
            Cartoes
          </button>
          <button
            className="finances-page__action-button"
            onClick={() => setIsBalanceForecastModalOpen(true)}
            type="button"
          >
            <TrendingUp size={20} />
            Previsao
          </button>
        </div>
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

      {isBalanceForecastModalOpen && (
        <FinanceBalanceForecastModal
          currentBalance={generalBalance}
          incomeEstimates={monthlyIncomeEstimates}
          onClose={() => setIsBalanceForecastModalOpen(false)}
          onIncomeEstimatesChange={setMonthlyIncomeEstimates}
          onIncomeEstimateChange={handleIncomeEstimateChange}
          projectionMonths={balanceProjection}
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
