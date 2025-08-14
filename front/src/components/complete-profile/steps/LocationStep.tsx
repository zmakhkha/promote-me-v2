import React, { useState, useEffect } from "react";
import {
  FormControl,
  VStack,
  Box,
  Icon,
  Button,
  Text,
  Input,
} from "@chakra-ui/react";
import { MdLocationOn } from "react-icons/md";

interface Props {
  formData: any;
  setFormData: React.Dispatch<React.SetStateAction<any>>;
}

const LocationInputStep = ({ formData, setFormData }: Props) => {
  const [isAuto, setIsAuto] = useState(true); // ✅ Initially true
  const [isDetecting, setIsDetecting] = useState(false);
  const [locationDetected, setLocationDetected] = useState(false);
  const [hasCoordinates, setHasCoordinates] = useState(false);
  const [isFilledAuto, setIsFilledAuto] = useState(true); // ✅ Controls if auto failed or not

  useEffect(() => {
    if (isAuto) {
      
      handleAutoLocation();
    }
  }, [isAuto]);

  const handleAutoLocation = () => {
    setIsDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = `${position.coords.latitude}, ${position.coords.longitude}`;
        setFormData((prev: any) => ({
          ...prev,
          location: coords,
        }));
        setLocationDetected(true);
        setHasCoordinates(true);
        setIsDetecting(false);
        setIsFilledAuto(true); // Auto success
      },
      () => {
        setIsDetecting(false);
        setIsAuto(false);
        setIsFilledAuto(false); // Auto failed
      }
    );
  };

  return (
    <FormControl >
      <VStack spacing={6}>
        <Box
          p={6}
          borderRadius="full"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="md"
        >
          <Icon as={MdLocationOn} boxSize={20} color="blue.500" />
        </Box>

        {/* Auto location button (only if auto is possible and not failed) */}
        {isFilledAuto && !locationDetected && (
          <Button
            leftIcon={<Icon as={MdLocationOn} />}
            colorScheme="blue"
            size="lg"
            onClick={handleAutoLocation}
            isLoading={isDetecting}
            loadingText="Detecting..."
            isDisabled={locationDetected}
          >
            {locationDetected ? "Location Saved" : "Get My Location"}
          </Button>
        )}

        {/* Show detected location */}
        {hasCoordinates && (
          <Text fontSize="sm" color="gray.500">
            {formData.location}
          </Text>
        )}

        {/* Manual location input if auto failed */}
        {!isFilledAuto && !locationDetected && (
          <Input
            placeholder="Enter your location manually"
            value={formData.location || ""}
            onChange={(e) =>
              setFormData((prev: any) => ({
                ...prev,
                location: e.target.value,
              }))
            }
          />
        )}
      </VStack>

      {hasCoordinates && (
        <Text fontSize="xs" color="gray.500" mt={4} textAlign="center">
          Your location will be used to show nearby matches.
        </Text>
      )}
    </FormControl>
  );
};

export default LocationInputStep;
