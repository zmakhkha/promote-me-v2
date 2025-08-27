"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainSwipeableCardsPage from "./MainSwipeableCardsPage";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainSwipeableCardsPage} />
  );
};

export default HomePage;
