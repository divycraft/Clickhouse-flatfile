import React, { useState } from 'react';
import {
    TextField,
    Button,
    Container,
    Typography,
    Alert,
    ThemeProvider,
    createTheme,
    CssBaseline
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

function AuthPage({ setUser, setChConfig, setIsLogin, isLogin, setError }) {
    const [auth, setAuth] = useState({ email: '', password: '' });
    const [localError, setLocalError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const navigate = useNavigate();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@#$%^&+=!]).{8,}$/;

    const validate = () => {
        let isValid = true;

        if (!emailRegex.test(auth.email)) {
            setEmailError('Invalid email format');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (!passwordRegex.test(auth.password)) {
            setPasswordError('Password must be at least 8 characters, include uppercase, lowercase, digit, and special character');
            isValid = false;
        } else {
            setPasswordError('');
        }

        return isValid;
    };

    const handleAuth = async () => {
        if (!validate()) return;

        try {
            const url = isLogin
                ? 'http://localhost:8081/auth/login'
                : 'http://localhost:8081/auth/register';

            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: auth.email,
                    password: auth.password
                })
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Authentication failed');
            }

            const data = await response.json();
            const { token } = data;

            if (token) {
                localStorage.setItem('token', token);
                setChConfig((cfg) => ({ ...cfg, token }));
                setUser(auth.email);
                setLocalError('');
                setError('');
                navigate('/data-ingestion');
            } else {
                throw new Error('Token not returned from server');
            }
        } catch (err) {
            const message = err.message || 'Authentication failed';
            setLocalError(message);
            setError(message);
        }
    };

    const theme = createTheme({
        palette: {
            mode: 'light',
            background: {
                default: '#ffffff',
                paper: '#f5f5f5',
            },
            text: {
                primary: '#000000',
                secondary: '#333333'
            },
            primary: {
                main: '#000000'
            },
            error: {
                main: '#d32f2f'
            }
        },
        typography: {
            fontFamily: 'Arial, sans-serif'
        }
    });

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Container>
                <Typography variant="h5" gutterBottom>
                    {isLogin ? 'Login' : 'Register'}
                </Typography>

                <TextField
                    label="Email"
                    value={auth.email}
                    onChange={(e) => setAuth({ ...auth, email: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!emailError}
                    helperText={emailError}
                />
                <TextField
                    label="Password"
                    type="password"
                    value={auth.password}
                    onChange={(e) => setAuth({ ...auth, password: e.target.value })}
                    fullWidth
                    margin="normal"
                    error={!!passwordError}
                    helperText={passwordError}
                />
                <Button
                    variant="contained"
                    onClick={handleAuth}
                    fullWidth
                    sx={{ mt: 2, backgroundColor: '#000', color: '#fff', '&:hover': { backgroundColor: '#222' } }}
                >
                    {isLogin ? 'Login' : 'Register'}
                </Button>
                <Button
                    onClick={() => setIsLogin(!isLogin)}
                    fullWidth
                    sx={{
                        mt: 1,
                        color: '#555',
                        '&:hover': { color: '#000' }
                    }}
                >
                    {isLogin ? 'Need an account? Register' : 'Have an account? Login'}
                </Button>

                {localError && (
                    <Alert severity="error" sx={{ mt: 2 }}>
                        {localError}
                    </Alert>
                )}
            </Container>
        </ThemeProvider>
    );
}

export default AuthPage;
