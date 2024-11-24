import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { userInfosSelector } from '../../features/loginSlice';
import { CustomError } from '../../model/CustomError';
import { Message } from '../../model/common';
import { addMessage } from './addMessagesAPI';
import { Grid, TextField, IconButton, Typography, Input } from '@mui/material';
import { setnewMSG } from '../../features/messageSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../app/store';
import SendIcon from '@mui/icons-material/Send';
import AttachFileIcon from '@mui/icons-material/AttachFile';

const AddMessage: React.FC<{ receiverId: number }> = ({ receiverId }) => {
    const dispatch = useDispatch<AppDispatch>();
    const userInfos = useSelector(userInfosSelector);
    const [messageSent, setMessageSent] = useState('');
    const [selectedFile, setSelectedFile] = useState<Blob | null>(null);
    const [error, setError] = useState({} as CustomError);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

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
    
            // Create a FormData object
            const formData = new FormData();
            formData.append('message', JSON.stringify(message));
            if (selectedFile) {
                formData.append('file', selectedFile);
            }
    
            addMessage(
                formData,
                (result: boolean) => {
                    if (result === true) {
                        dispatch(setnewMSG());
                        setMessageSent('');
                        setSelectedFile(null);
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
        <Grid container alignItems="center" justifyContent="center" sx={{ mt: 2, p: 2 }}>
            <Grid item xs={8} sx={{ pr: 2 }}>
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
                />
            </Grid>
            <Grid >
                <Input
                    type="file"
                    inputProps={{ accept: 'image/*' }}
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                    id="file-upload"
                />
                {/* Label Associated with the Hidden Input */}
                <label htmlFor="file-upload">
                    <IconButton component="span" sx={{ color: 'white' }} aria-label="Attach file">
                        <AttachFileIcon />
                    </IconButton>
                </label>
            </Grid>
            <Grid item >
                <IconButton type="submit" sx={{ color: 'white' }} onClick={handleSubmit}>
                    <SendIcon />
                </IconButton>
            </Grid>
            {error.message && <Typography color="error">{error.message}</Typography>}
        </Grid>
    );
};

export default AddMessage;
