import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { userInfosSelector } from '../../features/loginSlice';
import { CustomError } from '../../model/CustomError';
import { MessageInfos, Message } from '../../model/common';
import { getMessage } from './getMessagesAPI';
import { newMSGSelector } from '../../features/messageSlice';
import { formatTimestamp } from '../../model/common';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material';

const MessageList: React.FC<{ receiverId: number, receiverName: string }> = ({ receiverId, receiverName }) => {
  const newMSGcounter = useSelector(newMSGSelector);
  const userInfos = useSelector(userInfosSelector);
  const [messageList, setMessageList] = useState<Message[]>([]);
  const [error, setError] = useState({} as CustomError);
  const [messageRecus, setMessageRecus] = useState<Message[]>([]);
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const messageInfosEnvoyes = { senderId: userInfos.userId, receiverId: receiverId } as MessageInfos;
    const messageInfosRecus = { senderId: receiverId, receiverId: userInfos.userId } as MessageInfos;

    getMessage(
      messageInfosEnvoyes,
      (resultEnvoyes: Message[]) => {
        setError(new CustomError(""));
        setMessageList(resultEnvoyes);
      },
      (loginError: CustomError) => {
        setError(loginError);
      }
    );

    getMessage(
      messageInfosRecus,
      (resultRecus: Message[]) => {
        setError(new CustomError(""));
        setMessageRecus(resultRecus);
      },
      (loginError: CustomError) => {
        setError(loginError);
      }
    );
  }, [userInfos.userId, receiverId, newMSGcounter]);

  const combinedMessages = [...messageList, ...messageRecus].sort((a, b) => {
    if (a.timestamp && b.timestamp) {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    }
    return 0;
  });

  useEffect(() => {
    if (scrollRef.current && combinedMessages.length > 0) {
      const lastMessage = scrollRef.current.lastChild as HTMLDivElement;
      lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }
  }, [combinedMessages]);

  return (
    <>
      {/* Receiver Header */}
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
        <Typography variant="h6">{receiverName}</Typography>
      </Box>

      {/* Message List */}
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
          background: "linear-gradient(to right, #6a11cb, #2575fc)", // Gradient background
          color: "#fff",
        }}
        ref={scrollRef}
      >
        <List>
          {combinedMessages.length > 0 ? (
            combinedMessages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  justifyContent: message.senderId === userInfos.userId ? 'flex-end' : 'flex-start',
                  marginBottom: 2,
                }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: message.senderId === userInfos.userId ? 'grey.300' : 'success.light',
                    color: message.senderId === userInfos.userId ? 'text.primary' : 'white',
                    borderRadius: 2,
                    maxWidth: '60%',
                    boxShadow: 2,
                  }}
                >
                  {message.filePath && (
                    <img src={message.filePath} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                  )}
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
