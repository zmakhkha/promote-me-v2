"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Tooltip,
  Link,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { BellIcon, MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
import { MdPrivacyTip } from "react-icons/md";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";
import Image from "next/image";
import useColorModeStyles from "@/utils/useColorModeStyles";
import api from "@/services/axios";

const BigMenu = () => {
  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;
  const { bg, toggleColorMode } = useColorModeStyles();
  const [username, setUsername] = useState("User");
  const { hoverColor } = useColorModeStyles();

  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

  const fetchUsers = async () => {
    try {
      const response = await api.get("/api/v1/profile/");
      setUsername(response.data.first_name);
    } catch (err: any) {
      console.log("[Header] [fetchUsers] There was an error.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onOpen = () => setIsOpen(true);
  const onClose = () => setIsOpen(false);

  const handleLogout = () => {
    console.log("Logged out");
    onClose();
  };

  return (
    <Flex
      justify="space-between"
      px={10}
      align="center"
      pb={4}
      bg={bg}
      border={1}
      borderColor="red"
      minHeight="80px"
    >
      <Image height={50} src={logo} alt="Logo" />
      <Flex
        justify="space-between"
        px={3}
        align="center"
        pb={4}
        bg={bg}
        border={1}
        borderColor="red"
        minHeight="80px"
      >
        <Flex align="center">
          <Tooltip label="Notifications" aria-label="Notifications">
            <Link href="/notifications">
              <IconButton
                icon={<BellIcon />}
                aria-label="Notifications"
                variant="ghost"
                _hover={{ color: hoverColor }}
                mr={4}
              />
            </Link>
          </Tooltip>
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
          <IconButton
            icon={bg === "gray.200" ? <MoonIcon /> : <SunIcon />}
            aria-label="Toggle Color Mode"
            variant="ghost"
            onClick={toggleColorMode}
            ml={4}
          />
        </Flex>

        {/* Logout Confirmation Dialog */}
        {/* <AlertDialog isOpen={isOpen} onClose={onClose} leastDestructiveRef={cancelRef}>
    <AlertDialogOverlay>
      <AlertDialogContent>
        <AlertDialogHeader fontSize="lg" fontWeight="bold">
          Confirm Logout
        </AlertDialogHeader>
        <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
        <AlertDialogFooter>
          <Button ref={cancelRef} onClick={onClose}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={handleLogout} ml={3}>
            Log Out
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialogOverlay>
  </AlertDialog> */}
      </Flex>
    </Flex>
  );
};

export default BigMenu;
