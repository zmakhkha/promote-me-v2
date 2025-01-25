import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect, useCallback } from "react";
const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });
import { Smile } from "lucide-react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Button,
  Text,
  Spinner,
  Input,
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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  // Reference for emoji picker container
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Close emoji picker on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    if (showEmojiPicker) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom whenever the messages array changes
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

  const addEmoji = (emojiObject: { emoji: string }) => {
    setInputValue((prev) => prev + emojiObject.emoji);
  };

  // Sort messages by timestamp before rendering
  const sortedMessages = [...messages].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  const escFunction = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      resetChatAndReconnectWebSockets();
    }
  }, []);

  useEffect(() => {
    document.addEventListener("keydown", escFunction, false);

    return () => {
      document.removeEventListener("keydown", escFunction, false);
    };
  }, [escFunction]);
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
        border="2px"
        borderColor={"blue.400"}
        align="stretch"
        mb={4}
        maxHeight="calc(100% - 100px)"
        overflowY="auto"
        flexGrow={1}
        p={2}
      >
        {sortedMessages.map((message, index) => (
          <HStack
            key={index}
            justify={message.type === "sent" ? "flex-end" : "flex-start"}
            align="flex-end"
            spacing={2}
          >
            {message.type === "received" && (
              <Avatar size="sm" name={message.sender} />
            )}
            <Box
              bg={message.type === "sent" ? hoverColor : borderColor}
              color={message.type === "sent" ? "white" : textColor}
              px={4}
              py={2}
              borderRadius={12}
              maxWidth="70%"
              boxShadow="sm"
              display="flex"
              flexDirection="column"
              pt={1}
              pb={0}
            >
              <Text fontWeight={400} fontSize="md" wordBreak="break-word">
                {message.text}
              </Text>
              <Text fontSize="xs" color="gray.400" textAlign="right" pb={0}>
                {message.timestamp}
              </Text>
            </Box>
          </HStack>
        ))}

        {/* Reference div for scrolling */}
        <div ref={messagesEndRef} />
      </VStack>

      <HStack height={10} spacing={2} position="relative">
        <Button
          height={10}
          colorScheme="pink"
          onClick={resetChatAndReconnectWebSockets}
        >
          Esc
        </Button>
        <Input
          height={10}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          size="sm"
          onKeyPress={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <Button height={10} colorScheme="blue" onClick={toggleEmojiPicker}>
          <Smile />
        </Button>

        {/* Emoji Picker */}
        {showEmojiPicker && (
          <Box
            position="absolute"
            bottom="50px"
            zIndex="10"
            ref={emojiPickerRef}
          >
            <EmojiPicker onEmojiClick={addEmoji} />
          </Box>
        )}
        <Button colorScheme="pink" onClick={handleSendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatScreen;
