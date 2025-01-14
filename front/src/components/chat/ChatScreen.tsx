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
  const [sentMessages, setSentMessages] = useState<Message[]>([]);
  const [receivedMessages, setReceivedMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [token, settoken] = useState<string>("");
  const [chatStatus, setChatStatus] = useState<string>(
    "Waiting for a connection..."
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

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
      const token = localStorage.getItem("accessToken");
      connectWebSocket(token || "", "2");
      randomConnectWebSocket(token || "");
    }
  }, [user]);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        console.log("------------------->[", data,"]");

        switch (data.type) {

          case "redirect":
            const { room_name, users } = data;
            const user1 = users.user1;
            const user2 = users.user2;

            if (user.username === user1.username) {
              setChatStatus(`Matched with ${user2.username}!`);
            } else if (user.username === user2.username) {
              setChatStatus(`Matched with ${user1.username}!`);
            }
            setIsConnecting(false); // Stop the spinner
            setRoomId(room_name);
            startChat(token, room_name);
            break;

          case "chat_message":
            console.log("ana hnaaaaaaaaaaaaaaaaaaaaaaaaaa");
            const { sender, message, timestamp } = data;

            const date = new Date(timestamp);
            const formattedTimestamp = `${date.getHours()}:${String(
              date.getMinutes()
            ).padStart(2, "0")}, ${date.getDate()}/${
              date.getMonth() + 1
            }/${date.getFullYear()}`;

            if (user.id === sender) {
              // Add to sentMessages if sender is the current user
              setSentMessages((prev) => [
                ...prev,
                {
                  text: message,
                  type: "sent", // Mark as "sent" for current user's messages
                  sender,
                  timestamp: formattedTimestamp,
                },
              ]);
              console.log(sentMessages);
            } else {
              // Add to receivedMessages if sender is not the current user
              setReceivedMessages((prev) => [
                ...prev,
                {
                  text: message,
                  type: "received", // Mark as "received" for other user's messages
                  sender,
                  timestamp: formattedTimestamp,
                },
              ]);
              console.log(receivedMessages);
            }
            break;

          default:
            // console.error("Unknown message type:", data);
            console.log("message : ", data);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", event.data, error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [user]);

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (inputValue && inputValue.trim()) {
      sendMessage({
        user: user.username,
        sender: user.id,
        content: inputValue,
      });
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
        {/* Render sent messages */}
        {sentMessages.map((message, index) => (
          <HStack key={index} justify="flex-end">
            <Box
              bg={hoverColor}
              color="white"
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

        {/* Render received messages */}
        {receivedMessages.map((message, index) => (
          <HStack key={index} justify="flex-start">
            <Avatar size="sm" name={message.sender} />
            <Box
              bg={borderColor}
              color={textColor}
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
