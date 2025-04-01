"use client";
import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import ListeUsers from "../../components/ListeUsers";
import Sidebar from "@/common/Sidebar";
import Header from "@/common/Header";
import useColorModeStyles from "@/utils/useColorModeStyles";


const Page = () => {
  const { textColor, navBgColor } = useColorModeStyles();

  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
        md: `"header header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr", md: "50px 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: "200px 1fr" }}
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      <GridItem area={"header"} bg={navBgColor}>
                {/* <Header /> */}
                <h1>Header</h1>
      </GridItem>
      <GridItem
        bg={navBgColor}
        area={"nav"}
        display={{ base: "none", md: "block" }}
      >
        {/* <Sidebar /> */}
        <h1>Sidebar</h1>
      </GridItem>
      <GridItem
        pl="2"
        bg={navBgColor}
        area={"main"}
        overflowY="auto"
        height="100%"
      >
        <ListeUsers />
      </GridItem>
    </Grid>
  );
};

export default Page;
