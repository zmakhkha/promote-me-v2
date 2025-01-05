"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Input,
  VStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  useToast,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaRegComments } from "react-icons/fa";
import useColorModeStyles from "@/utils/useColorModeStyles";

const MainChat: React.FC = () => {
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const [connected, setConnected] = useState<boolean>(false);
  const [chatStarted, setChatStarted] = useState<boolean>(false);
  const [messages, setMessages] = useState<any[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [userName, setUserName] = useState<string>("");
  const [matchUser, setMatchUser] = useState<string>("");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  // Handle matching user
  useEffect(() => {
    if (chatStarted && !connected) {
      setTimeout(() => {
        const randomUsers = ["John", "Sarah", "Alex", "Emily"];
        const randomIndex = Math.floor(Math.random() * randomUsers.length);
        setMatchUser(randomUsers[randomIndex]);
        setConnected(true);

        toast({
          title: "You are connected!",
          description: `You are now connected with ${randomUsers[randomIndex]}`,
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }, 2000); // Simulating a 2-second random match time
    }
  }, [chatStarted]);

  // Function to handle sending messages
  const sendMessage = () => {
    if (inputMessage.trim() === "") return;

    const newMessage = {
      sender: userName,
      message: inputMessage,
      timestamp: new Date().toLocaleTimeString(),
    };

    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setInputMessage("");
  };

  // Function to start chat and show terms modal
  const startChat = () => {
    onOpen();
  };

  // Function to handle accepting the terms
  const handleAcceptTerms = () => {
    onClose();
    setUserName("User_" + Math.floor(Math.random() * 100)); // Assign a random user name
    setChatStarted(true);
  };

  return (
    <Box p={4} bg={bg} height="100vh">
      {/* Title Section */}
      <Box
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        mb={4}
        bg={bg}
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
          Random Chat
        </Text>
        <Text fontSize="md" mt={2} color={textColor}>
          Chat with random people and make new connections!
        </Text>
      </Box>

      {/* Modal for Terms and Conditions */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Terms and Conditions</ModalHeader>
          <ModalBody>
            <Text fontSize="md" color={textColor}>
              By using this service, you agree to our terms and conditions.
              This includes random user matching and chat functionalities.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleAcceptTerms}>
              Accept
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Decline
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Chat Interface */}
      <VStack spacing={4} align="stretch">
        {!chatStarted ? (
          <Button
            colorScheme="blue"
            size="lg"
            leftIcon={<FaRegComments />}
            onClick={startChat}
          >
            Start Chat
          </Button>
        ) : (
          <>
            {connected && (
              <Box
                border="1px solid"
                borderColor={borderColor}
                p={4}
                bg={bg}
                borderRadius="md"
                textAlign="center"
              >
                <Text fontSize="lg" fontWeight="bold" color={textColor}>
                  You are connected with {matchUser}
                </Text>
              </Box>
            )}

            <Box
              bg={bg}
              p={4}
              borderRadius="md"
              border="1px solid"
              borderColor={borderColor}
              maxHeight="400px"
              overflowY="scroll"
            >
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  bg={msg.sender === userName ? "blue.100" : "green.100"}
                  p={2}
                  borderRadius="md"
                  mb={2}
                  alignSelf={msg.sender === userName ? "flex-end" : "flex-start"}
                >
                  <Text color={textColor} fontSize="sm" fontWeight="bold">
                    {msg.sender} - {msg.timestamp}
                  </Text>
                  <Text color={textColor}>{msg.message}</Text>
                </Box>
              ))}
            </Box>

            {/* Message Input Section */}
            <Box display="flex" mt={4}>
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message..."
                bg={bg}
                borderColor={borderColor}
                mr={2}
                color={textColor}
              />
              <Button
                colorScheme="blue"
                onClick={sendMessage}
                disabled={!inputMessage.trim()}
              >
                Send
              </Button>
            </Box>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default MainChat;
