"use client";
import React from "react";
import { Box, Flex } from "@chakra-ui/react";
import useColorModeStyles from "@/utils/useColorModeStyles";

const RegisterLayout = ({ children }: { children: React.ReactNode }) => {
  const { bg, textColor } = useColorModeStyles();

  return (
    <Flex justify="center" align="center" py={5} px={5} height="100vh">
      <Box bg={bg} color={textColor} p={8} borderRadius="md" shadow="md">
        {children}
      </Box>
    </Flex>
  );
};

export default RegisterLayout;
