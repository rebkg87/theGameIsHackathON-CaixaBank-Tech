import React from 'react';
import { Line } from 'react-chartjs-2';
import useTransactions from '../hooks/useTransactions';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Typography } from '@mui/material';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);


function BalanceOverTime() {
    const { transactions } = useTransactions();

    const sortedTransactions = [...transactions].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateA - dateB;
    });

    const data = [];
    let cumulativeBalance = 0;

    sortedTransactions.forEach((transaction) => {
        const [day, month, year] = transaction.date.split('/').map(Number);
        const transactionDate = new Date(year, month - 1, day);

        if (!isNaN(transactionDate)) {
            cumulativeBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;

            data.push({
                date: transactionDate.toLocaleDateString(),
                Balance: cumulativeBalance,
            });
        } else {
            console.error("Fecha inválida:", transaction.date);
        }
    });

    const chartData = {
        labels: data.map((entry) => entry.date),
        datasets: [
            {
                label: 'Balance Over Time',
                data: data.map((entry) => entry.Balance),
                borderColor: '#007EAE',
                backgroundColor: '#007EAE',
                fill: true,
                tension: 0.4,
                borderWidth: 2,
                pointRadius: 4,
                pointBackgroundColor: '#007EAE',
            },
        ],
    };

    return (
        <div style={{ width: '100%', height: '400px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
            <Typography variant="h5" gutterBottom sx={{ fontWeight: '600', textAlign: 'center' }}>
                Your Balance Over Time
            </Typography>
            {data.length > 0 ? (
                <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
            ) : (
                <p>No data available to show.</p>
            )}
        </div>
    );
}

export default BalanceOverTime;
