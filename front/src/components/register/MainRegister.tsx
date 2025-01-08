"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Checkbox,
  CheckboxGroup,
  useToast,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useColorModeStyles from "@/utils/useColorModeStyles";
import axios from "../../services/axios";

const MainRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    location: "",
    bio: "",
    interests: [],
    instagram: "",
    snapchat: "",
    tiktok: "",
  });

  const [isClient, setIsClient] = useState(false);
  const { bg, textColor, hoverColor, borderColor } = useColorModeStyles();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = async () => {
    if (step === steps.length) {
      try {
        const response = await axios.post("/api/v1/register/", formData);
        console.log("✅ Registration successful:", response.data);

        toast({
          title: "Account Created Successfully",
          description: "Redirecting to home page...",
          status: "success",
          duration: 3000,
        });
        router.push("/");
      } catch (error: any) {
        if (error.response) {
          console.error("❌ Backend Error Response:", error.response.data);
          toast({
            title: "Registration Failed",
            description:
              error.response.data?.email ||
              error.response.data?.username ||
              error.response.data?.instagram ||
              error.response.data?.snapchat ||
              error.response.data?.tiktok ||
              "An error occurred.",
            status: "error",
            duration: 5000,
          });
        } else {
          console.error("❌ Network Error or No Response:", error.message);
          toast({
            title: "Network Error",
            description: "Failed to connect to the server.",
            status: "error",
            duration: 5000,
          });
        }
      }
      return;
    }
    setStep((prev) => prev + 1);
  };

  const steps = [
    {
      title: "Choose a Username",
      description: "This will be your unique identifier.",
      key: "username",
      component: (
        <Input
          placeholder="Enter your username"
          value={formData.username}
          onChange={(e) => updateFormData("username", e.target.value)}
        />
      ),
    },
    {
      title: "What's your email?",
      description: "To create or login to your account",
      key: "email",
      component: (
        <Input
          placeholder="Enter your email"
          type="email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
        />
      ),
    },
    {
      title: "Choose a Password",
      description: "Make sure it's strong and secure.",
      key: "password",
      component: (
        <Input
          placeholder="Enter your password"
          type="password"
          value={formData.password}
          onChange={(e) => updateFormData("password", e.target.value)}
        />
      ),
    },
    {
      title: "What's your first name?",
      description: "Let us know how to address you.",
      key: "first_name",
      component: (
        <Input
          placeholder="Enter your first name"
          value={formData.first_name}
          onChange={(e) => updateFormData("first_name", e.target.value)}
        />
      ),
    },
    {
      title: "What's your last name?",
      description: "Share your family name.",
      key: "last_name",
      component: (
        <Input
          placeholder="Enter your last name"
          value={formData.last_name}
          onChange={(e) => updateFormData("last_name", e.target.value)}
        />
      ),
    },
    {
      title: "Enter your date of birth",
      description: "We need this to verify your age.",
      key: "birth_date",
      component: (
        <Input
          placeholder="YYYY-MM-DD"
          type="date"
          value={formData.birth_date}
          onChange={(e) => updateFormData("birth_date", e.target.value)}
        />
      ),
    },
    {
      title: "What's your gender?",
      description: "Please select your gender.",
      key: "gender",
      component: (
        <RadioGroup
          value={formData.gender}
          onChange={(value) => updateFormData("gender", value)}
        >
          <Stack spacing={4} direction="row">
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="nonbinary">Non-Binary</Radio>
          </Stack>
        </RadioGroup>
      ),
    },
    {
      title: "Where are you located?",
      description: "Provide your current city and country.",
      key: "location",
      component: (
        <Input
          placeholder="Enter your location"
          value={formData.location}
          onChange={(e) => updateFormData("location", e.target.value)}
        />
      ),
    },
    {
      title: "Write a short bio",
      description: "Tell us a bit about yourself.",
      key: "bio",
      component: (
        <Input
          placeholder="Write something about you"
          value={formData.bio}
          onChange={(e) => updateFormData("bio", e.target.value)}
        />
      ),
    },
    {
      title: "Share your Instagram handle",
      description: "Let others connect with you on Instagram.",
      key: "instagram",
      component: (
        <Input
          placeholder="Enter your Instagram username"
          value={formData.instagram}
          onChange={(e) => updateFormData("instagram", e.target.value)}
        />
      ),
    },
    {
      title: "Share your Snapchat handle",
      description: "Let others connect with you on Snapchat.",
      key: "snapchat",
      component: (
        <Input
          placeholder="Enter your Snapchat username"
          value={formData.snapchat}
          onChange={(e) => updateFormData("snapchat", e.target.value)}
        />
      ),
    },
    {
      title: "Share your TikTok handle",
      description: "Let others connect with you on TikTok.",
      key: "tiktok",
      component: (
        <Input
          placeholder="Enter your TikTok username"
          value={formData.tiktok}
          onChange={(e) => updateFormData("tiktok", e.target.value)}
        />
      ),
    },
  ];

  const currentStep = steps[step - 1];

  return (
    <Flex justify="center" align="center" py={5} px={5} height="100vh">
      <Box bg={bg} color={textColor} p={8} borderRadius="md" shadow="md">
        <Text fontSize="2xl" fontWeight="bold">
          {currentStep.title}
        </Text>
        <Text mt={2} mb={6}>
          {currentStep.description}
        </Text>
        <Box mb={6}>{currentStep.component}</Box>
        <Button colorScheme="blue" onClick={handleNext}>
          {step === steps.length ? "Finish" : "Next"}
        </Button>
      </Box>
    </Flex>
  );
};

export default MainRegister;
