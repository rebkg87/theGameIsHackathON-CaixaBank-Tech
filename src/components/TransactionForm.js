import React, { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { transactionsStore } from '../stores/transactionStore';
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, Select, MenuItem, InputLabel, FormControl, Grid, Box } from '@mui/material';
import { categoryKeywords } from '../constants/categoryKeywords';
import { allCategories } from '../constants/categories';
import useTransactions from '../hooks/useTransactions';
import useSubmitTransaction from '../hooks/useSubmitTransaction';

function TransactionForm({ transactionToEdit, onClose }) {
    const editTransactionId = transactionToEdit ? transactionToEdit.id : null
    const {handleTransactionSubmit} = useSubmitTransaction(editTransactionId, resetForm, onClose)
    const {addNewTransaction, updateTransactions} = useTransactions()
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [type, setType] = useState('expense');
    const [category, setCategory] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(()=>{
        if (transactionToEdit) return
        const assignedCategory = assignCategory(description)
        setCategory(assignedCategory)
    }, [description, transactionToEdit])

    const assignCategory = (desc) => {
        for (const [category, keywords] of Object.entries(categoryKeywords)) {
            if (keywords.some(keyword => desc.toLowerCase().includes(keyword.toLowerCase()))) {
                return category
            }
        }
        return 'Other Expenses';
    };

    useEffect(() => {
        if (!transactionToEdit) {
            const assignedCategory = assignCategory(description)
            setCategory(assignedCategory)
        }
    }, [description, transactionToEdit]);

    const handleSubmit = (e) => {
        e.preventDefault();
        handleTransactionSubmit(description, amount, type, category, date)
    };

    return (
        <Dialog open={true} onClose={onClose}>
            <DialogTitle>{transactionToEdit ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                label="Description"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                                name="description"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                label="Amount (€)"
                                type="number"
                                value={amount}
                                onChange={(e) => setAmount(e.target.value)}
                                fullWidth
                                margin="normal"
                                required
                                inputProps={{ min: 0, step: '0.01' }}
                                name="amount"
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel id="type-label">Type</InputLabel>
                                <Select
                                    labelId="type-label"
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    label="Type"
                                    name="type"
                                    inputProps={{ name: 'filterTypeForm' }}
                                >
                                    <MenuItem value="income">Income</MenuItem>
                                    <MenuItem value="expense">Expense</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth margin="normal" required>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    value={category}
                                    onChange={(e) => setCategory(e.target.value)}
                                    label="Category"
                                    name="category"
                                    inputProps={{ name: 'filterCategoryForm' }}
                                >
                                    {/* Instructions: Use the `allCategories` imported file to render the categories as menu items */}
                                    <MenuItem value="Other Expenses">Other Expenses</MenuItem>
                                </Select>
                            </FormControl>
                        </Grid>
                        {/* Fill in the remaining field for date type */}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', p: 2 }}>
                        <Button onClick={onClose} color="secondary">
                            Cancel
                        </Button>
                        <Button type="submit" variant="contained" color="primary" data-testid="add-transaction-button">
                            {transactionToEdit ? 'Update' : 'Add'}
                        </Button>
                    </Box>
                </DialogActions>
            </form>
        </Dialog>
    );
}

export default TransactionForm;