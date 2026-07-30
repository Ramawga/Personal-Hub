import { CircleDollarSign, ReceiptText, WalletCards } from 'lucide-react'
import { ExpenseBarChart } from '../../molecules/ExpenseBarChart'
import type { FinanceChartPoint, SummaryFilter, Transaction } from '../../../types/finances'
import { currencyFormatter } from '../../../utils/finances'
import { FinanceTransactionHistory } from '../FinanceTransactionHistory'

type FinanceSummaryProps = {
  balance: number
  customEnd: string
  customStart: string
  emptyBarText: string
  emptyChartText: string
  expenseTotal: number
  incomeTotal: number
  onCustomEndChange: (value: string) => void
  onCustomStartChange: (value: string) => void
  onSummaryFilterChange: (filter: SummaryFilter) => void
  summaryFilter: SummaryFilter
  tagChartData: FinanceChartPoint[]
  timeChartData: FinanceChartPoint[]
  transactions: Transaction[]
}

const summaryFilters: Array<{ label: string; value: SummaryFilter }> = [
  { label: 'Diario', value: 'daily' },
  { label: 'Mensal', value: 'monthly' },
  { label: 'Anual', value: 'yearly' },
  { label: 'Periodo', value: 'period' },
]

export function FinanceSummary({
  balance,
  customEnd,
  customStart,
  emptyBarText,
  emptyChartText,
  expenseTotal,
  incomeTotal,
  onCustomEndChange,
  onCustomStartChange,
  onSummaryFilterChange,
  summaryFilter,
  tagChartData,
  timeChartData,
  transactions,
}: FinanceSummaryProps) {
  return (
    <div className="finances-summary">
      <div className="finances-summary__toolbar">
        <div>
          <span>Resumo de gastos</span>
          <strong>{currencyFormatter.format(expenseTotal)}</strong>
        </div>

        <div className="finances-summary__filters" aria-label="Filtros do resumo">
          {summaryFilters.map((filter) => (
            <button
              className={summaryFilter === filter.value ? 'is-active' : ''}
              key={filter.value}
              onClick={() => onSummaryFilterChange(filter.value)}
              type="button"
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {summaryFilter === 'period' && (
        <div className="finances-summary__period">
          <label>
            Inicio
            <input onChange={(event) => onCustomStartChange(event.target.value)} type="date" value={customStart} />
          </label>
          <label>
            Fim
            <input onChange={(event) => onCustomEndChange(event.target.value)} type="date" value={customEnd} />
          </label>
        </div>
      )}

      <div className="finances-summary__metrics">
        <article>
          <CircleDollarSign size={22} />
          <span>Entradas</span>
          <strong>{currencyFormatter.format(incomeTotal)}</strong>
        </article>
        <article>
          <ReceiptText size={22} />
          <span>Saidas</span>
          <strong>{currencyFormatter.format(expenseTotal)}</strong>
        </article>
        <article>
          <WalletCards size={22} />
          <span>Saldo do periodo</span>
          <strong className={balance >= 0 ? 'is-positive' : 'is-negative'}>{currencyFormatter.format(balance)}</strong>
        </article>
      </div>

      <div className="finance-charts">
        <ExpenseBarChart emptyText={emptyBarText} tagChartData={tagChartData} timeChartData={timeChartData} />
        <FinanceTransactionHistory emptyText={emptyChartText} transactions={transactions} />
      </div>
    </div>
  )
}
