"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainDiscoverPage from "@/components/mainpages/MainDiscoverPage";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainDiscoverPage} />
  );
};

export default HomePage;
