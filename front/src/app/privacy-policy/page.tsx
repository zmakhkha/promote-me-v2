"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainPrivacyPolicy from "@/components/other/MainPrivacyPolicy";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainPrivacyPolicy} />
  );
};

export default HomePage;
