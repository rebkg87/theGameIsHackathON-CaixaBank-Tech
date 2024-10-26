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
    const [showCredentials, setShowCredentials] = useState(false);
    const navigate = useNavigate();

    const defaultCredentials = {
        email: 'default@example.com',
        password: 'password123'
    };

    const handleLogin = (e) => {
        e.preventDefault();

        // Validate that fields are not empty
        // Instructions:
        // - Check if the email and password fields are filled.
        if (!email || !password) {
            setError("Por favor, complete todos los campos")
            // - If either is empty, set an appropriate error message.
            return;
        }

        // Validate credentials
        // Instructions:
        // - Check if the entered credentials match the default credentials or the stored user credentials.
        if (email === defaultCredentials.email && password === defaultCredentials.password) {
            // - If valid, call the `login` function and navigate to the homepage.
            login({ email })
            navigate('/')
            // - If invalid, set an error message.
        } else {
            setError('Credenciales incorrectas. Intente nuevamente')
        }
    };

    const handleShowDefaultCredentials = () => {
        // Show default credentials in case the user requests it
        setEmail(defaultCredentials.email);
        setPassword(defaultCredentials.password);
        setShowCredentials(true);
    };

    return (
        <Box sx={{ maxWidth: 400, mx: 'auto', mt: 8, p: 2, border: '1px solid #ddd', borderRadius: 2 }}>
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
                />
                <TextField
                    label="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    fullWidth
                    margin="normal"
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

            {/* Show error message when applicable */}
            {/* - Use the Alert component to display the error message if one exists. */}
            {/* - Ensure that registration and forgot password options are displayed below the error message if present. */}

            {error && <AlertBanner errorMessage={error}/>}

            {showCredentials && (
                <Alert severity="info" sx={{ mt: 2 }}>
                    <strong>Email:</strong> {defaultCredentials.email}<br />
                    <strong>Password:</strong> {defaultCredentials.password}
                </Alert>
            )}
            <Button color="primary" onClick={handleShowDefaultCredentials}>
                Mostar Credenciales por Defecto
            </Button>
        </Box>
    );
}

export default LoginPage;
