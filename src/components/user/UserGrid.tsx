import { SimpleGrid, Text } from "@chakra-ui/react";
import UserCardSkeleton from "./UserCardSkeleton"; // create a skeleton loader for UserCard
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
  }>;
}

const UserGrid = ({ homeUsers }: Props) => {
  const Skeletons = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  if (!homeUsers) return <Text>No users found</Text>;

  return (
    <SimpleGrid
      columns={{ sm: 1, md: 2, lg: 3, xl: 4 }}
      padding="10px"
      spacing={6}
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
