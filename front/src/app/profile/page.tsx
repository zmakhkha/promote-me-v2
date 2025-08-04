"use client";

import React from "react";
import MainLayout from "@/MainLayout";
import MyProfile from "@/components/mainpages/MyProfile";
const HomePage = () => {

  return (
    <MainLayout MainComponent={MyProfile} />
  );
};

export default HomePage;
