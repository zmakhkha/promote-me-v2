"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MainTermsOfService from "@/components/other/MainTermsOfService";

const HomePage = () => {

  return (
    <MainLayout MainComponent={MainTermsOfService} />
  );
};

export default HomePage;
