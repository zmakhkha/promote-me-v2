"use client";
import React, { useState } from "react";
import {
  Flex,
  IconButton,
  Link,
  Button,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaHome, FaComments } from "react-icons/fa";
import { FaSnapchat, FaInstagram, FaTiktok } from "react-icons/fa6";
import Image from "next/image";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";
import useColorModeStyles from "@/utils/useColorModeStyles";

const NonAuthHeaderSmall = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;
  const { bg } = useColorModeStyles();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <Flex
      as="header"
      justify="space-between"
      align="center"
      px={4}
      height="60px"
      bg={bg}
      boxShadow="sm"
    >
      {/* Logo */}
      <Link href="/">
        <Image
          height={40}
          width={100}
          src={logo}
          alt="Logo"
          style={{ objectFit: "contain" }}
        />
      </Link>

      <Flex justify="space-between" bg={bg}>
        {/* Burger Menu */}
        <IconButton
          icon={<HamburgerIcon />}
          aria-label="Open Menu"
          variant="ghost"
          onClick={() => setIsDrawerOpen(true)}
        />
      </Flex>

      {/* Full-Screen Drawer Menu */}
      <Drawer
        isOpen={isDrawerOpen}
        placement="right"
        onClose={() => setIsDrawerOpen(false)}
      >
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader>Menu</DrawerHeader>
          <DrawerBody>
            <Flex direction="column" gap={4}>
              <Link href="/">
                <Button
                  leftIcon={<FaHome />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Home
                </Button>
              </Link>
              <Link href="/omegle">
                <Button
                  leftIcon={<FaComments />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Omegle Chat 
                </Button>
              </Link>
              <Link href="/snapchat">
                <Button
                  leftIcon={<FaSnapchat />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Snapchat
                </Button>
              </Link>
              <Link href="/instagram">
                <Button
                  leftIcon={<FaInstagram />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Instagram
                </Button>
              </Link>
              <Link href="/tiktok">
                <Button
                  leftIcon={<FaTiktok />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  TikTok
                </Button>
              </Link>
              <Button
                leftIcon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                onClick={toggleColorMode}
                variant="ghost"
                justifyContent="flex-start"
              >
                {colorMode === "light" ? "Dark Mode" : "Light Mode"}
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Flex>
  );
};

export default NonAuthHeaderSmall;
