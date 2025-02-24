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
import api from "@/services/axios/api";
import Notifications from "./Notifications";
import socketConnect from "@/services/axios/socketConnect";

const BigMenu = () => {
  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;
  const { bg, toggleColorMode } = useColorModeStyles();
  const [username, setUsername] = useState("User");
  // const { hoverColor } = useColorModeStyles();

  // const [isOpen, setIsOpen] = useState(false);
  // const cancelRef = React.useRef<HTMLButtonElement>(null);

  const fetchUsers = async () => {
    try {
      socketConnect("1");
      const response = await api.get("/api/v1/profile/");
      setUsername(response.data.first_name);
    } catch (err: any) {
      console.log("[Header] [fetchUsers] There was an error.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);


  return (
    <Flex
    flexDirection="row-reverse"
      px={4}
      align="center"
      pt={1}
      bg={bg}
      height="60px"
      borderColor="red"
    >
      <Flex align="center">
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
              // onClick={onOpen}
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
    </Flex>
  );
};

export default BigMenu;
