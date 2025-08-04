"use client";
import React from "react";
import { Flex, IconButton, Link, Text, useColorMode } from "@chakra-ui/react";
import Image from "next/image";

import { FaSnapchat, FaInstagram, FaTiktok, FaHeart } from "react-icons/fa6";
import useColorModeStyles from "@/utils/useColorModeStyles";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";

// import { getIsAuth } from "@/services/axios/api";

const Sidebar = () => {
  const { colorMode } = useColorMode();
  const { bg, hoverColor, textColor } = useColorModeStyles();
  const logo = colorMode === "light" ? logoLight : logoDark;

  return (
    <>
      <Flex
        direction="column"
        align="flex-start"
        justify="space-between"
        bg={bg}
        p={4}
        width="100%"
        height="100vh"
        position="sticky"
        top="0"
      >
        {/* Top Section (Logo & Links) */}
        <Flex direction="column" width="100%">
          {/* Logo */}
          <Flex justify="center" align="center" mt={-8} mb={6} width="100%">
            <Link href="/">
              <Image height={100} width={100} src={logo} alt="Logo" />
            </Link>
          </Flex>

          {/* Sidebar Items */}
          <Flex direction="column" width="100%">
            {[
              // { label: "Chat", icon: <FaComments />, href: "/chat/random" },
              { label: "Discover", icon: <FaHeart />, href: "/discover" },
              { label: "Snapchat", icon: <FaSnapchat />, href: "/snapchat" },
              { label: "Instagram", icon: <FaInstagram />, href: "/instagram" },
              { label: "TikTok", icon: <FaTiktok />, href: "/tiktok" },
            ].map(({ label, icon, href }, index) => (
              <Link key={index} href={href} style={{ width: "100%" }}>
                <Flex
                  align="center"
                  p={2}
                  borderRadius="md"
                  _hover={{ bg: hoverColor }}
                  width="100%"
                >
                  <IconButton
                    icon={icon}
                    aria-label={label}
                    variant="ghost"
                    size="lg"
                    mr={2}
                  />
                  <Text fontSize="md" color={textColor}>
                    {label}
                  </Text>
                </Flex>
              </Link>
            ))}
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};

export default Sidebar;
