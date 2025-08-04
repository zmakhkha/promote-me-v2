"use client";

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
} from "@chakra-ui/react";
import {
  FaHeart,
  FaComment,
  FaTimes,
  FaQuestion,
  FaFlag,
  FaCog,
} from "react-icons/fa";
import defaultImage from "@images/no-avatar.png";
import { MdLocationOn } from "react-icons/md";
import { useState } from "react";
import discoverProfiles from "@/data/discoverProfiles";

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

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

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
            // src={ profile.profileImage || defaultImage.src}
            src={defaultImage.src}
            alt={`${profile.name}'s profile`}
            borderRadius="xl"
            objectFit="cover"
            maxH="65vh"
            w="full"
          />
          <Text fontSize="sm" color="green.500" fontWeight="semibold">
            {profile.isVerified ? "✔ Profile Verified" : ""}
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
            {/* <IconButton
              aria-label="Not Sure"
              icon={<FaQuestion />}
              size="md"
              onClick={handleNotSure}
            /> */}
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
            <Text>{profile.aboutMe}</Text>

            <Text fontWeight="bold">Specs</Text>
            <Wrap>
              {profile.specs.map((spec, idx) => (
                <Tag key={idx}>{spec}</Tag>
              ))}
            </Wrap>

            <Text fontWeight="bold">I&apos;m Looking For</Text>
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
