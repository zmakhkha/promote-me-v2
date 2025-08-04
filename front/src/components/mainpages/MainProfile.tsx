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
  FaCommentDots,
  FaGlobe,
  FaInstagram,
  FaSnapchatGhost,
  FaTiktok,
} from "react-icons/fa";
import placeholderAvatar from "@images/no-avatar.png";

import useColorModeStyles from "../../utils/useColorModeStyles";
import api from "@/services/axios/api";
import { USerProfile } from "../auth/types";

interface MainProfileProps {
  username: string; // Expecting the username as a prop
}

const MainProfile = ({ username }: MainProfileProps) => {
  const { bg, textColor, borderColor, navBgColor, tiktok } =
    useColorModeStyles();

  const [liked, setLiked] = useState(false);
  const [userData, setUserData] = useState<USerProfile>({
    id: 0,
    username: "",
    email: "",
    first_name: "Loading...",
    last_name: "",
    age: 18,
    gender: "",
    location: "",
    bio: "",
    interests: [],
    image_url: placeholderAvatar.src,
    image_link: "",
    views: 0,
    likes: 0,
    points: 0,
    instagram: "null",
    snapchat: "null",
    tiktok: "null",
    isOnline: false,
    status: "",
  });

  const [imagePreview, setImagePreview] = useState<string>(
    placeholderAvatar.src
  );

  // Fetch the like status from the backend
  const fetchLikeStatus = async () => {
    try {
      const response = await api.get(`/profile/like-status/${username}/`);
      console.log("---------->|", response.data);
      setLiked(response.data.detail); // Set the like status from backend
    } catch (error) {
      console.error("Error fetching like status:", error);
    }
  };

  const handleDislike = async () => {
    try {
      const response = await api.post(`profile/dislike/`, {
        disliked_username: username,
      });

      if (response.status === 200) {
        // Toggle like status and update likes count
        setLiked(false);
        setUserData((prev) => ({
          ...prev,
          likes: prev.likes - (liked ? 1 : 0), // Decrement likes if disliked
        }));
      }
    } catch (error) {
      console.error("Failed to dislike user:", error);
    }
  };

  const handleLike = async () => {
    try {
      if (liked) {
        // If already liked, handle dislike
        await handleDislike();
      } else {
        // Send like toggle request
        const response = await api.post(`profile/like/`, {
          liked_username: username,
        });

        setLiked(true);
        if (response.data?.likes !== undefined) {
          setUserData((prev) => ({
            ...prev,
            likes: response.data.likes,
          }));
        }
      }
    } catch (error) {
      console.error("Failed to like/dislike user:", error);
    }
  };

  // Fetch user data and increment views
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/v1/users/${username}/`);
        setUserData(response.data);
        setImagePreview(
          response.data.image_link ||
            response.data.image_url ||
            placeholderAvatar.src
        );

        // Increment views
        await api.post(`api/v1/profile/view/`, { viewed_username: username });
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    if (username) {
      fetchUserData();
      fetchLikeStatus(); // Fetch like status when the component mounts
    }
  }, ); 

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
        <Flex justify="center" mt={-8}>
          <IconButton
            aria-label="Like/Dislike"
            icon={
              liked ? (
                <Text fontSize="2xl" color="red.400">
                  ❤️
                </Text>
              ) : (
                <Text fontSize="2xl" color="gray.400">
                  🤍
                </Text>
              )
            }
            variant="ghost"
            onClick={handleLike}
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

        {/* Start Chat Button */}
        <Flex justify="center" mb={4}>
          <Link href={`/chat/${userData.username}`} textDecoration="underline">
            <IconButton
              aria-label="Start Chat"
              icon={<FaCommentDots />}
              colorScheme="teal"
              size="lg"
              variant="solid"
            />
          </Link>
        </Flex>

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
              href={`https://snapchat.com/add/${userData.snapchat}`}
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
              href={`https://www.tiktok.com/@${userData.tiktok}`}
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
                aria-label="Tiktok"
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
