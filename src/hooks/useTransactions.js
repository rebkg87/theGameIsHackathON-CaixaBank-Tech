import { useStore } from '@nanostores/react'
import { useCallback } from 'react'
import { transactionsStore, addTransaction, deleteTransaction as removeTransaction } from '../stores/transactionStore'

const useTransactions = () => {
    const transactions = useStore(transactionsStore)

    const expenses = transactions.filter(transaction => transaction.type === 'expense')

    const income = transactions.filter(transaction => transaction.type === 'income')

    const totalExpense = expenses.reduce((sum, transaction) => sum + transaction.amount, 0);
    const totalIncome = income.reduce((sum, transaction) => sum + transaction.amount, 0);

    const addNewTransaction = useCallback((transaction)=> {
        addTransaction(transaction)
    },[])
    const deleteTransaction = useCallback((id)=>{
        removeTransaction(id)
    },[])
    const updateTransactions = useCallback((updatedTransactions)=>{
        removeTransaction(updatedTransactions.id)
        addTransaction(updatedTransactions)
    },[])

        return {
            transactions, expenses, income, totalExpense, totalIncome, addNewTransaction, deleteTransaction, updateTransactions
        }
}

export default useTransactions