"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import MainSettings from "@/components/settings/MainSettings";
import Header from "@/common/Header";
import { useRouter } from "next/navigation";
import { checkAuthTokens } from "@/services/axios/checkAuthTokens";
import socketConnect from "@/services/axios/socketConnect";

const HomePage = () => {
  const { bg, textColor, navBgColor } = useColorModeStyles();

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkAuthTokens();
    if (!isAuthenticated) {
      router.push("/login");
    }
    socketConnect("1");
  }, [router]);
  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
        md: `"header header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr", md: "50px 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: "50px 1fr" }}
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      <GridItem area="header" position="sticky" top="0" zIndex="10" bg={bg}>
        <Header />
      </GridItem>

      <GridItem
        area="nav"
        bg={navBgColor}
        display={{ base: "none", md: "block" }}
      >
        <Sidebar />
      </GridItem>

      <GridItem area="main" pl="2" bg={navBgColor}>
        <MainSettings />
      </GridItem>
    </Grid>
  );
};

export default HomePage;
