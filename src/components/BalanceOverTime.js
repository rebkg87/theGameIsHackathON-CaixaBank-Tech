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
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Legend, Title);


function BalanceOverTime() {
    const { transactions } = useTransactions();

    const sortedTransactions = [...transactions].sort(
        (a, b) => new Date(a.date) - new Date(b.date)
    );

    const data = [];
    let cumulativeBalance = 0;

    sortedTransactions.forEach((transaction) => {
        if (transaction.type === 'income') {
            cumulativeBalance += transaction.amount;
        } else if (transaction.type === 'expense') {
            cumulativeBalance -= transaction.amount;
        }

        data.push({
            date: new Date(transaction.date).toLocaleDateString(),
            Balance: cumulativeBalance,
        });
        console.log(transaction.date);

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
            <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        </div>
    );
}

export default BalanceOverTime;
