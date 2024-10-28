import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { login } from '../stores/authStore';

function RegisterPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault();

        if (!email || !password || !confirmPassword) {
            setError("Please, complete all fields")
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords are a mismatch")
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format");
            return;
        }

        const existingUser = localStorage.getItem(email);
        if (existingUser) {
            setError('User already exists. Please sign in.');
            return;
        }

        localStorage.setItem(email, JSON.stringify({ password }));

        login({ email });
        setSuccess(true);
        setError('');
        setTimeout(() => {
            navigate('/');
        }, 2000);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2, border: '1px solid #ddd', borderRadius: 2, p: 8 }}>
            <Typography variant="h4" gutterBottom>
                Register
            </Typography>
            <form onSubmit={handleRegister}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ccc',
                            },
                            '&:hover fieldset': {
                                borderColor: '#007EAE',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#007EAE',
                            },
                        },
                    }}
                />

                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    name="password"
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ccc',
                            },
                            '&:hover fieldset': {
                                borderColor: '#007EAE',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#007EAE',
                            },
                        },
                    }}
                />

                <TextField
                    label="Confirm Password"
                    type="password"
                    value={confirmPassword}
                    name="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    fullWidth
                    margin="normal"
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            '& fieldset': {
                                borderColor: '#ccc',
                            },
                            '&:hover fieldset': {
                                borderColor: '#007EAE',
                            },
                            '&.Mui-focused fieldset': {
                                borderColor: '#007EAE',
                            },
                        },
                    }}
                />

                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Register
                </Button>
            </form>

            {error && (
                <Alert severity="error" sx={{ mt: 2 }}>
                    {error}
                </Alert>
            )}

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Account created successfully!
                </Alert>
            )}
        </Box>
    );
}

export default RegisterPage;
