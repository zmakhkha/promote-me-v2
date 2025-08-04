"use client";

import React, { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NonAuthHeader from "@/common/NonAuthHeader"; // Keep your custom header
import MainRegister from "@/components/auth/MainRegister";

const Page = () => {

  useEffect(() => {
    localStorage.clear();
  }, );

  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr" }} // header + main content
      gridTemplateColumns={{ base: "1fr" }} // Single column for mobile view
      height="100vh"
      gap="0.5"
      color="gray.800"
      fontWeight="bold"
    >
      <GridItem area="header" position="sticky" top="0" zIndex="2">
        <NonAuthHeader />
      </GridItem>

      <GridItem area="main" bg="white" overflow="auto">
        <MainRegister />
      </GridItem>
    </Grid>
  );
};

export default Page;
