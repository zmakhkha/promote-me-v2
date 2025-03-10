"use client";

import React from "react";
import { Flex, IconButton, Button, useColorMode, Link } from "@chakra-ui/react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import useColorModeStyles from "@/utils/useColorModeStyles";
import { useRouter } from "next/navigation";
import Image from "next/image";
import logoLight from "../../public/logo-light.png";
import logoDark from "../../public/logo-dark.png";

const NonAuthHeaderBig = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const logo = colorMode === "light" ? logoLight : logoDark;
  const { bg } = useColorModeStyles();
  const router = useRouter();

  return (
    <Flex
      justify="space-between"
      align="center"
      px={6}
      py={2}
      bg={bg}
      height="60px"
    >
      {/* Sign In / Sign Up Buttons */}
      <Flex gap={3}>
        {/* <Link href="/register">
          <Button onClick={() => router.push("/signin")} variant="outline">
            Sign In
          </Button>
        </Link>
        <Link href="/login">
          <Button onClick={() => router.push("/signup")} colorScheme="blue">
            Sign Up
          </Button>
        </Link> */}
        <Image height={40} width={100} src={logo} alt="promote-me logo" />
      </Flex>

      {/* Light/Dark Mode Toggle */}
      <IconButton
        icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        aria-label="Toggle Color Mode"
        variant="ghost"
        onClick={toggleColorMode}
      />
    </Flex>
  );
};

export default NonAuthHeaderBig;
