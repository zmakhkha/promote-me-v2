"use client";

import React, { useState } from "react";
import NextLink from "next/link";
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  VStack,
  HStack,
  Text,
  Avatar,
  Badge,
  Button,
  Divider,
  useColorModeValue,
  Link as ChakraLink,
} from "@chakra-ui/react";
import { Bell, X } from "lucide-react";

// Sample notifications data based on your format
const sampleNotifications = [
  {
    id: 1,
    title: "It's a Match! 🎉",
    message: "You and Sarah both liked each other's profiles. Start chatting now!",
    notification_type: "new_match",
    timestamp: "2025-08-28T15:00:00Z",
    user_action_required: true,
    profile_link: "/profile/sarah123",
    image_url: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150",
    read: false
  },
  {
    id: 2,
    title: "New Message 📩",
    message: "Alex sent you a message. Check it out now!",
    notification_type: "new_chat",
    timestamp: "2025-08-28T15:05:00Z",
    user_action_required: true,
    chat_link: "/chat/conv_456",
    image_url: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
    read: false
  },
  {
    id: 3,
    title: "Someone Liked Your Profile ❤️",
    message: "Emma liked your profile. You can like them back to match!",
    notification_type: "profile_liked",
    timestamp: "2025-08-28T12:45:00Z",
    user_action_required: true,
    profile_link: "/profile/emma789",
    image_url: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150",
    read: false
  },
  {
    id: 4,
    title: "Someone Viewed Your Profile 👀",
    message: "Michael checked out your profile! Want to message them?",
    notification_type: "profile_view",
    timestamp: "2025-08-28T14:30:00Z",
    user_action_required: false,
    profile_link: "/profile/michael456",
    image_url: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
    read: true
  }
];

const NotificationBell = () => {
  const [notifications, setNotifications] = useState(sampleNotifications);
  const [isOpen, setIsOpen] = useState(false);

  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  
  const unreadCount = notifications.filter(n => !n.read).length;

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const markAsRead = (id, event) => {
    event.stopPropagation();
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const removeNotification = (id, event) => {
    event.stopPropagation();
    event.preventDefault();
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getActionLink = (notification) => {
    if (notification.chat_link) return notification.chat_link;
    if (notification.profile_link) return notification.profile_link;
    return "#";
  };

  const getActionColor = (type) => {
    switch (type) {
      case "new_match": return "green";
      case "new_chat": return "blue";
      case "profile_liked": return "pink";
      case "profile_view": return "purple";
      default: return "gray";
    }
  };

  return (
    <Box position="relative" zIndex={100}>
      <Popover
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onOpen={() => setIsOpen(true)}
        placement="bottom-end"
        closeOnBlur={true}
      >
        <PopoverTrigger>
          <IconButton
            variant="ghost"
            size="sm"
            aria-label="Notifications"
            icon={<Bell size={20} />}
            color={useColorModeValue("gray.600", "gray.300")}
            onClick={() => setIsOpen(!isOpen)}
          />
        </PopoverTrigger>

        {/* Notification badge */}
        {unreadCount > 0 && (
          <Box
            position="absolute"
            top="-2px"
            right="-2px"
            w="18px"
            h="18px"
            bg="red.500"
            color="white"
            border="2px solid"
            borderColor={bgColor}
            borderRadius="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            fontSize="xs"
            fontWeight="bold"
            zIndex={1}
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Box>
        )}

        <PopoverContent
          w="400px"
          maxH="500px"
          overflowY="auto"
          bg={bgColor}
          borderColor={borderColor}
          boxShadow="xl"
        >
          <PopoverHeader borderBottom="1px" borderColor={borderColor} py={3}>
            <HStack justify="space-between">
              <Text fontWeight="semibold" fontSize="lg">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Button
                  size="xs"
                  variant="ghost"
                  color="blue.500"
                  onClick={markAllAsRead}
                >
                  Mark all as read
                </Button>
              )}
            </HStack>
          </PopoverHeader>

          <PopoverBody p={0}>
            {notifications.length === 0 ? (
              <Box p={6} textAlign="center">
                <Text color={mutedColor}>No notifications yet</Text>
              </Box>
            ) : (
              <VStack spacing={0} align="stretch">
                {notifications.map((notification, index) => (
                  <Box key={notification.id}>
                    <ChakraLink
                      as={NextLink}
                      href={getActionLink(notification)}
                      _hover={{ textDecoration: "none" }}
                      onClick={() => markAsRead(notification.id, event)}
                    >
                      <Box
                        p={4}
                        _hover={{ bg: hoverBg }}
                        cursor="pointer"
                        bg={!notification.read ? useColorModeValue("blue.50", "blue.900") : "transparent"}
                        position="relative"
                      >
                        <HStack align="start" spacing={3}>
                          <Avatar
                            size="sm"
                            src={notification.image_url}
                            name="User"
                          />
                          
                          <VStack align="start" spacing={1} flex="1" minW="0">
                            <HStack justify="space-between" w="full">
                              <Text
                                fontSize="sm"
                                fontWeight={!notification.read ? "semibold" : "medium"}
                                noOfLines={1}
                              >
                                {notification.title}
                              </Text>
                              <IconButton
                                variant="ghost"
                                size="xs"
                                aria-label="Remove notification"
                                icon={<X size={14} />}
                                onClick={(e) => removeNotification(notification.id, e)}
                                opacity={0.6}
                                _hover={{ opacity: 1 }}
                              />
                            </HStack>
                            
                            <Text
                              fontSize="xs"
                              color={mutedColor}
                              noOfLines={2}
                              lineHeight="short"
                            >
                              {notification.message}
                            </Text>
                            
                            <HStack justify="space-between" w="full" mt={1}>
                              <Text fontSize="xs" color={mutedColor}>
                                {formatTimeAgo(notification.timestamp)}
                              </Text>
                              
                              {notification.user_action_required && (
                                <Badge
                                  size="sm"
                                  colorScheme={getActionColor(notification.notification_type)}
                                  variant="subtle"
                                >
                                  Action needed
                                </Badge>
                              )}
                            </HStack>
                          </VStack>
                        </HStack>

                        {/* Unread indicator dot */}
                        {!notification.read && (
                          <Box
                            position="absolute"
                            top="4px"
                            left="4px"
                            w="8px"
                            h="8px"
                            bg="blue.500"
                            borderRadius="full"
                          />
                        )}
                      </Box>
                    </ChakraLink>
                    {index < notifications.length - 1 && (
                      <Divider borderColor={borderColor} />
                    )}
                  </Box>
                ))}
              </VStack>
            )}
          </PopoverBody>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default NotificationBell;