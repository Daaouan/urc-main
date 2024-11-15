import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Link,
  ChakraProvider,
  Divider,
  Text,
  Flex,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginUser } from './loginApi';
import { RootState, Session } from '../model/common';
import { CustomError } from '../model/CustomError';
import { useDispatch, useSelector } from 'react-redux';
import { SET_SESSION } from '../redux';
import { extendTheme } from '@chakra-ui/react';

// Define custom theme with sleek light/dark color scheme
const theme = extendTheme({
  config: {
    initialColorMode: 'dark',
    useSystemColorMode: false,
  },
  colors: {
    brand: {
      50: '#2D3748',
      500: '#3182CE', 
      600: '#2B6CB0',
    },
  },
  components: {
    Button: {
      baseStyle: {
        _focus: { boxShadow: '0 0 0 2px #3182CE' },
        _hover: { bg: 'brand.600' },
      },
    },
  },
});

export function Login() {
  const [error, setError] = useState({} as CustomError);
  const session = useSelector((state: RootState) => state.session.session || null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    const form = event.currentTarget;
    const data = new FormData(form);
    loginUser(
      {
        user_id: -1,
        username: data.get('login') as string,
        password: data.get('password') as string,
      },
      (result: Session) => {
        setLoading(false);
        dispatch(SET_SESSION(result));
        sessionStorage.setItem('session', JSON.stringify(result));
        form.reset();
        setError(new CustomError(''));
        navigate('/messages');
      },
      (loginError: CustomError) => {
        setLoading(false);
        setError(loginError);
        dispatch(SET_SESSION({} as Session));
      }
    );
  };

  return (
    <ChakraProvider theme={theme}>
      <Flex minH="100vh" align="center" justify="center" bgGradient="linear(to-r, brand.500, brand.600)">
        <Box
          maxW="sm"
          w="full"
          bg="white"
          p={8}
          borderRadius="lg"
          boxShadow="xl"
          textAlign="center"
          transform="scale(1)"
          _hover={{ transform: 'scale(1.03)', transition: 'transform 0.2s ease-in-out' }}
        >
          <Heading mb={4} fontSize="2xl" color="gray.800">
            Connexion
          </Heading>
          <Divider mb={6} borderColor="gray.300" />
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel color="gray.700">Login</FormLabel>
              <Input
                name="login"
                placeholder="Enter your login"
                focusBorderColor="brand.500"
                bg="gray.100"
                borderRadius="md"
                color="gray.800"
              />
            </FormControl>
            <FormControl mb={6}>
              <FormLabel color="gray.700">Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                focusBorderColor="brand.500"
                bg="gray.100"
                borderRadius="md"
                color="gray.800"
              />
            </FormControl>
            <Button
              type="submit"
              w="full"
              colorScheme="brand"
              isLoading={loading}
              loadingText="Connexion"
              borderRadius="md"
              bgGradient="linear(to-r, brand.500, brand.600)"
              color="white"
              _hover={{
                bgGradient: 'linear(to-r, brand.400, brand.500)',
              }}
            >
              Connexion
            </Button>
          </form>

          {error.message && (
            <Text mt={4} color="red.400">
              {error.message}
            </Text>
          )}

          <Divider my={6} borderColor="gray.300" />
          <Text color="gray.600">
            Vous n&apos;avez pas encore de compte ?{' '}
            <br />
            <Link as={RouterLink} to="/signup" color="brand.500" fontWeight="bold">
              Créer un compte
            </Link>
          </Text>
        </Box>
      </Flex>
    </ChakraProvider>
  );
}
