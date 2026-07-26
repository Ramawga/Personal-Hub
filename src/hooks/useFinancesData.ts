import { useEffect, useState } from 'react'
import type { FinanceTag, FinancesData, Transaction } from '../types/finances'
import { createTagsFromTransactions, financesApiPath } from '../utils/finances'

export function useFinancesData() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [tags, setTags] = useState<FinanceTag[]>([])
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [isSavingData, setIsSavingData] = useState(false)
  const [dataError, setDataError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadFinancesData() {
      try {
        const response = await fetch(financesApiPath)

        if (!response.ok) {
          throw new Error('Nao foi possivel carregar os dados financeiros.')
        }

        const data = (await response.json()) as FinancesData

        if (isMounted) {
          const loadedTransactions = Array.isArray(data.transactions) ? data.transactions : []
          const loadedTags = Array.isArray(data.tags) ? data.tags : createTagsFromTransactions(loadedTransactions)

          setTransactions(loadedTransactions)
          setTags(loadedTags)
          setDataError('')
        }
      } catch {
        if (isMounted) {
          setDataError('Nao foi possivel carregar o arquivo de financas.')
        }
      } finally {
        if (isMounted) {
          setIsLoadingData(false)
        }
      }
    }

    void loadFinancesData()

    return () => {
      isMounted = false
    }
  }, [])

  async function persistFinances(nextTransactions: Transaction[], nextTags: FinanceTag[]) {
    const nextData: FinancesData = {
      tags: nextTags,
      transactions: nextTransactions,
    }

    const response = await fetch(financesApiPath, {
      body: JSON.stringify(nextData),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    })

    if (!response.ok) {
      throw new Error('Nao foi possivel salvar os dados financeiros.')
    }
  }

  async function addTransaction(newTransaction: Transaction, tagColor: string) {
    if (isSavingData) {
      return false
    }

    const existingTag = tags.find((tag) => tag.name.toLowerCase() === newTransaction.tag.toLowerCase())
    const nextTags = existingTag
      ? tags.map((tag) =>
          tag.name.toLowerCase() === newTransaction.tag.toLowerCase() ? { ...tag, color: tagColor } : tag,
        )
      : [...tags, { color: tagColor, name: newTransaction.tag }]
    const nextTransactions = [...transactions, newTransaction]

    setTransactions(nextTransactions)
    setTags(nextTags)
    setIsSavingData(true)

    try {
      await persistFinances(nextTransactions, nextTags)
      setDataError('')

      return true
    } catch {
      setTransactions(transactions)
      setTags(tags)
      setDataError('Nao foi possivel salvar o lancamento no arquivo JSON.')

      return false
    } finally {
      setIsSavingData(false)
    }
  }

  async function deleteTransaction(transactionId: string) {
    if (isSavingData) {
      return
    }

    const nextTransactions = transactions.filter((transaction) => transaction.id !== transactionId)

    setTransactions(nextTransactions)
    setIsSavingData(true)

    try {
      await persistFinances(nextTransactions, tags)
      setDataError('')
    } catch {
      setTransactions(transactions)
      setDataError('Nao foi possivel excluir o lancamento no arquivo JSON.')
    } finally {
      setIsSavingData(false)
    }
  }

  return {
    addTransaction,
    dataError,
    deleteTransaction,
    isLoadingData,
    isSavingData,
    tags,
    transactions,
  }
}
