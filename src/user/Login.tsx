import React, { useState } from "react";
import { loginUser } from "./loginApi";
import { Session, UserInfos } from "../model/common";
import { CustomError } from "../model/CustomError";
import { TextField, Button, Grid, Typography, Paper, Box, Alert, Link } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";
import { AppDispatch } from "../app/store";
import { setUserInfos } from "../features/loginSlice";

export function Login() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();

    const [error, setError] = useState({} as CustomError);
    const [session, setSession] = useState({} as Session);

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        loginUser(
            { user_id: -1, username: data.get('login') as string, password: data.get('password') as string },
            (result: Session) => {
                console.log(result);
                setSession(result);
                form.reset();
                setError(new CustomError(""));
                const userInfosData = { username: result.username, userId: result.id } as UserInfos;
                dispatch(setUserInfos(userInfosData));
                navigate('/home');
            },
            (loginError: CustomError) => {
                console.log(loginError);
                setError(loginError);
                setSession({} as Session);
            });
    };

    return (
        <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ height: '100vh', backgroundColor: '#f7f9fc', padding: 2 }}
        >
            <Paper elevation={3} sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h4" align="center" gutterBottom sx={{ fontWeight: 'bold', color: '#1976d2' }}>
                    Connexion
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    <TextField
                        name="login"
                        label="Login"
                        placeholder="Saisissez votre login"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        name="password"
                        label="Mot de passe"
                        type="password"
                        placeholder="Saisissez votre mot de passe"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ mt: 2, mb: 1, padding: 1 }}
                    >
                        Connexion
                    </Button>
                    {error.message && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error.message}
                        </Alert>
                    )}
                </Box>
                <Grid container justifyContent="center" sx={{ mt: 3 }}>
                    <Link href="/signup" underline="hover">
                        Créer un compte
                    </Link>
                </Grid>
                {session.token && (
                    <Typography variant="body2" align="center" sx={{ mt: 2 }}>
                        Connecté en tant que {session.username}
                    </Typography>
                )}
            </Paper>
        </Grid>
    );
}
