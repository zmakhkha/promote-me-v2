import React from "react";
import NextLink from "next/link";
import {
  Box,
  Text,
  Link,
  Image,
  HStack,
  VStack,
  Badge,
  Divider,
} from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { SiSnapchat } from "react-icons/si";
import { SiInstagram } from "react-icons/si";  // Import Instagram icon
import { SiTiktok } from "react-icons/si";     // Import TikTok icon
import getCorrectImage from "@/services/axios/getCorrectImage";
import useColorModeStyles from "@/utils/useColorModeStyles";
import { USerProfile } from "../auth/types";


interface SnapListItemProps {
  user: USerProfile;
  platform: "snapchat" | "instagram" | "tiktok";  // Add 'platform' prop to specify which social media to render
}

const UserListItem: React.FC<SnapListItemProps> = ({ user, platform }) => {
  const { bg, textColor, borderColor, hoverColor, snapchatTextColor } =
    useColorModeStyles();

  const getSocialMediaLink = () => {
    switch (platform) {
      case "snapchat":
        return `https://snapchat.com/add/${user.snapchat}`;
      case "instagram":
        return `https://instagram.com/${user.instagram}`;
      case "tiktok":
        return `https://tiktok.com/@${user.tiktok}`;
      default:
        return "#";  // Return a default link if the platform is not recognized
    }
  };

  const getIcon = () => {
    switch (platform) {
      case "snapchat":
        return <SiSnapchat />;
      case "instagram":
        return <SiInstagram />;
      case "tiktok":
        return <SiTiktok />;
      default:
        return null;
    }
  };

  return (
    <Box
      w="full"
      as={Link}
      href={`/profile/${user.username}`}
      p={3}
      borderWidth={1}
      borderRadius="lg"
      borderColor={borderColor}
      bg={bg}
      boxShadow="md"
      transition="transform 0.2s ease-in-out"
      _hover={{
        transform: "scale(1.02)",
        boxShadow: "lg",
        borderColor: hoverColor,
      }}
    >
      {/* User Info */}
      <HStack spacing={3} align="center">
        <Image
          src={user.image_link || getCorrectImage(user.image_url)}
          alt={user.username}
          boxSize="90px"
          borderRadius={20}
          border="1px solid"
          borderColor={user.isOnline ? "green.400" : "gray.400"}
        />
        <VStack align="start" spacing={0}>
          <Link
            as={NextLink}
            href={`/profile/${user.id}/${user.username}`}
            color={textColor}
            fontWeight="bold"
            fontSize="lg"
            _hover={{ color: hoverColor }}
          >
            {user.first_name} · {user.gender} · {user.age}
          </Link>
          <HStack fontSize="sm" color="gray.500">
            <FaMapMarkerAlt />
            <Text>{user.location || "Unknown"}</Text>
          </HStack>

          {/* Interests */}
          <HStack mt={2} spacing={2} wrap="wrap">
            {user.interests.slice(0, 3).map((interest, index) => (
              <Badge
                key={index}
                colorScheme="blue"
                px={2}
                py={1}
                borderRadius="full"
              >
                {interest}
              </Badge>
            ))}
          </HStack>
        </VStack>
      </HStack>

      <Divider my={2} borderColor={borderColor} />
      <Box display="flex" justifyContent="center">
        <Link
          href={getSocialMediaLink()}  // Use the dynamic link function
          isExternal
          display="flex"
          alignItems="center"
          color={snapchatTextColor}  // Use the same color for consistency
          fontWeight="medium"
          _hover={{ textDecoration: "underline" }}
        >
          {getIcon()} &nbsp;
          View {platform.charAt(0).toUpperCase() + platform.slice(1)} {/* Capitalize the type */}
        </Link>
      </Box>
    </Box>
  );
};

export default UserListItem;
