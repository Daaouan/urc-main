import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { userInfosSelector } from '../../features/loginSlice';
import { CustomError } from '../../model/CustomError';
import { Message } from '../../model/common';
import { addMessage } from './addMessagesAPI';
import { Grid, TextField, IconButton, Typography } from '@mui/material';
import { setnewMSG } from '../../features/messageSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import SendIcon from '@mui/icons-material/Send';

const AddMessage: React.FC<{ receiverId: number }> = ({ receiverId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const userInfos = useSelector(userInfosSelector);
    const [messageSent, setMessageSent] = useState('');
    const [error, setError] = useState({} as CustomError);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setMessageSent(e.target.value);
    };

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        if (receiverId !== -1) {
            const message: Message = {
                senderId: userInfos.userId,
                receiverId: receiverId,
                messageContent: messageSent,
                senderName: userInfos.username,
            };
            addMessage(
                message,
                (result: boolean) => {
                    if (result === true) {
                        dispatch(setnewMSG());
                        setMessageSent('');
                        setError(new CustomError(''));
                    } else {
                        console.error('La création de message a échoué.');
                    }
                },
                (messageError: CustomError) => {
                    console.log(messageError);
                    setError(messageError);
                }
            );
        }
    };

    return (
        <Grid
            container
            alignItems="center"
            justifyContent="center"
            sx={{
                mt: 2,
                p: 2,
                paddingLeft: 30,
                borderTop: '1px solid',
                borderColor: 'grey.300',
                borderRadius: 2,
                boxShadow: 2, 
            }}
        >
            <Grid item xs={10} sx={{ pr: 2 }}>
                <TextField
                    name="messageSent"
                    label="Votre Message"
                    placeholder="Saisissez votre message"
                    variant="outlined"
                    fullWidth
                    value={messageSent}
                    onChange={handleChange}
                    autoComplete="off"
                    multiline
                    maxRows={2}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            borderRadius: 2, 
                            color: 'white',
                        },
                    }}

                />
            </Grid>
            <Grid item xs={2}>
                <IconButton
                    type="submit"
                    color="primary"
                    onClick={handleSubmit}
                    sx={{
                        bgcolor: 'primary.main',
                        color: 'white',
                        '&:hover': { bgcolor: 'primary.dark' },
                        borderRadius: 1, 
                        boxShadow: 1, 
                    }}
                >
                    <SendIcon />
                </IconButton>
            </Grid>
            {error.message && (
                <Typography variant="caption" color="error" sx={{ mt: 1, textAlign: 'center' }}>
                    {error.message}
                </Typography>
            )}
        </Grid>
    );
};

export default AddMessage;
