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
  name: string;
  age: number | null;
  is_verified: boolean;
  bio: string;
  specs: string[];
  looking_for: string[];
  interests: string[];
  favoriteThing: string | null;
  causes: string[];
  boundary: string | null;
  location: string;
  distance: string;
  image_url: string | null;
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
        const response = await api.get<Profile[]>("discover/");
        setProfiles(response.data);
        setIndex(0);
      } catch (err) {
        setError("Failed to load profiles: "+ err);
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
    console.log("Liked", profiles[index]?.name);
    handleNext();
  };

  const handleSkip = () => {
    console.log("Skipped", profiles[index]?.name);
    handleNext();
  };

  const handleChat = () => {
    console.log("Chat with", profiles[index]?.name);
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
        width={{ base: "100%", sm: "90%", md: "500px", lg: "600px" }}
        maxHeight="85vh"
        overflowY="auto"
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

        <VStack spacing={4} align="center" pt={10} pb={6}>
          {/* Profile Image */}
          <Img
            src={profile.image_url || defaultImage.src || getCorrectImage(profile.image_url)}
            alt={`${profile.name}'s profile`}
            borderRadius="xl"
            objectFit="cover"
            maxH="65vh"
            w="full"
          />
          <Text fontSize="sm" color="green.500" fontWeight="semibold">
            {profile.is_verified ? "✔ Profile Verified" : ""}
          </Text>
          <Text fontSize="2xl" fontWeight="bold">
            {profile.name}, {profile.age}
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

            <Text fontWeight="bold">Specs</Text>
            <Wrap>
              {profile.specs.map((spec, idx) => (
                <Tag key={idx}>{spec}</Tag>
              ))}
            </Wrap>

            <Text fontWeight="bold">I&apos;m Looking For</Text>
            <Wrap>
              {profile.looking_for.map((item, idx) => (
                <Tag key={idx} colorScheme="blue" >
                  {item}
                </Tag>
              ))}
            </Wrap>

            <Text fontWeight="bold">My Interests</Text>
            <Wrap>
              {profile.interests.map((item, idx) => (
                <Tag key={idx} colorScheme="purple" >
                  {item}
                </Tag>
              ))}
            </Wrap>

            <Text fontWeight="bold">My Favourite Thing To Do</Text>
            <Text>{profile.favoriteThing}</Text>

            <Text fontWeight="bold">My Causes and Communities</Text>
            <Wrap>
              {profile.causes.map((item, idx) => (
                <Tag key={idx} colorScheme="teal" >
                  {item}
                </Tag>
              ))}
            </Wrap>

            <Text fontWeight="bold">My Most Important Boundary</Text>
            <Text>{profile.boundary}</Text>

            <Text fontWeight="bold">My Location</Text>
            <HStack>
              <MdLocationOn />
              <Text>
                {profile.location} — ~{profile.distance} away
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
  );
};

export default MainDiscoverPage;
