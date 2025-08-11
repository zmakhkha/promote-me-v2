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
  Img,
} from "@chakra-ui/react";
import { FaHeart, FaComment, FaTimes, FaCog, FaFlag } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { DiscoverUser } from "../auth/types";
import defaultImage from "@images/no-avatar.png";


interface DiscoverCardProps {
  profile: DiscoverUser;
  onLike: () => void;
  onSkip: () => void;
  onChat: () => void;
}

const DiscoverCard = ({ profile, onLike, onSkip, onChat }: DiscoverCardProps) => {
  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
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
        <Img
          src={profile.profileImage || defaultImage.src}
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

        <HStack spacing={4}>
          <IconButton
            aria-label="Skip"
            icon={<FaTimes />}
            size="md"
            onClick={onSkip}
          />
          <IconButton
            aria-label="Chat"
            icon={<FaComment />}
            size="md"
            onClick={onChat}
          />
          <IconButton
            aria-label="Like"
            icon={<FaHeart />}
            size="md"
            onClick={onLike}
            colorScheme="red"
          />
        </HStack>

        <Divider />

        <VStack align="start" spacing={3} w="full" fontSize="sm">
          <Text fontWeight="bold">About Me</Text>
          <Text>{profile.aboutMe}</Text>

          <Text fontWeight="bold">Specs</Text>
          <Wrap>
            {profile.specs.map((spec, idx) => (
              <Tag key={idx}>{spec}</Tag>
            ))}
          </Wrap>

          <Text fontWeight="bold">Iéapos;m Looking For</Text>
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

        <HStack justify="space-between" pt={4} w="full">
          <IconButton
            aria-label="Skip"
            icon={<FaTimes />}
            onClick={onSkip}
            size="md"
          />
          <IconButton
            aria-label="Chat"
            icon={<FaComment />}
            onClick={onChat}
            size="md"
          />
          <IconButton
            aria-label="Like"
            icon={<FaHeart />}
            onClick={onLike}
            size="md"
            colorScheme="red"
          />
        </HStack>
      </VStack>
    </Box>
  );
};

export default DiscoverCard;
