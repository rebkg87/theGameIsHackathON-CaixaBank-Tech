import React, { useState, useMemo } from 'react';
import useTransactions from '../hooks/useTransactions';
import { expenseCategories, incomeCategories, allCategories } from '../constants/categories'
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
    TablePagination
} from '@mui/material';

function TransactionList() {
    const { transactions, addNewTransaction, deleteTransaction, updateTransactions } = useTransactions()

    const [filterCategory, setFilterCategory] = useState('');
    const [filterType, setFilterType] = useState('');
    const [sortField, setSortField] = useState('');
    const [amount, setAmount] = useState('')
    const [description, setDescription] = useState('')
    const [type, setType] = useState('expense')
    const [category, setCategory] = useState('')
    const [editTransactionId, setEditTransactionId] = useState(null)

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const filteredTransactions = useMemo(() => {
        return transactions.filter(transaction => {
            const matchesCategory = filterCategory ? transaction.category === filterCategory : true
            const matchesType = filterType ? transaction.type === filterType : true
            return matchesCategory && matchesType
        })
    }, [transactions, filterCategory, filterType])

    const sortedTransactions = useMemo(() => {
        return [...filteredTransactions].sort((a, b) => {
            if (sortField === 'amount') {
                return a.amount - b.amount
            } else if (sortField === 'date') {
                return new Date(a.date) - new Date(b.date)
            }
            return 0
        })
    }, [filteredTransactions, sortField])


    const handleChangePage = (event, newPage) => {
        setPage(newPage)
    }

    const handleChangeRowPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10))
        setPage(0)
    }

    const handleTransactionSubmit = (e) => {
        e.preventDefault()
        const transaction = {
            id: editTransactionId ? editTransactionId : Date.now(),
            description,
            amount: parseFloat(amount),
            type,
            category,
            date: new Date().toLocaleDateString()
        }

        if (editTransactionId) {
            updateTransactions(transaction)
        } else {
            addNewTransaction(transaction)
        }
        resetForm()
    }

    const resetForm = () => {
        setDescription('')
        setAmount('')
        setType('expense')
        setCategory('')
        setEditTransactionId(null)
    }

    // Implement delete functionality
    // Instructions:
    // - Implement the logic to delete a transaction by its ID.
    // - Make sure the transactions state/store is updated after deletion.
    // Implement functionality to delete a transaction

    const handleDelete = (id) => {
        deleteTransaction(id)
    }

    // Implement edit functionality
    // Instructions:
    // - Implement logic to edit a transaction.
    // - Ensure the updated transaction is saved in the store.
    const handleEdit = (transaction) => {
        // Implement functionality to edit a transaction
        setEditTransactionId(transaction.id);
        setDescription(transaction.description);
        setAmount(transaction.amount);
        setType(transaction.type);
        setCategory(transaction.category);
    };

    const categoriesToShow = type === 'expense' ? expenseCategories : incomeCategories

    const displayedTransactions = useMemo(() => {
        const start = page * rowsPerPage
        const end = start + rowsPerPage
        return sortedTransactions.slice(start, end)
    }, [sortedTransactions, page, rowsPerPage])


    return (
        <Box sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Transaction List
            </Typography>

            {/* Add transaction */}
            {/* Instructions:
                - Implement the logic to open a form for adding a new transaction.
                - Trigger the form/modal through the onClick event. */}
            {/* Implement functionality to add transaction */}

            <form onSubmit={handleTransactionSubmit}>
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
                        <InputLabel id="type-label" >Type</InputLabel>
                        <Select
                            labelId="type-label"
                            value={type}
                            onChange={(e) => {
                                setType(e.target.value)
                                setCategory('')
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
                            {categoriesToShow.map((category) => (
                                <MenuItem key={category} value={category}>{category}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <Button variant="contained" color="primary" type="submit">
                        {editTransactionId ? 'Update Transaction' : 'Add Transaction'}
                    </Button>
                </Box>
            </form>


            {/* Filters */}
            {/* Instructions:
                - Implement category and type filters using Material UI's `Select` component.
                - Update the filterCategory and filterType state values when the user makes a selection.
                - Apply the selected filters to the displayed transactions. */}
            <Box sx={{ display: 'flex', gap: 2, my: 2 }}>
                <FormControl variant='filled' sx={{ minWidth: 120 }}>
                    <InputLabel id="filter-category-label">Category</InputLabel>
                    <Select
                        labelId="filter-category-label"
                        value={filterCategory}
                        onChange={(e) => setFilterCategory(e.target.value)}
                    >
                        <MenuItem value="">All</MenuItem>
                        {allCategories.map((category) => (
                            <MenuItem key={category} value={category}>{category}</MenuItem>
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

            {/* Table of transactions */}
            {/* Instructions:
                - Render the transactions in a table format using Material UI's `Table` component.
                - For each transaction, display the following details: description, amount, type, category, and date.
                - Implement the action buttons (Edit, Delete) within each row for managing transactions. */}
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

                        {/* Map over the transactions and render each transaction as a row.
                            - For each row, add logic for Edit and Delete actions.
                            - Display the transaction data in the respective table cells. */}
                        {displayedTransactions.map((transaction) => (
                            <TableRow key={transaction.id}>
                                <TableCell>{transaction.description}</TableCell>
                                <TableCell>{transaction.amount}</TableCell>
                                <TableCell>{transaction.type}</TableCell>
                                <TableCell>{transaction.category}</TableCell>
                                <TableCell>{transaction.date}</TableCell>
                                <TableCell sx={{ display: 'flex', gap: 1 }}>
                                    <Button variant='outlined' color="primary" disableElevation onClick={() => handleEdit(transaction)}>Edit</Button>
                                    <Button variant='outlined' color="error" disableElevation onClick={() => handleDelete(transaction.id)}>Delete</Button>
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
