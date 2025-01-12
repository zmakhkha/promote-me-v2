"use client";

import { useRouter } from "next/navigation";
import { Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import MainProfile from "@/components/profile/MainProfile";
import Header from "@/common/Header";
import { checkAuthTokens } from "@/services/axios/checkAuthTokens";
import socketConnect from "@/services/axios/socketConnect";

const HomePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<string | null>(null);
  const { bg, textColor, navBgColor } = useColorModeStyles();

  useEffect(() => {
    // Check for 'user' query parameter using URLSearchParams
    const isAuthenticated = checkAuthTokens();
    if (!isAuthenticated) {
      router.push("/login");
    }
    socketConnect("1");

    const queryUser = new URLSearchParams(window.location.search).get("user");
    if (queryUser) {
      setUser(queryUser);
    }
  }, [router]);

  if (!user) {
    return <div>Loading...</div>; // You can show a loading state or error message
  }

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
        {/* Pass the user query parameter to MainProfile as a prop */}
        <MainProfile username={user} />
      </GridItem>
    </Grid>
  );
};

export default HomePage;
