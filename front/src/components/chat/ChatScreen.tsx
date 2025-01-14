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
  randomConnectWebSocket,
  disconnectAll,
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
  const [token, setToken] = useState<string>("");
  const [chatStatus, setChatStatus] = useState<string>(
    "Waiting for a connection..."
  );
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);

  // Fetch user profile and token
  useEffect(() => {
    const token = localStorage.getItem("accessToken") || "";
    setToken(token);
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

  // Connect WebSocket on user change
  useEffect(() => {
    if (user) {
      connectWebSocket(token || "", "2");
      randomConnectWebSocket(token || "");
    }
  }, [user]);

  // Handle incoming WebSocket messages
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (!event.data || event.data === "{}") {
        console.error("Received an empty WebSocket message:", event.data);
        return;
      }
      try {
        const data = JSON.parse(event.data);
        console.log("------------------->[", data, "]");

        switch (data.type) {
          case "match":
            setChatStatus("Connected! Start chatting.");
            setIsConnecting(false);
            setRoomId(data.roomId);
            break;

          case "redirect":
            const { room_name, users } = data;
            const user1 = users.user1;
            const user2 = users.user2;
            if (
              user.username === user1.username ||
              user.username === user2.username
            ) {
              if (user.username === user1.username) {
                setChatStatus(`Matched with ${user2.username}!`);
              } else if (user.username === user2.username) {
                setChatStatus(`Matched with ${user1.username}!`);
              }
              setIsConnecting(false);
              setRoomId(room_name);
              startChat(token, room_name);
            }
            break;

          case "chat_message":
            const { sender, message, timestamp } = data;
            console.log("timestamp -->|", timestamp);
            const formattedTimestamp = `${timestamp.hour}:${timestamp.hour}`;

            if (data.roomId == roomId) {
              setMessages((prev) => [
                ...prev,
                {
                  text: message,
                  type: user.id === sender ? "sent" : "received",
                  sender: user.id === sender ? user.username : data.user,
                  timestamp: formattedTimestamp,
                },
              ]);
            }
            break;

          default:
            console.log("Unknown message type:", data);
        }
      } catch (error) {
        console.log(
          "-->|Failed to parse WebSocket message:",
          event.data,
          error
        );
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [user]);

  const resetChatAndReconnectWebSockets = () => {
    // Disconnect existing WebSockets
    disconnectAll();

    // Reset states
    setMessages([]);
    setInputValue("");
    setChatStatus("Waiting for a connection...");
    setIsConnecting(true);
    setRoomId(null);

    // Reconnect WebSockets
    connectWebSocket(token || "", "2");
    randomConnectWebSocket(token || "");
    
    // Optionally reconnect chat socket if roomId is available
    if (roomId) {
      startChat(token || "", roomId);
    }
    
    // Reset the user state if needed
    // setUser(null); // Uncomment if you want to reset the user state as well
  };

  

  // Handle sending messages
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

  // Sort messages by timestamp before rendering
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
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
        {sortedMessages.map((message, index) => (
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
              <Text fontWeight="bold">{message.sender}</Text>
              <Text>{message.text}</Text>
              <Text
                fontSize="xs"
                color="gray.500"
                mt={1}
                textAlign={message.type === "sent" ? "right" : "left"}
              >
                {message.timestamp}
              </Text>
            </Box>
          </HStack>
        ))}

        {/* Reference div for scrolling */}
        <div ref={messagesEndRef} />
      </VStack>

      <HStack spacing={2}>
        {/* New (Esc) Button */}
        <Button colorScheme="blue" onClick={resetChatAndReconnectWebSockets}>
          New (Esc)
        </Button>
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
