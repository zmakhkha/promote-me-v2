"use client";

import React, { useState } from "react";
import { Box, Text, Image, Button, VStack, HStack, Badge } from "@chakra-ui/react";
import { FaHeart, FaTimes, FaComment } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import homeUsers from "@/data/homeUsers";

const MotionBox = motion(Box);

const MainHome = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNextUser = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % homeUsers.length);
  };

  const currentUser = homeUsers[currentIndex];

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100%"
      p={4}
    >
      <AnimatePresence>
        <MotionBox
          key={currentUser.id}
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -300 }}
          transition={{ duration: 0.5 }}
          maxW="400px"
          borderWidth="1px"
          borderRadius="lg"
          overflow="hidden"
          boxShadow="lg"
          bg="white"
        >
          {/* User Image */}
          <Image
            src={currentUser.imageUrl}
            alt={currentUser.username}
            objectFit="cover"
            width="100%"
            height="350px"
          />

          {/* User Details */}
          <Box p={4}>
            <Text fontSize="xl" fontWeight="bold">
              {currentUser.firstName}, {currentUser.age}
            </Text>
            <Text fontSize="sm" color="gray.500">
              {currentUser.location}
            </Text>
            <Text mt={2} noOfLines={2}>
              {currentUser.bio.length > 50
                ? `${currentUser.bio.substring(0, 50)}...`
                : currentUser.bio}
            </Text>
            <HStack spacing={2} mt={2}>
              {currentUser.interests.map((interest) => (
                <Badge key={interest} colorScheme="teal">
                  {interest}
                </Badge>
              ))}
            </HStack>
          </Box>

          {/* Action Buttons */}
          <HStack justifyContent="space-around" p={4}>
            <Button
              leftIcon={<FaHeart />}
              colorScheme="green"
              onClick={handleNextUser}
            >
              Like
            </Button>
            <Button
              leftIcon={<FaComment />}
              colorScheme="blue"
              onClick={() => alert(`Chat with ${currentUser.firstName}`)}
            >
              Chat
            </Button>
            <Button
              leftIcon={<FaTimes />}
              colorScheme="red"
              onClick={handleNextUser}
            >
              Ignore
            </Button>
          </HStack>
        </MotionBox>
      </AnimatePresence>
    </Box>
  );
};

export default MainHome;
