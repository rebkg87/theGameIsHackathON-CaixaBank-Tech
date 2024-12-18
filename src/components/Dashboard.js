import React, { Profiler, Suspense } from 'react';
import { useStore } from '@nanostores/react';
import { Box, Typography, Grid, Paper, Alert } from '@mui/material';
import ExportButton from './ExportButton';
import DownloadProfilerData from './DownloadProfilerData';
import { onRenderCallback } from '../utils/onRenderCallback';
import { userSettingsStore } from '../stores/userSettingsStore';
import BudgetAlert from './BudgetAlert';
import useTransactions from '../hooks/useTransactions';
import { useNavigate } from 'react-router-dom';
import { authStore } from '../stores/authStore';

const AnalysisGraph = React.lazy(() => import('./AnalysisGraph'));
const BalanceOverTime = React.lazy(() => import('./BalanceOverTime'));
const Statistics = React.lazy(() => import('./Statistics'));
const Recommendations = React.lazy(() => import('./Recommendations'));
const RecentTransactions = React.lazy(() => import('./RecentTransactions'));

function Dashboard() {
    const { expenses, income, totalExpense, totalIncome } = useTransactions()
    const userSettings = useStore(userSettingsStore)
    const { isAuthenticated } = useStore(authStore)
    const navigate = useNavigate()

    if (!isAuthenticated) {
        navigate('/login')
        return null
    }

    const headers = ['description', 'amount', 'type', 'category', 'date']

    const csvData = expenses.concat(income).map(transaction => ({
        description: transaction.description,
        amount: transaction.amount,
        type: transaction.type,
        category: transaction.category,
        date: new Date(transaction.date).toLocaleDateString()
    }))

    const balance = totalIncome - totalExpense

    const totalBudgetLimit = userSettings.totalBudgetLimit


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
                                backgroundColor: '#43a047', '& .MuiTypography-root': {
                                    color: 'white', fontWeight: 'bold'
                                },
                            }
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#007EAE' }}>
                                Total Income
                            </Typography>
                            <Typography variant="h5" data-testid="total-income" sx={{ color: '#43a047' }}>
                                {totalIncome} €                            </Typography>
                        </Paper>
                    </Grid>
                    <Grid item xs={12} md={4}>
                        <Paper sx={{
                            padding: 2, boxShadow: 3, borderRadius: 2, transition: 'background-color 0.3s', '&:hover': {
                                backgroundColor: '#b71c1c', '& .MuiTypography-root': {
                                    color: 'white', fontWeight: 'bold'
                                },
                            }
                        }}>
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#007EAE' }}>
                                Total Expenses
                            </Typography>
                            <Typography variant="h5" data-testid="total-expenses" sx={{ color: 'red' }}>
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
                        }}
                        >
                            <Typography variant="h6" gutterBottom sx={{ fontWeight: 'bold', color: '#007EAE' }}>
                                Balance
                            </Typography>
                            <Typography variant="h5" data-testid="balance" sx={{ color: balance < 0 ? 'red' : 'inherit' || balance > 0 ? '#43a047' : 'inherit' }} >
                                {balance} €
                            </Typography>
                        </Paper>
                    </Grid>
                </Grid>
                <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2, mt: 5, flexWrap: 'wrap', alignContent: 'center', justifyContent: 'center' }}>
                    {balance < 0 && (
                        <Alert variant='filled' severity="error" sx={{ mb: 2, paddingRight: 2 }}>
                            Warning: Negative Balance
                        </Alert>
                    )}
                    {totalExpense > totalBudgetLimit && (
                        <BudgetAlert />
                    )}
                </Box>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12} md={6}>
                        <Suspense fallback={<div>Loading Statistics...</div>}>
                            <Statistics />
                        </Suspense>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Suspense fallback={<div>Loading Recommendations...</div>}>
                            <Recommendations />
                        </Suspense>
                    </Grid>
                </Grid>
                <Grid container spacing={4} sx={{ mt: 4, display: 'flex', flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', alignContent: 'center', gap: 10 }}>
                    <Grid item xs={12}>
                        <Suspense fallback={<div>Loading Chart...</div>}>
                            <AnalysisGraph />
                        </Suspense>
                    </Grid>
                    <Grid item xs={12}>
                        <Suspense fallback={<div>Loading Chart...</div>}>
                            <BalanceOverTime />
                        </Suspense>
                    </Grid>
                </Grid>
                <Grid container spacing={4} sx={{ mt: 4 }}>
                    <Grid item xs={12}>
                        <Suspense fallback={<div>Loading Recent Transactions...</div>}>
                            <RecentTransactions />
                        </Suspense>
                    </Grid>
                </Grid>
            </Box>
        </Profiler>
    );
}

export default Dashboard;
