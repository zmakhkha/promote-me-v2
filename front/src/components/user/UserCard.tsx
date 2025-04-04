import getCorrectImage from "@/services/axios/getCorrectImage";
import useColorModeStyles from "@/utils/useColorModeStyles";
import {
  Card,
  CardBody,
  Heading,
  HStack,
  Image,
  Text,
  Badge,
  Box,
  useBreakpointValue,
  Divider,
  Link,
  Flex,
} from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdLocationOff } from "react-icons/md";
import { SiSnapchat } from "react-icons/si";
import { SiInstagram } from "react-icons/si";
import { SiTiktok } from "react-icons/si";

interface HomeUser {
  id: number;
  username: string;
  first_name: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  interests: string[];
  image_url: string;
  isOnline: boolean;
  instagram: string;
  snapchat: string;
  tiktok: string;
}

interface UserCardProps {
  user: HomeUser;
  platform: "snapchat" | "instagram" | "tiktok"; // New prop to define the platform
}

const UserCard = ({ user, platform }: UserCardProps) => {
  const {
    bg,
    textColor,
    borderColor,
    hoverColor,
    snapchatTextColor,
    instagramTextColor,
    tiktokTextColor,
  } = useColorModeStyles();

  const cardWidth = useBreakpointValue({ base: "90%", sm: "300px", md: "400px" });
  const imageHeight = useBreakpointValue({ base: "180px", sm: "200px", md: "220px" });
  const cardMaxHeight = useBreakpointValue({ base: "420px", md: "500px" });

  return (
    <Card
      width={cardWidth}
      maxH={cardMaxHeight}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "xl",
        borderColor: hoverColor,
      }}
      bg={bg}
      border="1px"
      borderColor={borderColor}
    >
      {/* Image Section */}
      <Box
        as={Link}
        href={`/profile/${user.username}`}
        height={imageHeight}
        width="100%"
        overflow="hidden"
        position="relative"
      >
        <Image
          src={getCorrectImage(user.image_url)}
          alt={`${user.username}'s profile`}
          objectFit="cover"
          width="100%"
          height="100%"
          borderRadius="0"
        />
      </Box>

      {/* Scrollable Content */}
      <Flex
        direction="column"
        overflowY="auto"
        maxH={`calc(${cardMaxHeight} - ${imageHeight})`}
        flex="1"
      >
        <CardBody display="flex" flexDirection="column" flex="1">
          <HStack justify="space-between" mb={1}>
            <Heading fontSize="xl" fontWeight="bold" color={textColor} mb={2}>
              {user.first_name} · {user.gender} · {user.age}
            </Heading>
          </HStack>

          <HStack mb={2} color="gray.500" fontSize="sm" fontStyle="italic">
            <FaMapMarkerAlt />
            <Text>{user.location || <MdLocationOff />}</Text>
          </HStack>

          <Heading fontSize="md" mb={1} color={textColor}>
            Interests
          </Heading>
          <Flex wrap="wrap" gap={2}>
            {user.interests?.slice(0, 3).map((interest, index) => (
              <Badge
                key={index}
                colorScheme="blue"
                fontSize="sm"
                px={2}
                borderRadius="full"
                boxShadow="md"
                bg="blue.100"
                color="blue.800"
              >
                {interest}
              </Badge>
            ))}
          </Flex>
        </CardBody>
      </Flex>

      {/* Divider and Platform Link */}
      <Divider borderColor={borderColor} />
      <Box textAlign="center" py={2}>
        {/* Conditionally render based on the platform */}
        {platform === "snapchat" && (
          <Link
            href={`https://snapchat.com/add/${user.snapchat}`}
            isExternal
            color={snapchatTextColor}
            fontWeight="medium"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            _hover={{ textDecoration: "underline" }}
          >
            <SiSnapchat /> &nbsp;
            View Snapchat
          </Link>
        )}

        {platform === "instagram" && (
          <Link
            href={`https://instagram.com/${user.instagram}`}
            isExternal
            color={instagramTextColor}
            fontWeight="medium"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            _hover={{ textDecoration: "underline" }}
          >
            <SiInstagram /> &nbsp;
            View Instagram
          </Link>
        )}

        {platform === "tiktok" && (
          <Link
            href={`https://tiktok.com/@${user.tiktok}`}
            isExternal
            color={tiktokTextColor}
            fontWeight="medium"
            display="flex"
            alignItems="center"
            justifyContent="center"
            gap={2}
            _hover={{ textDecoration: "underline" }}
          >
            <SiTiktok /> &nbsp;
            View TikTok
          </Link>
        )}
      </Box>
    </Card>
  );
};

export default UserCard;
