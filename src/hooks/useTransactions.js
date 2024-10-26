import { useStore } from '@nanostores/react'
import { useCallback } from 'react'
import { transactionsStore, addTransaction, deleteTransaction as removeTransaction } from '../stores/transactionStore'

const useTransactions = () => {
    const transactions = useStore(transactionsStore)
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
            transactions, addNewTransaction, deleteTransaction, updateTransactions
        }
}

export default useTransactions