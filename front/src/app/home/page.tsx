"use client";

import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import MainInstagram from "@/components/instagram/mainInstagram";
import Header from "@/common/Header";
import MainHome from "@/components/home/MainHome";

const HomePage = () => {
  const { bg, textColor, navBgColor } = useColorModeStyles();

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
        <Header/>
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
        <MainHome/>
      </GridItem>
    </Grid>
  );
};

export default HomePage;
