"use client";

import React from "react";
import { Flex, IconButton, Text, useColorMode } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import useColorModeStyles from "@/utils/useColorModeStyles";
import { useRouter } from "next/navigation";
import { Typewriter } from "react-simple-typewriter";

const NonAuthHeaderBig = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { bg, textColor } = useColorModeStyles();
  const router = useRouter();

  return (
    <Flex
      justify="space-between"
      align="center"
      px={6}
      py={2}
      bg={bg}
      height="60px"
    >
      {/* Typewriter Text */}
      <Flex gap={3}>
        <Text
          fontSize="2xl"
          fontWeight="semibold"
          color={textColor}
          fontFamily="'Pacifico', cursive"
          textAlign="center"
        >
          <Typewriter
            words={[
              "Find real Instagram users near you",
              "Meet new TikTok friends online",
              "Connect with Snapchat users instantly",
              "Chat with real people, not bots",
              "Make new friends online today",
              "Discover trending TikTok profiles",
              "Follow interesting people on Snapchat",
              "Find Instagram users by interests",
              "Make online friends safely and easily",
              "Explore new connections on social media",
              "Meet cool people on TikTok and Snap",
              "Build your social circle online",
              "Start chatting with Instagram users now",
              "Make friends who share your interests",
              "Grow your Snap and TikTok following",
              "Find local TikTok users near you",
              "Promote yourself and meet others online",
              "Discover social media friends by hobby",
              "Connect with verified users only",
              "Your next online friend is just a click away",
            ]}
            loop={0}
            cursor
            // cursorStyle="❤"
            cursorStyle=""
            typeSpeed={70}
            deleteSpeed={50}
            delaySpeed={1500}
          />
        </Text>
      </Flex>

      {/* Light/Dark Mode Toggle */}
      <IconButton
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        aria-label="Toggle Color Mode"
        variant="ghost"
        onClick={toggleColorMode}
      />
    </Flex>
  );
};

export default NonAuthHeaderBig;
