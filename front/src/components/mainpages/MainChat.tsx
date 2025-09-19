"use client";

import React, { useMemo, useState, useEffect, useRef } from "react";
import {
  Box,
  Flex,
  Text,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Avatar,
  AvatarBadge,
  Badge,
  Button,
  Tooltip,
  Divider,
  useBreakpointValue,
  useColorModeValue,
} from "@chakra-ui/react";
import { HeartHandshake, Search, SendHorizonal, Circle, MessageSquareText, ArrowLeft } from "lucide-react";

// ---- Types ----
interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
  isOnline?: boolean;
  tagline?: string;
}

interface Message {
  id: string;
  fromId: string;
  toId: string;
  text: string;
  createdAt: number; // epoch ms
}

// ---- Mock data ----
const MOCK_USERS: User[] = [
  { id: "u1", name: "Sara", username: "sara_rose", avatar: "/avatars/01.png", isOnline: true,  tagline: "Writer • Loves sunsets" },
  { id: "u2", name: "Amine", username: "amine.dev",  avatar: "/avatars/02.png", isOnline: true,  tagline: "Runner • Matcha addict" },
  { id: "u3", name: "Lina", username: "linaverse",   avatar: "/avatars/03.png", isOnline: false, tagline: "Photographer • Cats>Dogs (sorry)" },
];

const MOCK_HISTORY: Message[] = [
  { id: "m1", fromId: "u1", toId: "me", text: "Hey there! Loved your bio.", createdAt: Date.now() - 1000 * 60 * 60 * 2 },
  { id: "m2", fromId: "me", toId: "u1", text: "Thanks! Sunset hunter in training ☀️", createdAt: Date.now() - 1000 * 60 * 60 * 2 + 60_000 },
  { id: "m3", fromId: "u1", toId: "me", text: "So beach or mountains?", createdAt: Date.now() - 1000 * 60 * 60 * 2 + 120_000 },
];

// ---- Utils ----
const timeAgo = (ts: number) => {
  const d = Math.max(1, Math.floor((Date.now() - ts) / 1000));
  if (d < 60) return `${d}s`;
  const m = Math.floor(d / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const days = Math.floor(h / 24);
  return `${days}d`;
};

const initials = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

// ---- Main ----
const MainChat: React.FC = () => {
  const isDesktop = useBreakpointValue({ base: false, md: true });

  // Chakra color tokens
  const shellBg       = useColorModeValue("white", "gray.800");
  const pageBorder    = useColorModeValue("gray.200", "gray.700");
  const textMain      = useColorModeValue("gray.900", "gray.100");
  const textMuted     = useColorModeValue("gray.600", "gray.400");
  const listItemHover = useColorModeValue("gray.100", "whiteAlpha.100");
  const listItemActive= useColorModeValue("gray.200", "whiteAlpha.200");
  const bubbleMineBg  = useColorModeValue("blue.500", "blue.400");
  const bubbleOtherBg = useColorModeValue("gray.100", "whiteAlpha.200");
  const inputBg       = useColorModeValue("gray.50", "whiteAlpha.100");

  const [query, setQuery] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>(MOCK_HISTORY);
  const [draft, setDraft] = useState("");

  const users = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_USERS;
    return MOCK_USERS.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        (u.tagline?.toLowerCase().includes(q) ?? false)
    );
  }, [query]);

  const selectedUser = useMemo(
    () => MOCK_USERS.find((u) => u.id === selectedUserId) || null,
    [selectedUserId]
  );

  const chatForSelected = useMemo(() => {
    if (!selectedUser) return [] as Message[];
    return messages.filter(
      (m) =>
        (m.fromId === selectedUser.id && m.toId === "me") ||
        (m.fromId === "me" && m.toId === selectedUser.id)
    );
  }, [messages, selectedUser]);

  const endRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatForSelected.length, selectedUserId]);

  function handleSend() {
    const text = draft.trim();
    if (!text || !selectedUser) return;
    const msg: Message = {
      id: crypto.randomUUID(),
      fromId: "me",
      toId: selectedUser.id,
      text,
      createdAt: Date.now(),
    };
    setMessages((prev) => [...prev, msg]);
    setDraft("");
  }

  // Contacts pane
  const ContactsPane = (
    <Flex direction="column" h="full" bg={shellBg}>
      <Box px={4} pt={4}>
        <Flex align="center" gap={2}>
          <HeartHandshake size={18} />
          <Text fontWeight="semibold" color={textMain}>
            Matches & Chats
          </Text>
        </Flex>

        <InputGroup mt={3}>
          <InputLeftElement pointerEvents="none">
            <Search size={16} />
          </InputLeftElement>
          <Input
            bg={inputBg}
            placeholder="Search people…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </InputGroup>
      </Box>

      <Box my={3}>
        <Divider borderColor={pageBorder} />
      </Box>

      <Box flex="1" overflowY="auto" px={2} pb={2}>
        {users.map((u) => {
          const isActive = selectedUserId === u.id;
          return (
            <Flex
              key={u.id}
              align="center"
              gap={3}
              px={2}
              py={2}
              borderRadius="xl"
              cursor="pointer"
              bg={isActive ? listItemActive : "transparent"}
              _hover={{ bg: listItemHover }}
              onClick={() => setSelectedUserId(u.id)}
            >
              <Box position="relative">
                <Avatar name={u.name} src={u.avatar} size="md">
                  <AvatarBadge
                    boxSize="1em"
                    bg={u.isOnline ? "green.400" : "gray.400"}
                    borderColor={shellBg}
                  />
                </Avatar>
              </Box>

              <Flex direction="column" minW={0} flex="1">
                <Flex align="center" gap={2} minW={0}>
                  <Text noOfLines={1} fontWeight="medium" color={textMain}>
                    {u.name}
                  </Text>
                  {u.isOnline && (
                    <Badge
                      variant="subtle"
                      colorScheme="green"
                      display="inline-flex"
                      alignItems="center"
                      gap={1}
                    >
                      <Circle size={10} /> online
                    </Badge>
                  )}
                </Flex>
                {u.tagline && (
                  <Text noOfLines={1} fontSize="sm" color={textMuted}>
                    {u.tagline}
                  </Text>
                )}
              </Flex>
            </Flex>
          );
        })}
      </Box>
    </Flex>
  );

  // Empty chat
  const EmptyChat = (
    <Flex m="auto" direction="column" align="center" textAlign="center" maxW="md">
      <Flex
        h={16}
        w={16}
        align="center"
        justify="center"
        rounded="full"
        boxShadow="sm"
        bg={useColorModeValue("gray.100", "whiteAlpha.200")}
      >
        <MessageSquareText />
      </Flex>
      <Text mt={5} fontSize="xl" fontWeight="semibold" color={textMain}>
        Select a contact to start chatting
      </Text>
      <Text mt={2} fontSize="sm" color={textMuted}>
        Your conversations live here. Pick someone from the left or keep exploring matches.
      </Text>
    </Flex>
  );

  // Chat pane
  const ChatPane = selectedUser ? (
    <Flex direction="column" h="full" bg={shellBg}>
      {/* Header */}
      <Flex align="center" gap={3} px={4} py={3} borderBottom="1px" borderColor={pageBorder}>
        {!isDesktop && (
          <IconButton
            aria-label="Back"
            variant="ghost"
            size="sm"
            onClick={() => setSelectedUserId(null)}
            icon={<ArrowLeft size={18} />}
          />
        )}
        <Avatar name={selectedUser.name} src={selectedUser.avatar} />
        <Box lineHeight="short">
          <Text fontWeight="semibold" color={textMain}>
            {selectedUser.name}
          </Text>
          <Text fontSize="xs" color={textMuted}>
            {selectedUser.isOnline ? "Active now" : "Offline"}
          </Text>
        </Box>
        <Box ml="auto">
          <Tooltip label="Keep it kind. Curiosity is attractive.">
            <Badge colorScheme="pink">Dating chat</Badge>
          </Tooltip>
        </Box>
      </Flex>

      {/* Messages */}
      <Box flex="1" overflowY="auto" px={4} py={4}>
        <Flex direction="column" gap={3}>
          {chatForSelected.map((m) => {
            const mine = m.fromId === "me";
            return (
              <Flex key={m.id} w="full" justify={mine ? "flex-end" : "flex-start"} gap={2} align="flex-end">
                {!mine && (
                  <Avatar name={selectedUser.name} src={selectedUser.avatar} size="sm" />
                )}
                <Box
                  maxW="75%"
                  px={3}
                  py={2}
                  rounded="2xl"
                  boxShadow="sm"
                  bg={mine ? bubbleMineBg : bubbleOtherBg}
                  color={mine ? "white" : textMain}
                  borderBottomRightRadius={mine ? "sm" : "2xl"}
                  borderBottomLeftRadius={mine ? "2xl" : "sm"}
                >
                  <Text whiteSpace="pre-wrap" lineHeight="tall">
                    {m.text}
                  </Text>
                  <Text mt={1} fontSize="10px" opacity={0.7}>
                    {timeAgo(m.createdAt)}
                  </Text>
                </Box>
              </Flex>
            );
          })}
          <Box ref={endRef} />
        </Flex>
      </Box>

      {/* Composer */}
      <Box borderTop="1px" borderColor={pageBorder} p={3}>
        <Flex align="center" gap={2}>
          <Input
            bg={inputBg}
            placeholder={`Message ${selectedUser.name}…`}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
          />
          <Button colorScheme="blue" onClick={handleSend} leftIcon={<SendHorizonal size={16} />}>
            Send
          </Button>
        </Flex>
      </Box>
    </Flex>
  ) : (
    <Flex direction="column" h="full" bg={shellBg}>
      {EmptyChat}
    </Flex>
  );

  // Layouts
  if (!isDesktop) {
    // Mobile: show either list or chat
    return (
      <Box h="calc(100vh - 6rem)" border="1px" borderColor={pageBorder} rounded="2xl" overflow="hidden" bg={shellBg}>
        {selectedUser ? ChatPane : ContactsPane}
      </Box>
    );
  }

  // Desktop: two panes
  return (
    <Box
      h="calc(100vh - 6rem)"
      border="1px"
      borderColor={pageBorder}
      rounded="2xl"
      overflow="hidden"
      bg={shellBg}
      color={textMain}
    >
      <Flex h="full">
        <Box w="32%" minW="260px" maxW="420px" borderRight="1px" borderColor={pageBorder}>
          {ContactsPane}
        </Box>
        <Box flex="1">{ChatPane}</Box>
      </Flex>
    </Box>
  );
};

export default MainChat;
