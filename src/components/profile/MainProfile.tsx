"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  HStack,
  VStack,
  Divider,
  Textarea,
  Button,
  Tag,
  TagLabel,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FaGlobe,
  FaSnapchatGhost,
  FaInstagram,
  FaTiktok,
} from "react-icons/fa";
import placeholderAvatar from "../../data/image/no-avatar.png";
import useColorModeStyles from "../../utils/useColorModeStyles";

interface UserData {
  profile_image: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  age: number;
  bio: string;
  views: number;
  likes: number;
  points: number;
  interests: string[];
  instagram?: string;
  snapchat?: string;
  tiktok?: string;
}

const MainProfile = () => {
  const { bg, tiktok, textColor, borderColor, navBgColor } =
    useColorModeStyles();

  const [userData, setUserData] = useState<UserData>({
    profile_image: placeholderAvatar.src,
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    location: "USA, New Jersey",
    age: 25,
    bio: "Loves coffe, annimals and idk",
    views: 1200,
    likes: 3500,
    points: 45,
    interests: ["coffe", "puppies", "dogs"],
    instagram: "https://instagram.com/johndoe",
    snapchat: "https://snapchat.com/add/mks_zak",
    tiktok: "https://tiktok.com/@johndoe",
  });

  const [imagePreview, setImagePreview] = useState<string>(
    placeholderAvatar.src
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
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

  return (
    <Flex justify="center" align="center" py={5} px={5}>
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
      >
        {/* Avatar */}
        <Flex justify="center" mb={2}>
          <Avatar
            size="2xl"
            src={imagePreview}
            borderWidth="4px"
            borderColor={bg}
            boxShadow="lg"
          />
        </Flex>

        {/* Name and Age */}
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          {userData.firstName} {userData.lastName}, {userData.age}
        </Text>

        {/* Location */}
        <HStack justify="center" color={textColor} mb={2}>
          <FaGlobe />
          <Text>{userData.location}</Text>
        </HStack>

        <Divider borderColor={borderColor} mb={2} />

        {/* Social Media Icons */}
        <HStack justify="center" spacing={4} mb={2}>
          {userData.instagram && (
            <IconButton
              aria-label="Instagram"
              icon={<FaInstagram />}
              onClick={() => window.open(userData.instagram, "_blank")}
              colorScheme="pink"
              variant="ghost"
            />
          )}
          {userData.snapchat && (
            <IconButton
              aria-label="Snapchat"
              icon={<FaSnapchatGhost />}
              onClick={() => window.open(userData.snapchat, "_blank")}
              colorScheme="yellow"
              variant="ghost"
            />
          )}
          {userData.tiktok && (
            <IconButton
              aria-label="TikTok"
              icon={<FaTiktok />}
              onClick={() => window.open(userData.tiktok, "_blank")}
              color={tiktok} // Black in light mode, white in dark mode
              bg="transparent"
              _hover={{
                bg: useColorModeValue("gray.200", "gray.700"),
              }}
              variant="ghost"
            />
          )}
        </HStack>

        <Divider borderColor={borderColor} mb={2} />

        {/* Stats */}
        <HStack justify="space-around" mb={2}>
          <VStack>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              {userData.views}
            </Text>
            <Text>Views</Text>
          </VStack>
          <VStack>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              {userData.likes}
            </Text>
            <Text>Likes</Text>
          </VStack>
          <VStack>
            <Text fontSize="lg" fontWeight="bold" color={textColor}>
              {userData.points}
            </Text>
            <Text>Points</Text>
          </VStack>
        </HStack>

        <Divider borderColor={borderColor} mb={2} />

        {/* Interests */}
        <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
          Interests
        </Text>
        <HStack spacing={2} wrap="wrap" justify="center" mb={2}>
          {userData.interests.map((tag, index) => (
            <Tag key={index} size="md" variant="subtle" colorScheme="teal">
              <TagLabel>{tag}</TagLabel>
            </Tag>
          ))}
        </HStack>

        <Divider borderColor={borderColor} mb={2} />

        {/* About Me */}
        <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
          About Me
        </Text>
        <Textarea
          value={userData.bio}
          isReadOnly
          rows={3}
          resize="none"
          bg={navBgColor}
          color={textColor}
        />
      </Box>
    </Flex>
  );
};

export default MainProfile;
