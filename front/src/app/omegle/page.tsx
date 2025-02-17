"use client";

import { Flex } from "@chakra-ui/react";
import React from "react";
import useColorModeStyles from "@/utils/useColorModeStyles";
import OmegleScreen from "@/components/chat/OmegleChatScreen";

const HomePage = () => {
  const { bg, textColor, navBgColor } = useColorModeStyles();

  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      bg={navBgColor}
      color={textColor}
    >
      <OmegleScreen />
    </Flex>
  );
};

export default HomePage;
