"use client";

import React, { useState, useEffect } from "react";
import {
  VStack,
  Input,
  Select,
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
} from "@chakra-ui/react";
import api from "@/services/axios/api"; // Ensure this points to your axios instance
import { toast } from "react-toastify"; // Import the toast function
import "react-toastify/dist/ReactToastify.css"; // Import Toastify CSS

const GENDERS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
];

const ORIENTATIONS = [
  { value: "male", label: "Interested in Males" },
  { value: "female", label: "Interested in Females" },
  // Add other options if needed
];

type Step1Props = {
  setStep: React.Dispatch<React.SetStateAction<number>>;
};

const Step1 = ({ setStep }: Step1Props) => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    birth_date: "",
    gender: "",
    sexual_orientation: "bisexual",
    bio: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  // Fetch existing user data on mount
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api("/profile/complete/personal-info", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.status === 200) {
          // Populate form data with the fetched user data
          setFormData(response.data);
        } else {
          toast.error("Failed to fetch user data.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching the user data." + error);
      }
    };

    fetchUserData();
  }, []);

  const onChange = (field: string, value: string) => {
    setFormData((prevData) => ({ ...prevData, [field]: value }));
  };

  const onClose = () => {
    console.log("Cannot close modal");
    return true;
  };

  const handleUpdate = async () => {
    setIsLoading(true); // Set loading state
    try {
      const response = await api("/profile/complete/personal-info", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        data: JSON.stringify(formData), // Ensure formData is properly stringified
      });

      if (response.status === 200) {
        // If the update is successful, increment the step to render the next one
        setStep((prevStep) => prevStep + 1);
        toast.success("Profile updated successfully!"); // Success toast
        onClose(); // Close the modal
      } else {
        throw new Error("Failed to update profile.");
      }
    } catch (error) {
      toast.error("Profile update failed. Please try again." + error); // Error toast
    } finally {
      setIsLoading(false); // Set loading state to false
    }
  };

  return (
    <>
      {/* Modal Component */}
      <Modal isOpen={true} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent maxWidth="70%" maxHeight="90%">
          <ModalHeader>Personal Info</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              {/* First Name Input */}
              <FormControl>
                <FormLabel>First Name</FormLabel>
                <Input
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={(e) => onChange("first_name", e.target.value)}
                />
              </FormControl>

              {/* Last Name Input */}
              <FormControl>
                <FormLabel>Last Name</FormLabel>
                <Input
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={(e) => onChange("last_name", e.target.value)}
                />
              </FormControl>

              {/* Birth Date Input */}
              <FormControl>
                <FormLabel>Birth Date</FormLabel>
                <Input
                  type="date"
                  placeholder="Birth Date"
                  value={formData.birth_date}
                  onChange={(e) => onChange("birth_date", e.target.value)}
                />
              </FormControl>

              {/* Gender Select */}
              <FormControl>
                <FormLabel>Gender</FormLabel>
                <Select
                  placeholder="Select Gender"
                  value={formData.gender}
                  onChange={(e) => onChange("gender", e.target.value)}
                >
                  {GENDERS.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Sexual Orientation Select */}
              <FormControl>
                <FormLabel>Sexual Orientation</FormLabel>
                <Select
                  placeholder="Select Sexual Orientation"
                  value={formData.sexual_orientation}
                  onChange={(e) => onChange("sexual_orientation", e.target.value)}
                >
                  {ORIENTATIONS.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </Select>
              </FormControl>

              {/* Bio Input */}
              <FormControl>
                <FormLabel>Bio</FormLabel>
                <Textarea
                  placeholder="Bio"
                  value={formData.bio}
                  onChange={(e) => onChange("bio", e.target.value)}
                  rows={4}
                />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={handleUpdate}
              isLoading={isLoading} // Show loading state
              isDisabled={isLoading} // Disable the button while loading
            >
              Save & Update Profile
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* ToastContainer to display the toasts */}
      {/* <toast.ToastContainer /> */}
    </>
  );
};

export default Step1;
