"use client";

import { Box, Button, Container, IconButton, Text, VStack, useColorMode } from "@chakra-ui/react";
import { Heart, Users, Moon, Sun } from "lucide-react";

interface EmptyStateProps {
  stage: "unseen_users" | "other_users" | "no_more_users";
  otherUsersLength: number;
  onShowOtherUsers: () => void;
  onRefresh: () => void;
  onBack: () => void;
  toggleColorMode: () => void;
}

const EmptyState = ({ stage, otherUsersLength, onShowOtherUsers, onRefresh, onBack, toggleColorMode }: EmptyStateProps) => {
  const { colorMode } = useColorMode();
  const bgColor = colorMode === "light" ? "gray.50" : "gray.900";
  const textColor = colorMode === "light" ? "gray.800" : "white";

  return (
    <Box minH="100vh" bg={bgColor}>
      <Container maxW="md" centerContent>
        <VStack spacing={6} justify="center" minH="100vh">
          <Heart size={64} color="#E53E3E" />
          {stage === "unseen_users" && otherUsersLength > 0 ? (
            <>
              <Text color={textColor}>No more new users!</Text>
              <Text color="gray.500">Would you like to see other users you've interacted with before?</Text>
              <Button colorScheme="pink" onClick={onShowOtherUsers} leftIcon={<Users size={20} />}>
                Show Other Users
              </Button>
              <Button variant="outline" onClick={onRefresh}>Refresh</Button>
            </>
          ) : (
            <>
              <Text color={textColor}>No more users available!</Text>
              <Text color="gray.500">Check back later for new profiles.</Text>
              <Button colorScheme="blue" onClick={onRefresh}>Refresh</Button>
              <Button variant="ghost" onClick={onBack}>Back to Start</Button>
            </>
          )}
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

export default EmptyState;
