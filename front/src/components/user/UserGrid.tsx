import { SimpleGrid, Text } from "@chakra-ui/react";
import UserCardSkeleton from "./UserCardSkeleton";
import UserCard from "./UserCard";
import UserCardContainer from "./UserCardContainer";

interface Props {
  homeUsers: Array<{
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
  }>;
}

const UserGrid = ({ homeUsers }: Props) => {
  const Skeletons = Array.from({ length: 10 }, (_, i) => i + 1);

  if (!homeUsers || homeUsers.length === 0)
    return <Text textAlign="center">No users found</Text>;

  return (
    <SimpleGrid
      columns={{ base: 1, sm: 1, md: 2, lg: 3, xl: 4 }}
      padding={{ base: "5px", md: "10px" }}
      spacing={{ base: 4, md: 6 }}
      justifyItems="center"
      alignItems="start"
    >
      {/* Loading Skeletons */}
      {Skeletons.map((skeleton) => (
        <UserCardContainer key={skeleton}>
          <UserCardSkeleton />
        </UserCardContainer>
      ))}

      {/* Display Users */}
      {homeUsers.map((user) => (
        <UserCardContainer key={user.id}>
          <UserCard user={user} />
        </UserCardContainer>
      ))}
    </SimpleGrid>
  );
};

export default UserGrid;
