"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import { checkAuthTokens } from "@/services/axios/checkAuthTokens";
import socketConnect from "@/services/axios/socketConnect";
import { useRouter } from "next/navigation";

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
        <h1>Header</h1>
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
      <GridItem area="main" pl="2" bg={navBgColor}>
        {/* Placeholder for Main Content */}
        <h2>Main Content Area</h2>
      </GridItem>
    </Grid>
  );
};

export default HomePage;
