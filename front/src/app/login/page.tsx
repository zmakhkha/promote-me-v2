"use client";

import React, { useEffect } from "react";
import { Grid, GridItem } from "@chakra-ui/react";
import NonAuthHeader from "@/common/NonAuthHeader"; // Keep your custom header
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
      gridTemplateRows={{ base: "auto 1fr" }} // header + main content
      gridTemplateColumns={{ base: "1fr" }} // Single column for mobile view
      height="100vh"
      gap="0.5"
      color="gray.800"
      fontWeight="bold"
    >
      {/* Header Section */}
      <GridItem area="header" position="sticky" top="0" zIndex="2">
        {/* Header will stay on top */}
        <NonAuthHeader />
      </GridItem>

      {/* Main Content Section */}
      <GridItem area="main" bg="white" overflow="auto">
        {/* Main content goes here */}
        <MainLogin /> {/* Assuming this is your main form/step component */}
      </GridItem>
    </Grid>
  );
};

export default Page;
