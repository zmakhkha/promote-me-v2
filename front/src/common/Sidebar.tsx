"use client";
import React, { useRef } from "react";
import NextLink from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Flex,
  IconButton,
  Tooltip,
  Box,
  Link as ChakraLink,
  useDisclosure,
  AlertDialog,
  AlertDialogBody,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogOverlay,
  Button,
} from "@chakra-ui/react";
import { FaHeart, FaSnapchat, FaInstagram, FaTiktok } from "react-icons/fa6";
import { IoLogOut } from "react-icons/io5";
import useColorModeStyles from "@/utils/useColorModeStyles";


const Sidebar = () => {
  const { bg, hoverColor, textColor, iconColor } = useColorModeStyles();

  const pathname = usePathname();
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const cancelRef = useRef<HTMLButtonElement | null>(null);

  const navItems = [
    { href: "/discover", icon: <FaHeart />, label: "Discover" },
    { href: "/snapchat", icon: <FaSnapchat />, label: "Snapchat" },
    { href: "/instagram", icon: <FaInstagram />, label: "Instagram" },
    { href: "/tiktok", icon: <FaTiktok />, label: "TikTok" },
  ];

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  const handleLogout = () => {
    try {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
    } catch {}
    onClose();
    router.push("/login");
  };

  return (
    <>
      <Flex
        direction="column"
        align="center"
        justify="space-between"
        bg={bg}
        p={4}
        w="100%"
        h="95vh"
        position="sticky"
        top="0"
      >
        {/* Top: Logo + Nav */}
        <Flex direction="column" align="center" w="100%">
          {navItems.map((item, idx) => (
            <React.Fragment key={item.href}>
              <Tooltip label={item.label} aria-label={item.label} placement="right">
                <ChakraLink as={NextLink} href={item.href} _hover={{ textDecoration: "none" }}>
                  <IconButton
                    aria-label={item.label}
                    icon={item.icon}
                    variant="ghost"
                    mb={2}
                    _hover={{ color: hoverColor }}
                    color={isActive(item.href) ? hoverColor : iconColor ?? textColor}
                  />
                </ChakraLink>
              </Tooltip>
              {idx < navItems.length - 1 && (
                <Box height="1px" width="20px" bg="gray.400" mb={2} />
              )}
            </React.Fragment>
          ))}
        </Flex>

        {/* Bottom: Logout */}
        <Flex direction="column" align="center" w="100%">
          <Box height="1px" width="20px" bg="gray.400" mb={2} />
          <Tooltip label="Logout" aria-label="Logout" placement="right">
            <IconButton
              aria-label="Logout"
              icon={<IoLogOut style={{ transform: "scaleX(-1)" }} />}
              variant="ghost"
              onClick={onOpen}
              _hover={{ color: hoverColor }}
              color={iconColor ?? textColor}
            />
          </Tooltip>
        </Flex>
      </Flex>

      {/* Confirm Logout */}
      <AlertDialog isOpen={isOpen} leastDestructiveRef={cancelRef} onClose={onClose} isCentered>
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Logout
            </AlertDialogHeader>
            <AlertDialogBody>Are you sure you want to log out?</AlertDialogBody>
            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={handleLogout} ml={3}>
                Logout
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
