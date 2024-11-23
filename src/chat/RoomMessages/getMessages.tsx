import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { userInfosSelector } from '../../features/loginSlice';
import { CustomError } from '../../model/CustomError';
import { MessageInfos, Message } from '../../model/common';
import { getMessagesByRoom } from './getMessagesAPI';
import { newMSGSelector } from '../../features/messageSlice';
import { formatTimestamp } from '../../model/common';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

const MessageList: React.FC<{ roomId: number, roomName: string }> = ({ roomId, roomName }) => {
  const newMSGcounter = useSelector(newMSGSelector);
  const [messages, setMessages] = useState<Message[]>([]);
  const [error, setError] = useState({} as CustomError);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    getMessagesByRoom(
      roomId,
      (result: Message[]) => {
        setError(new CustomError(''));
        setMessages(result);
      },
      (messageError: CustomError) => {
        setError(messageError);
      }
    );
  }, [roomId, newMSGcounter]);

  useEffect(() => {
    if (scrollRef.current && messages.length > 0) {
      const lastMessage = scrollRef.current.lastChild as HTMLDivElement;
      lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [messages]);

  return (
    <>
      <Box
        width="100%"
        sx={{
          backgroundColor: 'primary.main',
          color: 'white',
          textAlign: 'center',
          padding: '10px',
          borderRadius: 1,
        }}
      >
        <Typography variant="h6">{roomName}</Typography>
      </Box>

      <Box
        sx={{
          width: '100%',
          bgcolor: 'grey.100',
          p: 3,
          borderRadius: 2,
          boxShadow: 2,
          maxHeight: '70vh',
          overflowY: 'auto',
          margin: '20px auto',
          background: 'linear-gradient(to right, #6a11cb, #2575fc)',
          color: '#fff',
        }}
        ref={scrollRef}
      >
        <List>
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.senderId === roomId ? 'flex-end' : 'flex-start',
                  marginBottom: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: message.senderId === roomId ? 'grey.300' : 'success.light',
                    color: message.senderId === roomId ? 'text.primary' : 'white',
                    borderRadius: 2,
                    maxWidth: '60%',
                    boxShadow: 2,
                  }}
                >
                  <Typography>{message.messageContent}</Typography>
                  {message.timestamp && (
                    <Typography variant="caption" sx={{ mt: 1, color: 'text.secondary' }}>
                      {formatTimestamp(message.timestamp)}
                    </Typography>
                  )}
                </Box>
              </ListItem>
            ))
          ) : (
            <Typography variant="body2" textAlign="center">
              Pas de Messages
            </Typography>
          )}
        </List>
        {error.message && <Typography color="error">{error.message}</Typography>}
      </Box>
    </>
  );
};

export default MessageList;
