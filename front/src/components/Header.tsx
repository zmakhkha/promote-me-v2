"use client";

import React from "react";
import Image from "next/image";
import NextLink from "next/link";
import {
  Box,
  Flex,
  Input,
  InputGroup,
  InputLeftElement,
  IconButton,
  Avatar,
  Text,
  Link as ChakraLink,
  useColorModeValue,
  useColorMode,
} from "@chakra-ui/react";
import { Search, Sun, Moon } from "lucide-react";
import NotificationBell from "./NotificationBell"; // Import the new component
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";
import SearchInput from "./SearchInput";


const Header = () => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const iconMuted = useColorModeValue("#6B7280", "#9CA3AF"); // gray-500 / gray-400
  const { colorMode, toggleColorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;
  const onSearch  = () =>{}

  return (
    <Box
      as="header"
      w="full"
      borderBottom="1px"
      borderColor={borderColor}
      bg={bgColor}
    >
      <Flex h={16} align="center" justify="space-between" px={6} >
        {/* Logo */}
        
          <ChakraLink
            as={NextLink}
            href="/"
            aria-label="Home"
            _hover={{ textDecoration: "none" }}
          >
            <Image width={60} src={logo} alt="Logo" />
          </ChakraLink>

          {/* Search */}
          <SearchInput onSearch={onSearch} />
        {/* Right actions */}
        <Flex align="center" gap={4}>
          {/* Color Mode Toggle */}
          <IconButton
            variant="ghost"
            size="sm"
            aria-label={`Switch to ${colorMode === "light" ? "dark" : "light"} mode`}
            icon={colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />}
            color={useColorModeValue("gray.600", "gray.300")}
            onClick={toggleColorMode}
          />

          {/* Notifications Bell Component */}
          <NotificationBell />

          {/* Username */}
          <Text fontSize="sm" fontWeight="medium">
            zmakhkha
          </Text>

          {/* Avatar */}
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