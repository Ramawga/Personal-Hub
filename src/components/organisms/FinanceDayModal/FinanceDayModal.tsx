import { Trash2, X } from 'lucide-react'
import type { CSSProperties, FormEvent } from 'react'
import type { FinanceCard, FinanceTag, PaymentMethod, Transaction, TransactionType } from '../../../types/finances'
import { currencyFormatter, getPaymentMethodLabel } from '../../../utils/finances'

type FinanceDayModalProps = {
  cards: FinanceCard[]
  emptyModalText: string
  formAmount: string
  formCardId: string
  formDescription: string
  formInstallments: string
  formPaymentMethod: PaymentMethod
  formTag: string
  formTagColor: string
  formType: TransactionType
  isSavingData: boolean
  onAmountChange: (value: string) => void
  onCardChange: (value: string) => void
  onClose: () => void
  onDeleteTransaction: (transactionId: string) => void
  onDescriptionChange: (value: string) => void
  onInstallmentsChange: (value: string) => void
  onPaymentMethodChange: (paymentMethod: PaymentMethod) => void
  onSelectTag: (tag: FinanceTag) => void
  onSubmit: (event: FormEvent<HTMLFormElement>) => void
  onTagChange: (value: string) => void
  onTagColorChange: (value: string) => void
  onTypeChange: (type: TransactionType) => void
  selectedDateKey: string
  tags: FinanceTag[]
  transactions: Transaction[]
}

export function FinanceDayModal({
  cards,
  emptyModalText,
  formAmount,
  formCardId,
  formDescription,
  formInstallments,
  formPaymentMethod,
  formTag,
  formTagColor,
  formType,
  isSavingData,
  onAmountChange,
  onCardChange,
  onClose,
  onDeleteTransaction,
  onDescriptionChange,
  onInstallmentsChange,
  onPaymentMethodChange,
  onSelectTag,
  onSubmit,
  onTagChange,
  onTagColorChange,
  onTypeChange,
  selectedDateKey,
  tags,
  transactions,
}: FinanceDayModalProps) {
  const selectedCard = cards.find((card) => card.id === formCardId)

  return (
    <div className="finance-modal" role="dialog" aria-modal="true" aria-label="Detalhes do dia">
      <div className="finance-modal__content">
        <header>
          <div>
            <span>Detalhes do dia</span>
            <h2>{selectedDateKey.split('-').reverse().join('/')}</h2>
          </div>
          <button aria-label="Fechar modal" onClick={onClose} type="button">
            <X size={20} />
          </button>
        </header>

        <div className="finance-modal__list">
          {transactions.length > 0 ? (
            transactions.map((transaction) => (
              <article className={`is-${transaction.type}`} key={transaction.id}>
                <div>
                  <strong>{transaction.tag}</strong>
                  <span>
                    {transaction.description}
                    {transaction.paymentMethod ? ` - ${getPaymentMethodLabel(transaction.paymentMethod)}` : ''}
                    {transaction.cardId
                      ? ` - ${cards.find((card) => card.id === transaction.cardId)?.name ?? 'Cartao'}`
                      : ''}
                    {transaction.installments && transaction.installments > 1
                      ? ` - ${transaction.installmentNumber}/${transaction.installments}`
                      : ''}
                  </span>
                </div>
                <strong>
                  {transaction.type === 'income' ? '+' : '-'} {currencyFormatter.format(transaction.amount)}
                </strong>
                <button
                  aria-label={`Excluir lancamento ${transaction.tag}`}
                  disabled={isSavingData}
                  onClick={() => onDeleteTransaction(transaction.id)}
                  type="button"
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))
          ) : (
            <p>{emptyModalText}</p>
          )}
        </div>

        <form className="finance-modal__form" onSubmit={onSubmit}>
          <div className="finance-modal__type">
            <button
              className={formType === 'expense' ? 'is-active' : ''}
              onClick={() => onTypeChange('expense')}
              type="button"
            >
              Gasto
            </button>
            <button
              className={formType === 'income' ? 'is-active' : ''}
              onClick={() => onTypeChange('income')}
              type="button"
            >
              Ganho
            </button>
          </div>

          {formType === 'expense' && (
            <div className="finance-modal__payment">
              <button
                className={formPaymentMethod === 'pix' ? 'is-active' : ''}
                onClick={() => onPaymentMethodChange('pix')}
                type="button"
              >
                Pix
              </button>
              <button
                className={formPaymentMethod === 'cash' ? 'is-active' : ''}
                onClick={() => onPaymentMethodChange('cash')}
                type="button"
              >
                Dinheiro
              </button>
              <button
                className={formPaymentMethod === 'card' ? 'is-active' : ''}
                onClick={() => onPaymentMethodChange('card')}
                type="button"
              >
                Cartao
              </button>
            </div>
          )}

          {formType === 'expense' && formPaymentMethod === 'card' && (
            <div className="finance-modal__card-fields">
              {cards.length > 0 ? (
                <>
                  <label>
                    Cartao
                    <select onChange={(event) => onCardChange(event.target.value)} value={formCardId}>
                      <option value="">Selecione um cartao</option>
                      {cards.map((card) => (
                        <option key={card.id} value={card.id}>
                          {card.name}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Parcelas
                    <input
                      disabled={selectedCard?.type === 'debit'}
                      max="48"
                      min="1"
                      onChange={(event) => onInstallmentsChange(event.target.value)}
                      type="number"
                      value={selectedCard?.type === 'debit' ? '1' : formInstallments}
                    />
                  </label>
                </>
              ) : (
                <p>Cadastre um cartao antes de lancar gastos no cartao.</p>
              )}
            </div>
          )}

          <label>
            Valor
            <input
              min="0"
              onChange={(event) => onAmountChange(event.target.value)}
              placeholder="0,00"
              step="0.01"
              type="number"
              value={formAmount}
            />
          </label>
          {tags.length > 0 && (
            <div className="finance-modal__tags" aria-label="Tags existentes">
              {tags.map((tag) => (
                <button
                  key={tag.name}
                  onClick={() => onSelectTag(tag)}
                  style={{ '--tag-color': tag.color } as CSSProperties}
                  type="button"
                >
                  {tag.name}
                </button>
              ))}
            </div>
          )}
          <label>
            Tag
            <input
              onChange={(event) => onTagChange(event.target.value)}
              placeholder="Mercado, Ifood, Salario..."
              type="text"
              value={formTag}
            />
          </label>
          <label>
            Cor da tag
            <input onChange={(event) => onTagColorChange(event.target.value)} type="color" value={formTagColor} />
          </label>
          <label>
            Descricao
            <input
              onChange={(event) => onDescriptionChange(event.target.value)}
              placeholder="Opcional"
              type="text"
              value={formDescription}
            />
          </label>

          <button disabled={isSavingData} type="submit">
            {isSavingData ? 'Salvando...' : 'Adicionar lancamento'}
          </button>
        </form>
      </div>
    </div>
  )
}
