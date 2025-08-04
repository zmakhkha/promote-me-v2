"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainSettings from "@/components/mainpages/MainSettings";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainSettings} />
  );
};

export default HomePage;
