"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainChat from "@/components/mainpages/MainChat";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainChat} />
  );
};

export default HomePage;


