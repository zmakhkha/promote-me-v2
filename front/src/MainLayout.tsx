"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import Header from "@/common/Header";
import { useRouter } from "next/navigation";
import socketConnect from "@/services/axios/socketConnect";
import { checkAuthTokens } from "@/services/axios/CheckAuthAndConnect";

// Corrected typing for MainComponent prop
interface MainLayoutProps {
  MainComponent: React.ComponentType;
}

const MainLayout = ({ MainComponent }: MainLayoutProps) => {
  const { bg, textColor, navBgColor } = useColorModeStyles();
  const router = useRouter();

  React.useEffect(() => {
    const isAuthenticated = checkAuthTokens();
    console.log("isAuthenticated:", isAuthenticated);
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
      <GridItem area="header" position="sticky" top="0" zIndex="2" bg={bg}>
        <Header />
      </GridItem>

      <GridItem
        area="nav"
        bg={navBgColor}
        display={{ base: "none", md: "block" }}
      >
        <Sidebar />
      </GridItem>

      <GridItem
        area="main"
        position="sticky"
        zIndex="1"
        overflowY="auto"
        pl="2"
        bg={navBgColor}
      >
        <MainComponent /> {/* Render the MainComponent here */}
      </GridItem>
    </Grid>
  );
};

export default MainLayout;
