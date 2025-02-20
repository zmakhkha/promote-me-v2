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

const NonAuthHeader = () => {
  const { colorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;
  const { bg, toggleColorMode } = useColorModeStyles();
  const [username, setUsername] = useState("User");
  const { hoverColor } = useColorModeStyles();

  const [isOpen, setIsOpen] = useState(false);
  const cancelRef = React.useRef<HTMLButtonElement>(null);

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
      pt={1}
      bg={bg}
      height="60px"
      borderColor="red"
    >
      <Link href="/">
        <Image height={60} src={logo} alt="Logo" />
      </Link>
      <Flex
        justify="space-between"
        px={3}
        align="center"
        pb={4}
        bg={bg}
        border={1}
        borderColor="red"
      ></Flex>
    </Flex>
  );
};

export default NonAuthHeader;
