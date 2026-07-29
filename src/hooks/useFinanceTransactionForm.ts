import { type FormEvent, useState } from 'react'
import type { FinanceCard, FinanceTag, PaymentMethod, Transaction, TransactionType } from '../types/finances'
import { buildCardInstallmentTransactions, defaultTagColors } from '../utils/finances'

type UseFinanceTransactionFormParams = {
  addTransaction: (newTransaction: Transaction, tagColor: string) => Promise<boolean>
  addTransactions: (newTransactions: Transaction[], tagColor: string) => Promise<boolean>
  cards: FinanceCard[]
  isSavingData: boolean
  selectedDateKey: string | null
  tags: FinanceTag[]
}

export function useFinanceTransactionForm({
  addTransaction,
  addTransactions,
  cards,
  isSavingData,
  selectedDateKey,
  tags,
}: UseFinanceTransactionFormParams) {
  const [formType, setFormType] = useState<TransactionType>('expense')
  const [formPaymentMethod, setFormPaymentMethod] = useState<PaymentMethod>('pix')
  const [formCardId, setFormCardId] = useState('')
  const [formInstallments, setFormInstallments] = useState('1')
  const [formAmount, setFormAmount] = useState('')
  const [formTag, setFormTag] = useState('')
  const [formTagColor, setFormTagColor] = useState(defaultTagColors[0])
  const [formDescription, setFormDescription] = useState('')

  function resetTransactionForm() {
    setFormAmount('')
    setFormTag('')
    setFormDescription('')
    setFormType('expense')
    setFormPaymentMethod('pix')
    setFormCardId('')
    setFormInstallments('1')
  }

  function handleTagNameChange(tagName: string) {
    const existingTag = tags.find((tag) => tag.name.toLowerCase() === tagName.trim().toLowerCase())

    setFormTag(tagName)

    if (existingTag) {
      setFormTagColor(existingTag.color)
    }
  }

  function selectTag(tag: FinanceTag) {
    setFormTag(tag.name)
    setFormTagColor(tag.color)
  }

  function handlePaymentMethodChange(paymentMethod: PaymentMethod) {
    setFormPaymentMethod(paymentMethod)

    if (paymentMethod !== 'card') {
      setFormCardId('')
      setFormInstallments('1')

      return
    }

    setFormCardId((currentCardId) => currentCardId || cards[0]?.id || '')
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!selectedDateKey || !formAmount || !formTag.trim() || isSavingData) {
      return
    }

    const amount = Number(formAmount)
    const description = formDescription.trim() || formTag.trim()
    const tag = formTag.trim()

    if (formType === 'expense' && formPaymentMethod === 'card') {
      const selectedCard = cards.find((card) => card.id === formCardId)

      if (!selectedCard) {
        return
      }

      const cardTransactions = buildCardInstallmentTransactions({
        amount,
        card: selectedCard,
        dateKey: selectedDateKey,
        description,
        installments: Number(formInstallments) || 1,
        tag,
      })

      if (await addTransactions(cardTransactions, formTagColor)) {
        resetTransactionForm()
      }

      return
    }

    const newTransaction: Transaction = {
      amount,
      date: selectedDateKey,
      description,
      id: crypto.randomUUID(),
      paymentMethod: formType === 'expense' ? formPaymentMethod : undefined,
      tag,
      type: formType,
    }

    if (await addTransaction(newTransaction, formTagColor)) {
      resetTransactionForm()
    }
  }

  return {
    formAmount,
    formCardId,
    formDescription,
    formInstallments,
    formPaymentMethod,
    formTag,
    formTagColor,
    formType,
    handlePaymentMethodChange,
    handleSubmit,
    handleTagNameChange,
    resetTransactionForm,
    selectTag,
    setFormAmount,
    setFormCardId,
    setFormDescription,
    setFormInstallments,
    setFormTagColor,
    setFormType,
  }
}
