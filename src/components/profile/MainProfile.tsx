"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  useColorModeValue,
  Text,
  Avatar,
  HStack,
  VStack,
  Divider,
  Textarea,
  Button,
  Tag,
  TagLabel,
} from "@chakra-ui/react";
import { FaGlobe, FaUserFriends, FaHeart } from "react-icons/fa";

// Placeholder Image
import placeholderAvatar from "../../data/image/no-avatar.jpg";

interface UserData {
  profile_image: string;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
  age: number;
  bio: string;
  followers: number;
  likes: number;
  posts: number;
  tags: string[];
}

const MainProfile = () => {
  const [userData, setUserData] = useState<UserData>({
    profile_image: placeholderAvatar.src,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    country: "USA",
    age: 25,
    bio: "Passionate about web development and design.",
    followers: 1200,
    likes: 3500,
    posts: 45,
    tags: ["Developer", "Designer", "Traveler"],
  });

  const [imagePreview, setImagePreview] = useState<string>(
    placeholderAvatar.src
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Mock API Call
        const response = await fetch("/api/user/profile");
        const data = await response.json();
        setUserData(data);
        setImagePreview(data.profile_image || placeholderAvatar.src);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // UI Colors
  const bgColor = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.100");
  const nameColor = useColorModeValue("black", "white");
  const dividerColor = useColorModeValue("gray.400", "gray.600");
  const cardShadow = useColorModeValue("md", "lg");

  return (
    <Flex justify="center" align="center" py={10}>
      <Box
        maxW="lg"
        w="full"
        bg={bgColor}
        boxShadow={cardShadow}
        borderRadius="lg"
        p={8}
        textAlign="center"
      >
        {/* Avatar */}
        <Flex justify="center" mb={4}>
          <Avatar
            size="2xl"
            src={imagePreview}
            borderWidth="4px"
            borderColor={bgColor}
            boxShadow="lg"
          />
        </Flex>

        {/* Name and Age */}
        <Text fontSize="2xl" fontWeight="bold" color={nameColor}>
          {userData.firstName} {userData.lastName}, {userData.age}
        </Text>
        <Text color={textColor} fontSize="sm" mb={4}>
          {userData.email}
        </Text>

        {/* Country */}
        <HStack justify="center" color={textColor} mb={4}>
          <FaGlobe />
          <Text>{userData.country}</Text>
        </HStack>

        <Divider borderColor={dividerColor} mb={4} />

        {/* Stats */}
        <HStack justify="space-around" mb={4}>
          <VStack>
            <Text fontSize="lg" fontWeight="bold" color={nameColor}>
              {userData.followers}
            </Text>
            <Text color={textColor}>Followers</Text>
          </VStack>
          <VStack>
            <Text fontSize="lg" fontWeight="bold" color={nameColor}>
              {userData.likes}
            </Text>
            <Text color={textColor}>Likes</Text>
          </VStack>
          <VStack>
            <Text fontSize="lg" fontWeight="bold" color={nameColor}>
              {userData.posts}
            </Text>
            <Text color={textColor}>Posts</Text>
          </VStack>
        </HStack>

        <Divider borderColor={dividerColor} mb={4} />

        {/* Interests */}
        <Text fontSize="lg" fontWeight="bold" color={nameColor} mb={2}>
          Interests
        </Text>
        <HStack spacing={2} wrap="wrap" justify="center" mb={4}>
          {userData.tags.map((tag, index) => (
            <Tag key={index} size="md" variant="subtle" colorScheme="teal">
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </HStack>

        <Divider borderColor={dividerColor} mb={4} />

        {/* About Me */}
        <Text fontSize="lg" fontWeight="bold" color={nameColor} mb={2}>
          About Me
        </Text>
        <Textarea
          value={userData.bio}
          isReadOnly
          rows={3}
          resize="none"
          bg={useColorModeValue("gray.100", "gray.700")}
        />
        <Button
          mt={4}
          colorScheme="teal"
          size="sm"
          onClick={() => alert("Edit Profile")}
        >
          Edit Profile
        </Button>
      </Box>
    </Flex>
  );
};

export default MainProfile;
