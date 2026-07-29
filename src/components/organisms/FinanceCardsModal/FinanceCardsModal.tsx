import { CreditCard, X } from 'lucide-react'
import type { FormEvent } from 'react'
import type { CardType, FinanceCard, Transaction } from '../../../types/finances'
import { currencyFormatter, getCardTypeLabel } from '../../../utils/finances'
import './FinanceCardsModal.scss'

type FinanceCardsModalProps = {
  cardLimit: string
  cardName: string
  cardStatementDay: string
  cardType: CardType
  cards: FinanceCard[]
  currentDateKey: string
  isSavingData: boolean
  onCardLimitChange: (value: string) => void
  onCardNameChange: (value: string) => void
  onCardStatementDayChange: (value: string) => void
  onCardTypeChange: (value: CardType) => void
  onClose: () => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  transactions: Transaction[]
}

export function FinanceCardsModal({
  cardLimit,
  cardName,
  cardStatementDay,
  cardType,
  cards,
  currentDateKey,
  isSavingData,
  onCardLimitChange,
  onCardNameChange,
  onCardStatementDayChange,
  onCardTypeChange,
  onClose,
  onSubmit,
  transactions,
}: FinanceCardsModalProps) {
  return (
    <div className="finance-modal" role="dialog" aria-modal="true" aria-label="Cartoes">
      <div className="finance-modal__content finance-cards-modal">
        <header>
          <div>
            <span>Controle de cartoes</span>
            <h2>Cartoes</h2>
          </div>
          <button aria-label="Fechar cartoes" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </header>

        <div className="finance-cards-modal__list">
          {cards.length > 0 ? (
            cards.map((card) => {
              const cardTransactions = transactions.filter((transaction) => transaction.cardId === card.id)
              const paidTotal = cardTransactions
                .filter((transaction) => transaction.date <= currentDateKey)
                .reduce((total, transaction) => total + transaction.amount, 0)
              const scheduledTotal = cardTransactions
                .filter((transaction) => transaction.date > currentDateKey)
                .reduce((total, transaction) => total + transaction.amount, 0)
              const totalSpent = paidTotal + scheduledTotal
              const installmentGroups = new Set(
                cardTransactions
                  .filter((transaction) => transaction.installmentGroupId && transaction.installments && transaction.installments > 1)
                  .map((transaction) => transaction.installmentGroupId),
              )

              return (
                <article className="finance-card-summary" key={card.id}>
                  <div className="finance-card-summary__title">
                    <CreditCard size={20} />
                    <div>
                      <strong>{card.name}</strong>
                      <span>
                        {getCardTypeLabel(card.type)} - fatura dia {card.statementDay}
                      </span>
                    </div>
                  </div>

                  <dl>
                    <div>
                      <dt>Limite</dt>
                      <dd>{currencyFormatter.format(card.limit)}</dd>
                    </div>
                    <div>
                      <dt>Gasto total</dt>
                      <dd>{currencyFormatter.format(totalSpent)}</dd>
                    </div>
                    <div>
                      <dt>Ja contabilizado</dt>
                      <dd>{currencyFormatter.format(paidTotal)}</dd>
                    </div>
                    <div>
                      <dt>Programado</dt>
                      <dd>{currencyFormatter.format(scheduledTotal)}</dd>
                    </div>
                    <div>
                      <dt>Compras parceladas</dt>
                      <dd>{installmentGroups.size}</dd>
                    </div>
                    <div>
                      <dt>Parcelas geradas</dt>
                      <dd>{cardTransactions.length}</dd>
                    </div>
                  </dl>
                </article>
              )
            })
          ) : (
            <p>Nenhum cartao cadastrado.</p>
          )}
        </div>

        <form className="finance-modal__form" onSubmit={onSubmit}>
          <div className="finance-modal__type">
            <button
              className={cardType === 'credit' ? 'is-active' : ''}
              onClick={() => onCardTypeChange('credit')}
              type="button"
            >
              Credito
            </button>
            <button
              className={cardType === 'debit' ? 'is-active' : ''}
              onClick={() => onCardTypeChange('debit')}
              type="button"
            >
              Debito
            </button>
          </div>

          <label>
            Nome do cartao
            <input
              onChange={(event) => onCardNameChange(event.target.value)}
              placeholder="Nubank, Inter, C6..."
              type="text"
              value={cardName}
            />
          </label>

          <label>
            Dia da fatura
            <input
              max="31"
              min="1"
              onChange={(event) => onCardStatementDayChange(event.target.value)}
              type="number"
              value={cardStatementDay}
            />
          </label>

          <label>
            Limite
            <input
              min="0"
              onChange={(event) => onCardLimitChange(event.target.value)}
              placeholder="0,00"
              step="0.01"
              type="number"
              value={cardLimit}
            />
          </label>

          <button disabled={isSavingData} type="submit">
            {isSavingData ? 'Salvando...' : 'Cadastrar cartao'}
          </button>
        </form>
      </div>
    </div>
  )
}
