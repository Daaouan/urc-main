import React, { useState } from "react";
import { loginUser } from "./loginApi";
import { Session, UserInfos } from "../model/common";
import { CustomError } from "../model/CustomError";
import {
  TextField,
  Button,
  Typography,
  Paper,
  Box,
  Alert,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
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
      { user_id: -1, username: data.get("login") as string, password: data.get("password") as string },
      (result: Session) => {
        setSession(result);
        form.reset();
        setError(new CustomError(""));
        const userInfosData = { username: result.username, userId: result.id } as UserInfos;
        dispatch(setUserInfos(userInfosData));
        navigate("/home");
      },
      (loginError: CustomError) => {
        setError(loginError);
        setSession({} as Session);
      }
    );
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
      }}
    >
      <Paper elevation={6} sx={{ padding: 4, width: 400 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Connexion
        </Typography>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            name="login"
            label="Login"
            placeholder="Saisissez votre login"
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="password"
            label="Mot de passe"
            type="password"
            placeholder="Saisissez votre mot de passe"
            variant="outlined"
            fullWidth
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            color="secondary"
            fullWidth
            sx={{
              mt: 2,
              bgcolor: "#2575fc",
              "&:hover": { bgcolor: "#6a11cb" },
            }}
          >
            Connexion
          </Button>
        </Box>
        {error.message && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error.message}
          </Alert>
        )}
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
          Pas encore de compte ?{" "}
          <Button component="a" href="/signup" variant="text" color="primary">
            Créer un compte
          </Button>
        </Typography>
        {session.token && (
          <Typography variant="body2" align="center" sx={{ mt: 2 }}>
            Connecté en tant que {session.username}
          </Typography>
        )}
      </Paper>
    </Box>
  );
}
