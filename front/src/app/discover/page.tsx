"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import { DiscoverProfileCard } from "@/components/mainpages/DiscoverProfileCard";

const HomePage = () => {

  return (
    <MainLayout MainComponent={DiscoverProfileCard} />
  );
};

export default HomePage;
