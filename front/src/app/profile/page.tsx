"use client";

import { useRouter } from "next/navigation";
import { Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import MyProfile from "@/components/mainpages/MyProfile";
import Header from "@/common/Header";
import socketConnect from "@/services/axios/socketConnect";
import { checkAuthTokens } from "@/services/axios/CheckAuthAndConnect";

const MePage = () => {
  const router = useRouter();
  const { bg, textColor, navBgColor } = useColorModeStyles();

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
        {/* Pass the user query parameter to MyProfile as a prop */}
        <MyProfile />
      </GridItem>
    </Grid>
  );
};

export default MePage;
