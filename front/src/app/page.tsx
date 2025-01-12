"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import Header from "@/common/Header";
import MainHome from "@/components/home/MainHome";
import { useRouter } from "next/navigation";
import { checkAuthTokens } from "@/services/axios/checkAuthTokens";
import BottomBar from "@/common/BottomBar"; // Import the BottomBar component
import { connectWebSocket } from "@/services/axios/websocketService";
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
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      {/* Header Section */}
      <GridItem area="header" bg={bg} p={4}>
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
      <GridItem area="main" pl="2" bg={navBgColor}>
        <MainHome />
      </GridItem>

      {/* Bottom Bar Section - Only visible on small screens */}
      <GridItem
        area="bottom"
        bg={navBgColor}
        display={{ base: "block", md: "none" }} // Shows bottom bar on small screens only
        position="absolute"
        bottom="0"
        left="0"
        width="100%" // Ensures the BottomBar stretches across the entire width
      >
        <BottomBar /> {/* Your custom BottomBar with 5 icons */}
      </GridItem>
    </Grid>
  );
};

export default Page;
