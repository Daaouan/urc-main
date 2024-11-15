import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { userInfosSelector } from '../features/loginSlice';
import GetUser from './allUser/getUser';
import { messageReceiverSelector } from '../features/messageSlice';
import { CssBaseline, IconButton, Typography, Box, Drawer, List, Divider, ListItem, Avatar } from '@mui/material';
import { Logout } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AppDispatch } from '../app/store';
import { setLogout } from '../features/loginSlice';

const Home = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const receiverId = useSelector(messageReceiverSelector);
    const userInfos = useSelector(userInfosSelector);

    useEffect(() => {
        console.log(userInfos);
    }, [userInfos, receiverId]);

    const drawerWidth1 = 280;

    const handleLogout = () => {
        dispatch(setLogout());
        navigate('/');
    };
    window.Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // OK
        }
    });

    return (
        
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#f5f5f5' }}>
            <CssBaseline />
            <Drawer
                sx={{
                    width: drawerWidth1,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth1,
                        boxSizing: 'border-box',
                        bgcolor: '#3f51b5',
                        color: '#fff',
                    },
                }}
                variant="permanent"
                anchor="left"
            >
                {/* Titre de la barre latérale */}
                <Box sx={{ p: 2, textAlign: 'center', bgcolor: '#303f9f' }}>
                    <Typography variant="h6" noWrap>
                        Utilisateurs
                    </Typography>
                </Box>

                <Divider sx={{ bgcolor: 'rgba(255,255,255,0.2)' }} />
                
                <List>
                    <ListItem disablePadding>
                        <Box sx={{ padding: 2 }}>
                            <GetUser />
                        </Box>
                    </ListItem>
                </List>
            </Drawer>

            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    width: `calc(100% - ${drawerWidth1}px)`,
                    display: 'flex',
                    flexDirection: 'column',
                    position: 'relative',
                    bgcolor: '#fafafa',
                }}
            >
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

                {/* En-tête de la page */}
                <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 2 }}>
                    Démarrez une discussion
                </Typography>
                <Typography variant="subtitle1" sx={{ color: '#757575' }}>
                    Sélectionnez un utilisateur dans la liste pour commencer une conversation.
                </Typography>

                <Divider sx={{ my: 3 }} />

                {/* Contenu de la section principale */}
                <Box
                    sx={{
                        flex: 1,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        color: '#9e9e9e',
                        fontSize: '1.2em',
                    }}
                >
                    <Typography>Pas encore de conversation sélectionnée.</Typography>
                </Box>
            </Box>
        </Box>
    );
};

export default Home;
