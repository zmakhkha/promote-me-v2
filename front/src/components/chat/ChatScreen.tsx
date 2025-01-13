import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Button,
  Text,
  Spinner,
  Textarea,
  useColorModeValue,
} from "@chakra-ui/react";
import useColorModeStyles from "@/utils/useColorModeStyles";
import { connectWebSocket, sendMessage, disconnectWebSocket } from "@/services/axios/websocketService";

type Message = {
  text: string;
  type: "sent" | "received" | "system";
  timestamp: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [chatStatus, setChatStatus] = useState<string>("Waiting for a connection...");
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";
    if (!token) {
      setChatStatus("Authentication failed. Please log in.");
      return;
    }

    connectWebSocket(token, "random");

    const handleMessage = (event: MessageEvent) => {
      try {
        const data = event.data;
        console.log('------------------');
        console.log(data);
        console.log('------------------');
        
        switch (data.type) {
          case "match":
            setChatStatus("Connected! Start chatting.");
            setIsConnecting(false);
            setRoomId(data.roomId);
            break;
          case "message":
            setMessages((prev) => [
              ...prev,
              { text: data.message, type: "received", timestamp: getCurrentTimestamp() },
            ]);
            break;
          case "system":
            setMessages((prev) => [
              ...prev,
              { text: data.message, type: "system", timestamp: getCurrentTimestamp() },
            ]);
            break;
          default:
            console.error("Unknown message type:", data.type);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", event.data, error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      disconnectWebSocket();
      window.removeEventListener("message", handleMessage);
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage({ message: inputValue, roomId });
      setMessages((prev) => [
        ...prev,
        { text: inputValue, type: "sent", timestamp: getCurrentTimestamp() },
      ]);
      setInputValue("");
    }
  };

  return (
    <Box
      maxW="lg"
      w="full"
      bg={bg}
      borderRadius="lg"
      p={8}
      boxShadow="lg"
      borderColor={borderColor}
      borderWidth="1px"
      mx="auto"
      my="auto"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="80vh"
    >
      <Box mb={4} textAlign="center">
        <Text fontSize="xl" fontWeight="bold">{chatStatus}</Text>
        {isConnecting && <Spinner mt={4} />}
      </Box>

      <VStack
        spacing={4}
        align="stretch"
        mb={4}
        maxHeight="calc(100% - 100px)"
        overflowY="auto"
        flexGrow={1}
      >
        {messages.map((message, index) => (
          <HStack key={index} justify={message.type === "sent" ? "flex-end" : "flex-start"}>
            {message.type === "received" && <Avatar size="sm" name="Received User" />}
            <Box
              bg={message.type === "sent" ? hoverColor : borderColor}
              color={message.type === "sent" ? "white" : textColor}
              px={4}
              py={2}
              borderRadius="lg"
              maxWidth="70%"
              boxShadow="sm"
            >
              <Text>{message.text}</Text>
              <Text fontSize="xs" color="gray.500" mt={1} textAlign="right">
                {message.timestamp}
              </Text>
            </Box>
          </HStack>
        ))}
        <div ref={messagesEndRef} />
      </VStack>

      <HStack spacing={2}>
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          size="sm"
          resize="none"
        />
        <Button colorScheme="pink" onClick={handleSendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatScreen;
