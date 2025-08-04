"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainInstagram from "@/components/mainpages/mainInstagram";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainInstagram} />
  );
};

export default HomePage;
