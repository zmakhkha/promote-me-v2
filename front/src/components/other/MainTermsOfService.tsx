"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";
import useColorModeStyles from "@/utils/useColorModeStyles";

const MainTermsOfService = () => {
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
          Terms of Service
        </Heading>

        <Text fontSize="md">
          By accessing or using our self-promotion platform, you agree to be
          bound by these Terms of Service. Please read them carefully before
          using the site.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Eligibility
        </Heading>
        <Text>
          You must be at least 13 years old to use this platform. If you are
          under 18, you must have parental or guardian consent.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          User Conduct
        </Heading>
        <Text>
          You agree not to use the platform to:
          <br />
          - Post or share inappropriate content
          <br />
          - Harass, spam, or impersonate other users
          <br />
          - Engage in unlawful or fraudulent activities
          <br />- Violate any applicable local, national, or international laws
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Account Responsibilities
        </Heading>
        <Text>
          You are responsible for safeguarding your login credentials. You agree
          to notify us immediately of any unauthorized use of your account.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Content Ownership
        </Heading>
        <Text>
          Users retain ownership of their content but grant us a license to use,
          display, and distribute it on the platform for the purposes of
          providing our services and promoting user interactions.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Ad Integration and Monetization
        </Heading>
        <Text>
          Our platform may display advertisements from third-party partners.
          Your use of the platform implies consent to ad personalization and
          performance tracking in compliance with policies set by ad networks
          such as Google Ads.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Termination
        </Heading>
        <Text>
          We reserve the right to suspend or terminate accounts that violate
          these terms or pose a threat to the safety and integrity of the
          community.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Changes to Terms
        </Heading>
        <Text>
          We may update these Terms of Service at any time. Continued use of the
          platform signifies your acceptance of the updated terms.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Contact
        </Heading>
        <Text>
          For questions or concerns regarding these terms, please contact our
          support team.
        </Text>

        <Text fontSize="sm" color="gray.500">
          Last updated: April 2025
        </Text>
      </VStack>
    </Box>
  );
};

export default MainTermsOfService;
