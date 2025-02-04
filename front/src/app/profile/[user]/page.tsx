"use client";

import { Flex, Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect } from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import Header from "@/common/Header";
import { checkAuthTokens } from "@/services/axios/checkAuthTokens";
import { useRouter } from "next/navigation";
import socketConnect from "@/services/axios/socketConnect";
import MainProfile from "@/components/profile/MainProfile";
type Props = {
  user: string;
};

const page = ({ params }: { params: Props }) => {
  const { user } = params;
  const { bg, textColor, navBgColor } = useColorModeStyles();

  const router = useRouter();

  useEffect(() => {
    const isAuthenticated = checkAuthTokens();
    if (!isAuthenticated) {
      router.push("/login");
    }
    socketConnect("2");
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
      <GridItem area="header" position="sticky" top="0" zIndex="10" bg={bg}>
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
        zIndex="1000"
        overflowY="auto"
        pl="2"
        bg={navBgColor}
      >
        {/* Pass the user query parameter to MainProfile as a prop */}
        <MainProfile username={user} />
      </GridItem>
    </Grid>
  );
};

export default page;
