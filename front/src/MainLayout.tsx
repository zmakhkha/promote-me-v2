// MainLayout.tsx
"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import Header from "@/components/Header";
import { useRouter } from "next/navigation";
import socketConnect from "@/services/axios/socketConnect";
import { checkAuthTokens } from "@/services/axios/CheckAuthAndConnect";

interface MainLayoutProps {
  MainComponent: React.ComponentType;
}

const HEADER_H = 60; // px

const MainLayout = ({ MainComponent }: MainLayoutProps) => {
  const { bg, textColor, navBgColor } = useColorModeStyles();
  const router = useRouter();

  React.useEffect(() => {
    const isAuthenticated = checkAuthTokens();
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    socketConnect("1");
  }, [router]);

  return (
    <Grid
      templateAreas={{
        base: `"header" "main"`,
        md: `"header header" "nav main"`,
      }}
      gridTemplateRows={{ base: `${HEADER_H}px 1fr`, md: `${HEADER_H}px 1fr` }}
      gridTemplateColumns={{ base: "1fr", md: "60px 1fr" }}
      height="100dvh"                // <- exact viewport height, mobile-safe
      overflow="hidden"              // <- kill page scrollbars
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
        overflow="hidden"
      >
        <Sidebar />
      </GridItem>

      <GridItem
        area="main"
        bg={navBgColor}
        overflow="hidden"           // <- prevent vertical/horizontal scroll here
        p={0}
      >
        <MainComponent />
      </GridItem>
    </Grid>
  );
};

export default MainLayout;
