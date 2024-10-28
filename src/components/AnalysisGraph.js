import React from 'react';
import useTransactions from '../hooks/useTransactions';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);


function AnalysisGraph() {
    const {transactions} = useTransactions()

    const categories = [...new Set(transactions.map(transaction => transaction.category))];

    const incomeData = categories.map(category => {
        return transactions
            .filter(transaction => transaction.category === category && transaction.type === 'income')
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    });

    const expenseData = categories.map(category => {
        return transactions
            .filter(transaction => transaction.category === category && transaction.type === 'expense')
            .reduce((sum, transaction) => sum + transaction.amount, 0);
    });

    const data = {
        labels: categories,
        datasets: [
            {
                label: 'Income',
                data: incomeData,
                backgroundColor: '#007EAE',
                stack: 'Stack 0',
                borderColor: 'rgba(255, 255, 255, 0.8)', 
                borderWidth: 1,
                borderRadius: 20,
            },
            {
                label: 'Expense',
                data: expenseData,
                backgroundColor: '#ffa000',
                stack: 'Stack 0',
                borderColor: 'rgba(255, 255, 255, 0.8)', 
                borderWidth: 1,
                borderRadius: 20,
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Bar data={data} options={{ responsive: true, maintainAspectRatio: false}} />
        </div>
    );
}

export default AnalysisGraph;
