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
import { disconnectAll, sendMessage } from "@/services/axios/websocketService";

type Message = {
  text: string;
  type: "sent" | "received" | "system";
  timestamp: string;
  sender?: string;
};

const OmegleScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [isRegistered, setIsRegistered] = useState<boolean>(false);
  const [chatStatus, setChatStatus] = useState<string>("Waiting for a connection...");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [activeUsers, setActiveUsers] = useState<number>(500);
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getActiveUsers().then(setActiveUsers);
  }, []);

  const handleRegister = async () => {
    if (username.trim()) {
      await registerUser(username);
      setIsRegistered(true);
    }
  };

  const resetChatAndReconnectWebSockets = () => {
    disconnectAll();
    setMessages([]);
    setInputValue("");
    setChatStatus("Waiting for a connection...");
    setIsConnecting(true);
    setRoomId(null);
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      sendMessage({ user: username, content: inputValue });
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
      {!isRegistered ? (
        <VStack spacing={4}>
          <Text fontSize="xl" fontWeight="bold">Enter Your Name</Text>
          <Input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Your name..."
          />
          <Button colorScheme="blue" onClick={handleRegister}>
            Join Chat
          </Button>
        </VStack>
      ) : (
        <>
          <Box mb={4} textAlign="center">
            <Text fontSize="xl" fontWeight="bold">
              {chatStatus} - {activeUsers}+ active users
            </Text>
            {isConnecting && <Spinner mt={4} />}
          </Box>
          <VStack spacing={4} borderColor={"blue.400"} align="stretch" mb={4} flexGrow={1} p={2}>
            {messages.map((message, index) => (
              <HStack key={index} justify={message.type === "sent" ? "flex-end" : "flex-start"} align="flex-end" spacing={2}>
                {message.type === "received" && <Avatar size="sm" name={message.sender} />}
                <Box bg={message.type === "sent" ? hoverColor : borderColor} px={4} py={2} borderRadius={12} maxWidth="70%">
                  <Text fontSize="md">{message.text}</Text>
                  <Text fontSize="xs" color="gray.400" textAlign="right">{message.timestamp}</Text>
                </Box>
              </HStack>
            ))}
            <div ref={messagesEndRef} />
          </VStack>
          <HStack height={10} spacing={2}>
            <Button height={10} colorScheme="pink" onClick={resetChatAndReconnectWebSockets}>Esc</Button>
            <Input height={10} value={inputValue} onChange={(e) => setInputValue(e.target.value)} placeholder="Type your message..." onKeyPress={(e) => { if (e.key === "Enter") { e.preventDefault(); handleSendMessage(); }}} />
            <Button height={10} colorScheme="blue" onClick={() => setShowEmojiPicker((prev) => !prev)}><Smile /></Button>
            {showEmojiPicker && (<Box position="absolute" bottom="50px" zIndex="2" ref={emojiPickerRef}><EmojiPicker onEmojiClick={(emojiObject) => setInputValue((prev) => prev + emojiObject.emoji)} /></Box>)}
            <Button colorScheme="pink" onClick={handleSendMessage}>Send</Button>
          </HStack>
        </>
      )}
    </Box>
  );
};

export default OmegleScreen;
