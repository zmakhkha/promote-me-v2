import dynamic from "next/dynamic";
import React, { useState, useEffect, useRef, useCallback } from "react";
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
  Flex,
} from "@chakra-ui/react";
import useColorModeStyles from "@/utils/useColorModeStyles";
import {
  startOmegleChat,
  sendOmegleMessage,
  OmegleConnectWebSocket,
  disconnectAll,
} from "@/services/axios/websocketService";

type Message = {
  text: string;
  type: "sent" | "received" | "system";
  timestamp: string;
  sender?: string;
};

const OmegleChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [chatStatus, setChatStatus] = useState<string>(
    "Please enter your details..."
  );
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isConnecting, setIsConnecting] = useState<boolean>(true);
  const [roomId, setRoomId] = useState<string | null>(null);
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [user, setUser] = useState<any>(null);
  const [name, setName] = useState<string>("");
  const [age, setAge] = useState<number>(18);
  const [ip, setIp] = useState<string>("");

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

  // Fetch the user's IP address on page load
  useEffect(() => {
    const fetchIp = async () => {
      try {
        const response = await fetch("https://api.ipify.org?format=json");
        const data = await response.json();
        setIp(data.ip); // Set the IP address
      } catch (error) {
        console.error("Error fetching IP address:", error);
      }
    };

    fetchIp();
  }, []);

  // Connect WebSocket once the user has entered their info
  const handleStartChat = () => {
    if (name && age && ip) {
      // Save user information
      setUser({ name, age });
      setChatStatus("Connecting...");

      // Connect WebSocket with the IP address
      OmegleConnectWebSocket(ip, name, age);
    }
  };

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
            console.log("-------------------------->", roomId);
            startOmegleChat(data.roomId, name);
            break;

          case "redirect":
            const { room_name, users } = data;
            const user1 = users.user1;
            const user2 = users.user2;
            if (name === user1.username || name === user2.username) {
              if (name === user1.username) {
                setChatStatus(`Matched with ${user2.username}!`);
              } else if (name === user2.username) {
                setChatStatus(`Matched with ${user1.username}!`);
              }
              setIsConnecting(false);
              setRoomId(room_name);
              startOmegleChat(room_name, name);
            }
            break;

          case "chat_message":
            console.log("[chat_message]---------->", data);
            const { sender, content, timestamp } = data;
            const formattedTimestamp = `${timestamp.hour}:${timestamp.hour}`;

            if (data.roomId == roomId) {
              setMessages((prev) => [
                ...prev,
                {
                  text: content,
                  type: name === sender ? "sent" : "received",
                  sender: name === sender ? name : data.user,
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

    // Reconnect WebSocket
    OmegleConnectWebSocket(ip, name, age);

    if (roomId) {
      startOmegleChat(roomId, name);
    }
  };

  const handleSendMessage = () => {
    if (inputValue && inputValue.trim()) {
      sendOmegleMessage({
        user: name,
        sender: name,
        content: inputValue,
        roomName: roomId,
      });
      setInputValue("");
    }
  };

  const addEmoji = (emojiObject: { emoji: string }) => {
    setInputValue((prev) => prev + emojiObject.emoji);
  };

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
    <Flex justify="center" align="center" py={5} px={5}>
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
        {/* Ask for user's name and age */}
        {chatStatus === "Please enter your details..." && (
          <VStack spacing={4}>
            <Text fontSize="xl">Enter your details</Text>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
            />
            <Input
              type="number"
              value={age}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="Your age"
            />
            <Button onClick={handleStartChat} colorScheme="blue">
              Start Chat
            </Button>
          </VStack>
        )}

        {/* Chat Interface */}
        {chatStatus !== "Please enter your details..." && (
          <>
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
              {messages.map((message, index) => (
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
                    <Text
                      fontSize="xs"
                      color="gray.400"
                      textAlign="right"
                      pb={0}
                    >
                      {message.timestamp}
                    </Text>
                  </Box>
                </HStack>
              ))}
              <div ref={messagesEndRef} />
            </VStack>

            {/* Message Input Section */}
            <HStack spacing={2} pt={4}>
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type your message..."
                size="lg"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault(); // Prevents a new line
                    handleSendMessage();
                  }
                }}
              />
              <Button onClick={handleSendMessage} colorScheme="blue">
                Send
              </Button>
              <Button variant="ghost" onClick={toggleEmojiPicker}>
                <Smile />
              </Button>
              {showEmojiPicker && (
                <div
                  ref={emojiPickerRef}
                  style={{
                    position: "absolute",
                    bottom: "60px",
                    zIndex: 100,
                    right: 0,
                  }}
                >
                  <EmojiPicker onEmojiClick={addEmoji} />
                </div>
              )}
            </HStack>
          </>
        )}
      </Box>
    </Flex>
  );
};

export default OmegleChatScreen;
