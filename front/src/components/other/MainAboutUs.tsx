"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";
import useColorModeStyles from "@/utils/useColorModeStyles";

const MainAboutUs = () => {
  const { bg, textColor, borderColor, primaryColor, secondaryColor } =
    useColorModeStyles();

  return (
    <Box
      bg={bg}
      color={textColor}
      px={{ base: 4, md: 8 }}
      py={8}
      maxW="4xl"
      mx="auto"
      border="1px solid"
      borderColor={borderColor}
      borderRadius="2xl"
      mt={6}
      mb={12}
    >
      <VStack align="start" spacing={6}>
        <Heading as="h1" fontSize="3xl" color={primaryColor}>
          About Us
        </Heading>

        <Text fontSize="md">
          Welcome to our self-promotion platform — a place built to empower
          individuals to showcase their talents, connect with like-minded
          people, and grow their personal brands online.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Our Mission
        </Heading>
        <Text>
          We believe in creating a space where everyone has the tools and
          exposure to promote themselves authentically. Whether you're an
          aspiring content creator, a passionate hobbyist, or just someone
          wanting to connect, this platform is designed for you.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          What We Offer
        </Heading>
        <Text>
          - A personalized profile to showcase your interests, achievements, and
          social presence.
          <br />
          - A dynamic chat system to meet and engage with others.
          <br />
          - Tools to boost your visibility, track your reach, and grow your
          audience.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Built with Passion
        </Heading>
        <Text>
          This platform is made by a small team of developers and creators who
          understand the importance of meaningful exposure. We're always working
          to improve your experience, add new features, and keep the community
          safe and welcoming.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Let’s Grow Together
        </Heading>
        <Text>
          Our journey is just getting started, and we want you to be a part of
          it. Share your voice, connect with others, and let the world know who
          you are.
        </Text>

        <Text fontSize="sm" color="gray.500">
          Last updated: April 2025
        </Text>
      </VStack>
    </Box>
  );
};

export default MainAboutUs;
