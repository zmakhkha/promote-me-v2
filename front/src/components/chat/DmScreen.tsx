import dynamic from "next/dynamic";
import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Button,
  Text,
  Input,
} from "@chakra-ui/react";
import { Smile } from "lucide-react";
import useColorModeStyles from "@/utils/useColorModeStyles";
import {
  connectWebSocket,
  sendMessage,
  startChat,
  generateRoomName,
} from "@/services/axios/websocketService";
import { getConnectedUser } from "@/services/axios/getConnectedUser";
import api from "@/services/axios/api";

const EmojiPicker = dynamic(() => import("emoji-picker-react"), { ssr: false });

type Message = {
  text: string;
  type: "sent" | "received" | "system";
  timestamp: string;
  sender?: string;
};

type Props = {
  user: string;
};

const DmScreen = ({ user }: Props) => {
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [roomId, setRoomId] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);

  // Get the access token once
  
  const getToken = () => localStorage.getItem("accessToken") || "";

  const scrollToBottom = () =>
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

  const fetchMessages = async (authUserId: number) => {
    try {
      const response = await api.get(`/api/v1/messages/${user}/`);
      const formatted = response.data.map((msg: any) => ({
        text: msg.content,
        type: msg.sender === authUserId ? "sent" : "received",
        sender: msg.sender === authUserId ? userData?.username : user,
        timestamp: msg.timestamp,
      }));
      setMessages(formatted);
    } catch (err) {
      console.error("Error fetching messages:", err);
    }
  };

  const handleIncomingMessage = useCallback(
    (event: MessageEvent) => {
      if (!event.data || event.data === "{}") return;

      try {
        const data = JSON.parse(event.data);
        if (data.type !== "chat_message") return;

        const { sender, message, timestamp, user: senderUsername } = data;

        const formatted: Message = {
          text: message,
          type: sender === userData?.id ? "sent" : "received",
          sender: sender === userData?.id ? userData?.username : senderUsername,
          timestamp: `${timestamp.hour}:${timestamp.minute}`,
        };

        setMessages((prev) => [...prev, formatted]);
      } catch (err) {
        console.error("Failed to parse WebSocket message:", err);
      }
    },
    [userData]
  );

  const initChat = async () => {
    const token = getToken();
    if (!token) return;

    try {
      const userProfile = await getConnectedUser();
      setUserData(userProfile);

      const room = generateRoomName(userProfile.username, user);
      setRoomId(room);

      startChat(token, room);
      connectWebSocket(token, room);

      await fetchMessages(userProfile.id);
    } catch (error) {
      console.error("Initialization error:", error);
    }
  };

  const handleSendMessage = () => {
    if (!inputValue.trim() || !userData) return;

    sendMessage({
      user: userData.username,
      sender: userData.id,
      content: inputValue,
    });

    setInputValue("");
  };

  const toggleEmojiPicker = () => setShowEmojiPicker((prev) => !prev);

  const addEmoji = (emojiObject: { emoji: string }) => {
    setInputValue((prev) => prev + emojiObject.emoji);
  };

  // Mount logic
  useEffect(() => {
    initChat();
  }, [user]);

  // Scroll on new messages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Handle outside click to close emoji picker
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target as Node)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle incoming WebSocket messages
  useEffect(() => {
    window.addEventListener("message", handleIncomingMessage);
    return () => {
      window.removeEventListener("message", handleIncomingMessage);
    };
  }, [handleIncomingMessage]);

  const sortedMessages = [...messages].sort(
    (a, b) =>
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
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
          Chatting with {user}
        </Text>
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
        <div ref={messagesEndRef} />
      </VStack>

      <HStack height={10} spacing={2} position="relative">
        <Button height={10} colorScheme="blue" onClick={toggleEmojiPicker}>
          <Smile />
        </Button>

        {showEmojiPicker && (
          <Box position="absolute" bottom="50px" zIndex="2" ref={emojiPickerRef}>
            <EmojiPicker onEmojiClick={addEmoji} />
          </Box>
        )}

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
        <Button colorScheme="pink" onClick={handleSendMessage}>
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default DmScreen;
