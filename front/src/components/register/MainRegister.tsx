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

const MainRegister = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    confirmationCode: "",
    firstName: "",
    lastName: "",
    dateOfBirth: "",
    gender: "",
    lookingFor: "",
    interests: [],
    photo: null,
  });
  const [isClient, setIsClient] = useState(false);
  const { bg, textColor, hoverColor, borderColor } = useColorModeStyles();
  const toast = useToast();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const steps = [
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
      title: "Enter the confirmation code",
      description: "Check your email for the code we sent you.",
      key: "confirmationCode",
      component: (
        <Input
          placeholder="Enter confirmation code"
          type="text"
          value={formData.confirmationCode}
          onChange={(e) => updateFormData("confirmationCode", e.target.value)}
        />
      ),
    },
    {
      title: "What's your first name?",
      description: "Let us know how to address you.",
      key: "firstName",
      component: (
        <Input
          placeholder="Enter your first name"
          type="text"
          value={formData.firstName}
          onChange={(e) => updateFormData("firstName", e.target.value)}
        />
      ),
    },
    {
      title: "What's your last name?",
      description: "Share your family name.",
      key: "lastName",
      component: (
        <Input
          placeholder="Enter your last name"
          type="text"
          value={formData.lastName}
          onChange={(e) => updateFormData("lastName", e.target.value)}
        />
      ),
    },
    {
      title: "Enter your date of birth",
      description: "We need this to verify your age.",
      key: "dateOfBirth",
      component: (
        <Input
          placeholder="DD/MM/YYYY"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
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
      title: "What are you looking for?",
      description: "Select one option that best describes your intent.",
      key: "lookingFor",
      component: (
        <RadioGroup
          value={formData.lookingFor}
          onChange={(value) => updateFormData("lookingFor", value)}
        >
          <Stack spacing={4}>
            <Radio value="marriage">Get Married</Radio>
            <Radio value="relationship">Find a Relationship</Radio>
            <Radio value="friends">Chat and Meet Friends</Radio>
            <Radio value="culture">Know Other Cultures</Radio>
          </Stack>
        </RadioGroup>
      ),
    },
    {
      title: "Select your interests",
      description: "Choose the interests that define you most.",
      key: "interests",
      component: (
        <CheckboxGroup
          value={formData.interests}
          onChange={(value) => updateFormData("interests", value)}
        >
          <Text fontWeight="bold">Hobbies</Text>
          <Stack spacing={2} mb={4}>
            <Checkbox value="poetry">Poetry</Checkbox>
            <Checkbox value="prose">Prose</Checkbox>
            <Checkbox value="makeup">Makeup</Checkbox>
          </Stack>
          <Text fontWeight="bold">Sports</Text>
          <Stack spacing={2}>
            <Checkbox value="climbing">Climbing</Checkbox>
            <Checkbox value="badminton">Badminton</Checkbox>
          </Stack>
        </CheckboxGroup>
      ),
    },
    {
      title: "Add your first photo",
      description: "Upload a profile picture to represent yourself.",
      key: "photo",
      component: (
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => updateFormData("photo", e.target.files?.[0])}
        />
      ),
    },
  ];

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleNext = () => {
    if (step === steps.length) {
      toast({
        title: "Account Created Successfully",
        description: "Redirecting to home page...",
        status: "success",
        duration: 3000,
      });
      router.push("/home");
      return;
    }
    setStep((prev) => prev + 1);
  };

  const currentStep = steps[step - 1];

  return (
    <Flex justify="center" align="center" py={5} px={5} height="100vh">
      <Box bg={bg} color={textColor} p={8} borderRadius="md" shadow="md">
        <Text fontSize="2xl" fontWeight="bold">{currentStep.title}</Text>
        <Text mt={2} mb={6}>{currentStep.description}</Text>
        <Box mb={6}>{currentStep.component}</Box>
        <Button colorScheme="blue" onClick={handleNext}>{step === steps.length ? "Finish" : "Next"}</Button>
      </Box>
    </Flex>
  );
};

export default MainRegister;
