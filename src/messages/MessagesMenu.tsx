import { useSelector } from "react-redux";
import { RootState } from "../model/common";
import UsersList from "./UsersList";
import Chat from "./Chat";
import { Box, Button, Heading, Input, Flex, Spacer, Divider } from '@chakra-ui/react';
import React from 'react';
import { useParams } from 'react-router-dom';

const MessagesMenu = () => {
  const session = useSelector((state: RootState) => state.session.session);
  const { id } = useParams();

  return (
    <Box width="100%" height="100vh" bg="#f7fafc" padding="20px">
      <Flex direction="row" justify="space-between" align="flex-start" height="100%">
        {/* Chat Section */}
        <Box width={['100%', '70%']} padding="20px" borderRadius="lg" boxShadow="lg" bg="white" height="100%">
          <Chat />
        </Box>

        {/* Divider */}
        <Spacer />

        {/* User List Sidebar */}
        <Box width={['100%', '30%']} padding="20px" borderRadius="lg" boxShadow="lg" bg="white" height="100%">
          <UsersList />
        </Box>
      </Flex>
    </Box>
  );
};

export default MessagesMenu;
