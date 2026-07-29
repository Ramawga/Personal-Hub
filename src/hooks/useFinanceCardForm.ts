import { type FormEvent, useState } from 'react'
import type { CardType, FinanceCard } from '../types/finances'

type UseFinanceCardFormParams = {
  addCard: (newCard: FinanceCard) => Promise<boolean>
  isSavingData: boolean
}

export function useFinanceCardForm({ addCard, isSavingData }: UseFinanceCardFormParams) {
  const [cardName, setCardName] = useState('')
  const [cardStatementDay, setCardStatementDay] = useState('10')
  const [cardLimit, setCardLimit] = useState('')
  const [cardType, setCardType] = useState<CardType>('credit')

  async function handleCardSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!cardName.trim() || !cardLimit || !cardStatementDay || isSavingData) {
      return
    }

    const statementDay = Math.min(Math.max(Number(cardStatementDay), 1), 31)

    if (
      await addCard({
        id: crypto.randomUUID(),
        limit: Number(cardLimit),
        name: cardName.trim(),
        statementDay,
        type: cardType,
      })
    ) {
      setCardName('')
      setCardLimit('')
      setCardStatementDay('10')
      setCardType('credit')
    }
  }

  return {
    cardLimit,
    cardName,
    cardStatementDay,
    cardType,
    handleCardSubmit,
    setCardLimit,
    setCardName,
    setCardStatementDay,
    setCardType,
  }
}
