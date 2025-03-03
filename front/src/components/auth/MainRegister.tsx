"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Textarea,
  useToast,
  Avatar,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useColorModeStyles from "@/utils/useColorModeStyles";
import api from "../../services/axios/api";

const MainRegister = () => {
  const { bg, textColor } = useColorModeStyles();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    username: "zak",
    email: "zak@mail.com",
    password: "MKSzak123",
    first_name: "zak",
    snapchat: "zak",
    instagram: "zak",
    tiktok: "zak",
    last_name: "mks",
    birth_date: "20/10/1999",
    gender: "male",
    location: "khouribga, morocco",
    bio: "morocco",
    interests: [] as string[],
    image_url: Avatar,
  });

  const [isClient, setIsClient] = useState(false);
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
        const response = await api.post("/api/v1/register/", formData);
        toast({
          title: "Account Created Successfully",
          description: "Redirecting to login page...",
          status: "success",
          duration: 3000,
        });
        router.push("/login");
      } catch (error: any) {
        toast({
          title: "Registration Failed",
          description: error.response?.data?.message || "An error occurred.",
          status: "error",
          duration: 5000,
        });
      }
      return;
    }
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const steps = [
    {
      title: "Choose a Username",
      key: "username",
      component: (
        <Input
          placeholder="Username"
          value={formData.username}
          onChange={(e) => updateFormData("username", e.target.value)}
        />
      ),
    },
    {
      title: "Your Email",
      key: "email",
      component: (
        <Input
          type="email"
          placeholder="Email"
          value={formData.email}
          onChange={(e) => updateFormData("email", e.target.value)}
        />
      ),
    },
    {
      title: "Create a Password",
      key: "password",
      component: (
        <Input
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={(e) => updateFormData("password", e.target.value)}
        />
      ),
    },
    {
      title: "First Name",
      key: "first_name",
      component: (
        <Input
          placeholder="First Name"
          value={formData.first_name}
          onChange={(e) => updateFormData("first_name", e.target.value)}
        />
      ),
    },
    {
      title: "Last Name",
      key: "last_name",
      component: (
        <Input
          placeholder="Last Name"
          value={formData.last_name}
          onChange={(e) => updateFormData("last_name", e.target.value)}
        />
      ),
    },
    {
      title: "Date of Birth",
      key: "birth_date",
      component: (
        <Input
          type="date"
          value={formData.birth_date}
          onChange={(e) => updateFormData("birth_date", e.target.value)}
        />
      ),
    },
    {
      title: "Gender",
      key: "gender",
      component: (
        <RadioGroup
          value={formData.gender}
          onChange={(value) => updateFormData("gender", value)}
        >
          <Stack direction="row">
            <Radio value="male">Male</Radio>
            <Radio value="female">Female</Radio>
            <Radio value="other">Other</Radio>
          </Stack>
        </RadioGroup>
      ),
    },
    {
      title: "Location",
      key: "location",
      component: (
        <Input
          placeholder="City, Country"
          value={formData.location}
          onChange={(e) => updateFormData("location", e.target.value)}
        />
      ),
    },
    {
      title: "Snapchat",
      key: "snapchat",
      component: (
        <Input
          placeholder="Snapchat username"
          value={formData.snapchat}
          onChange={(e) => updateFormData("snapchat", e.target.value)}
        />
      ),
    },
    {
      title: "Instagram",
      key: "instagram",
      component: (
        <Input
          placeholder="Instagram username"
          value={formData.instagram}
          onChange={(e) => updateFormData("instagram", e.target.value)}
        />
      ),
    },
    {
      title: "Tiktok",
      key: "tiktok",
      component: (
        <Input
          placeholder="Tiktok username"
          value={formData.tiktok}
          onChange={(e) => updateFormData("tiktok", e.target.value)}
        />
      ),
    },
    {
      title: "Tell Us About Yourself",
      key: "bio",
      component: (
        <Textarea
          placeholder="Short bio"
          value={formData.bio}
          onChange={(e) => updateFormData("bio", e.target.value)}
        />
      ),
    },
    {
      title: "Your Interests",
      key: "interests",
      component: (
        <Stack>
          {["Music", "Sports", "Movies", "Art", "Travel"].map((interest) => (
            <Checkbox
              key={interest}
              isChecked={formData.interests.includes(interest)}
              onChange={(e) =>
                updateFormData(
                  "interests",
                  e.target.checked
                    ? [...formData.interests, interest]
                    : formData.interests.filter((i) => i !== interest)
                )
              }
            >
              {interest}
            </Checkbox>
          ))}
        </Stack>
      ),
    },
    {
      title: "Upload a Profile Picture",
      key: "image_url",
      component: (
        <Input
          type="file"
          accept="image/*"
          onChange={(e) =>
            updateFormData("image_url", e.target.files?.[0] || null)
          }
        />
      ),
    },
  ];

  return (
    <Flex
      align="center"
      justify="center"
      direction="column"
      w="100%"
      minH="100%"
      p={4}
      bg={bg}
    >
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg={bg}
        color={textColor}
        maxW="lg"
        w="100%"
        borderColor="pink.300"
      >
        <Text
          fontSize="2xl"
          fontWeight="bold"
          mb={4}
          textAlign="center"
          color="pink.400"
        >
          {steps[step - 1].title}
        </Text>
        <Box mb={4}>{steps[step - 1].component}</Box>
        <Flex mt={4} justify="space-between">
          {step > 1 && (
            <Button onClick={handlePrevious} colorScheme="gray">
              Previous
            </Button>
          )}
          <Button onClick={handleNext} colorScheme="pink" variant="solid">
            {step === steps.length ? "Submit" : "Next"}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default MainRegister;
