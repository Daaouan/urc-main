import React, { useState } from 'react';
import { TextField, Button, Grid, Typography, Paper, Alert, Box } from '@mui/material';
import { createUser } from './signUpApi';
import { Account } from '../model/common';
import { CustomError } from "../model/CustomError";
import { Link, useNavigate } from 'react-router-dom';

const SignUp = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
  });
  const [error, setError] = useState({} as CustomError);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const account: Account = {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    };

    createUser(
      account,
      (result: boolean) => {
        if (result === true) {
          setFormData({ email: '', password: '', confirmPassword: '', username: '' });
          setError(new CustomError(""));
          navigate('/login');
        } else {
          console.error("La création de l'utilisateur a échoué.");
        }
      },
      (createAccountError: CustomError) => {
        setError(createAccountError);
      }
    );
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#e0f7fa' }}>
      <Grid container direction="column" alignItems="center" spacing={3}>
        <Grid item>
          <Paper elevation={3} sx={{ padding: 4, width: 400 }}>
            <Typography variant="h4" align="center" gutterBottom>
              Créer un compte
            </Typography>
            <form onSubmit={handleSubmit}>
              <TextField
                name="username"
                label="Nom d'utilisateur"
                placeholder="Saisissez votre nom d'utilisateur"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.username}
                onChange={handleChange}
                required
              />
              <TextField
                name="email"
                label="E-mail"
                type="email"
                placeholder="Entrez votre adresse e-mail"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <TextField
                name="password"
                label="Mot de passe"
                type="password"
                placeholder="Entrez votre mot de passe"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <TextField
                name="confirmPassword"
                label="Confirmer le mot de passe"
                type="password"
                placeholder="Confirmez votre mot de passe"
                variant="outlined"
                fullWidth
                margin="normal"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
                sx={{ mt: 2, mb: 2 }}
              >
                Créer un compte
              </Button>
            </form>
            {error.message && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error.message}
              </Alert>
            )}
          </Paper>
        </Grid>
        <Grid item>
          <Typography variant="body2">
            Déjà un compte ?{" "}
            <Button component={Link} to="/login" variant="text" color="primary">
              Se connecter
            </Button>
          </Typography>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SignUp;
