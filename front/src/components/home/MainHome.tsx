"use client";

import React, { useState } from "react";
import { Box, Text, Button } from "@chakra-ui/react";
import { FaInstagram, FaSnapchat, FaTiktok, FaComment } from "react-icons/fa";
import { useRouter } from "next/navigation"; // Importing Next.js useRouter hook
import useColorModeStyles from "@/utils/useColorModeStyles"; // Import the custom hook

const MainHome: React.FC = () => {
  const { bg, textColor, borderColor } = useColorModeStyles(); // Use the custom hook
  const router = useRouter(); // Hook to handle navigation

  // Function to handle navigation when platform buttons are clicked
  const handlePlatformClick = (platform: string) => {
    router.push(`/${platform.toLowerCase()}`); // Navigates to /instagram, /snapchat, or /tiktok
  };

  // Function to handle random chat button click
  const handleRandomChat = () => {
    // You can adjust this logic to navigate to a random user chat page
    const randomPlatform = ["instagram", "snapchat", "tiktok"];
    const randomPlatformIndex = Math.floor(
      Math.random() * randomPlatform.length
    );
    router.push(`/chat`); // Redirect to a random chat page
  };

  return (
    <Box p={4}>
      {/* Title Section with Border */}
      <Box
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        p={4}
        mb={4}
        bg={bg}
        className="title-container"
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
          Explore New Connections
        </Text>
        <Text fontSize="md" mt={2} color={textColor}>
          Welcome to our platform! Discover and connect with new people based on
          shared interests and passions. Whether you're looking for friends,
          networking, or new experiences, you'll find it here.
        </Text>
        {/* SEO Optimized Text Section */}
        <Box
          //   border="1px solid"
          borderColor={borderColor}
          borderRadius="md"
          p={4}
          mb={4}
          bg={bg}
          className="seo-text-container"
        >
          <Text fontSize="xl" fontWeight="semibold" color={textColor}>
            Discover Your Next Friend or Network Connection
          </Text>
          <Text fontSize="md" mt={2} color={textColor}>
            Our platform connects people who share common interests, hobbies,
            and values. Browse through detailed profiles and start meaningful
            conversations. Whether you're into technology, art, travel, or
            anything in between, we have a community for you!
          </Text>
          <Text fontSize="sm" mt={2} color={textColor}>
            Explore people based on location, interests, and more! Get started
            now and meet someone new today.
          </Text>
        </Box>

        <Box
          borderColor={borderColor}
          borderRadius="md"
          p={4}
          mb={4}
          bg={bg}
          className="intro-text-container"
        >
          <Text fontSize="md" color={textColor} textAlign="center">
            You can chat with friends on Instagram, Snapchat, or TikTok, or you
            can choose to chat randomly with someone from any platform. Select
            an option to get started!
          </Text>
        </Box>

        {/* Platform Selection Buttons */}
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexWrap="wrap"
          mb={4}
          bg={bg}
        >
          <Button
            leftIcon={<FaInstagram />}
            colorScheme="pink"
            onClick={() => handlePlatformClick("Instagram")}
            mx={1}
            // px={2}
            flex="1"
            minWidth="120px"
            mt={{ base: 2, md: 0 }}
          >
            <Text>Instagram users</Text>
          </Button>
          <Button
            leftIcon={<FaSnapchat />}
            colorScheme="yellow"
            onClick={() => handlePlatformClick("Snapchat")}
            mx={2}
            flex="1"
            minWidth="120px"
            mt={{ base: 2, md: 0 }}
          >
            <Text>Snapchat users</Text>
          </Button>
          <Button
            leftIcon={<FaTiktok />}
            colorScheme="green"
            onClick={() => handlePlatformClick("TikTok")}
            mx={2}
            flex="1"
            minWidth="120px"
            mt={{ base: 2, md: 0 }}
          >
            TikTok users
          </Button>
        </Box>

        <Text align="center">Or</Text>
        {/* Display Random Chat Button */}
        <Box textAlign="center" mb={4}>
          <Button
            leftIcon={<FaComment />}
            colorScheme="blue"
            onClick={handleRandomChat}
            mx={2}
            flex="1"
            minWidth="200px"
            mt={{ base: 2, md: 0 }}
          >
            Chat Randomly
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default MainHome;
