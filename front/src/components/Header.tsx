"use client";

import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import {
  Box,
  Flex,
  IconButton,
  Avatar,
  Text,
  Link as ChakraLink,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { Sun, Moon } from "lucide-react";
import NotificationBell from "./NotificationBell";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";
import SearchInput from "./SearchInput";

const Header = () => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  const { colorMode, toggleColorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;

  const onSearch = (value: string) => {
    // You can route, set state, or call an API here.
    // For demo: log searches/usernames.
    console.log("Search submit/select:", value);
  };

  return (
    <Box as="header" w="full" borderBottom="1px" borderColor={borderColor} bg={bgColor}>
      <Flex
        h={16}
        align="center"
        justify="space-between"
        px={{ base: 4, md: 6 }}
        gap={4}
        wrap="nowrap"
      >
        {/* Left: Logo */}
        <ChakraLink
          as={NextLink}
          href="/"
          aria-label="Home"
          _hover={{ textDecoration: "none" }}
          minW="60px"
        >
          <Image width={60} src={logo} alt="Logo" />
        </ChakraLink>

        {/* Middle: Search (grows) */}
        <Flex flex="1" minW={0}>
          <SearchInput onSearch={onSearch} />
        </Flex>

        {/* Right actions */}
        <Flex align="center" gap={{ base: 2, md: 4 }} minW="fit-content">
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
            icon={colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
            color={useColorModeValue("gray.600", "gray.300")}
            onClick={toggleColorMode}
          />

          <NotificationBell />

          <Text display={{ base: "none", md: "block" }} fontSize="sm" fontWeight="medium">
            zmakhkha
          </Text>

          <Avatar
            size="sm"
            name="zmakhkha"
            src="/images/profile-avatar.png"
            bg="blue.500"
            color="white"
          />
        </Flex>
      </Flex>
    </Box>
  );
};

export default Header;
