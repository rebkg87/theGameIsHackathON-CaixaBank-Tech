import React, { Profiler, Suspense } from 'react';
import { useStore } from '@nanostores/react';
import { Box, Typography, Grid, Paper } from '@mui/material';
import ExportButton from './ExportButton';
import DownloadProfilerData from './DownloadProfilerData';
import { onRenderCallback } from '../utils/onRenderCallback';
import { transactionsStore } from '../stores/transactionStore';
import useTransactions from '../hooks/useTransactions';

const AnalysisGraph = React.lazy(() => import('./AnalysisGraph'));
const BalanceOverTime = React.lazy(() => import('./BalanceOverTime'));
const Statistics = React.lazy(() => import('./Statistics'));
const Recommendations = React.lazy(() => import('./Recommendations'));
const RecentTransactions = React.lazy(() => import('./RecentTransactions'));

function Dashboard() {
    const transactions = useStore(transactionsStore)

    const headers = ['description', 'amount', 'type', 'category', 'date']

    const csvData = transactions.map(transaction => ({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: new Date(transaction.date).toLocaleDateString()
    }))

    const totalIncome = transactions
        .filter((transaction) => transaction.type === 'income')
        .reduce((sum, transaction) => sum + transaction.amount, 0)

    const totalExpense = transactions
        .filter((transaction) => transaction.type === 'expense')
        .reduce((sum, transaction) => sum + transaction.amount, 0)

    const balance = totalIncome - totalExpense

    return (
        <Profiler id="Dashboard" onRender={onRenderCallback}>
            <Box sx={{ p: 4 }}>
                <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignContent: 'center' }}>
                    <Typography variant="h3" gutterBottom sx={{ fontWeight: '600', color: 'primary' }}>
                        Dashboard
                    </Typography>

                    <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
                        <ExportButton
                            data={csvData}
                            filename="transactions.csv"
                            headers={headers}
                            label="Export Transactions"
                        />
                        <DownloadProfilerData />
                    </Box>
                </Box>

                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{
                            padding: 2, boxShadow: 3, borderRadius: 2, transition: 'background-color 0.3s', '&:hover': {
                                backgroundColor: '#00e676', '& .MuiTypography-root': {
                                    color: 'white', fontWeight: 'bold'
                                },
                            }
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Total Income
                            </Typography>
                            <Typography variant="h5" data-testid="total-income">
                                {totalIncome} €                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{
                            padding: 2, boxShadow: 3, borderRadius: 2, transition: 'background-color 0.3s', '&:hover': {
                                backgroundColor: '#ff1744', '& .MuiTypography-root': {
                                    color: 'white', fontWeight: 'bold'
                                },
                            }
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Total Expenses
                            </Typography>
                            <Typography variant="h5" data-testid="total-expenses">
                                {totalExpense} €                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{
                            padding: 2, boxShadow: 3, borderRadius: 2, transition: 'background-color 0.3s', '&:hover': {
                                backgroundColor: 'primary.light', '& .MuiTypography-root': {
                                    color: 'white', fontWeight: 'bold'
                                },
                            }
                        }}>
                            <Typography variant="h6" gutterBottom>
                                Balance
                            </Typography>
                            <Typography variant="h5" data-testid="balance">
                                {balance} €                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Profiler>
    );
}

export default Dashboard;
