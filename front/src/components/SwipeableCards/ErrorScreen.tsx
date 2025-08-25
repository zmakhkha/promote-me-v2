"use client";

import { Box, Button, Container, IconButton, Text, VStack, useColorMode } from "@chakra-ui/react";
import { X, Moon, Sun } from "lucide-react";

interface ErrorScreenProps {
  error: string | null;
  onRetry: () => void;
  toggleColorMode: () => void;
}

const ErrorScreen = ({ error, onRetry, toggleColorMode }: ErrorScreenProps) => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "gray.50" : "gray.900";
  const textColor = colorMode === "light" ? "gray.800" : "white";

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="md" centerContent>
        <VStack spacing={6} justify="center" minH="100vh">
          <X size={64} color="#E53E3E" />
          <Text color={textColor} fontSize="lg">Failed to load profiles</Text>
          <Text color="gray.500" textAlign="center">{error}</Text>
          <Button colorScheme="pink" size="lg" onClick={onRetry}>Try Again</Button>
          <IconButton
            aria-label="Toggle color mode"
            icon={colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
            onClick={toggleColorMode}
            variant="ghost"
          />
        </VStack>
      </Container>
    </Box>
  );
};

export default ErrorScreen;
