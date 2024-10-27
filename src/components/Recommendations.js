import React, { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import { CircularProgress, Typography, Box } from '@mui/material';
import useTransactions from '../hooks/useTransactions';

function Recommendations() {
    const { expenses } = useTransactions();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            // setError("Failed to load recommendations.") //Simular error
            setLoading(false);
        }, 1000);

    }, []);

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    const now = new Date();
    const startOfCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
    const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)

    const expenseThisMonth = expenses
        .filter(transaction => transaction.date >= startOfCurrentMonth && transaction.date < startOfNextMonth)
        .reduce((sum, transaction) => sum + transaction.amount, 0)
    const expenseLastMonth = expenses
        .filter(transaction => transaction.date >= startOfLastMonth && transaction.date < startOfCurrentMonth)
        .reduce((sum, transaction) => sum + transaction.amount, 0)

    let message = ''
    
    if (expenseLastMonth === 0) {
        message = "Great job! You haven't recorded any expenses last month. Keep it up!"
    } else if (expenseThisMonth < expenseLastMonth) {
        const decreasePercentage = ((expenseLastMonth - expenseThisMonth) / expenseLastMonth) * 100
        message = `Congratulations! Your expenses decreased by ${decreasePercentage.toFixed(2)}%.`
    } else if (expenseThisMonth > expenseLastMonth) {
        const increasePercentage = ((expenseThisMonth - expenseLastMonth) / expenseLastMonth) * 100;
        message = `Your expenses increased by ${increasePercentage.toFixed(2)}%. Consider reviewing your spending.`
    } else {
        message = "Your spending hasn't changed compared to last month. Keep monitoring your expenses!"
    }

    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', color: '#007EAE' }}>Recommendations</Typography>
            <Typography>{message}</Typography>
        </Box>
    );
}

export default Recommendations;
