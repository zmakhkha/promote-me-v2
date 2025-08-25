"use client";

import { Box, Container, IconButton, Spinner, Text, VStack, useColorMode } from "@chakra-ui/react";
import { Moon, Sun } from "lucide-react";

const LoadingScreen = ({ toggleColorMode }: { toggleColorMode: () => void }) => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "gray.50" : "gray.900";
  const textColor = colorMode === "light" ? "gray.800" : "white";

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="md" centerContent>
        <VStack spacing={6} justify="center" minH="100vh">
          <Spinner size="xl" color="pink.500" />
          <Text color={textColor} fontSize="lg">Loading profiles...</Text>
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

export default LoadingScreen;
