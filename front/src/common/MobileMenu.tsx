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
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
} from "@chakra-ui/react";
import { HamburgerIcon, MoonIcon, SunIcon, BellIcon } from "@chakra-ui/icons";
import { FaUser, FaHome, FaComments, FaCog } from "react-icons/fa";
import { FaSnapchat, FaInstagram, FaTiktok } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
import { MdPrivacyTip } from "react-icons/md";
import Image from "next/image";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";
import useColorModeStyles from "@/utils/useColorModeStyles";
import api from "@/services/axios/api";
import Notifications from "./Notifications";

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
  const [isOpen, setIsOpen] = useState(false);

  const onOpen = () => setIsOpen(true);

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
        {/* <Link href="/notifications">
          <Button
            leftIcon={<BellIcon />}
            variant="ghost"
            justifyContent="flex-start"
            w="full"
          ></Button>
        </Link> */}
        <Notifications />

        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser />}
            aria-label="Profile"
            variant="ghost"
          />
          <MenuList>
            <MenuItem>Welcome {username}</MenuItem>
            <MenuItem icon={<FaUser />}>
              <Link href="/profile">Profile</Link>
            </MenuItem>
            <MenuItem icon={<HiDocumentText />}>
              <Link href="/termsofservice">Terms of Service</Link>
            </MenuItem>
            <MenuItem icon={<MdPrivacyTip />}>
              <Link href="/privacypolicy">Privacy Policy</Link>
            </MenuItem>
            <MenuItem
              onClick={onOpen}
              icon={<IoLogOut style={{ transform: "scaleX(-1)" }} />}
            >
              Log Out
            </MenuItem>
          </MenuList>
        </Menu>
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
              <Link href="/chat/random">
                <Button
                  leftIcon={<FaComments />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Chat
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
              <Link href="/settings">
                <Button
                  leftIcon={<FaCog />}
                  variant="ghost"
                  justifyContent="flex-start"
                  w="full"
                >
                  Settings
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
                onClick={() => setIsLogoutOpen(false)}
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
