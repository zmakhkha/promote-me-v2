import { Box } from "@chakra-ui/react";

const UserCardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      boxShadow="md"
      borderRadius="lg"
      padding="10px"
      bg="white"
    >
      {children}
    </Box>
  );
};

export default UserCardContainer;
