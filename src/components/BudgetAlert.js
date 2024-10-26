import React, { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { userSettingsStore } from '../stores/userSettingsStore';
import { transactionsStore } from '../stores/transactionStore';
import { budgetAlertStore, resetBudgetAlert, updateBudgetAlert } from '../stores/budgetAlertStore'; // Importar el store de alertas
import AlertBanner from './AlertBanner';
import { Box } from '@mui/material';

const BudgetAlert = () => {
    const userSettings = useStore(userSettingsStore);
    const transactions = useStore(transactionsStore);
    const budgetAlert = useStore(budgetAlertStore)

    const totalExpense = transactions.reduce((total, transaction) => {
        return transaction.type === 'expense' ? total + transaction.amount : total
    }, 0)

    const budgetExceeded = totalExpense > userSettings.totalBudgetLimit

    useEffect(() => {
        if (budgetExceeded) {
            updateBudgetAlert('Budget exceeded! Check your expenses.')
        } else {
            resetBudgetAlert()
        }
    }, [budgetExceeded, userSettings.totalBudgetLimit]);

    return (
        budgetAlert.isVisible && (
            <Box sx={{display: 'flex', flexDirection:'row-reverse', flexWrap:'wrap'}}>
                <AlertBanner
                    errorMessage={budgetAlert.message}
                    onClose={resetBudgetAlert}
                    severity="warning"
                    notificationCount={budgetAlert.notificationCount}
                />
            </Box>
        )
    );
};

export default BudgetAlert;
