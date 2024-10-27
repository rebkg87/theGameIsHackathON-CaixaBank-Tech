import React from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import { Paper, Typography } from '@mui/material';
import useTransactions from '../hooks/useTransactions';

function Statistics() {
    const {expenses, totalExpense} = useTransactions()

    const uniqueDates = [...new Set(expenses.map(transaction => new Date(transaction.date).toLocaleDateString))]
    const averageDailyExpense = uniqueDates.length > 0 ? (totalExpense / uniqueDates.length) : 0
    const categoryExpenses = expenses.reduce ((acc, transaction) => {
        acc [transaction.category] = (acc [transaction.category] || 0) + transaction.amount
        return acc
    }, {})
    const maxCategory = Object.keys(categoryExpenses).reduce((max, category) => {
        return categoryExpenses[category] > (categoryExpenses[max] || 0) ? category : max
    }, null)

    return (
        <Paper sx={{ padding: 2, mt: 2 }}>
            <Typography variant="h6">Key Statistics</Typography>
            <Typography>
                Average Daily Expense: {averageDailyExpense.toFixed(2)} €
            </Typography>
            <Typography>
                Highest Spending Category:{' '}
                {maxCategory
                    ? `${maxCategory} (${categoryExpenses[maxCategory].toFixed(2)} €)`
                    : 'No data available'}
            </Typography>
        </Paper>
    );
}

export default Statistics;
