import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Text,
  Link,
  ChakraProvider,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { registerUser } from './signupApi';
import { User } from '../model/common';
import { useDispatch } from 'react-redux';
import { SET_SESSION } from '../redux';
import { extendTheme } from '@chakra-ui/react';

const theme = extendTheme({
  colors: {
    brand: {
      50: '#2D3748',
      500: '#3182CE',
      600: '#2B6CB0',
      700: '#1a3545',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'brand.50',
        color: 'brand.500',
        fontFamily: 'Arial, sans-serif',
      },
    },
  },
});

const Signup: React.FC = () => {
  const [registrationData, setRegistrationData] = useState<User>({
    user_id: -1,
    username: '',
    email: '',
    password: '',
  });

  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Validate inputs
    if (!registrationData.username || !registrationData.email || !registrationData.password) {
      setError('All fields are required.');
      return;
    }

    setLoading(true);
    registerUser(
      registrationData,
      (session) => {
        setLoading(false);
        dispatch(SET_SESSION(session));
        navigate('/messages');
      },
      (registrationError) => {
        setLoading(false);
        setError(registrationError.message);
      }
    );
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setRegistrationData((prevData) => ({ ...prevData, [name]: value }));
  };

  return (
    <ChakraProvider theme={theme}>
      <Box
        display="flex"
        alignItems="center"
        justifyContent="center"
        height="100vh"
        bgGradient="linear(to-r, brand.600, brand.700)"
      >
        <Box
          width="100%"
          maxWidth="400px"
          p={8}
          borderRadius="xl"
          bg="white"
          boxShadow="xl"
          transform="scale(1)"
          _hover={{ transform: 'scale(1.02)', transition: 'all 0.3s ease-in-out' }}
        >
          <Heading mb={6} textAlign="center" size="lg" color="brand.600">
            Create Account
          </Heading>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4}>
              <FormLabel color="brand.600">Username</FormLabel>
              <Input
                name="username"
                placeholder="Enter your username"
                value={registrationData.username}
                onChange={handleChange}
                borderColor="brand.500"
                focusBorderColor="brand.600"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel color="brand.600">Email</FormLabel>
              <Input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={registrationData.email}
                onChange={handleChange}
                borderColor="brand.500"
                focusBorderColor="brand.600"
              />
            </FormControl>
            <FormControl mb={6}>
              <FormLabel color="brand.600">Password</FormLabel>
              <Input
                type="password"
                name="password"
                placeholder="Enter your password"
                value={registrationData.password}
                onChange={handleChange}
                borderColor="brand.500"
                focusBorderColor="brand.600"
              />
            </FormControl>
            <Button
              type="submit"
              width="100%"
              bgGradient="linear(to-r, brand.600, brand.700)"
              color="white"
              _hover={{ bgGradient: 'linear(to-r, brand.500, brand.600)' }}
              isLoading={loading}
              loadingText="Signing up"
            >
              Create Account
            </Button>
          </form>

          {error && (
            <Box mt={4} color="red.500" textAlign="center">
              <Text>{error}</Text>
            </Box>
          )}

          <Box mt={6} textAlign="center">
            <Text>
              Already have an account?{' '}
              <br />
              <Link as={RouterLink} to="/login" color="brand.500" fontWeight="bold">
                Log in
              </Link>
            </Text>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
};

export default Signup;
