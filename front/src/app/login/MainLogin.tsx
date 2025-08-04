"use client";
import React, { useState } from "react";
import { Box, Button, Input, Text, Flex, Link } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

import useColorModeStyles from "@/utils/useColorModeStyles";
import axios from "axios";
const MainLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { bg, textColor } = useColorModeStyles();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://localhost:2000/api/v1/login/", {
        username,
        password,
      });

      const { access, refresh, is_staff } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);
      if (is_staff) {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      let message = "An unexpected error occurred. Please try again.";
      if (err.response?.status === 401) {
        message = "Invalid username or password.";
      } else if (err.response?.status === 429) {
        message = "Too many login attempts. Please try again later.";
      }

      setError(message); 
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      w="100%"
      minH="100%"
      p={4}
      bg={bg}
    >
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg={bg}
        color={textColor}
        maxW="lg"
        w="100%"
        borderColor="pink.300"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={4}
          textAlign="center"
          color="pink.400"
        >
          Login
        </Text>
        <form onSubmit={handleLogin}>
          <Flex direction="column" gap={4}>
            <Input
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="login-input"
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="login-input"
            />
            <Button
              type="submit"
              colorScheme="pink"
              variant="solid"
              w="full"
              isLoading={loading}
              loadingText="Logging in..."
            >
              Login
            </Button>
          </Flex>
        </form>
        {error && (
          <Flex justify="center" align="center" mt={2} w="100%" color="red.500">
            <Text>{error}</Text>
          </Flex>
        )}
        <Text mt={4} textAlign="center" color="gray.600">
          Don&apos;t have an account?{" "}
          <Link href="/register" color="pink.500" fontWeight="bold">
            Register
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default MainLogin;
