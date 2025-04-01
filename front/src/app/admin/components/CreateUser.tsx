"use client";

import React, { useState, ChangeEvent } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Select,
  Stack,
  Checkbox,
  Radio,
  RadioGroup,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import "@/css/styles.css";
import useColorModeStyles from "@/utils/useColorModeStyles";
import api from "@/services/axios/api";
import countries from "@/data/countries";

const CreateUser = () => {
  const toast = useToast();
  const { bg, textColor } = useColorModeStyles();

  const [formData, setFormData] = useState({
    username: "zakaa",
    first_name: "zakaa",
    last_name: "mksaa",
    email: "zak2@mail.com",
    instagram: "mks_insta",
    snapchat: "mks_snap",
    tiktok: "mks_tiktok",
    password: "MKSzak123",
    birth_date: "1999-10-20",
    gender: "male",
    location: "khouribga, morocco",
    bio: "morocco",
    interests: [] as string[],
    image_url: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("image_url", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach((key) => {
        if (key === "interests") {
          formDataToSend.append("interests", JSON.stringify(formData[key]));
        } else if (key === "image_url" && formData[key]) {
          formDataToSend.append("image_url", formData[key] as File);
        } else {
          formDataToSend.append(key, formData[key] as any);
        }
      });

      const response = await api.post("/api/v1/register/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log("-----------------------------------------");
      console.log(response.status);
      console.log(response);
      console.log("-----------------------------------------");

      if (response.status === 200 || response.status === 201) {
        toast({ title: "User Created Successfully", status: "success", duration: 3000 });
      } else {
        toast({ title: "Registration Failed", status: "error", duration: 5000 });
      }
    } catch (error: any) {
      console.error("Error response:", error.response);
      toast({ title: "Error", description: error.message, status: "error", duration: 5000 });
    }
  };

  return (
    <Box p={8} borderWidth={1} borderRadius="lg" boxShadow="lg" bg={bg} color={textColor}>
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center" color="pink.400">
        Create User
      </Text>
      <VStack spacing={4} align="stretch">
        <FormControl>
          <FormLabel>Username</FormLabel>
          <Input value={formData.username} onChange={(e) => updateFormData("username", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>First Name</FormLabel>
          <Input value={formData.first_name} onChange={(e) => updateFormData("first_name", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input value={formData.last_name} onChange={(e) => updateFormData("last_name", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input value={formData.instagram} onChange={(e) => updateFormData("instagram", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input value={formData.snapchat} onChange={(e) => updateFormData("snapchat", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Last Name</FormLabel>
          <Input value={formData.tiktok} onChange={(e) => updateFormData("tiktok", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Email</FormLabel>
          <Input type="email" value={formData.email} onChange={(e) => updateFormData("email", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input type="password" value={formData.password} onChange={(e) => updateFormData("password", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Gender</FormLabel>
          <RadioGroup value={formData.gender} onChange={(value) => updateFormData("gender", value)}>
            <Stack direction="row">
              <Radio value="male">Male</Radio>
              <Radio value="female">Female</Radio>
              <Radio value="other">Other</Radio>
            </Stack>
          </RadioGroup>
        </FormControl>
        <FormControl>
          <FormLabel>Location</FormLabel>
          <Select value={formData.location} onChange={(e) => updateFormData("location", e.target.value)}>
            {countries.map((country) => (
              <option key={country.name.common} value={country.name.common}>{country.name.common}</option>
            ))}
          </Select>
        </FormControl>
        <FormControl>
          <FormLabel>Bio</FormLabel>
          <Textarea value={formData.bio} onChange={(e) => updateFormData("bio", e.target.value)} />
        </FormControl>
        <FormControl>
          <FormLabel>Profile Picture</FormLabel>
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </FormControl>
        <Button onClick={handleSubmit} colorScheme="pink">Create User</Button>
      </VStack>
    </Box>
  );
};

export default CreateUser;
