// File: components/common/BottomBar.js

import { HStack, IconButton } from "@chakra-ui/react";
import { FiHome, FiSearch, FiBell, FiUser, FiSettings } from "react-icons/fi";

const BottomBar = () => {
  return (
    <HStack justify="space-between" p={2} bg="gray.800" color="white">
      <IconButton icon={<FiHome />} aria-label="Home" />
      <IconButton icon={<FiSearch />} aria-label="Search" />
      <IconButton icon={<FiBell />} aria-label="Notifications" />
      <IconButton icon={<FiUser />} aria-label="Profile" />
      <IconButton icon={<FiSettings />} aria-label="Settings" />
    </HStack>
  );
};

export default BottomBar;
