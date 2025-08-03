"use client";

import {
  Box,
  Image,
  Text,
  VStack,
  HStack,
  IconButton,
  Tag,
  Wrap,
  Divider,
  Spacer,
} from "@chakra-ui/react";
import {
  FaHeart,
  FaComment,
  FaTimes,
  FaQuestion,
  FaFlag,
  FaEyeSlash,
} from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { useState } from "react";
import discoverProfiles from "@/data/discoverProfiles";
import useColorModeStyles from "@/utils/useColorModeStyles";

export const DiscoverProfileCard = () => {
  const [index, setIndex] = useState(0);
  const profile = discoverProfiles[index];

  const handleNext = () => {
    setIndex((prev) => (prev + 1) % discoverProfiles.length);
  };

  const handleLike = () => {
    console.log("Liked", profile.name);
    handleNext();
  };

  const handleSkip = () => {
    console.log("Skipped", profile.name);
    handleNext();
  };

  const handleNotSure = () => {
    console.log("Not Sure about", profile.name);
    handleNext();
  };

  const handleChat = () => {
    console.log("Chat with", profile.name);
  };
  const { bg, borderColor } = useColorModeStyles();


  return (
    <Box
      maxW="lg"
      w="full"
      bg={bg}
      borderRadius="lg"
      p={8}
      boxShadow="lg"
      borderColor={borderColor}
      borderWidth="1px"
      mx="auto"
      my="auto"
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      height="80vh"
      // width={}
    >
      {/* Hide / Report Icons */}
      <HStack justify="flex-end" spacing={2} position="absolute" top={4} right={4}>
        <IconButton aria-label="Hide" icon={<FaEyeSlash />} size="sm" variant="ghost" />
        <IconButton aria-label="Report" icon={<FaFlag />} size="sm" variant="ghost" />
      </HStack>

      {/* Profile Image */}
      <VStack spacing={2} align="center" mb={4}>
        <Image
          src={profile.profileImage}
          alt={`${profile.name}'s profile`}
          borderRadius="xl"
          objectFit="cover"
          maxH="60vh"
          w="full"
        />
        <Text fontSize="sm" color="green.500" fontWeight="semibold">
          {profile.isVerified ? "✔ Profile Verified" : ""}
        </Text>
        <Text fontSize="2xl" fontWeight="bold">
          {profile.name}, {profile.age}
        </Text>

        {/* Interaction Buttons under image */}
        <HStack spacing={6} mt={2}>
          <IconButton aria-label="Skip" icon={<FaTimes />} size="lg" onClick={handleSkip} />
          <IconButton aria-label="Not Sure" icon={<FaQuestion />} size="lg" onClick={handleNotSure} />
          <IconButton aria-label="Chat" icon={<FaComment />} size="lg" onClick={handleChat} />
          <IconButton aria-label="Like" icon={<FaHeart />} size="lg" onClick={handleLike} colorScheme="red" />
        </HStack>
      </VStack>

      <Divider my={4} />

      {/* About Me */}
      <VStack align="start" spacing={3}>
        <Text fontWeight="bold">About Me</Text>
        <Text>{profile.aboutMe}</Text>

        <Text fontWeight="bold">Specs</Text>
        <Wrap>
          {profile.specs.map((spec, idx) => (
            <Tag key={idx}>{spec}</Tag>
          ))}
        </Wrap>

        <Text fontWeight="bold">I'm Looking For</Text>
        <Wrap>
          {profile.lookingFor.map((item, idx) => (
            <Tag key={idx} colorScheme="blue">
              {item}
            </Tag>
          ))}
        </Wrap>

        <Text fontWeight="bold">My Interests</Text>
        <Wrap>
          {profile.interests.map((item, idx) => (
            <Tag key={idx} colorScheme="purple">
              {item}
            </Tag>
          ))}
        </Wrap>

        <Text fontWeight="bold">My Favourite Thing To Do</Text>
        <Text>{profile.favoriteThing}</Text>

        <Text fontWeight="bold">My Causes and Communities</Text>
        <Wrap>
          {profile.causes.map((item, idx) => (
            <Tag key={idx} colorScheme="teal">
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

      {/* Footer actions */}
      <Spacer my={6} />
      <HStack justify="space-between" mt={8}>
        <IconButton aria-label="Skip" icon={<FaTimes />} onClick={handleSkip} size="lg" />
        <IconButton aria-label="Chat" icon={<FaComment />} onClick={handleChat} size="lg" />
        <IconButton aria-label="Like" icon={<FaHeart />} onClick={handleLike} size="lg" colorScheme="red" />
      </HStack>
    </Box>
  );
};
