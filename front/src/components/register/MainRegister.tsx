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
    interests: [] as string[],
    instagram: "",
    snapchat: "",
    tiktok: "",
    image_url: "",
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
    const finalFormData = {
      ...formData,
      interests: JSON.stringify(formData.interests || ["Sport"]), // Ensure interests is sent as JSON
    };

    if (step === steps.length) {
      try {
        console.log("📝 FormData before sending:");
        console.log(finalFormData.interests);

        const response = await axios.post("/api/v1/register/", finalFormData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

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
              error.response.data?.image_url ||
              error.response.data?.interests ||
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

  const handlePrevious = () => {
    if (step > 1) {
      setStep((prev) => prev - 1);
    }
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
      description: "To create or login to your account.",
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
      description: "Your family name.",
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
      description: "Let others know your region.",
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
      description: "Tell us something about yourself.",
      key: "bio",
      component: (
        <Textarea
          placeholder="Write a short bio"
          value={formData.bio}
          onChange={(e) => updateFormData("bio", e.target.value)}
        />
      ),
    },
    {
      title: "What are your interests?",
      description: "Select your hobbies and passions.",
      key: "interests",
      component: (
        <Stack spacing={2}>
          {[
            "Sports",
            "Music",
            "Traveling",
            "Gaming",
            "Reading",
            "Cooking",
            "Photography",
            "Technology",
          ].map((interest) => (
            <Checkbox
              key={interest}
              isChecked={formData.interests.includes(interest)}
              onChange={(e) => {
                const updatedInterests = e.target.checked
                  ? [...formData.interests, interest]
                  : formData.interests.filter((i) => i !== interest);
                updateFormData("interests", updatedInterests);
              }}
            >
              {interest}
            </Checkbox>
          ))}
        </Stack>
      ),
    },

    {
      title: "Social Media Profiles",
      description: "Add your social media links.",
      key: "social_media",
      component: (
        <>
          <Input
            placeholder="Instagram username"
            value={formData.instagram}
            onChange={(e) => updateFormData("instagram", e.target.value)}
          />
          <Input
            placeholder="Snapchat username"
            value={formData.snapchat}
            mt={2}
            onChange={(e) => updateFormData("snapchat", e.target.value)}
          />
          <Input
            placeholder="TikTok username"
            value={formData.tiktok}
            mt={2}
            onChange={(e) => updateFormData("tiktok", e.target.value)}
          />
        </>
      ),
    },
    {
      title: "Upload Your Profile Picture",
      description: "Choose a profile picture to represent you.",
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
    <Flex align="center" justify="center" minH="100vh" bg={bg}>
      <Box
        p={8}
        borderWidth={1}
        borderRadius="lg"
        boxShadow="lg"
        bg={bg}
        color={textColor}
        maxW="lg"
        w="100%"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          {steps[step - 1].title}
        </Text>
        <Text mb={4}>{steps[step - 1].description}</Text>
        <Box mb={4}>{steps[step - 1].component}</Box>
        <Flex mt={4} justify="space-between">
          {step > 1 && (
            <Button onClick={handlePrevious} colorScheme="gray">
              Previous
            </Button>
          )}
          <Button onClick={handleNext} colorScheme="teal">
            {step === steps.length ? "Submit" : "Next"}
          </Button>
        </Flex>
      </Box>
    </Flex>
  );
};

export default MainRegister;
