"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Sidebar from "@/common/NonAuthSidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import MainInstagram from "@/components/instagram/mainInstagram";
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
        md: `"nav header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr", md: "60px 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: "200px 1fr" }}
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      {/* Header Section */}
      <GridItem area="header" position="sticky" top="0" zIndex="2" bg={bg}>
        {/* Placeholder for Header */}
        {/* <h1>Header</h1> */}
        <Header />
      </GridItem>

      {/* Sidebar Section */}
      <GridItem
        area="nav"
        bg={navBgColor}
        display={{ base: "none", md: "block" }}
      >
        <Sidebar />
      </GridItem>

      {/* Main Content Section */}
      <GridItem
        area="main"
        position="sticky"
        zIndex="1"
        overflowY="auto"
        pl="2"
        bg={navBgColor}
      >
        {/* Placeholder for Main Content */}
        <MainInstagram />
      </GridItem>
    </Grid>
  );
};

export default HomePage;
