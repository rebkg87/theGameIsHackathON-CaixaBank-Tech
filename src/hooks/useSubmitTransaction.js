
import useTransactions from './useTransactions';

const useSubmitTransaction = (editTransactionId, resetForm, onClose) => {
    const { addNewTransaction, updateTransactions } = useTransactions()

    const handleTransactionSubmit = (description, amount, type, category, date) => {
        if (!description || !amount || !category || !type) {
            alert('Please fill in all fields!');
            return;
        }

        const transactionData = {
            id: editTransactionId ? editTransactionId : Date.now(),
            description,
            amount: parseFloat(amount),
            type,
            category,
            date: new Date().toLocaleDateString()
        };

        if (editTransactionId) {
            updateTransactions(transactionData);
        } else {
            addNewTransaction(transactionData);
        }

        resetForm()
        if (onClose) onClose()
    };

    return {
        handleTransactionSubmit,
    };
};

export default useSubmitTransaction;
