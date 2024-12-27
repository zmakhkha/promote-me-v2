import { Card, CardBody, Heading, HStack, Image, Text, Badge } from "@chakra-ui/react";
import { FaMapMarkerAlt } from "react-icons/fa";
import { MdCheckCircle, MdCancel } from "react-icons/md";

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
    <Card>
      <Image src={user.imageUrl} borderRadius="full" boxSize="150px" objectFit="cover" />
      <CardBody>
        <HStack justify="space-between" marginBottom={3}>
          <Heading fontSize="xl">
            {user.username}, {user.age}
          </Heading>
          <Badge colorScheme={user.isOnline ? "green" : "red"}>
            {user.isOnline ? <MdCheckCircle /> : <MdCancel />} {user.isOnline ? "Online" : "Offline"}
          </Badge>
        </HStack>
        <HStack marginBottom={2}>
          <FaMapMarkerAlt />
          <Text>{user.location}</Text>
        </HStack>
        <Text marginBottom={2}>{user.bio}</Text>
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
