import type { CSSProperties } from 'react'
import type { ExpenseByTag } from '../../../types/finances'
import { currencyFormatter } from '../../../utils/finances'

type ExpensePieChartProps = {
  emptyText: string
  expenseTotal: number
  expensesByTag: ExpenseByTag[]
}

export function ExpensePieChart({ emptyText, expenseTotal, expensesByTag }: ExpensePieChartProps) {
  const pieBackground =
    expenseTotal > 0
      ? `conic-gradient(${expensesByTag
          .map((item, index) => {
            const previousTotal = expensesByTag
              .slice(0, index)
              .reduce((total, current) => total + current.amount, 0)
            const start = (previousTotal / expenseTotal) * 100
            const end = ((previousTotal + item.amount) / expenseTotal) * 100

            return `${item.color} ${start}% ${end}%`
          })
          .join(', ')})`
      : undefined

  return (
    <article className="finance-chart finance-chart--pie">
      <div
        aria-label="Grafico de pizza por categoria"
        className="finance-chart__pie"
        style={{ background: pieBackground }}
      />
      <div>
        <h2>Gastos por tag</h2>
        <ul>
          {expensesByTag.length > 0 ? (
            expensesByTag.map((item) => (
              <li key={item.tag}>
                <span style={{ '--tag-color': item.color } as CSSProperties} />
                {item.tag}
                <strong>{currencyFormatter.format(item.amount)}</strong>
              </li>
            ))
          ) : (
            <li>{emptyText}</li>
          )}
        </ul>
      </div>
    </article>
  )
}
