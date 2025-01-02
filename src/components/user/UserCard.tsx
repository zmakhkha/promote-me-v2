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
  Spacer,
} from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCheckCircle, MdCancel, MdLocationOff } from "react-icons/md";
import { FaInstagram } from "react-icons/fa";

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
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles(); // Destructure the colors
  const imageSize = useBreakpointValue({ base: "150px", md: "200px" });
  const cardMaxHeight = useBreakpointValue({ base: "450px", md: "600px" });

  // Truncate bio if it's longer than 90 characters
  const truncatedBio =
    user.bio.length > 90 ? `${user.bio.substring(0, 90)}...` : user.bio;

  return (
    <Card
      width="sm"
      maxH={cardMaxHeight}
      height="450px"
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
        as={Link}
        href={`/profile/${user.username}`}
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
        flex="1"
      >
        <CardBody flex="1" display="flex" flexDirection="column">
          {/* Header Section with User Info */}
          <HStack justify="space-between" mb={1}>
            <Heading fontSize="xl" fontWeight="semibold" color={textColor}>
              {user.username}, {user.age}
            </Heading>
            {/* <Badge
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
            </Badge> */}
          </HStack>
          {/* Location Section */}
          <HStack mb={1}>
            <FaMapMarkerAlt color="gray.600" />
            <Text fontSize="md" color={textColor}>
              {user.location || <MdLocationOff color="gray.400" />}
            </Text>
          </HStack>
          {/* Bio Section */}
          <Text
            fontSize="sm"
            color={textColor}
            mb={1}
            // lineHeight="1.6"
            flex="1"
            // overflow="hidden"
            textOverflow="ellipsis"
          >
            {truncatedBio}
          </Text>
          <Spacer /> {/* Pushes content to the top if there's empty space */}
          {/* Interests Section */}
          <Heading fontSize="md" mb={1} color={textColor}>
            Interests
          </Heading>
          <Flex wrap="wrap" gap={2}>
            {user.interests.map((interest, index) => (
              <Badge
                key={index}
                colorScheme="blue"
                fontSize="sm"
                px={2}
                // py={1}
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
      {/* Divider and Instagram Link */}
      <Divider borderColor={borderColor} />
      <Box textAlign="center" py={2}>
        <Link
          href={`https://www.instagram.com/${user.instagram}`}
          isExternal
          color="blue.400"
          fontWeight="medium"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          _hover={{ textDecoration: "underline" }}
        >
          <FaInstagram />
          View Instagram
        </Link>
      </Box>
    </Card>
  );
};

export default UserCard;
