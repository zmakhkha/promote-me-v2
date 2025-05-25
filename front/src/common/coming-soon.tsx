import useColorModeStyles from "@/utils/useColorModeStyles";
import { Center, VStack, Box, Heading, Text } from "@chakra-ui/react";
import type { NextPage } from "next";

const ComingSoon: NextPage = () => {
  const { bg, textColor } = useColorModeStyles();

  return (
    <Center px={4} my={5}>
      <VStack spacing={4}  textAlign="center">
        <Heading as="h1" size="2xl" color={textColor}>
          This page will be available soon
        </Heading>
        <Text fontSize="md" color={textColor} maxW="md">
          This page will be dedicated to matching only authenticated users to
          ensure a safe and genuine experience, helping to avoid catfishing.
        </Text>
      </VStack>
    </Center>
  );
};

export default ComingSoon;
