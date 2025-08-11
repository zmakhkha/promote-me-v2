"use client";

import React, { useState, useEffect } from "react";
import {
  VStack,
  Input,
  Textarea,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Tag,
  TagCloseButton,
  TagLabel,
  InputGroup,
  InputLeftElement,
  Flex,
  Wrap,
  WrapItem,
  SimpleGrid,
  Box,
  Text,
  Icon,
  NumberInput,
  NumberInputField,
} from "@chakra-ui/react";
import { FaMosque, FaCross, FaStarOfDavid, FaChurch, FaUser, FaRuler, FaSmoking, FaWineGlass } from "react-icons/fa";
import { MdSmokeFree, MdLocalBar } from "react-icons/md";
import api from "@/services/axios/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Types for the fields
interface SpecsData {
  height: string;
  religion: string;
  smoke: string;
  drink: string;
}

interface Step2Data {
  interests: string[];
  specs: SpecsData;
  looking_for: string[];
  favorite_thing: string;
  causes: string[];
  boundary: string;
}

interface Step2Props {
  setStep: React.Dispatch<React.SetStateAction<number>>;
}

// Type for tag field keys that are arrays
type TagField = 'interests' | 'looking_for' | 'causes';

// Type for specs field keys
type SpecKey = keyof SpecsData;

const Step2 = ({ setStep }: Step2Props) => {
  const [formData, setFormData] = useState<Step2Data>({
    interests: [],
    specs: {
      height: "",
      religion: "",
      smoke: "",
      drink: ""
    },
    looking_for: [],
    favorite_thing: "",
    causes: [],
    boundary: "",
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  
  // Separate input states for different tag types
  const [interestsInput, setInterestsInput] = useState<string>("");
  const [causesInput, setCausesInput] = useState<string>("");
  const [lookingForInput, setLookingForInput] = useState<string>("");

  // Fetch existing data for Step 2 fields
  useEffect(() => {
    const fetchUserData = async (): Promise<void> => {
      try {
        const response = await api("/profile/complete/step2", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          setFormData(response.data);
        } else {
          toast.error("Failed to fetch step 2 data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching data: " + error);
      }
    };

    fetchUserData();
  }, []);

  const onChange = (field: keyof Step2Data, value: string | string[] | SpecsData): void => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  // Function to handle specs changes
  const handleSpecChange = (specKey: SpecKey, value: string): void => {
    setFormData((prevData) => ({
      ...prevData,
      specs: {
        ...prevData.specs,
        [specKey]: value
      }
    }));
  };

  // Generic function to handle adding tags
  const handleAddTag = (
    field: TagField, 
    inputValue: string, 
    setInputValue: React.Dispatch<React.SetStateAction<string>>
  ): void => {
    if (inputValue.trim() !== "" && !formData[field].includes(inputValue.trim())) {
      setFormData((prevData) => ({
        ...prevData,
        [field]: [...prevData[field], inputValue.trim()],
      }));
      setInputValue(""); // Clear the input field
    }
  };

  // Generic function to handle removing tags
  const handleRemoveTag = (field: TagField, index: number): void => {
    const updatedTags = formData[field].filter((_: string, i: number) => i !== index);
    setFormData((prevData) => ({ ...prevData, [field]: updatedTags }));
  };

  // Generic function to render tags with different colors
  const renderTagsWithColor = (
    tags: string[], 
    colorScheme: string, 
    field: TagField
  ): JSX.Element[] => {
    return tags.map((tag: string, index: number) => (
      <WrapItem key={`${field}-${index}`}>
        <Tag size="md" colorScheme={colorScheme} borderRadius="full">
          <TagLabel>{tag}</TagLabel>
          <TagCloseButton onClick={() => handleRemoveTag(field, index)} />
        </Tag>
      </WrapItem>
    ));
  };

  // Get religion icon based on input
  const getReligionIcon = (religion: string): JSX.Element | null => {
    const religionLower = religion.toLowerCase();
    switch (religionLower) {
      case 'muslim':
      case 'islam':
        return <Icon as={FaMosque} boxSize={8} color="green.500" />;
      case 'christian':
      case 'christianity':
      case 'catholic':
      case 'protestant':
        return <Icon as={FaCross} boxSize={8} color="blue.500" />;
      case 'jewish':
      case 'judaism':
        return <Icon as={FaStarOfDavid} boxSize={8} color="purple.500" />;
      case 'hindu':
      case 'hinduism':
      case 'buddhist':
      case 'buddhism':
        return <Icon as={FaChurch} boxSize={8} color="orange.500" />;
      default:
        return religion ? <Icon as={FaUser} boxSize={8} color="gray.500" /> : null;
    }
  };

  // Get height display with conversion
  const getHeightDisplay = (height: string): JSX.Element | null => {
    const heightNum = parseFloat(height);
    if (!heightNum || heightNum <= 0) return null;
    
    const heightInInches = (heightNum / 2.54).toFixed(1);
    const feet = Math.floor(heightNum / 30.48);
    const inches = Math.round((heightNum / 2.54) % 12);
    
    return (
      <Box textAlign="center" mt={2}>
        <Icon as={FaRuler} boxSize={6} color="blue.500" mb={2} />
        <Text fontSize="sm" color="gray.600">
          {heightNum}cm = {feet}'{inches}" = {heightInInches}"
        </Text>
      </Box>
    );
  };

  // Get smoking icon and display
  const getSmokingDisplay = (smoke: string): JSX.Element | null => {
    const smokeLower = smoke.toLowerCase();
    if (smokeLower === 'yes' || smokeLower === 'smoker') {
      return (
        <Box textAlign="center" mt={2}>
          <Icon as={FaSmoking} boxSize={6} color="red.500" mb={1} />
          <Text fontSize="xs" color="red.500">Smoker</Text>
        </Box>
      );
    } else if (smokeLower === 'no' || smokeLower === 'non-smoker') {
      return (
        <Box textAlign="center" mt={2}>
          <Icon as={MdSmokeFree} boxSize={6} color="green.500" mb={1} />
          <Text fontSize="xs" color="green.500">Non-Smoker</Text>
        </Box>
      );
    }
    return null;
  };

  // Get drinking icon and display
  const getDrinkingDisplay = (drink: string): JSX.Element | null => {
    const drinkLower = drink.toLowerCase();
    if (drinkLower === 'yes' || drinkLower === 'drinker') {
      return (
        <Box textAlign="center" mt={2}>
          <Icon as={FaWineGlass} boxSize={6} color="purple.500" mb={1} />
          <Text fontSize="xs" color="purple.500">Drinks</Text>
        </Box>
      );
    } else if (drinkLower === 'no' || drinkLower === 'non-drinker') {
      return (
        <Box textAlign="center" mt={2}>
          <Icon as={MdLocalBar} boxSize={6} color="green.500" mb={1} />
          <Text fontSize="xs" color="green.500">Non-Drinker</Text>
        </Box>
      );
    }
    return null;
  };

  const onClose = (): boolean => {
    console.log("Cannot close modal");
    return true;
  };

  const handleUpdate = async (): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await api("/profile/complete/step2", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(formData),
      });

      if (response.status === 200) {
        setStep((prevStep: number) => prevStep + 1);
        toast.success("Step 2 updated successfully!");
        onClose();
      } else {
        throw new Error("Failed to update step 2 data.");
      }
    } catch (error) {
      toast.error("Profile update failed. Please try again: " + error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Modal isOpen={true} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent maxWidth="80%" maxHeight="95%">
          <ModalHeader>Step 2 - Interests & Preferences</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={6} align="start">
              {/* Interests Field */}
              <FormControl>
                <FormLabel>Interests</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    value={interestsInput}
                    onChange={(e) => setInterestsInput(e.target.value)}
                    placeholder="Add an interest and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag("interests", interestsInput, setInterestsInput);
                      }
                    }}
                  />
                </InputGroup>
                <Wrap spacing={2} mt={2}>
                  {renderTagsWithColor(formData.interests, "blue", "interests")}
                </Wrap>
              </FormControl>

              {/* Specs Field - Input with Icons */}
              <FormControl>
                <FormLabel>Personal Specifications</FormLabel>
                <SimpleGrid columns={2} spacing={6}>
                  {/* Height */}
                  <Box>
                    <FormControl>
                      <FormLabel fontSize="sm">Height (cm)</FormLabel>
                      <NumberInput
                        value={formData.specs.height}
                        onChange={(valueString) => handleSpecChange("height", valueString)}
                        min={100}
                        max={250}
                      >
                        <NumberInputField placeholder="e.g., 168" />
                      </NumberInput>
                      {getHeightDisplay(formData.specs.height)}
                    </FormControl>
                  </Box>

                  {/* Religion */}
                  <Box>
                    <FormControl>
                      <FormLabel fontSize="sm">Religion</FormLabel>
                      <Input
                        value={formData.specs.religion}
                        onChange={(e) => handleSpecChange("religion", e.target.value)}
                        placeholder="e.g., Muslim, Christian, Jewish"
                      />
                      <Box textAlign="center" mt={2} minH="60px" display="flex" flexDirection="column" alignItems="center" justifyContent="center">
                        {getReligionIcon(formData.specs.religion)}
                        {formData.specs.religion && (
                          <Text fontSize="xs" mt={1} color="gray.600" textTransform="capitalize">
                            {formData.specs.religion}
                          </Text>
                        )}
                      </Box>
                    </FormControl>
                  </Box>

                  {/* Smoking */}
                  <Box>
                    <FormControl>
                      <FormLabel fontSize="sm">Smoking Status</FormLabel>
                      <Input
                        value={formData.specs.smoke}
                        onChange={(e) => handleSpecChange("smoke", e.target.value)}
                        placeholder="e.g., Yes, No, Non-smoker"
                      />
                      <Box minH="50px" display="flex" alignItems="center" justifyContent="center">
                        {getSmokingDisplay(formData.specs.smoke)}
                      </Box>
                    </FormControl>
                  </Box>

                  {/* Drinking */}
                  <Box>
                    <FormControl>
                      <FormLabel fontSize="sm">Drinking Status</FormLabel>
                      <Input
                        value={formData.specs.drink}
                        onChange={(e) => handleSpecChange("drink", e.target.value)}
                        placeholder="e.g., Yes, No, Non-drinker"
                      />
                      <Box minH="50px" display="flex" alignItems="center" justifyContent="center">
                        {getDrinkingDisplay(formData.specs.drink)}
                      </Box>
                    </FormControl>
                  </Box>
                </SimpleGrid>
              </FormControl>

              {/* Looking For Field */}
              <FormControl>
                <FormLabel>Looking For</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    value={lookingForInput}
                    onChange={(e) => setLookingForInput(e.target.value)}
                    placeholder="Add what you're looking for and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag("looking_for", lookingForInput, setLookingForInput);
                      }
                    }}
                  />
                </InputGroup>
                <Wrap spacing={2} mt={2}>
                  {renderTagsWithColor(formData.looking_for, "teal", "looking_for")}
                </Wrap>
              </FormControl>

              {/* Favorite Thing Field */}
              <FormControl>
                <FormLabel>Favorite Thing</FormLabel>
                <Input
                  value={formData.favorite_thing}
                  onChange={(e) => onChange("favorite_thing", e.target.value)}
                  placeholder="What is your favorite thing?"
                />
              </FormControl>

              {/* Causes Field */}
              <FormControl>
                <FormLabel>Causes You Care About</FormLabel>
                <InputGroup>
                  <InputLeftElement pointerEvents="none" />
                  <Input
                    value={causesInput}
                    onChange={(e) => setCausesInput(e.target.value)}
                    placeholder="Add a cause and press Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddTag("causes", causesInput, setCausesInput);
                      }
                    }}
                  />
                </InputGroup>
                <Wrap spacing={2} mt={2}>
                  {renderTagsWithColor(formData.causes, "green", "causes")}
                </Wrap>
              </FormControl>

              {/* Boundary Field */}
              <FormControl>
                <FormLabel>Personal Boundaries</FormLabel>
                <Textarea
                  value={formData.boundary}
                  onChange={(e) => onChange("boundary", e.target.value)}
                  placeholder="Describe any personal boundaries you'd like to set..."
                  rows={3}
                  resize="vertical"
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleUpdate}
              isLoading={isLoading}
              isDisabled={isLoading}
              size="lg"
            >
              Save & Update Preferences
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Step2;