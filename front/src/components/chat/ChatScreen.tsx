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
import startChat, {
  connectWebSocket,
  sendMessage,
  disconnectWebSocket,
  randomConnectWebSocket,
} from "@/services/axios/websocketService";
import { getConnectedUser } from "@/services/axios/getConnectedUser";

type Message = {
  text: string;
  type: "sent" | "received" | "system";
  timestamp: string;
  sender?: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [token, settoken] = useState<string>("");
  const [chatStatus, setChatStatus] = useState<string>("Waiting for a connection...");
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [connectedUser, setConnectedUser] = useState<string>("");

  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";
    settoken(token);
    if (!token) {
      setChatStatus("Authentication failed. Please log in.");
      return;
    }

    const fetchUserProfile = async () => {
      try {
        const userData = await getConnectedUser();
        setUser(userData);
      } catch (error) {
        console.log("Failed to load user profile.");
      }
    };

    fetchUserProfile();
  }, []);

  useEffect(() => {
    if (user) {
      setConnectedUser(user.username);
      connectWebSocket(localStorage.getItem("accessToken") || "", "2");
      randomConnectWebSocket(localStorage.getItem("accessToken") || "");
    }
  }, [user]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "match":
            setChatStatus("Connected! Start chatting.");
            setIsConnecting(false); // Stop the spinner
            setRoomId(data.roomId);
            break;

          case "status_user":
            console.log("Status update:", data.action);
            break;

          case "message":
            setMessages((prev) => [
              ...prev,
              {
                text: data.message,
                type: "received",
                timestamp: getCurrentTimestamp(),
                sender: data.sender,
              },
            ]);
            break;

          case "system":
            setMessages((prev) => [
              ...prev,
              {
                text: data.message,
                type: "system",
                timestamp: getCurrentTimestamp(),
              },
            ]);
            break;

          case "redirect":
            const { room_name, users } = data;
            const user1 = users.user1;
            const user2 = users.user2;

            if (connectedUser === user1.username) {
              setChatStatus(`Matched with ${user2.username}!`);
            } else if (connectedUser === user2.username) {
              setChatStatus(`Matched with ${user1.username}!`);
            }
            setIsConnecting(false); // Stop the spinner

            setRoomId(room_name);
            startChat(token, room_name);
            break;

          case "chat_message":
            const { sender, message, timestamp } = data;

            const date = new Date(timestamp);
            const formattedTimestamp = `${date.getHours()}:${String(
              date.getMinutes()
            ).padStart(2, "0")}, ${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`;

            setMessages((prev) => [
              ...prev,
              {
                text: message,
                type: connectedUser === sender ? "sent" : "received", // Determine the type based on sender
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
      window.removeEventListener("message", handleMessage);
    };
  }, [connectedUser]);

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage({
        user: connectedUser,
        sender: connectedUser,
        content: inputValue,
      });
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
              <Avatar size="sm" name={message.sender} />
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
