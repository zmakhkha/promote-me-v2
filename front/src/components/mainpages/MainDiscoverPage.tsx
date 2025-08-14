"use client";

import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  VStack,
  HStack,
  IconButton,
  Tag,
  Wrap,
  Divider,
  useColorModeValue,
  Flex,
  Img,
  Spinner,
} from "@chakra-ui/react";
import {
  FaHeart,
  FaComment,
  FaTimes,
  FaFlag,
  FaCog,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import defaultImage from "@images/no-avatar.png";
import api from "@/services/axios/api";
import getCorrectImage from "@/services/axios/getCorrectImage";

type Profile = {
  id: number;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  age: number;
  bio: string;
  interests: string[];
  location: string;
  distance: number;
  image_profile: string;
  points: number;
  latitude: number;
  longitude: number;
};

const MainDiscoverPage = () => {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  useEffect(() => {
    const fetchProfiles = async () => {
      try {
        setLoading(true);
        const response = await api.get<Profile[]>("/discover/");
        setProfiles(response.data.results); // Assuming the results array is part of the response
        setIndex(0);
      } catch (err) {
        setError("Failed to load profiles: " + err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfiles();
  }, []);

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % profiles.length);
  };

  const handleLike = () => {
    console.log("Liked", profiles[index]?.first_name);
    handleNext();
  };

  const handleSkip = () => {
    console.log("Skipped", profiles[index]?.first_name);
    handleNext();
  };

  const handleChat = () => {
    console.log("Chat with", profiles[index]?.first_name);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text color="red.500">{error}</Text>
      </Flex>
    );
  }

  if (!profiles.length) {
    return (
      <Flex justify="center" align="center" minH="60vh">
        <Text>No profiles found.</Text>
      </Flex>
    );
  }

  const profile = profiles[index];

  return (
    <Flex justify="center" align="center" py={5} px={5}>
      <Box
        bg={bg}
        borderRadius="lg"
        p={4}
        boxShadow="xl"
        borderColor={borderColor}
        borderWidth="1px"
        width={{ base: "90%", md: "80%" }}
        height={{ base: "90%", md: "80%" }}
        // maxHeight="85vh"
        overflow="hidden"
        position="relative"
      >
        {/* Hide / Report Icons */}
        <HStack
          justify="space-between"
          position="absolute"
          top={4}
          left={4}
          right={4}
        >
          <IconButton
            aria-label="Report"
            icon={<FaFlag />}
            size="sm"
            variant="ghost"
          />
          <IconButton
            aria-label="Settings"
            icon={<FaCog />}
            size="sm"
            variant="ghost"
          />
        </HStack>

        <Flex
          direction={{ base: "column", md: "row" }} // Image on top in small, left in large
          align="center"
          gap={4}
        >
          {/* Profile Image */}
          <Box
            flexShrink={0}
            w={{ base: "100%", md: "40%" }}
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Img
              src={getCorrectImage(profile.image_profile) || defaultImage.src}
              alt={`${profile.first_name}'s profile`}
              borderRadius="xl"
              objectFit="cover"
              maxH="65vh"
              w="full"
            />
          </Box>

          {/* Content */}
          <Box
            flex="1"
            overflowY="auto"
            maxHeight="65vh"
            display="flex"
            flexDirection="column"
            justifyContent="space-between"
          >
            <VStack spacing={4} align="start" pt={4} pb={6}>
              <Text fontSize="sm" color="green.500" fontWeight="semibold">
                {profile.is_verified ? "✔ Profile Verified" : ""}
              </Text>
              <Text fontSize="2xl" fontWeight="bold">
                {profile.first_name} {profile.last_name}, {profile.age}
              </Text>

              {/* Interaction Buttons under image */}
              <HStack spacing={4}>
                <IconButton
                  aria-label="Skip"
                  icon={<FaTimes />}
                  size="md"
                  onClick={handleSkip}
                />
                <IconButton
                  aria-label="Chat"
                  icon={<FaComment />}
                  size="md"
                  onClick={handleChat}
                />
                <IconButton
                  aria-label="Like"
                  icon={<FaHeart />}
                  size="md"
                  onClick={handleLike}
                  colorScheme="red"
                />
              </HStack>

              <Divider />

              {/* About Section */}
              <VStack align="start" spacing={3} w="full" fontSize="sm">
                <Text fontWeight="bold">About Me</Text>
                <Text>{profile.bio}</Text>

                <Text fontWeight="bold">My Interests</Text>
                <Wrap>
                  {profile.interests.map((item, idx) => (
                    <Tag key={idx} colorScheme="purple">
                      {item}
                    </Tag>
                  ))}
                </Wrap>

                <Text fontWeight="bold">My Location</Text>
                <HStack>
                  <MdLocationOn />
                  <Text>
                    {profile.location} — ~{profile.distance} km away
                  </Text>
                </HStack>
              </VStack>

              <Divider />

              {/* Footer Buttons */}
              <HStack justify="space-between" pt={4} w="full">
                <IconButton
                  aria-label="Skip"
                  icon={<FaTimes />}
                  onClick={handleSkip}
                  size="md"
                />
                <IconButton
                  aria-label="Chat"
                  icon={<FaComment />}
                  onClick={handleChat}
                  size="md"
                />
                <IconButton
                  aria-label="Like"
                  icon={<FaHeart />}
                  onClick={handleLike}
                  size="md"
                  colorScheme="red"
                />
              </HStack>
            </VStack>
          </Box>
        </Flex>
      </Box>
    </Flex>
  );
};

export default MainDiscoverPage;
