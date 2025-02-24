"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import Sidebar from "@/common/NonAuthSidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import OmegleChatScreen from "@/components/chat/OmegleChatScreen";
import NonAuthHeader from "@/common/NonAuthHeader";

const HomePage = () => {
  const { bg, textColor, navBgColor } = useColorModeStyles();

  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
        md: `"nav header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr", md: "60px 1fr" }} // Header is 60px tall
      gridTemplateColumns={{ base: "1fr", md: "200px 1fr" }} // Sidebar 250px, main takes the rest
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      {/* Sidebar - Full Height */}
      <GridItem
        area="nav"
        bg={navBgColor}
        display={{ base: "none", md: "block" }}
        zIndex="3"
        height="100vh"
        position="sticky"
        top="0"
      >
        <Sidebar />
      </GridItem>

      {/* Header - Starts After Sidebar */}
      <GridItem
        area="header"
        position="sticky"
        top="0"
        zIndex="2"
        bg={bg}
        width="100%"
      >
        <NonAuthHeader />
      </GridItem>

      {/* Main Content */}
      <GridItem area="main" overflowY="auto" pl="2" bg={navBgColor}>
        <OmegleChatScreen />
      </GridItem>
    </Grid>
  );
};

export default HomePage;
