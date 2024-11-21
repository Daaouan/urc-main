import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { userInfosSelector } from '../../features/loginSlice';
import { getAllUser } from './getUsersAPI';
import { CustomError } from '../../model/CustomError';
import { UserInfos } from '../../model/common';
import PersonPinOutlinedIcon from '@mui/icons-material/PersonPinOutlined';
import { useNavigate } from 'react-router-dom';
import { formatTimestamp } from '../../model/common';
import { setList } from '../../features/userlistSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import {
  Box,
  Grid,
  Paper,
  Typography,
  IconButton,
} from '@mui/material';

const GetUser = () => {
  const navigate = useNavigate();
  const userInfos = useSelector(userInfosSelector);
  const [usersList, setUsersList] = useState<UserInfos[]>([]);
  const [error, setError] = useState({} as CustomError);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("loading userInfos...");
  }, [userInfos, dispatch]);

  useEffect(() => {
    getAllUser(
      userInfos.userId,
      (result: UserInfos[]) => {
        setError(new CustomError(""));
        setUsersList(result);
        dispatch(setList(result));
      },
      (loginError: CustomError) => {
        console.log(loginError);
        setError(loginError);
      }
    );
  }, [navigate, userInfos]);

  const handleClick = (id: number, name: string) => {
    navigate(`/home/user/${name}/${id}`);
  };

  return (
    <Box>
      <Typography variant="h6" textAlign="center" sx={{ mb: 2 }}>
        Mes Contacts
      </Typography>

      <Grid container spacing={4}>
        {usersList.length > 0 ? (
          usersList.map((user, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: "10px",
                  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
                  bgcolor: "rgba(255, 255, 255, 0.1)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  color: "#fff",
                  height: "200px",
                  justifyContent: "center",
                  textAlign: "center",
                  cursor: "pointer",
                  '&:hover': {
                    bgcolor: 'primary.light',
                    color: 'white',
                  },
                }}
                onClick={() => handleClick(user.userId, user.username)}
              >
                <IconButton sx={{ mt: 2 }}>
                  <PersonPinOutlinedIcon sx={{ color: '#ffffff' }} />
                </IconButton>
                <Typography variant="h5">{user.username}</Typography>
                {user.last_login && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Dernière activité: {formatTimestamp(user.last_login)}
                    <br />
                  </Typography>
                )}
              </Paper>
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            <Typography variant="body2" textAlign="center">
              Aucun utilisateur trouvé.
            </Typography>
          </Grid>
        )}
      </Grid>

      {error.message && <Typography color="error">{error.message}</Typography>}
    </Box>
  );
};

export default GetUser;
