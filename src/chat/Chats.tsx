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
    const { receiverId, receiverName } = useParams();
    const userInfos = useSelector(userInfosSelector);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    useEffect(() => {
        console.log(userInfos);
    }, [userInfos, receiverId]);

    // Fonction de déconnexion
    const handleLogout = () => {
        dispatch(setLogout());
        navigate('/');
    };

    return (
        <Box component="main" sx={{ p: 3, margin: '0 auto', position: 'relative' }}>
            <CssBaseline />
            
            {/* Bouton de déconnexion en haut à droite */}
            <IconButton
                sx={{
                    position: 'absolute',
                    top: 16,
                    right: 16,
                    bgcolor: '#ff5722',
                    color: '#fff',
                    '&:hover': { bgcolor: '#e64a19' },
                }}
                onClick={handleLogout}
            >
                <Logout />
            </IconButton>

            <MessageList receiverId={Number(receiverId)} receiverName={String(receiverName)} />
            <AddMessage receiverId={Number(receiverId)} />
        </Box>
    );
};

export default Chats;
