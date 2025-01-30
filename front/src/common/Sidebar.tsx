"use client";
import React, { useRef } from "react";
import {
  Flex,
  IconButton,
  Box,
  Tooltip,
  Link,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { FaHome, FaCog, FaComments } from "react-icons/fa"; // Import FaComments here
import { FaSnapchat, FaInstagram, FaTiktok } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import { useRouter } from "next/navigation";
import useColorModeStyles from "@/utils/useColorModeStyles";

const Sidebar = () => {
  const { bg, hoverColor } = useColorModeStyles();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const handleLogout = () => {
    localStorage.clear();
    onClose();
    router.push("/login");
  };

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="flex-start"
        bg={bg}
        p={4}
        width="100%"
        height="100%"
        position="relative"
      >
        {/* Home */}
        <Tooltip label="Home" aria-label="Home">
          <Link href="/">
            <IconButton
              icon={<FaHome />}
              aria-label="Home"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Chat */}
        <Tooltip label="Chat" aria-label="Chat">
          <Link href="/chat/random">
            <IconButton
              icon={<FaComments />}
              aria-label="Chat"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Snapchat */}
        <Tooltip label="Snapchat" aria-label="Snapchat">
          <Link href="/snapchat">
            <IconButton
              icon={<FaSnapchat />}
              aria-label="Snapchat"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Instagram */}
        <Tooltip label="Instagram" aria-label="Instagram">
          <Link href="/instagram">
            <IconButton
              icon={<FaInstagram />}
              aria-label="Instagram"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* TikTok */}
        <Tooltip label="TikTok" aria-label="TikTok">
          <Link href="/tiktok">
            <IconButton
              icon={<FaTiktok />}
              aria-label="TikTok"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Settings */}
        <Tooltip label="Settings" aria-label="Settings">
          <Link href="/settings">
            <IconButton
              icon={<FaCog />}
              aria-label="Settings"
              variant="ghost"
              mb={2}
              _hover={{ color: hoverColor }}
            />
          </Link>
        </Tooltip>

        <Box height="1px" width="20px" bg="gray.400" mb={2} />

        {/* Logout */}
        <Tooltip label="Log Out" aria-label="Logout">
          <IconButton
            icon={<IoLogOut style={{ transform: "scaleX(-1)" }} />}
            aria-label="Logout"
            variant="ghost"
            onClick={onOpen}
            mb={2}
            _hover={{ color: hoverColor }}
          />
        </Tooltip>
      </Flex>

      {/* Logout Confirmation Dialog */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose}>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>Log Out</Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
