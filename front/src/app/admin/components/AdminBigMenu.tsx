import React, { useEffect, useState } from "react";
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
  Button,
} from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import { FaUser } from "react-icons/fa";
import logoLight from "@/../public/logo-light.png";
import logoDark from "@/../public/logo-dark.png";
import Image from "next/image";
import api from "@/services/axios/api";
import useColorModeStyles from "@/utils/useColorModeStyles";

const AdminBigMenu = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { bg, hoverColor } = useColorModeStyles();
  const [username, setUsername] = useState("User");
  const logo = colorMode === "light" ? logoLight : logoDark;

  useEffect(() => {
    api
      .get("/api/header/")
      .then((response) => setUsername(response.data.username))
      .catch((error) => console.error("Error fetching header data", error));
  }, []);

  return (
    <Flex
      justify="space-between"
      align="center"
      px={6}
      py={3}
      bg={bg}
      height="60px"
    >
      <Link href="/">
        <Image height={90} src={logo} alt="Logo" />
      </Link>
      <Flex align="center" gap={4}>
        <Menu>
          <MenuButton
            as={IconButton}
            icon={<FaUser />}
            aria-label="Profile"
            variant="ghost"
          />
          <MenuList>
            <MenuItem>Bonjour {username}</MenuItem>
          </MenuList>
        </Menu>
        <IconButton
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          aria-label="Toggle Color Mode"
          variant="ghost"
          onClick={toggleColorMode}
        />
      </Flex>
    </Flex>
  );
};

export default AdminBigMenu;
