import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../stores/authStore';
import {
    Box,
    Button,
    TextField,
    Typography,
    Alert,
    Grid
} from '@mui/material';
import AlertBanner from './AlertBanner';

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [showCredentials, setShowCredentials] = useState(false);
    const navigate = useNavigate();

    const defaultCredentials = {
        email: 'default@example.com',
        password: 'password123'
    };

    const handleLogin = (e) => {
        e.preventDefault();

        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (
            (storedUser && storedUser.email === email && storedUser.password === password) ||
            (email === defaultCredentials.email && password === defaultCredentials.password)
        ) {
            // Inicia sesión usando el authStore
            const userData = { email }; // Guarda solo el email en el authStore
            login(userData);
            setSuccess(true);
            setError('');
            setTimeout(() => navigate('/'), 2000); 
        } else {
            setError('Wrong credentials. Please try again.');
        }
    };

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setError("Invalid email format");
            return;
        }

    const handleShowDefaultCredentials = () => {
        setEmail(defaultCredentials.email);
        setPassword(defaultCredentials.password);
        setShowCredentials(true);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2, border: '1px solid #ddd', borderRadius: 2, p:8 }}>
            <Typography variant="h4" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Email"
                    type="email"
                    value={email}
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
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                    sx={{ mt: 2 }}
                >
                    Login
                </Button>
            </form>


            {error && <AlertBanner errorMessage={error}/>}

            {success && (
                <Alert severity="success" sx={{ mt: 2 }}>
                    Login successful! Redirecting to dashboard...
                </Alert>
            )}

            {showCredentials && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>Email:</strong> {defaultCredentials.email}<br />
                    <strong>Password:</strong> {defaultCredentials.password}
                </Alert>
            )}
            <Button color="primary" onClick={handleShowDefaultCredentials} sx={{mt:2}}>
                Show default credentials
            </Button>
        </Box>
    );
}

export default LoginPage;
