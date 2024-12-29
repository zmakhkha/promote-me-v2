import { Card, CardBody, Heading, HStack, Image, Text, Badge, Box } from "@chakra-ui/react";
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
}

interface Props {
  user: HomeUser;
}

const UserCard = ({ user }: Props) => {
  return (
    <Card maxW="sm" borderRadius="lg" boxShadow="lg" overflow="hidden">
      {/* Image Section */}
      <Box height="200px" overflow="hidden">
        <Image
          src={user.imageUrl}
          alt={`${user.username}'s profile`}
          objectFit="cover"
          width="100%"
          height="100%"
          borderRadius="md"
        />
      </Box>

      <CardBody>
        {/* Header Section with User Info */}
        <HStack justify="space-between" marginBottom={3}>
          <Heading fontSize="xl" fontWeight="semibold">
            {user.username}, {user.age}
          </Heading>
          <Badge colorScheme={user.isOnline ? "green" : "red"} variant="solid" borderRadius="full">
            {user.isOnline ? <MdCheckCircle /> : <MdCancel />} {user.isOnline ? "Online" : "Offline"}
          </Badge>
        </HStack>

        {/* Location Section */}
        <HStack marginBottom={2}>
          <FaMapMarkerAlt />
          <Text>{user.location || <MdLocationOff />} </Text>
        </HStack>

        {/* Bio Section */}
        <Text marginBottom={2}>{user.bio}</Text>

        {/* Interests Section */}
        <Heading fontSize="md" marginBottom={2}>
          Interests
        </Heading>
        <HStack wrap="wrap">
          {user.interests.map((interest, index) => (
            <Badge key={index} colorScheme="blue" marginRight={2} marginBottom={2}>
              {interest}
            </Badge>
          ))}
        </HStack>
      </CardBody>
    </Card>
  );
};

export default UserCard;
