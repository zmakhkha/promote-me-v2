import { Skeleton, Box } from "@chakra-ui/react";

const UserCardSkeleton = () => {
  return (
    <Box
      padding="6"
      borderWidth="1px"
      borderRadius="lg"
      width="100%"
      maxWidth="350px"
    >
      <Skeleton height="150px" borderRadius="full" mb={4} />
      <Skeleton height="20px" width="80%" mb={2} />
      <Skeleton height="20px" width="60%" mb={2} />
      <Skeleton height="15px" width="50%" />
    </Box>
  );
};

export default UserCardSkeleton;
