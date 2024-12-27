"use client";

import React, { useState, useEffect } from "react";
import { Grid, GridItem, Center } from "@chakra-ui/react";
import Sidebar from "@/common/Sidebar";
// import UserCard from "@/components/UserCard";
import homeUsers from "@/data/homeUsers";
import useColorModeStyles from "@/utils/useColorModeStyles";

const HomePage = () => {
  const { textColor, navBgColor } = useColorModeStyles();

  const [users, setUsers] = useState(homeUsers);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [animation, setAnimation] = useState<object | null>(null);

  const currentUser = users[currentIndex];

  const handleNextUser = () => {
    setCurrentIndex((prev) => (prev + 1) % users.length);
    setAnimation({ opacity: 0, x: 100 });
    setTimeout(() => {
      setAnimation({ opacity: 1, x: 0 });
    }, 200);
  };

  const handleCancel = () => {
    console.log("Chat canceled");
    setAnimation({ opacity: 0, x: -200 });
    setTimeout(() => {
      handleNextUser();
    }, 300);
  };

  const handleLike = () => {
    console.log("User liked!");
    setAnimation({ opacity: 0, x: 200 });
    setTimeout(() => {
      handleNextUser();
    }, 300);
  };

  useEffect(() => {
    if (!currentUser) setCurrentIndex(0);
  }, [currentIndex, users]);

  return (
    <Grid
      templateAreas={{
        base: `"header"
               "main"`,
        md: `"header header"
             "nav main"`,
      }}
      gridTemplateRows={{ base: "auto 1fr", md: "50px 1fr" }}
      gridTemplateColumns={{ base: "1fr", md: "50px 1fr" }}
      height="100vh"
      gap="0.5"
      color={textColor}
      fontWeight="bold"
    >
      {/* Header */}
      <GridItem area="header" bg={navBgColor} p={4}>
        <h1>Header</h1>
      </GridItem>

      {/* Sidebar */}
      <GridItem
        area="nav"
        bg={navBgColor}
        display={{ base: "none", md: "block" }}
      >
        <Sidebar />
      </GridItem>

      {/* Main Content */}
      {/* <GridItem area="main" pl="2" bg={navBgColor}>
        <Center height="100%">
          {currentUser ? (
            <UserCard
              username={currentUser.username}
              description={currentUser.description}
              tags={currentUser.tags}
              imageUrl={currentUser.imageUrl}
              isConnected={currentUser.isConnected}
              onCancel={handleCancel}
              onLike={handleLike}
              animation={animation}
            />
          ) : (
            <p>No more users!</p>
          )}
        </Center>
      </GridItem> */}
    </Grid>
  );
};

export default HomePage;
