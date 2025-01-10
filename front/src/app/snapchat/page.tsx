"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import Header from "@/common/Header";
import MainSnapchat from "@/components/snapchat/mainSnapchat";
import { useRouter } from "next/navigation";
import { checkAuthTokens } from "@/services/axios/checkAuthTokens";

const HomePage = () => {
  const { bg, textColor, navBgColor } = useColorModeStyles();
  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkAuthTokens();
    if (!isAuthenticated) {
      router.push("/login");
    }
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
      {/* Header Section */}
      <GridItem area="header" bg={bg} p={4}>
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
      {/* Main Content Section */}
            <GridItem
              area="main"
              position="sticky"
              zIndex="1000"
              overflowY="auto"
              pl="2"
              bg={navBgColor}
            >
        {/* Placeholder for Main Content */}
        <MainSnapchat />
      </GridItem>
    </Grid>
  );
};

export default HomePage;
