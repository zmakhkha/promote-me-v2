"use client";
import React, { useState } from "react";
import { Box, Button, Input, Text, Flex, Link, useToast } from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import api from "@/services/axios/api";

const MainLogin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const toast = useToast();
  const router = useRouter();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null); // Clear any previous errors

    try {
      const response = await api.post("/api/v1/login/", {
        username,
        password,
      });

      const { access, refresh } = response.data;

      // Store tokens in localStorage
      localStorage.setItem("accessToken", access);
      localStorage.setItem("refreshToken", refresh);

      // Redirect to home page
      router.push("/"); // Redirect using next.js router
    } catch (err: any) {
      // Handle errors gracefully
      if (err.response?.status === 401) {
        setError("Invalid username or password.");
      } else if (err.response?.status === 429) {
        setError("Too many login attempts. Please try again later.");
      } else {
        setError("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <Flex align="center" justify="center" direction="column" w="100%" minH="90vh" p={4} bg="gray.50">
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg="white"
        color="gray.700"
        maxW="lg"
        w="100%"
        borderColor="pink.300"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="pink.400">
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
            <Button type="submit" colorScheme="pink" variant="solid" w="full">
              Login
            </Button>
          </Flex>
        </form>
        {error && <Text color="red.500" mt={2}>{error}</Text>}
        <Text mt={4} textAlign="center" color="gray.600">
          Don&apos;t have an account-?{" "}
          <Link href="/register" color="pink.500" fontWeight="bold">
            Register
          </Link>
        </Text>
      </Box>
    </Flex>
  );
};

export default MainLogin;
