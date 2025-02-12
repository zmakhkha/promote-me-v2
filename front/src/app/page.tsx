"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import Header from "@/common/Header";
import MainHome from "@/components/home/MainHome";
import { useRouter } from "next/navigation";
import { checkAuthTokens } from "@/services/axios/checkAuthTokens";
import socketConnect from "@/services/axios/socketConnect";

const Page = () => {
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
      minHeight="100vh" // Changed from height="100vh"
      overflow="hidden" // Prevent any unwanted scroll
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      {/* Header Section */}
      <GridItem area="header" position="sticky" top="0" zIndex="1001" bg={bg}>
        <Header />
      </GridItem>

      {/* Sidebar Section - Only visible on larger screens */}
      <GridItem
        area="nav"
        bg={navBgColor}
        display={{ base: "none", md: "block" }} // Hides sidebar on small screens
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
        <MainHome />
      </GridItem>
    </Grid>
  );
};

export default Page;
