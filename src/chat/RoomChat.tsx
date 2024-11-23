import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfosSelector, setLogout } from '../features/loginSlice';
import MessageList from './messages/getMessages';
import AddMessage from './messages/addMessage';
import Box from '@mui/material/Box';
import { useParams, useNavigate } from 'react-router-dom';
import { CssBaseline, IconButton, Typography } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { AppDispatch } from '../app/store';

const Chats = () => {
    const { room_id, roomName } = useParams();
    const userInfos = useSelector(userInfosSelector);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(userInfos);
    }, [userInfos, room_id]);

    // Fonction de déconnexion
    const handleLogout = () => {
        dispatch(setLogout());
        navigate('/');
    };

    return (
        <Box
            component="main"
            sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                height: "100vh",
                background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient background
                color: "#fff",
                padding: 4,
                position: "relative",
            }}
        >
            <CssBaseline />

            {/* Logout Button */}
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

            {/* Page Title */}
            <Typography
                variant="h3"
                sx={{
                    fontWeight: 600,
                    mb: 2,
                    textShadow: "0px 2px 4px rgba(0, 0, 0, 0.2)",
                }}
            >
                Chat dans {roomName || "Utilisateur"} !
            </Typography>
            <Typography
                variant="subtitle1"
                sx={{
                    color: "rgba(255, 255, 255, 0.8)",
                    fontStyle: "italic",
                }}
            >
                Bienvenue dans votre espace de discussion. Vous pouvez maintenant envoyer des messages dans {roomName || "Utilisateur"}
            </Typography>

            {/* Messages */}
            <MessageList receiverId={Number(room_id)} receiverName={String(roomName)} />
            <AddMessage receiverId={Number(room_id)} />

        </Box>
    );
};

export default Chats;
