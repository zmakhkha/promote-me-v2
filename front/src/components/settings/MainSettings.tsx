import React, { useEffect, useState } from "react";
import {
  Box,
  Flex,
  Text,
  Avatar,
  Input,
  HStack,
  VStack,
  Textarea,
  Button,
  InputGroup,
  InputLeftElement,
  useToast,
  Icon,
} from "@chakra-ui/react";
import { FaInstagram, FaSnapchatGhost, FaTiktok } from "react-icons/fa";
import placeholderAvatar from "../../data/image/no-avatar.png";
import useColorModeStyles from "../../utils/useColorModeStyles";
import api from "@/services/axios";
import { log } from "node:console";
// import api from "../../utils/api";

interface UserData {
  profile_image: string;
  firstName: string;
  lastName: string;
  email: string;
  location: string;
  age: number;
  bio: string;
  views: number;
  likes: number;
  points: number;
  interests: string[];
  instagram?: string;
  snapchat?: string;
  tiktok?: string;
}

const MainSettings = () => {
  const { bg, tiktok, borderColor, navBgColor } = useColorModeStyles();
  const toast = useToast();

  const [userData, setUserData] = useState<UserData>({
    profile_image: placeholderAvatar.src,
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    age: 0,
    bio: "",
    views: 0,
    likes: 0,
    points: 0,
    interests: [],
    instagram: "",
    snapchat: "",
    tiktok: "",
  });

  const [imagePreview, setImagePreview] = useState<string>(
    placeholderAvatar.src
  );

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/v1/settings/");
        setUserData(response.data);
        console.log(response.data);
        
        setImagePreview(response.data.profile_image || placeholderAvatar.src);
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setUserData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
        setUserData((prev) => ({
          ...prev,
          profile_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    try {
      await api.put("/api/v1/settings/", userData);
      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast({
        title: "Update Failed",
        description: "An error occurred while updating your profile.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Flex justify="center" align="center" py={5} px={5}>
      <Box
        maxW="lg"
        w="full"
        bg={bg}
        borderRadius="lg"
        p={8}
        boxShadow="lg"
        borderColor={borderColor}
        borderWidth="1px"
      >
        <Text textAlign="center" fontSize="2xl" fontWeight="bold" mb={6}>
          Settings
        </Text>
        {/* Avatar Upload */}
        <Flex justify="center" align="center" direction="column" mb={4} w="full">
          <Avatar size="2xl" mb={1} src={imagePreview} />
          <Box textAlign="center">
            <Button
              as="label"
              htmlFor="file-upload"
              colorScheme="teal"
              cursor="pointer"
              mt={2}
            >
              Choose File
            </Button>
            <Input
              id="file-upload"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
            />
          </Box>
        </Flex>

        {/* Personal Information */}
        <VStack spacing={4} align="start">
          <HStack>
            <Input
              placeholder="First Name"
              name="firstName"
              value={userData.firstName}
              onChange={handleInputChange}
            />
            <Input
              placeholder="Last Name"
              name="lastName"
              value={userData.lastName}
              onChange={handleInputChange}
            />
          </HStack>
          <Textarea
            placeholder="Bio"
            name="bio"
            value={userData.bio}
            onChange={handleInputChange}
          />
        </VStack>

        {/* Social Media Links */}
        <Text mt={6} fontSize="lg" fontWeight="bold" mb={2}>
          Social Media Links
        </Text>
        <VStack spacing={3} align="start" w="full">
          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaInstagram} color="pink.400" />
            </InputLeftElement>
            <Input
              placeholder="Instagram username"
              name="instagram"
              value={userData.instagram || ""}
              onChange={handleInputChange}
            />
          </InputGroup>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaSnapchatGhost} color="yellow.400" />
            </InputLeftElement>
            <Input
              placeholder="Snapchat username"
              name="snapchat"
              value={userData.snapchat || ""}
              onChange={handleInputChange}
            />
          </InputGroup>

          <InputGroup>
            <InputLeftElement pointerEvents="none">
              <Icon as={FaTiktok} color={tiktok} />
            </InputLeftElement>
            <Input
              placeholder="TikTok username"
              name="tiktok"
              value={userData.tiktok || ""}
              onChange={handleInputChange}
            />
          </InputGroup>
        </VStack>

        <Button colorScheme="teal" mt={6} w="full" onClick={handleSaveChanges}>
          Save Changes
        </Button>
      </Box>
    </Flex>
  );
};

export default MainSettings;
