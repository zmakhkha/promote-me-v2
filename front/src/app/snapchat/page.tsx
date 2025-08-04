"use client";

import React from "react";
import MainSnapchat from "@/components/mainpages/mainSnapchat";  // Import MainSnapchat
import MainLayout from "@/MainLayout";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainSnapchat} />
  );
};

export default HomePage;
