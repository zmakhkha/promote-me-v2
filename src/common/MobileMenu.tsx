"use client";
import React from "react";
import {
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Link,
  Box,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import { IoLogOut } from "react-icons/io5";

const MobileMenu = () => {
  return (
    <Menu>
      <MenuButton
        as={IconButton}
        icon={<HamburgerIcon />}
        aria-label="Menu"
        variant="ghost"
      />
      <MenuList
        minWidth="100vw" // Full width of the screen
        maxHeight="50vh" // Reduce menu height
        overflowY="auto"
        borderRadius="0"
        p="0"
      >
        <MenuItem
          icon={<FaUser />}
          as={Link}
          href="/profile"
          width="100%"
          py={4} // Adjust button height
          textAlign="center"
        >
          Profile
        </MenuItem>
        <MenuItem
          icon={<IoLogOut />}
          as={Link}
          href="/logout"
          width="100%"
          py={4}
          textAlign="center"
        >
          Log Out
        </MenuItem>
      </MenuList>
    </Menu>
  );
};

export default MobileMenu;
