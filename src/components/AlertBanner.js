import React from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import { userSettingsStore } from '../stores/userSettingsStore';
import { Alert, Box, Collapse } from '@mui/material';

function AlertBanner({ errorMessage }) {
    const transactions = useStore(transactionsStore);
    const userSettings = useStore(userSettingsStore);

    const { totalBudgetLimit, categoryLimits, alertsEnabled } = userSettings;

    if (!alertsEnabled) return null;

    const totalExpense = transactions.reduce((total, transaction) => {
        return transaction.type === 'expense' ? total + transaction.amount : total
    }, 0) 

    const overTotalBudget = totalExpense > totalBudgetLimit;

    const exceededCategories = Object.keys(categoryLimits).filter(category => {
        const categoryExpenses = transactions
            .filter(transaction => transaction.category === category)
            .reduce((sum, transaction) => sum + transaction.amount, 0)
        return categoryExpenses > categoryLimits[category]
    }); 

    return (
        <Box sx={{display:'flex', flexDirection:'row', flexWrap:'wrap', gap: 2}}>
            {errorMessage && (
                <Alert variant='filled' severity="error" sx={{ mb: 2 }}>
                    {errorMessage}
                </Alert>
            )}
            <Collapse in={overTotalBudget}>
                <Alert variant='outlined' severity="warning" sx={{ mb: 2 }}>
                    You have exceeded your total budget limit of {totalBudgetLimit} €!
                </Alert>
            </Collapse>

            {exceededCategories.map((category) => (
                <Alert variant='outlined' severity="warning" sx={{ mb: 2 }} key={category}>
                    You have exceeded your budget limit for {category} ({categoryLimits[category]} €)!
                </Alert>
            ))}
        </Box>
    );
}

export default AlertBanner;
