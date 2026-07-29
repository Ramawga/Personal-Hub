import { ArrowLeft, ArrowRight, CalendarDays, Plus } from 'lucide-react'
import type { CalendarDay, Transaction } from '../../../types/finances'
import { currencyFormatter, isTransactionDue, monthFormatter, sumTransactions, weekdayLabels } from '../../../utils/finances'

type FinanceCalendarProps = {
  calendarDays: CalendarDay[]
  currentDateKey: string
  emptyDayText: string
  onChangeMonth: (direction: -1 | 1) => void
  onSelectDate: (dateKey: string) => void
  transactions: Transaction[]
  visibleDate: Date
}

export function FinanceCalendar({
  calendarDays,
  currentDateKey,
  emptyDayText,
  onChangeMonth,
  onSelectDate,
  transactions,
  visibleDate,
}: FinanceCalendarProps) {
  return (
    <section className="finance-calendar">
      <header>
        <div>
          <CalendarDays size={22} />
          <h2>{monthFormatter.format(visibleDate)}</h2>
        </div>
        <nav aria-label="Navegar por meses">
          <button aria-label="Mes anterior" onClick={() => onChangeMonth(-1)} type="button">
            <ArrowLeft size={18} />
          </button>
          <button aria-label="Proximo mes" onClick={() => onChangeMonth(1)} type="button">
            <ArrowRight size={18} />
          </button>
        </nav>
      </header>

      <div className="finance-calendar__weekdays">
        {weekdayLabels.map((weekday) => (
          <span key={weekday}>{weekday}</span>
        ))}
      </div>

      <div className="finance-calendar__grid">
        {calendarDays.map((calendarDay) => {
          const dayTransactions = transactions.filter((transaction) => transaction.date === calendarDay.dateKey)
          const dueTransactions = dayTransactions.filter((transaction) => isTransactionDue(transaction, currentDateKey))
          const scheduledCardTransactions = dayTransactions.filter(
            (transaction) =>
              transaction.type === 'expense' &&
              transaction.paymentMethod === 'card' &&
              !isTransactionDue(transaction, currentDateKey),
          )
          const dayIncome = sumTransactions(dueTransactions, 'income')
          const dayExpense = sumTransactions(dueTransactions, 'expense')
          const scheduledCardExpense = sumTransactions(scheduledCardTransactions, 'expense')

          return (
            <article
              className={`finance-day${calendarDay.isCurrentMonth ? '' : ' finance-day--muted'}${
                calendarDay.dateKey === currentDateKey ? ' finance-day--today' : ''
              }`}
              key={calendarDay.dateKey}
            >
              <header>
                <span>{calendarDay.date.getDate()}</span>
                <button
                  aria-label={`Abrir detalhes de ${calendarDay.dateKey}`}
                  onClick={() => onSelectDate(calendarDay.dateKey)}
                  type="button"
                >
                  <Plus size={16} />
                </button>
              </header>

              <div className="finance-day__values">
                {dayIncome > 0 && <strong className="is-income">+ {currencyFormatter.format(dayIncome)}</strong>}
                {dayExpense > 0 && <strong className="is-expense">- {currencyFormatter.format(dayExpense)}</strong>}
                {scheduledCardExpense > 0 && (
                  <strong className="is-scheduled">Programado - {currencyFormatter.format(scheduledCardExpense)}</strong>
                )}
                {dayIncome === 0 && dayExpense === 0 && scheduledCardExpense === 0 && <span>{emptyDayText}</span>}
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
