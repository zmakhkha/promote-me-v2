import { Box } from "@chakra-ui/react";

const UserCardContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="flex-start"
      boxShadow="md"
      borderRadius="lg"
      padding={10}
      width="100%"
      maxWidth="350px"
      bg="white"
    >
      {children}
    </Box>
  );
};

export default UserCardContainer;
