"use client";
import React, { useState, useEffect } from "react";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";
import { HiDocumentText } from "react-icons/hi";
import { MdPrivacyTip } from "react-icons/md";
import useColorModeStyles from "@/utils/useColorModeStyles";
import api from "@/services/axios/api";
import Notifications from "./Notifications";
import socketConnect from "@/services/axios/socketConnect";
import Link from "next/link";

const BigMenu = () => {
  const { bg, toggleColorMode } = useColorModeStyles();
  const [username, setUsername] = useState("User");

  const fetchUsers = async () => {
    try {
      socketConnect("1");
      const response = await api.get("/api/v1/profile/");
      setUsername(response.data.first_name);
    } catch (err) {
      console.log("[Header] [fetchUsers] There was an error.", err);
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
            <MenuItem as={Link} href="/profile" icon={<FaUser />}>
              Profile
            </MenuItem>
            <MenuItem
              as={Link}
              href="/terms-of-service"
              icon={<HiDocumentText />}
            >
              Terms of Service
            </MenuItem>
            <MenuItem as={Link} href="/privacy-policy" icon={<MdPrivacyTip />}>
              Privacy Policy
            </MenuItem>
            <MenuItem icon={<IoLogOut style={{ transform: "scaleX(-1)" }} />}>
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
