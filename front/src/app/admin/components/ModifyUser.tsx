"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Select,
  useToast,
  Textarea,
  Image,
} from "@chakra-ui/react";
import useColorModeStyles from "@/utils/useColorModeStyles";
import "@/css/styles.css";
import api from "@/services/axios/api";
  
type Props = {
  user: string;
};

const ModifyUser = ({ user }: Props) => {
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [refreshData, setRefreshData] = useState(false);
  

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
  const toast = useToast();
  const { bg, textColor, hoverColor, bgColor } = useColorModeStyles();
  const [formData, setFormData] = useState({
    username: user,
    first_name: "",
    last_name: "",
    age: "",
    gender: "",
    location: "",
    bio: "",
    interests: "",
    status: "",
    image_url: "",
    snapchat: "",
    instagram: "",
    tiktok: "",
    points: "",
    likes: "",
    views: "",
  });

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get(`/api/v1/modify-user/?username=${user}`);
        if (response.status === 200) {
          setFormData({
            ...formData,
            ...response.data, // Populate form fields with user data
          });
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
        toast({
          title: "Error",
          description: "Failed to fetch user data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchUserData();
    setRefreshData(false);
  }, [user, toast, refreshData]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
        const response = await api.put("/api/v1/modify-user/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        console.log("-----------------------------------------");
        console.log("Response Status:", response.status);
        console.log("Response Data:", response.data);
        console.log("-----------------------------------------");

        if (response.status === 200) {
            toast({
                title: "Success!",
                description: "Les données utilisateur ont été mises à jour avec succès.",
                status: "success",
                duration: 5000,
                isClosable: true,
            });
        }
        setRefreshData(true);
    } catch (error: any) {
        console.error("Error updating user data:", error);

        // Log more details about the error response
        if (error.response) {
            console.log("-----------------------------------------");
            console.log("Error Status:", error.response.status);
            console.log("Error Data:", error.response.data);
            console.log("Error Headers:", error.response.headers);
            console.log("-----------------------------------------");
        } else if (error.request) {
            console.log("No response received. Request details:", error.request);
        } else {
            console.log("Request setup error:", error.message);
        }

        toast({
            title: "Error",
            description: "Failed to update user data. Please try again.",
            status: "error",
            duration: 5000,
            isClosable: true,
        });
    }
};


  return (
    <div className="container">
      <Box className="header" bg={bg} p={4} mb={4} borderRadius="md" boxShadow="sm">
        <Text fontSize="2xl" fontWeight="bold" color={textColor}>
          Modifier les données de {user}
        </Text>
      </Box>
      <Box bg={bg} p={5} className="wide admin-register">
        <form onSubmit={handleSubmit}>
          <VStack spacing={4}>
            <FormControl id="username" isReadOnly>
              <FormLabel>Nom d'utilisateur</FormLabel>
              <Input type="text" name="username" value={formData.username} isReadOnly />
            </FormControl>

            <FormControl id="first_name" isRequired>
              <FormLabel>Prénom</FormLabel>
              <Input type="text" name="first_name" value={formData.first_name} onChange={handleChange} />
            </FormControl>

            <FormControl id="last_name" isRequired>
              <FormLabel>Nom</FormLabel>
              <Input type="text" name="last_name" value={formData.last_name} onChange={handleChange} />
            </FormControl>

            <FormControl id="age">
              <FormLabel>Âge</FormLabel>
              <Input type="number" name="age" value={formData.age} onChange={handleChange} />
            </FormControl>

            <FormControl id="gender">
              <FormLabel>Genre</FormLabel>
              <Select name="gender" value={formData.gender} onChange={handleChange}>
                <option value="male">Homme</option>
                <option value="female">Femme</option>
              </Select>
            </FormControl>

            <FormControl id="location">
              <FormLabel>Localisation</FormLabel>
              <Input type="text" name="location" value={formData.location} onChange={handleChange} />
            </FormControl>

            <FormControl id="bio">
              <FormLabel>Bio</FormLabel>
              <Textarea name="bio" value={formData.bio} onChange={handleChange} />
            </FormControl>

            {/* <FormControl>
              <FormLabel>Previous Profile Picture</FormLabel>
              {formData.image_url && typeof formData.image_url === 'string' && (
                <Image 
                  src={formData.image_url.startsWith("/") ? `http://localhost:2000${formData.image_url}` : formData.image_url} 
                  alt="Profile" 
                  boxSize="100px" 
                  borderRadius="full" 
                />
              )}
            </FormControl>



            <FormControl>
              <FormLabel>Profile Picture</FormLabel>
              <Input type="file" accept="image/*" onChange={handleImageChange} />
            </FormControl> */}

            <FormControl id="snapchat">
              <FormLabel>Snapchat</FormLabel>
              <Input type="text" name="snapchat" value={formData.snapchat} onChange={handleChange} />
            </FormControl>

            <FormControl id="instagram">
              <FormLabel>Instagram</FormLabel>
              <Input type="text" name="instagram" value={formData.instagram} onChange={handleChange} />
            </FormControl>

            <FormControl id="tiktok">
              <FormLabel>TikTok</FormLabel>
              <Input type="text" name="tiktok" value={formData.tiktok} onChange={handleChange} />
            </FormControl>

            <Button type="submit" bg={bgColor} color="white" _hover={{ bg: hoverColor }} width="100%">
              Mettre à jour
            </Button>
          </VStack>
        </form>
      </Box>
    </div>
  );
};

export default ModifyUser;
