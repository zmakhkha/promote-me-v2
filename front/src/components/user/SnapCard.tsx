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
import { MdLocationOff } from "react-icons/md";
import { SiSnapchat  } from "react-icons/si";
import { log } from "console";

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
}

interface Props {
  user: HomeUser;
}

const UserCard = ({ user }: Props) => {
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles(); // Destructure the colors
  const imageSize = useBreakpointValue({ base: "150px", md: "200px" });
  const cardMaxHeight = useBreakpointValue({ base: "450px", md: "600px" });
  console.log(user);
  // Truncate bio if it's longer than 90 characters
  const truncatedBio =
    user.bio.length > 90 ? `${user.bio.substring(0, 60)}...` : user.bio;

  return (
    <Card
      width="sm"
      maxH={cardMaxHeight}
      // height="450px"
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
        // href={`/profile/${user.username}`}
        // href={`/profile/${user.username}`}
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
          src={user.image_url}
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
            <Heading
              fontSize="xl"
              fontWeight="bold"
              color={textColor}
              mb={2}
              textAlign="center"
            >
              {user.first_name} · {user.gender} · {user.age}
            </Heading>
          </HStack>
          {/* Location Section */}
          <HStack
            // justify="center"
            mb={2}
            color="gray.500"
            fontSize="sm"
            fontStyle="italic"
          >
            <FaMapMarkerAlt />
            <Text>{user.location || <MdLocationOff />}</Text>
          </HStack>
          {/* Bio Section */}
          {/* About (Bio) Section */}
          {/* <Box
            bg="gray.200"
            p={3}
            borderRadius="md"
            mb={2}
            // textAlign="justify"
            _dark={{
              bg: "gray.700",
            }}
          >
            <Text fontSize="sm" color={textColor}>
              {truncatedBio}
            </Text>
          </Box> */}
          {/* <Spacer /> Pushes content to the top if there's empty space */}
          {/* Interests Section */}
          <Heading fontSize="md" mb={1} color={textColor}>
            Interests
          </Heading>
          <Flex wrap="wrap" gap={2}>
            {user.interests.slice(0, 3).map((interest, index) => (
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
          href={`https://snapchat.com/add/${user.instagram}`}
          isExternal
          color="blue.400"
          fontWeight="medium"
          display="flex"
          alignItems="center"
          justifyContent="center"
          gap={2}
          _hover={{ textDecoration: "underline" }}
        >
          <SiSnapchat />
          View Snapchat
        </Link>
      </Box>
    </Card>
  );
};

export default UserCard;
