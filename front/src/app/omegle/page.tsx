"use client";

import { Flex, IconButton } from "@chakra-ui/react";
import React from "react";
import useColorModeStyles from "@/utils/useColorModeStyles";
import OmegleScreen from "@/components/chat/OmegleChatScreen";
import { BellIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";


const HomePage = () => {
  const { bg, textColor, navBgColor } = useColorModeStyles();
  const { toggleColorMode } = useColorModeStyles();

  return (
    <Flex
      height="100vh"
      align="center"
      justify="center"
      bg={navBgColor}
      color={textColor}
    >
      <IconButton
        icon={bg === "gray.200" ? <MoonIcon /> : <SunIcon />}
        aria-label="Toggle Color Mode"
        variant="ghost"
        onClick={toggleColorMode}
        ml={4}
      />
      <OmegleScreen />
    </Flex>
  );
};

export default HomePage;
