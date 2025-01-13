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
import {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
  randomConnectWebSocket,
} from "@/services/axios/websocketService";

type Message = {
  text: string;
  type: "sent" | "received" | "system";
  timestamp: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [chatStatus, setChatStatus] = useState<string>(
    "Waiting for a connection..."
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const connectedUser = "frankday";

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";
    if (!token) {
      setChatStatus("Authentication failed. Please log in.");
      return;
    }

    connectWebSocket(token, "2");
    randomConnectWebSocket(token);
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data); // Parse JSON data
        // console.log("------------------");
        // console.log("----------------------->|--------", typeof(data));
        // console.log("------------------");

        switch (data.type) {
          case "match": // RandomChatConsumer match event
            setChatStatus("Connected! Start chatting.");
            setIsConnecting(false);
            setRoomId(data.roomId);
            break;

          case "message": // Chat message from ChatConsumer
            setMessages((prev) => [
              ...prev,
              {
                text: data.message,
                type: "received",
                timestamp: getCurrentTimestamp(),
              },
            ]);
            break;

          case "system": // System message
            setMessages((prev) => [
              ...prev,
              {
                text: data.message,
                type: "system",
                timestamp: getCurrentTimestamp(),
              },
            ]);
            break;

          case "status_user": // Status update from StatusConsumer
            console.log("Status update:", data.action);
            // Optionally handle the status update in the UI
            break;

          // case "redirect": // Redirect message from RandomChatConsumer
          //   const { room_name, partner } = data;
          //   setChatStatus(`Matched with ${partner.username}!`);
          //   setRoomId(room_name);
          //   break;
          case "redirect": // Redirect message from RandomChatConsumer
          const { room_name, users } = data;
          const user1 = users.user1;
          const user2 = users.user2;

          // Check if connectedUser is either user1 or user2
          if (connectedUser === user1.username) {
            setChatStatus(`Matched with ${user2.username}!`);
          } else if (connectedUser === user2.username) {
            setChatStatus(`Matched with ${user1.username}!`);
          }

          setRoomId(room_name);
          break;

          case "chat_message": // Chat message from ChatConsumer
            const { sender, message, timestamp } = data;
            const formattedTimestamp = `${timestamp.hour}:${timestamp.minute}, ${timestamp.day}/${timestamp.month}/${timestamp.year}`;
            setMessages((prev) => [
              ...prev,
              {
                text: message,
                type: "received",
                sender,
                timestamp: formattedTimestamp,
              },
            ]);
            break;

          default:
            console.error("Unknown message type:", data);
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
        <Text fontSize="xl" fontWeight="bold">
          {chatStatus}
        </Text>
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
          <HStack
            key={index}
            justify={message.type === "sent" ? "flex-end" : "flex-start"}
          >
            {message.type === "received" && (
              <Avatar size="sm" name="Received User" />
            )}
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
