"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Box, IconButton, Badge, VStack, Text, Menu, MenuButton, MenuList, MenuItem, Divider, useDisclosure } from "@chakra-ui/react";
import { FiInbox } from "react-icons/fi";
import api from "@/services/axios/api";

interface Message {
  id: number;
  sender: number;
  sender_username: string;
  content: string;
  timestamp: string;
}

const Notifications = () => {
  const [unseenMessages, setUnseenMessages] = useState<Message[]>([]);
  const router = useRouter();
  const { isOpen, onToggle, onClose } = useDisclosure(); // Control dropdown state

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await api.get("/api/v1/messages-notifications/");
        setUnseenMessages(response.data.unseen_messages || []);
		console.log("----------",response.data.unseen_messages)
      } catch (error) {
        console.error("Error fetching unseen messages:", error);
      }
    };

    fetchNotifications();
  }, []);

  return (
    <Menu isOpen={isOpen} onClose={onClose}>
      <MenuButton as={Box} position="relative" onClick={onToggle}>
        <IconButton
          aria-label="Inbox"
          icon={<FiInbox size={24} />}
          variant="ghost"
        />
        {unseenMessages.length > 0 && (
          <Badge
            colorScheme="red"
            position="absolute"
            top="0"
            right="0"
            borderRadius="full"
            fontSize="0.7em"
            px="2"
          >
            {unseenMessages.length}
          </Badge>
        )}
      </MenuButton>

      <MenuList minW="250px" p={2}>
        {unseenMessages.length === 0 ? (
          <Text textAlign="center" color="gray.500">No new messages</Text>
        ) : (
          <VStack align="stretch" spacing={1}>
            {unseenMessages.map((msg) => (
              <MenuItem
                key={msg.id}
                onClick={() => {
                  router.push(`/chat/${msg.sender_username}`);
                  onClose(); // Close the menu after clicking
                }}
                _hover={{ bg: "gray.100" }}
                borderRadius="md"
                p={2}
              >
                <Text fontWeight="bold">{msg.sender_username}:</Text>
                <Text fontSize="sm" isTruncated>
                  {msg.content.length > 30 ? `${msg.content.slice(0, 30)}...` : msg.content}
                </Text>
              </MenuItem>
            ))}
            <Divider />
          </VStack>
        )}
      </MenuList>
    </Menu>
  );
};

export default Notifications;
