"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainTiktok from "@/components/mainpages/MainTiktok";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainTiktok} />
  );
};

export default HomePage;
