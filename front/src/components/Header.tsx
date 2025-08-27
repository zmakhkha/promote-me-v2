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
import { Search, Bell } from "lucide-react";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";

const Header = () => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("white", "gray.800");
  const inputBg = useColorModeValue("gray.50", "gray.700");
  const iconMuted = useColorModeValue("#6B7280", "#9CA3AF"); // gray-500 / gray-400
  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;

  return (
    <Box
      as="header"
      w="full"
      borderBottom="1px"
      borderColor={borderColor}
      bg={bgColor}
    >
      <Flex h={16} align="center" justify="space-between" px={6} gap={4}>
        {/* Logo */}
        <>
          <ChakraLink
            as={NextLink}
            href="/"
            aria-label="Home"
            _hover={{ textDecoration: "none" }}
          >
            <Image width={60} src={logo} alt="Logo" />
          </ChakraLink>

          {/* Search */}
          <Box flex="1" maxW="md">
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <Search size={16} color={iconMuted} />
              </InputLeftElement>
              <Input
                type="search"
                placeholder="Search"
                bg={inputBg}
                variant="filled"
                focusBorderColor="blue.500"
              />
            </InputGroup>
          </Box>
        </>

        {/* Right actions */}
        <Flex align="center" gap={4}>
          {/* Notifications */}
          <Box position="relative">
            <IconButton
              variant="ghost"
              size="sm"
              aria-label="Notifications"
              icon={<Bell size={20} />}
              color={useColorModeValue("gray.600", "gray.300")}
            />
            <Box
              position="absolute"
              top="-2px"
              right="-2px"
              w="10px"
              h="10px"
              bg="red.500"
              border="2px solid"
              borderColor={bgColor}
              borderRadius="full"
            />
          </Box>

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
