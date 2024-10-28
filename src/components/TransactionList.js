import React, { useState, useMemo } from 'react';
import useTransactions from '../hooks/useTransactions';
import { expenseCategories, incomeCategories, allCategories } from '../constants/categories';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Button,
    Select,
    MenuItem,
    InputLabel,
    FormControl,
    Box,
    Typography,
    TextField,
    TablePagination,
    Alert
} from '@mui/material';
import useSubmitTransaction from '../hooks/useSubmitTransaction';
import BudgetAlert from './BudgetAlert';
import { useStore } from '@nanostores/react';
import { authStore } from '../stores/authStore';

function TransactionList() {
    const { isAuthenticated, user } = useStore(authStore);
    const { transactions, deleteTransaction } = useTransactions();
    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortField, setSortField] = useState('');
    const [editTransactionId, setEditTransactionId] = useState(null);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const resetForm = () => {
        setDescription('');
        setAmount('');
        setType('expense');
        setCategory('');
        setEditTransactionId(null);
        setDate('');
    };

    const { handleTransactionSubmit } = useSubmitTransaction(editTransactionId, resetForm);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesCategory = filterCategory ? transaction.category === filterCategory : true;
            const matchesType = filterType ? transaction.type === filterType : true;
            return matchesCategory && matchesType;
        });
    }, [transactions, filterCategory, filterType]);

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => {
            if (sortField === 'amount') {
                return a.amount - b.amount;
            } else if (sortField === 'date') {
                return new Date(a.date) - new Date(b.date);
            }
            return 0;
        });
    }, [filteredTransactions, sortField]);

    const displayedTransactions = useMemo(() => {
        const start = page * rowsPerPage;
        const end = start + rowsPerPage;
        return sortedTransactions.slice(start, end);
    }, [sortedTransactions, page, rowsPerPage]);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        handleTransactionSubmit(description, amount, type, category, date);
    };

    const handleDelete = (id) => {
        deleteTransaction(id);
    };

    const handleEdit = (transaction) => {
        setEditTransactionId(transaction.id);
        setDescription(transaction.description);
        setAmount(transaction.amount);
        setType(transaction.type);
        setCategory(transaction.category);
        setDate(transaction.date);
    };

    const categoriesToShow = type === 'expense' ? expenseCategories : incomeCategories;

    if (!isAuthenticated) {
        return <Alert severity="warning">You must to log in to see the transactions</Alert>;
    }
    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Transaction List
            </Typography>

            <BudgetAlert/>

            <form onSubmit={handleSubmit}>
                <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                    <TextField
                        variant="filled"
                        label="Description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <TextField
                        variant="filled"
                        label="Amount"
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        required
                    />
                    <FormControl variant='filled' sx={{ minWidth: 120 }}>
                        <InputLabel id="type-label">Type</InputLabel>
                        <Select
                            labelId="type-label"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value);
                                setCategory('');
                            }}
                        >
                            <MenuItem value="expense">Expense</MenuItem>
                            <MenuItem value="income">Income</MenuItem>
                        </Select>
                    </FormControl>
                    <FormControl variant='filled' sx={{ minWidth: 120 }}>
                        <InputLabel id="category-label">Category</InputLabel>
                        <Select
                            labelId="category-label"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                        >
                            <MenuItem value="">Select Category</MenuItem>
                            {categoriesToShow.map((cat) => (
                                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" type="submit">
                        {editTransactionId ? 'Update Transaction' : 'Add Transaction'}
                    </Button>
                </Box>
            </form>

            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                <FormControl variant='filled' sx={{ minWidth: 120 }}>
                    <InputLabel id="filter-category-label">Category</InputLabel>
                    <Select
                        labelId="filter-category-label"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {allCategories.map((cat) => (
                            <MenuItem key={cat} value={cat}>{cat}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl variant='filled' sx={{ minWidth: 120 }}>
                    <InputLabel id="filter-type-label">Type</InputLabel>
                    <Select
                        labelId="filter-type-label"
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        <MenuItem value="income">Income</MenuItem>
                        <MenuItem value="expense">Expense</MenuItem>
                    </Select>
                </FormControl>

                <FormControl variant='filled' sx={{ minWidth: 150 }}>
                    <InputLabel id="sort-field-label">Sort By</InputLabel>
                    <Select
                        labelId="sort-field-label"
                        value={sortField}
                        onChange={(e) => setSortField(e.target.value)}
                    >
                        <MenuItem value="">None</MenuItem>
                        <MenuItem value="amount">Amount</MenuItem>
                        <MenuItem value="date">Date</MenuItem>
                    </Select>
                </FormControl>
            </Box>

            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Description</TableCell>
                            <TableCell>Amount (€)</TableCell>
                            <TableCell>Type</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell>Date</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {displayedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant='outlined' color="primary" disableElevation onClick={() => handleEdit(transaction)}>
                                        Edit
                                    </Button>
                                    <Button variant='outlined' color="error" disableElevation onClick={() => handleDelete(transaction.id)}>
                                        Delete
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>

                <TablePagination
                    component="div"
                    count={sortedTransactions.length}
                    page={page}
                    onPageChange={handleChangePage}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={handleChangeRowPerPage}
                />
            </TableContainer>
        </Box>
    );
}

export default TransactionList;
