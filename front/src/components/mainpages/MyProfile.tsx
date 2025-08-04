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
  IconButton,
  TagLabel,
  Tag,
  Link,
} from "@chakra-ui/react";
import {
  FaGlobe,
  FaInstagram,
  FaSnapchatGhost,
  FaTiktok,
} from "react-icons/fa";
import placeholderAvatar from "@images/no-avatar.png";
import useColorModeStyles from "../../utils/useColorModeStyles";
import api from "@/services/axios/api";
import getCorrectImage from "@/services/axios/getCorrectImage";
import { USerProfile } from "../auth/types";

const MainProfile = () => {
  const { bg, tiktok, textColor, borderColor, navBgColor } =
    useColorModeStyles();

  const [userData, setUserData] = useState<USerProfile>({
    image_url: placeholderAvatar.src,
    image_link: "",
    first_name: "John",
    last_name: "wick",
    email: "",
    id: -1,
    isOnline: false,
    username: "",
    age: 18,
    gender: "",
    location: "",
    bio: "",
    views: 9999,
    likes: 4856,
    points: 14695,
    interests: [],
    instagram: "",
    snapchat: "",
    tiktok: "",
    status: "",
  });

  const [imagePreview, setImagePreview] = useState<string>(
    placeholderAvatar.src
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/profile/");
        console.log(response.data);

        const data = response.data;
        setUserData(data);
        setImagePreview(
          getCorrectImage(data.image_url) || placeholderAvatar.src
        );
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
          {userData.first_name} {userData.last_name}
          {userData.age !== null ? `, ${userData.age}` : ""}
        </Text>

        {/* Location */}
        <HStack justify="center" color={textColor} mb={2}>
          <FaGlobe />
          <Text>{userData.location || "Location not specified"}</Text>
        </HStack>

        <Divider borderColor={borderColor} mb={2} />

        {/* Social Media Icons */}
        <HStack justify="center" spacing={4} mb={2}>
          {userData.instagram && (
            <Link
              href={`https://www.instagram.com/${userData.instagram}`}
              isExternal
              color="blue.400"
              fontWeight="medium"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              _hover={{ textDecoration: "underline" }}
            >
              <IconButton
                aria-label="Instagram"
                icon={<FaInstagram />}
                colorScheme="pink"
                variant="ghost"
              />
            </Link>
          )}
          {userData.snapchat && (
            <Link
              href={`https://snapchat.com/add/${userData.instagram}`}
              isExternal
              color="blue.400"
              fontWeight="medium"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              _hover={{ textDecoration: "underline" }}
            >
              <IconButton
                aria-label="Snapchat"
                icon={<FaSnapchatGhost />}
                colorScheme="yellow"
                variant="ghost"
              />
            </Link>
          )}
          {userData.tiktok && (
            <Link
              href={`https://www.tiktok.com/@${userData.instagram}`}
              isExternal
              color="blue.400"
              fontWeight="medium"
              display="flex"
              alignItems="center"
              justifyContent="center"
              gap={2}
              _hover={{ textDecoration: "underline" }}
            >
              <IconButton
                aria-label="TikTok"
                icon={<FaTiktok />}
                color={tiktok}
                bg="transparent"
                variant="ghost"
              />
            </Link>
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
          {userData.interests.length > 0 ? (
            userData.interests.map((tag, index) => (
              <Tag key={index} size="md" variant="subtle" colorScheme="teal">
                <TagLabel>{tag}</TagLabel>
              </Tag>
            ))
          ) : (
            <Text>No interests specified</Text>
          )}
        </HStack>

        <Divider borderColor={borderColor} mb={2} />

        {/* About Me */}
        <Text fontSize="lg" fontWeight="bold" color={textColor} mb={2}>
          About Me
        </Text>
        <Textarea
          value={userData.bio || "No bio available."}
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
