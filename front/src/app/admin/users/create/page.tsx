"use client";
import Header from "@/common/Header";
import Sidebar from "@/common/Sidebar";
import useColorModeStyles from "@/utils/useColorModeStyles";
import { Grid, GridItem } from "@chakra-ui/react";
import React from "react";
import CreateUser from "../../components/CreateUser";

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
        <Header />
      </GridItem>
      <GridItem
        bg={navBgColor}
        area={"nav"}
        display={{ base: "none", md: "block" }}
      >
        <Sidebar />
      </GridItem>
      <GridItem
        pl="2"
        bg={navBgColor}
        area={"main"}
        overflowY="auto"
        height="100%"
      >
        {/* <CreateUser /> */}
        <CreateUser />
      </GridItem>
    </Grid>
  );
};

export default Page;
