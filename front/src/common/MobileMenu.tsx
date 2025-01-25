import React, { useState } from "react";
import { Flex, IconButton, Link, useDisclosure, useColorMode } from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, CloseIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { FaSnapchat, FaInstagram, FaTiktok } from "react-icons/fa6";

import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";
import Image from "next/image";

const MobileMenu = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;

  return (
    <Flex direction="column" position="relative" height="100vh">
      {/* Header with Logo and Burger Menu */}
      <Flex justify="space-between" align="center" px={4} py={2} bg={colorMode === "light" ? "gray.200" : "gray.800"} position="relative">
        <Image src={logo} alt="Logo" height={40} />
        <IconButton
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          variant="ghost"
          onClick={onOpen}
          size="lg"
          color={colorMode === "light" ? "black" : "white"}
        />
      </Flex>

      {/* Mobile Menu Drawer */}
      {isOpen && (
        <Flex
          direction="column"
          position="fixed"
          top={0}
          left={0}
          width="100%"
          height="100vh"
          bg={colorMode === "light" ? "gray.100" : "gray.700"}
          zIndex={999}
          p={4}
          align="flex-start"
          boxShadow="xl"
        >
          {/* Close Button */}
          <IconButton
            icon={<CloseIcon />}
            aria-label="Close Menu"
            variant="ghost"
            onClick={onClose}
            size="lg"
            color={colorMode === "light" ? "black" : "white"}
            alignSelf="flex-end"
            mb={4}
          />

          {/* Profile Link */}
          <Link href="/profile" w="full" py={2} textAlign="left" _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.600" }}>
            <FaUser /> Profile
          </Link>

          {/* Instagram Link */}
          <Link href="/instagram" w="full" py={2} textAlign="left" _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.600" }}>
            <FaInstagram /> Instagram
          </Link>

          {/* Snapchat Link */}
          <Link href="/snapchat" w="full" py={2} textAlign="left" _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.600" }}>
            <FaSnapchat /> Snapchat
          </Link>

          {/* Tiktok Link */}
          <Link href="/tiktok" w="full" py={2} textAlign="left" _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.600" }}>
            <FaTiktok /> Tiktok
          </Link>

          {/* Logout Link */}
          <Link
            onClick={() => {
              console.log("Logging out");
              // Add logout logic here
              onClose();
            }}
            w="full"
            py={2}
            textAlign="left"
            _hover={{ bg: colorMode === "light" ? "gray.200" : "gray.600" }}
          >
            <IoLogOut /> Log Out
          </Link>

          {/* Dark/Light Mode Switcher */}
          <Flex justify="center" mt={4}>
            <IconButton
              icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
              aria-label="Toggle Dark/Light Mode"
              variant="ghost"
              onClick={toggleColorMode}
              size="lg"
            />
          </Flex>
        </Flex>
      )}
    </Flex>
  );
};

export default MobileMenu;
