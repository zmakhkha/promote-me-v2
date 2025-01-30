"use client";
import React, { useState, useRef, useEffect } from "react";
import {
  Flex,
  IconButton,
  Link,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useColorMode,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
import { MdPrivacyTip } from "react-icons/md";
import Image from "next/image";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";
import useColorModeStyles from "@/utils/useColorModeStyles";
import api from "@/services/axios";

const MobileMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;
  const { bg } = useColorModeStyles();

  const [username, setUsername] = useState("User");
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isLogoutOpen, setIsLogoutOpen] = useState(false);
  const cancelRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get("/api/v1/profile/");
        setUsername(response.data.first_name);
      } catch (error) {
        console.error("[MobileMenu] Error fetching user data.");
      }
    };
    fetchUser();
  }, []);

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
      <Image
        height={40}
        width={100}
        src={logo}
        alt="Logo"
        style={{ objectFit: "contain" }}
      />

      {/* Burger Menu */}
      <IconButton
        icon={<HamburgerIcon />}
        aria-label="Open Menu"
        variant="ghost"
        onClick={() => setIsDrawerOpen(true)}
      />

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
              <Link href="/profile">
                <Button
                  leftIcon={<FaUser />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Profile
                </Button>
              </Link>
              <Link href="/notifications">
                <Button
                  leftIcon={<BellIcon />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Notifications
                </Button>
              </Link>
              <Link href="/termsofservice">
                <Button
                  leftIcon={<HiDocumentText />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Terms of Service
                </Button>
              </Link>
              <Link href="/privacypolicy">
                <Button
                  leftIcon={<MdPrivacyTip />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Privacy Policy
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
              <Button
                leftIcon={<IoLogOut />}
                colorScheme="red"
                onClick={() => setIsLogoutOpen(true)}
                variant="ghost"
                justifyContent="flex-start"
              >
                Log Out
              </Button>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </Drawer>

      {/* Logout Confirmation Dialog */}
      <AlertDialog
        isOpen={isLogoutOpen}
        onClose={() => setIsLogoutOpen(false)}
        leastDestructiveRef={cancelRef}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={() => setIsLogoutOpen(false)}>
                Cancel
              </Button>
              <Button
                colorScheme="red"
                onClick={() => console.log("Logged out")}
                ml={3}
              >
                Log Out
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </Flex>
  );
};

export default MobileMenu;
