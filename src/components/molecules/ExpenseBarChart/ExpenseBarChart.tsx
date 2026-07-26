import type { ExpenseByTag } from '../../../types/finances'
import { currencyFormatter } from '../../../utils/finances'

type ExpenseBarChartProps = {
  emptyText: string
  expenseTotal: number
  expensesByTag: ExpenseByTag[]
}

export function ExpenseBarChart({ emptyText, expenseTotal, expensesByTag }: ExpenseBarChartProps) {
  return (
    <article className="finance-chart finance-chart--bars">
      <h2>Colunas por categoria</h2>
      <div className="finance-chart__bars">
        {expensesByTag.length > 0 ? (
          expensesByTag.map((item) => (
            <div className="finance-chart__bar-item" key={item.tag}>
              <span>{currencyFormatter.format(item.amount)}</span>
              <div>
                <i style={{ height: `${Math.max((item.amount / expenseTotal) * 100, 8)}%` }} />
              </div>
              <strong>{item.tag}</strong>
            </div>
          ))
        ) : (
          <p>{emptyText}</p>
        )}
      </div>
    </article>
  )
}
