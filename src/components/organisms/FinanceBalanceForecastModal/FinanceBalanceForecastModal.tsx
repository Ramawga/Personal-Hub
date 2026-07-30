import { TrendingUp, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { BalanceProjectionMonth } from '../../../types/finances'
import { currencyFormatter } from '../../../utils/finances'
import '../FinanceDayModal/FinanceDayModal.scss'
import './FinanceBalanceForecastModal.scss'

type FinanceBalanceForecastModalProps = {
  currentBalance: number
  incomeEstimates: string[]
  onClose: () => void
  onIncomeEstimatesChange: (values: string[]) => void
  onIncomeEstimateChange: (index: number, value: string) => void
  projectionMonths: BalanceProjectionMonth[]
}

export function FinanceBalanceForecastModal({
  currentBalance,
  incomeEstimates,
  onClose,
  onIncomeEstimatesChange,
  onIncomeEstimateChange,
  projectionMonths,
}: FinanceBalanceForecastModalProps) {
  const [simulationMode, setSimulationMode] = useState<'detailed' | 'simple'>('simple')
  const simpleIncomeEstimate = useMemo(() => incomeEstimates.find(Boolean) ?? '', [incomeEstimates])
  const lastProjection = projectionMonths.at(-1)

  function handleSimpleIncomeChange(value: string) {
    onIncomeEstimatesChange(Array.from({ length: 12 }, () => value))
  }

  return (
    <div className="finance-modal" role="dialog" aria-modal="true" aria-label="Previsao de saldos">
      <div className="finance-modal__content finance-forecast-modal">
        <header>
          <div>
            <span>Proximos 12 meses</span>
            <h2>Previsao de saldo</h2>
          </div>
          <button aria-label="Fechar previsao" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </header>

        <div className="finance-forecast-modal__overview">
          <article>
            <span>Saldo atual</span>
            <strong>{currencyFormatter.format(currentBalance)}</strong>
          </article>
          <article>
            <span>Saldo previsto</span>
            <strong className={(lastProjection?.endingBalance ?? currentBalance) >= 0 ? 'is-positive' : 'is-negative'}>
              {currencyFormatter.format(lastProjection?.endingBalance ?? currentBalance)}
            </strong>
          </article>
        </div>

        <div className="finance-forecast-modal__mode">
          <div className="finance-forecast-modal__mode-actions" aria-label="Modo da previsao">
            <button
              className={simulationMode === 'simple' ? 'is-active' : ''}
              onClick={() => setSimulationMode('simple')}
              type="button"
            >
              Simples
            </button>
            <button
              className={simulationMode === 'detailed' ? 'is-active' : ''}
              onClick={() => setSimulationMode('detailed')}
              type="button"
            >
              Mes a mes
            </button>
          </div>

          {simulationMode === 'simple' ? (
            <label>
              Renda mensal estimada
              <input
                min="0"
                onChange={(event) => handleSimpleIncomeChange(event.target.value)}
                placeholder="0,00"
                step="0.01"
                type="number"
                value={simpleIncomeEstimate}
              />
            </label>
          ) : (
            <div className="finance-forecast-modal__income-grid">
              {projectionMonths.map((month, index) => (
                <label key={month.monthKey}>
                  {month.label}
                  <input
                    min="0"
                    onChange={(event) => onIncomeEstimateChange(index, event.target.value)}
                    placeholder="0,00"
                    step="0.01"
                    type="number"
                    value={incomeEstimates[index] ?? ''}
                  />
                </label>
              ))}
            </div>
          )}
        </div>

        <div className="finance-forecast-modal__table">
          <header>
            <span>Mes</span>
            <span>Entrada</span>
            <span>Cartoes</span>
            <span>Saldo</span>
          </header>

          {projectionMonths.map((month) => (
            <article key={month.monthKey}>
              <strong>{month.label}</strong>
              <span className="is-positive">+ {currencyFormatter.format(month.estimatedIncome)}</span>
              <span className="is-negative">- {currencyFormatter.format(month.cardExpenses)}</span>
              <strong className={month.endingBalance >= 0 ? 'is-positive' : 'is-negative'}>
                {currencyFormatter.format(month.endingBalance)}
              </strong>
            </article>
          ))}
        </div>

        <div className="finance-forecast-modal__note">
          <TrendingUp size={18} />
          <span>A previsao considera o saldo atual, a renda estimada e gastos de cartao ja lancados.</span>
        </div>
      </div>
    </div>
  )
}
