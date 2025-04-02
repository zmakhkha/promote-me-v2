"use client";

import React, { useState, useEffect, ChangeEvent } from "react";
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
  Image,
} from "@chakra-ui/react";
import { useRouter } from "next/navigation";
import useColorModeStyles from "@/utils/useColorModeStyles";
import api from "../../services/axios/api";
import countries  from "@/data/countries";

interface SelectProps {
  options: { value: string; label: string }[];
  placeholder: string;
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
}

const CustomSelect: React.FC<SelectProps> = ({ options, placeholder, onChange }) => {
  return (
    <select onChange={onChange} defaultValue="">
      <option value="" disabled>{placeholder}</option>
      {options.map((option, index) => (
        <option key={index} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

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
    image_url: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false); // track if OTP is verified

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  const updateFormData = (key: string, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };


  const sendOTP = async () => {
    try {
      const response = await api.post("/api/v1/send-otp/", { email: formData.email });
      if (response.status === 200) {
        toast({
          title: "OTP Sent",
          description: "Check your email for the OTP.",
          status: "success",
          duration: 3000,
        });
        setOtpSent(true);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.error || "An error occurred.",
        status: "error",
        duration: 3000,
      });
    }
  };
  
  const verifyOTP = async () => {
    try {
      const response = await api.post("/api/v1/verify-otp/", { email: formData.email, otp });
      if (response.status === 200) {
        toast({
          title: "OTP Verified",
          description: "Proceeding to the next step.",
          status: "success",
          duration: 3000,
        });
        setStep((prev) => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Invalid OTP",
        description: "Please enter the correct OTP.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const verifyUsername = async () => {
    try {
      const response = await api.post("/api/v1/verify-username/", { username: formData.username, otp });
      if (response.status === 200) {
        // toast({
        //   title: "OTP Verified",
        //   description: "Proceeding to the next step.",
        //   status: "success",
        //   duration: 3000,
        // });
        setStep((prev) => prev + 1);
      }
    } catch (error) {
      toast({
        title: "Invalid Username",
        description: "Username already taken.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleNext = async () => {
    console.log("++++++++++++++", step);
    if (step === 1) {
      try {
        const response = await api.post("/api/v1/verify-username/", { username: formData.username, otp });
        if (response.status === 200) {
          // toast({
          //   title: "OTP Verified",
          //   description: "Proceeding to the next step.",
          //   status: "success",
          //   duration: 3000,
          // });
          setStep((prev) => prev + 1); return;
        }
      } catch (error) {
        toast({
          title: "Invalid Username",
          description: "Username already taken.",
          status: "error",
          duration: 3000,
        });
        return;
      }
    }
      if (step === steps.length) {
      try {
        const formDataToSend = new FormData();

        // Append all fields from formData to formDataToSend
        (Object.keys(formData) as Array<keyof typeof formData>).forEach(
          (key) => {
            if (key === "interests") {
              // Stringify the entire array and append once
              formDataToSend.append("interests", JSON.stringify(formData[key]));
            } else if (key === "image_url" && formData[key]) {
              formDataToSend.append("image_url", formData[key] as File);
            } else {
              formDataToSend.append(key, formData[key] as any);
            }
          }
        );

      // Log the contents of formDataToSend
      console.log("------------------------------");
      if (formDataToSend instanceof FormData) {
          for (let [key, value] of formDataToSend.entries()) {
              console.log(`${key}:`, value);
          }
      } else {
          console.log(formDataToSend);
      }
      console.log("------------------------------");

      // Submit the form
      const response = await api.post("/api/v1/register/", formDataToSend, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Explicit response status check
      console.log("-----------------------------------------");
      console.log(response.status);
      console.log(response);
      console.log("-----------------------------------------");


        if (response.status === 200 || response.status === 201) {
          toast({
            title: "Account Created Successfully",
            description: "Redirecting to login page...",
            status: "success",
            duration: 3000,
          });
          router.push("/login");
        } else {
          toast({
            title: "Registration Failed",
            description: "Something went wrong. Please try again.",
            status: "error",
            duration: 5000,
          });
        }
      } catch (error: any) {
        toast({
          title: "Registration Failed",
          description:
            error.response?.data?.message || "An unexpected error occurred.",
          status: "error",
          duration: 5000,
        });
      }
      return;
    }

    // Move to next step if not at the last one
    if (step === 2 && !otpSent) return; // Prevent moving to OTP step without sending OTP
    if (step === 3 && !otpVerified) return;
    setStep((prev) => prev + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep((prev) => prev - 1);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      updateFormData("image_url", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const options = countries.map((country) => ({
    value: country.name.common,
    label: country.name.common,
  })).sort((a, b) => a.label.localeCompare(b.label));;

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    updateFormData("location", event.target.value);
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
        <Box>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={(e) => updateFormData("email", e.target.value)}
            isDisabled={otpSent} // Disable email input once OTP is sent
          />
          <Button colorScheme="blue" mt={2} onClick={sendOTP} isDisabled={otpSent}>
            Send OTP
          </Button>
        </Box>
      ),
    },
    {
      title: "Enter OTP",
      key: "otp",
      component: (
        <Box>
          <Input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button colorScheme="green" mt={2} onClick={verifyOTP} isDisabled={!otpSent || otpVerified || !otp}>
            Verify OTP
          </Button>
        </Box>
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
          </Stack>
        </RadioGroup>
      ),
    },
    {
      title: "Location",
      key: "location",
      component: (
        <CustomSelect options={options} placeholder="Select a country" onChange={handleChange} />
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
        <Stack spacing={4} align="center">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Profile Preview"
              boxSize="100px"
              objectFit="cover"
              borderRadius="full"
            />
          )}
          <Input type="file" accept="image/*" onChange={handleImageChange} />
        </Stack>
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
