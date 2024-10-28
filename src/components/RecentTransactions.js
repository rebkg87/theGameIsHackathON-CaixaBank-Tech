import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
} from '@mui/material';
import useTransactions from '../hooks/useTransactions';

function RecentTransactions() {
    const { transactions } = useTransactions();

    const sortedTransactions = [...transactions].sort((a, b) => {
        const [dayA, monthA, yearA] = a.date.split('/').map(Number);
        const [dayB, monthB, yearB] = b.date.split('/').map(Number);
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);
        return dateB - dateA; 
    });

    const recentTransactions = sortedTransactions.slice(0, 5);

    return (
        <div>
            <Typography variant="h4" gutterBottom color="primary" sx={{mb:4}}>
            Recent Transactions
            </Typography>
            <TableContainer component={Paper}>
                <Table size="medium">
                    <TableHead>
                        <TableRow>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#007EAE', color: 'white' }}>Description</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#007EAE', color: 'white' }}>Amount (€)</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#007EAE', color: 'white' }}>Type</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#007EAE', color: 'white' }}>Category</TableCell>
                            <TableCell sx={{ fontWeight: 'bold', backgroundColor: '#007EAE', color: 'white' }}>Date</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                    {recentTransactions.map((transaction) => {
                            const [day, month, year] = transaction.date.split('/').map(Number);
                            const transactionDate = new Date(year, month - 1, day);

                            return (
                                <TableRow key={transaction.id}>
                                    <TableCell>{transaction.description}</TableCell>
                                    <TableCell>
                                        {transaction.amount.toFixed(2)}
                                    </TableCell>
                                    <TableCell>{transaction.type}</TableCell>
                                    <TableCell>{transaction.category}</TableCell>
                                    <TableCell>
                                        {isNaN(transactionDate) ? (
                                            "Invalid Date"
                                        ) : (
                                            transactionDate.toLocaleDateString()
                                        )}
                                    </TableCell>
                                </TableRow>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default RecentTransactions;
