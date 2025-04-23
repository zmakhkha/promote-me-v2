"use client";

import { Box, Heading, Text, VStack } from "@chakra-ui/react";
import React from "react";
import useColorModeStyles from "@/utils/useColorModeStyles";

const MainPrivacyPolicy = () => {
  const { bg, textColor, borderColor, primaryColor, secondaryColor } = useColorModeStyles();

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
          Privacy Policy
        </Heading>

        <Text fontSize="md">
          Welcome to our self-promotion platform. Your privacy is very important
          to us. This Privacy Policy outlines the types of information we
          collect, how it is used, and how we safeguard your data, in accordance
          with best practices and advertising compliance.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Information We Collect
        </Heading>
        <Text>
          We collect information you provide directly (such as profile data,
          social links, and messages), and information collected automatically
          (such as browser type, device, IP address, usage statistics, and
          cookies).
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          How We Use Your Data
        </Heading>
        <Text>
          We use your data to:
          <br />
          - Deliver and improve our services.
          <br />
          - Provide personalized recommendations and interactions.
          <br />
          - Show relevant advertisements through mediation partners like Google
          Ads.
          <br />- Monitor and prevent fraudulent or abusive behavior.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Use of Cookies
        </Heading>
        <Text>
          Our platform may use cookies and similar technologies to enhance user
          experience, remember user preferences, and analyze site performance.
          By using our site, you consent to our cookie practices.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Third-Party Services
        </Heading>
        <Text>
          We may share data with trusted third-party platforms such as:
          <br />
          - Google Analytics for traffic insights
          <br />
          - Google Ads or other ad partners for monetization
          <br />- WebSocket providers for real-time chat functionality
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Your Privacy Choices
        </Heading>
        <Text>
          You can manage cookie preferences, request data deletion, or limit
          personalization through your account settings or by contacting us
          directly.
        </Text>

        <Heading as="h2" fontSize="xl" color={secondaryColor}>
          Contact Us
        </Heading>
        <Text>
          If you have any questions about this Privacy Policy, please reach out
          to us via the contact page.
        </Text>

        <Text fontSize="sm" color="gray.500">
          Last updated: April 2025
        </Text>
      </VStack>
    </Box>
  );
};

export default MainPrivacyPolicy;
