import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Avatar,
  Button,
  Textarea,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import useColorModeStyles from "@/utils/useColorModeStyles";
import randSocketConnect from "@/services/axios/randSocketConnect";

// Define the message type
type Message = {
  text: string;
  type: "sent" | "received";
  timestamp: string;
};

const ChatScreen = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [chatStatus, setChatStatus] = useState<string>(""); // Status of the chat (random stranger message)
  const [tags, setTags] = useState<string[]>([]); // Tags for both users (for example, shared interests)
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to fetch random stranger data and tags
  const startNewConversation = () => {
    // Example tags shared between both users (this would come from your matching service)
    const randomTags = ["Dogs", "puppies", "tick"];
    setTags(randomTags);

    // Simulate a stranger's info (this would be dynamic in a real app)
    setChatStatus("You're now chatting with a random stranger!");

    setMessages([]); // Clear messages for the new conversation
  };

  useEffect(() => {
    startNewConversation(); // Start a conversation when the component mounts
	randSocketConnect();
  }, []);

  // Scroll to the bottom whenever messages are updated
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const getCurrentTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages((prev) => [
        ...prev,
        {
          text: inputValue,
          type: "sent",
          timestamp: getCurrentTimestamp(),
        },
      ]);
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEscPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Escape") {
      e.preventDefault();
      startNewConversation();
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
      textAlign="center"
      borderColor={borderColor}
      borderWidth="1px"
      mx="auto"
      my="auto"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="80vh"
    >
      {/* Chat Status */}
      <Box mb={4}>
        <Text fontSize="xl" fontWeight="bold">{chatStatus}</Text>
        <Text fontSize="sm" color="gray.500">
          You both like {tags.join(", ")}
        </Text>
      </Box>

      {/* Chat Bubbles */}
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
            spacing={2}
          >
            {message.type === "received" && (
              <Avatar size="sm" name="Received User" src="/path/to/image.jpg" />
            )}
            <Box
              bg={message.type === "sent" ? hoverColor : borderColor}
              color={message.type === "sent" ? "white" : textColor}
              px={4}
              py={2}
              borderRadius="lg"
              maxWidth="70%"
              boxShadow="sm"
              position="relative"
            >
              <Text>{message.text}</Text>
              <Text
                fontSize="xs"
                color={message.type === "sent" ? "gray.300" : "gray.600"}
                mt={1}
                textAlign="right"
              >
                {message.timestamp}
              </Text>
            </Box>
          </HStack>
        ))}
        {/* Empty div for scrolling */}
        <div ref={messagesEndRef} />
      </VStack>

      {/* Input Area */}
      <HStack spacing={2} as="form" onSubmit={(e) => e.preventDefault()}>
        <Button
          colorScheme="blue"
          onClick={startNewConversation}
          bg={borderColor}
          _hover={{ bg: hoverColor }}
        >
          New (Esc)
        </Button>
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={(e) => {
            handleKeyPress(e);
            handleEscPress(e);
          }}
          placeholder="Type your message..."
          size="sm"
          resize="none"
          borderColor={borderColor}
          _focus={{ borderColor: hoverColor }}
        />
        <Button
          colorScheme="pink"
          onClick={handleSendMessage}
          bg={hoverColor}
          _hover={{ bg: textColor }}
        >
          Send
        </Button>
      </HStack>
    </Box>
  );
};

export default ChatScreen;
