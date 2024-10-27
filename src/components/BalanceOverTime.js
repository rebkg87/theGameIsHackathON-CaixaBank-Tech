import React from 'react';
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
import { Line } from 'react-chartjs-2';
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);


function BalanceOverTime() {
    const {transactions} = useTransactions()

    const sortedTransactions = transactions.sort((a, b) => new Date(a.date) - new Date(b.date));

    const data = [];
    let cumulativeBalance = 0;

    sortedTransactions.forEach(transaction => {
        cumulativeBalance += transaction.type === 'income' ? transaction.amount : -transaction.amount;
        data.push({ date: new Date(transaction.date).toLocaleDateString(), Balance: cumulativeBalance });
    });

    const chartData = {
        labels: data.map(item => item.date),
        datasets: [
            {
                label: 'Balance',
                data: data.map(item => item.Balance), 
                fill: false, 
                backgroundColor: '#007EAE',
                borderColor: '#007EAA',
                tension: 0.1, 
            },
        ],
    };

    return (
        <div style={{ height: '400px' }}>
            <Line data={chartData} options={{ responsive: true }} />
        </div>
    );
}

export default BalanceOverTime;
