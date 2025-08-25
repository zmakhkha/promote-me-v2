"use client";

import { Box, Badge, HStack, IconButton, Image, Text, VStack, Wrap, WrapItem, useColorMode } from "@chakra-ui/react";
import { MapPin, Star, Flag } from "lucide-react";
import getCorrectImage from "@/services/axios/getCorrectImage";

export interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  age: number;
  bio: string;
  interests: string[];
  location: string;
  latitude: number;
  longitude: number;
  points: number;
  image_profile: string;
  distance: number;
  common_tags: number;
}

interface UserCardProps {
  profile: UserProfile;
  isTopCard: boolean;
  dragOffset: { x: number; y: number };
  rotation: number;
  opacity: number;
  isDragging: boolean;
  onReport: () => void;
  mouseHandlers?: React.HTMLAttributes<HTMLDivElement>;
  touchHandlers?: React.HTMLAttributes<HTMLDivElement>;
}

const UserCard = ({
  profile,
  isTopCard,
  dragOffset,
  rotation,
  opacity,
  isDragging,
  onReport,
  mouseHandlers,
  touchHandlers,
}: UserCardProps) => {
  const { colorMode } = useColorMode();
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const textColor = colorMode === "light" ? "gray.800" : "white";

  return (
    <Box
      position="absolute"
      inset={0}
      bg={cardBg}
      borderRadius="2xl"
      boxShadow="2xl"
      overflow="hidden"
      cursor={isTopCard ? "grab" : "default"}
      _active={{ cursor: isTopCard ? "grabbing" : "default" }}
      border="1px"
      borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
      transform={
        isTopCard
          ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y}px) rotate(${rotation}deg)`
          : `translateY(${20}px) scale(0.95)`
      }
      opacity={isTopCard ? opacity : 1}
      transition={isDragging ? "none" : "transform 0.3s ease-out"}
      {...mouseHandlers}
      {...touchHandlers}
    >
      {/* Profile Image */}
      <Box position="relative" h="65%" minH="520px">
        <Image
          src={
            profile.image_profile?.startsWith("/")
              ? getCorrectImage(profile.image_profile)
              : `/placeholder.svg?height=520&width=450&query=${profile.first_name}`
          }
          alt={`${profile.first_name} ${profile.last_name}`}
          w="full"
          h="full"
          objectFit="cover"
          draggable={false}
        />
        <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.700, transparent, blackAlpha.200)" />

        {/* Report */}
        <IconButton
          aria-label="Report"
          icon={<Flag size={16} />}
          size="sm"
          variant="ghost"
          bg="blackAlpha.500"
          color="white"
          _hover={{ bg: "blackAlpha.700" }}
          borderRadius="full"
          position="absolute"
          top={4}
          left={4}
          onClick={onReport}
        />

        {/* Points */}
        <HStack position="absolute" top={4} right={4} bg="blackAlpha.500" borderRadius="full" px={3} py={1} spacing={1}>
          <Star size={16} color="#F6E05E" />
          <Text color="white">{profile.points}</Text>
        </HStack>

        {/* User Info */}
        <Box position="absolute" bottom={4} left={4} color="white">
          <HStack>
            <Text fontSize="lg">{profile.first_name} {profile.last_name}</Text>
            <Text fontSize="xl">{profile.age}</Text>
            {profile.is_verified && <Badge colorScheme="blue">✓</Badge>}
          </HStack>
          <HStack>
            <MapPin size={16} />
            <Text fontSize="sm">{profile.location} • {profile.distance.toFixed(1)} km</Text>
          </HStack>
        </Box>
      </Box>

      {/* Bio & Interests */}
      <VStack p={4} align="stretch">
        <Text fontSize="sm" color={textColor}>{profile.bio}</Text>
        <Wrap>
          {profile.interests.map((interest) => (
            <WrapItem key={interest}>
              <Badge>{interest}</Badge>
            </WrapItem>
          ))}
        </Wrap>
      </VStack>
    </Box>
  );
};

export default UserCard;
