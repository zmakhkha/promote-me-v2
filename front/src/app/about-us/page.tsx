"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainAboutUs from "@/components/other/MainAboutUs";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainAboutUs} />
  );
};

export default HomePage;
