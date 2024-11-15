import React, { useState, useEffect , useRef} from 'react';
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

const MessageList: React.FC<{ receiverId: number,receiverName : string }> = ({ receiverId ,receiverName}) => {

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
      <Box
          width={800}
          sx={{ backgroundColor: '#3498db', margin: 'auto', textAlign: 'center', padding: '10px' }}
      >
        <Typography variant="h6" component="div" sx={{ color: 'black' }}>
          {receiverName}
        </Typography>
      </Box>
      <Box width={760} bgcolor="grey.100" p={3} sx={{ overflowY: 'auto', maxHeight: '70vh' }} ref={scrollRef}>
        <List>
          {combinedMessages.length > 0 ? (
            combinedMessages.map((message, index) => (
              <ListItem
                key={index}
                sx={{
                  marginBottom: '8px',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: message.senderId === userInfos.userId ? 'flex-end' : 'flex-start',
                }}
              >
                <ListItemText
                  primary={message.messageContent}
                  sx={{
                    display: 'inline-block',
                    maxWidth: '45%',
                    backgroundColor: message.senderId === userInfos.userId ? '#e0e0e0' : '#4CAF50',
                    borderRadius: '8px',
                    padding: '8px',
                    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                  }}
                />
                {message.timestamp && (
                  <ListItemText
                    secondary={formatTimestamp(message.timestamp)}
                    sx={{
                      fontSize: '0.6rem',
                      color: 'gray',
                      textAlign: message.senderId === userInfos.userId ? 'right' : 'left',
                    }}
                  />
                )}
              </ListItem>
            ))
          ) : (
            <Typography variant="body2">Pas de Messages</Typography>
          )}
        </List>
        {error.message && <span>{error.message}</span>}
      </Box>
    </>
  );
};

export default MessageList;
