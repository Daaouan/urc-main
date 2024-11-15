import React, { useState, useEffect } from "react";
import { Box, Heading, Spinner, Text } from "@chakra-ui/react";
import { listUsers } from "./usersApi";
import { RootState, UserPublic } from "../model/common";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

const UserList = () => {
  const { id_receiver } = useParams();
  const [users, setUsers] = useState<UserPublic[]>([]);
  const [loading, setLoading] = useState(true);
  const session = useSelector((state: RootState) => state.session.session);
  const navigate = useNavigate();
  const { id } = useParams();
  const receiver_id = (id == null || id == undefined ? -1 : id) as number;

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersData = await listUsers();
        setUsers(usersData);
        const isReceiverInUsers = usersData.some(
          (user) => user.user_id === receiver_id
        );

        if (!isReceiverInUsers) {
          navigate("/messages");
        }
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des utilisateurs:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleUserClick = (userId: number) => {
    navigate(`/messages/user/${userId}`);
  };

  return (
    <Box width={['80%', '70%']}>
      {loading ? (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height="30vh"
        >
          <Spinner size="xl" />
        </Box>
      ) : (
        <Box>
          <Heading
            fontSize="2xl"
            mb="4"
            padding="4"
            color="#13262F"
            borderBottom="1px solid teal"
          >
            UTILISATEURS: 
          </Heading>
          {users.map((user) => (
            user.user_id !== session.id && (
              <Box
                key={user.user_id}
                onClick={() => handleUserClick(user.user_id)}
                backgroundColor={receiver_id === user.user_id ? "gray.300" : "gray.100"}
                p="3"
                mb="2"
                borderRadius="5px"
                cursor="pointer"
                _hover={{ backgroundColor: "gray.200" }}
              >
                <Text fontSize="lg" fontWeight="bold" color="black">
                  {user.username}
                </Text>
              </Box>
            )
          ))}
        </Box>
      )}
    </Box>
  );
};

export default UserList;
