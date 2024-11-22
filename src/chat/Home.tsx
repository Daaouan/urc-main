import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { userInfosSelector } from "../features/loginSlice";
import GetUser from "./allUser/getUser";
import Rooms from "../room/Rooms";
import { messageReceiverSelector } from "../features/messageSlice";
import {
  CssBaseline,
  IconButton,
  Typography,
  Box,
  Grid,
  Drawer,
  List,
  Divider,
  ListItem,
  Paper,
} from "@mui/material";
import { Logout } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { AppDispatch } from "../app/store";
import { setLogout } from "../features/loginSlice";

const Home = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const receiverId = useSelector(messageReceiverSelector);
  const userInfos = useSelector(userInfosSelector);

  useEffect(() => {
    console.log(userInfos);
  }, [userInfos, receiverId]);

  const drawerWidth = 300;

  const handleLogout = () => {
    dispatch(setLogout());
    navigate("/");
  };

  return (
    <Box
      sx={{
        display: "flex",
        height: "100vh",
        background: "linear-gradient(to right, #6a11cb, #2575fc)",
        color: "#fff",
      }}
    >
      <CssBaseline />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 4,
          width: `calc(100% - ${drawerWidth}px)`,
          display: "flex",
          flexDirection: "column",
          position: "relative",
        }}
      >
        <IconButton
          sx={{
            position: "absolute",
            top: 16,
            right: 16,
            background: "linear-gradient(to right, #00c6ff, #0072ff)", 
            color: "#fff", 
            borderRadius: "50%", 
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.2)", 
            "&:hover": {
              background: "linear-gradient(to right, #0072ff, #00c6ff)", 
              transform: "scale(1.1)", 
            },
            transition: "transform 0.3s, background 0.3s", 
          }}
          onClick={handleLogout}
        >
          <Logout />
        </IconButton>

        <Typography
          variant="h3"
          sx={{
            fontWeight: 600,
            mb: 2,
            textShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
          }}
        >
          Bienvenue, {userInfos.username || "Utilisateur"} !
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: "rgba(255, 255, 255, 0.8)",
            fontStyle: "italic",
          }}
        >
          Sélectionnez un utilisateur dans la liste pour démarrer une conversation.
          <br />
          <hr />
        </Typography>
        
        <br />
        <GetUser />

        <br /><br />
        <Rooms />
        
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "rgba(255, 255, 255, 0.6)",
            fontSize: "1.2em",
            fontStyle: "italic",
            mt: 4,
          }}
        >
          <Typography>Pas encore de conversation sélectionnée.</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
