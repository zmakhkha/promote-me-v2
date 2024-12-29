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
import { MdCheckCircle, MdCancel, MdLocationOff } from "react-icons/md";

interface HomeUser {
  id: number;
  username: string;
  age: number;
  gender: string;
  location: string;
  bio: string;
  interests: string[];
  imageUrl: string;
  isOnline: boolean;
  instagram: string;
}

interface Props {
  user: HomeUser;
}

const UserCard = ({ user }: Props) => {
  const { bg, textColor, borderColor, hoverColor, bgColor } =
    useColorModeStyles(); // Destructure the colors
  const imageSize = useBreakpointValue({ base: "150px", md: "200px" });
  const cardMaxHeight = useBreakpointValue({ base: "450px", md: "600px" });

  return (
    <Card
      maxW="sm"
      maxH={cardMaxHeight}
      borderRadius="xl"
      boxShadow="lg"
      overflow="hidden"
      transition="transform 0.2s"
      _hover={{
        transform: "scale(1.05)",
        boxShadow: "xl",
        borderColor: hoverColor, // Hover effect using color mode value
      }}
      bg={bg} // Set background color based on color mode
      border="1px"
      borderColor={borderColor} // Border color changes based on color mode
    >
      {/* Image Section */}
      <Box
        height={imageSize}
        width="100%"
        overflow="hidden"
        borderRadius="md"
        position="relative"
        _hover={{
          transform: "scale(1.1)",
          transition: "all 0.3s ease-in-out",
        }}
      >
        <Image
          src={user.imageUrl}
          alt={`${user.username}'s profile`}
          objectFit="cover"
          width="100%"
          height="100%"
          borderRadius="md"
        />
      </Box>

      {/* Scrollable Content */}
      <Flex
        direction="column"
        overflowY="auto"
        maxH={`calc(${cardMaxHeight} - ${imageSize})`}
      >
        <CardBody>
          {/* Header Section with User Info */}
          <HStack justify="space-between" mb={1}>
            <Heading fontSize="xl" fontWeight="semibold" color={textColor}>
              {user.username}, {user.age}
            </Heading>
            <Badge
              colorScheme={user.isOnline ? "green" : "red"}
              variant="solid"
              borderRadius="full"
              px={4}
              py={1}
              fontSize="sm"
              display="flex"
              alignItems="center"
            >
              {user.isOnline ? <MdCheckCircle /> : <MdCancel />}
              <span style={{ marginLeft: "4px" }}>
                {user.isOnline ? "Online" : "Offline"}
              </span>
            </Badge>
          </HStack>

          {/* Location Section */}
          <HStack mb={1}>
            <FaMapMarkerAlt color="gray.600" />
            <Text fontSize="md" color={textColor}>
              {user.location || <MdLocationOff color="gray.400" />}
            </Text>
          </HStack>

          {/* Bio Section */}
          <Text fontSize="sm" color={textColor} mb={1} lineHeight="1.6">
            {user.bio}
          </Text>

          {/* Interests Section */}
          <Heading fontSize="md" mb={1} color={textColor}>
            Interests
          </Heading>
          <HStack wrap="wrap">
            {user.interests.map((interest, index) => (
              <Badge key={index} colorScheme="blue" fontSize="sm" mr={2} mb={1}>
                {interest}
              </Badge>
            ))}
          </HStack>
        </CardBody>
      </Flex>

      {/* Divider and Instagram Link */}
      <Divider borderColor={borderColor} />
      <Box textAlign="center" py={3}>
        <Link
          href={`https://www.instagram.com/${user.instagram}`}
          isExternal
          color="blue.400"
          fontWeight="medium"
          _hover={{ textDecoration: "underline" }}
        >
          View Instagram
        </Link>
      </Box>
    </Card>
  );
};

export default UserCard;
