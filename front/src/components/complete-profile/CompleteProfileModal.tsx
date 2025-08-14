import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Spinner,
  useBreakpointValue,
  useToast,
  Center,
  Text,
  VStack,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";

// Step Components
import NameInputStep from "./steps/NameInputStep";
import GenderInputStep from "./steps/GenderInputStep";
import InterestsInputStep from "./steps/InterestsInputStep";
import ProfilePicturesInputStep from "./steps/ProfilePicturesInputStep";
import SexualPreferencesInputStep from "./steps/SexualPreferencesInputStep";
import api from "@/services/axios/api";
import LocationStep from "./steps/LocationStep";
import BiographyInputStep from "./steps/BiographyInputStep";

// Type for form data
export type FormDataType = {
  first_name: string;
  last_name: string;
  gender: string;
  bio: string;
  longitude: number | null;
  latitude: number | null;
  location: string;
  interests: string[];
  image_profile: string | File;
  image_2: string | File;
  image_3: string | File;
  image_4: string | File;
  image_5: string | File;
  sexual_orientation: string;
};

interface ProfileModalProps {
  title: string;
  stepLevel: number;
}

const CompleteProfileModal = ({ title, stepLevel }: ProfileModalProps) => {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const [formData, setFormData] = useState<FormDataType>({
    first_name: "",
    last_name: "",
    gender: "",
    bio: "",
    interests: [],
    sexual_orientation: "",
    image_profile: "",
    image_2: "",
    image_3: "",
    image_4: "",
    image_5: "",
    latitude: null,
    longitude: null,
    location: "",
  });

  const toast = useToast();

  // Fetch existing profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);

        // Use GET method to fetch existing data from the same endpoint
        const response = await api.get("/profile/complete/personal-info");

        if (response.data) {
          const profileData = response.data;

          setFormData({
            first_name: profileData.first_name || "",
            last_name: profileData.last_name || "",
            gender: profileData.gender || "",
            bio: profileData.bio || "",
            interests: profileData.interests || [],
            sexual_orientation: profileData.sexual_orientation || "",
            image_profile:
              profileData.image_profile || "/media/images/default.png",
            image_2: profileData.image_2 || "/media/images/default.png",
            image_3: profileData.image_3 || "/media/images/default.png",
            image_4: profileData.image_4 || "/media/images/default.png",
            image_5: profileData.image_5 || "/media/images/default.png",
            latitude: profileData.latitude || null,
            longitude: profileData.longitude || null,
            location: profileData.location || "",
          });
        }
      } catch (error: any) {
        console.error("Failed to fetch profile data:", error);
        setLoadError("Failed to load profile data. Please try again.");

        // If it's a 404 or similar, we can still proceed with empty form
        if (error.response?.status === 404) {
          console.log("No existing profile found, starting with empty form");
          setLoadError(null);
        } else {
          toast({
            title: "Load Error",
            description: "Failed to load existing profile data.",
            status: "warning",
            duration: 3000,
            isClosable: true,
            position: "bottom",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [toast]);

  const handleNext = async () => {
    if (step < 7) {
      setStep(step + 1);
    } else {
      try {
        setIsSubmitting(true);
        const form = new FormData();

        form.append("first_name", formData.first_name);
        form.append("last_name", formData.last_name);
        form.append("gender", formData.gender);
        form.append("bio", formData.bio);
        form.append("interests", JSON.stringify(formData.interests));

        // Append location data
        if (formData.latitude !== null) {
          form.append("latitude", formData.latitude.toString());
        }
        if (formData.longitude !== null) {
          form.append("longitude", formData.longitude.toString());
        }
        if (formData.location) {
          form.append("location", formData.location);
        }

        // Append image files if they have been uploaded
        if (formData.image_profile instanceof File) {
          form.append("image_profile", formData.image_profile);
        }
        if (formData.image_2 instanceof File) {
          form.append("image_2", formData.image_2);
        }
        if (formData.image_3 instanceof File) {
          form.append("image_3", formData.image_3);
        }
        if (formData.image_4 instanceof File) {
          form.append("image_4", formData.image_4);
        }
        if (formData.image_5 instanceof File) {
          form.append("image_5", formData.image_5);
        }

        form.append("sexual_orientation", formData.sexual_orientation);

        await api.put("/profile/complete/personal-info", form, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        console.log("Profile completed successfully!");
        toast({
          title: "Profile updated",
          description: "Your profile has been completed successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      } catch (error) {
        console.error("Failed to complete profile:", error);
        toast({
          title: "Update failed",
          description: "Something went wrong. Please try again.",
          status: "error",
          duration: 3000,
          isClosable: true,
          position: "bottom",
        });
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleRetry = () => {
    // Retry fetching data
    setLoadError(null);
    window.location.reload(); // Simple retry by reloading
  };

  const modalWidth = useBreakpointValue({ base: "90%", md: "80%" });
  const modalHeight = useBreakpointValue({ base: "8vh", md: "80%" });

  // Show loading spinner while fetching initial data
  if (isLoading) {
    return (
      <Modal isOpen={true} onClose={() => {}} size="full">
        <ModalOverlay />
        <ModalContent
          maxWidth={modalWidth}
          maxHeight={modalHeight}
          m="auto"
          display="flex"
          flexDirection="column"
        >
          <ModalBody>
            <Center h="400px">
              <VStack spacing={4}>
                <Spinner size="xl" color="blue.500" />
                <Text>Loading your profile data...</Text>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  // Show error state if loading failed
  if (loadError) {
    return (
      <Modal isOpen={true} onClose={() => {}} size="full">
        <ModalOverlay />
        <ModalContent
          maxWidth={modalWidth}
          maxHeight={modalHeight}
          m="auto"
          display="flex"
          flexDirection="column"
        >
          <ModalHeader>Error</ModalHeader>
          <ModalBody>
            <Center h="300px">
              <VStack spacing={4}>
                <Text color="red.500" textAlign="center">
                  {loadError}
                </Text>
                <Button colorScheme="blue" onClick={handleRetry}>
                  Try Again
                </Button>
              </VStack>
            </Center>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  }

  let content;
  switch (step) {
    case 1:
      content = <NameInputStep formData={formData} setFormData={setFormData} />;
      break;
    case 2:
      content = (
        <GenderInputStep formData={formData} setFormData={setFormData} />
      );
      break;
    case 3:
      content = (
        <BiographyInputStep formData={formData} setFormData={setFormData} />
      );
      break;
    case 4:
      content = (
        <InterestsInputStep formData={formData} setFormData={setFormData} />
      );
      break;
    case 5:
      content = (
        <SexualPreferencesInputStep
          formData={formData}
          setFormData={setFormData}
        />
      );
      break;
    case 6:
      content = <LocationStep formData={formData} setFormData={setFormData} />;
      break;
    case 7:
      content = (
        <ProfilePicturesInputStep
          formData={formData}
          setFormData={setFormData}
        />
      );
      break;
    default:
      content = <Spinner />;
      break;
  }

  return (
    <Modal isOpen={true} onClose={() => {}} size="full">
      <ModalOverlay />
      <ModalContent
        maxWidth={modalWidth}
        maxHeight={modalHeight}
        m="auto"
        display="flex"
        flexDirection="column"
      >
        <ModalHeader>{title}</ModalHeader>
        <ModalBody>
          <div>
            <p>Step {stepLevel}</p>
            {content}
          </div>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            onClick={handlePrev}
            isDisabled={step === 1 || isSubmitting}
          >
            Prev
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleNext}
            ml={3}
            isLoading={isSubmitting}
            loadingText={step === 6 ? "Submitting..." : "Next"}
          >
            {step === 6 ? "Submit" : "Next"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CompleteProfileModal;
