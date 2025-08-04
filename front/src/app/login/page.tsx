"use client";

import React, { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NonAuthHeader from "@/common/NonAuthHeader";
import MainLogin from "./MainLogin";

const Page = () => {

  useEffect(() => {
    localStorage.clear();
    }
  );

  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr" }}
      gridTemplateColumns={{ base: "1fr" }}
      height="100vh"
      gap="0.5"
      color="gray.800"
      fontWeight="bold"
    >
      <GridItem area="header" position="sticky" top="0" zIndex="2">
        <NonAuthHeader />
      </GridItem>
      <GridItem area="main" bg="white" overflow="auto">
        <MainLogin />
      </GridItem>
    </Grid>
  );
};

export default Page;
