import type { Transaction } from '../../../types/finances'
import { currencyFormatter, getPaymentMethodLabel } from '../../../utils/finances'
import './FinanceTransactionHistory.scss'

type FinanceTransactionHistoryProps = {
  emptyText: string
  transactions: Transaction[]
}

function formatDate(dateKey: string) {
  return dateKey.split('-').reverse().join('/')
}

export function FinanceTransactionHistory({ emptyText, transactions }: FinanceTransactionHistoryProps) {
  const sortedTransactions = [...transactions].sort((current, next) => next.date.localeCompare(current.date))

  return (
    <article className="finance-chart finance-chart--history">
      <h2>Historico de entradas e saidas</h2>

      <div className="finance-history">
        {sortedTransactions.length > 0 ? (
          sortedTransactions.map((transaction) => (
            <article className={`finance-history__item is-${transaction.type}`} key={transaction.id}>
              <div>
                <strong>{transaction.tag}</strong>
                <span>
                  {formatDate(transaction.date)}
                  {transaction.paymentMethod ? ` - ${getPaymentMethodLabel(transaction.paymentMethod)}` : ''}
                </span>
              </div>
              <strong>
                {transaction.type === 'income' ? '+' : '-'} {currencyFormatter.format(transaction.amount)}
              </strong>
            </article>
          ))
        ) : (
          <p>{emptyText}</p>
        )}
      </div>
    </article>
  )
}
