import { 
  FormControl, 
  FormLabel, 
  Input, 
  Button, 
  VStack, 
  HStack, 
  Text, 
  useToast,
  // Spinner,
  Box,
  Icon,
  useColorModeValue
} from "@chakra-ui/react";
import { useState } from "react";
import { FormDataType } from "../CompleteProfileModal";
import { MdLocationOn, MdEdit } from "react-icons/md";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

interface LocationData {
  latitude: number;
  longitude: number;
  address?: string;
}

const LocationStep = ({ formData, setFormData }: Props) => {
  const [isDetecting, setIsDetecting] = useState(false);
  const [showManualInput, setShowManualInput] = useState(false);
  const [currentLocation, setCurrentLocation] = useState<LocationData | null>(null);
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleAutoLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support geolocation.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      setShowManualInput(true);
      return;
    }

    setIsDetecting(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;

        const locationData: LocationData = {
          latitude,
          longitude,
          address: `${latitude.toFixed(6)}, ${longitude.toFixed(6)}`,
        };

        setCurrentLocation(locationData);
        setFormData((prev) => ({
          ...prev,
          latitude,
          longitude,
          location: locationData.address,
        }));

        toast({
          title: "Location Detected",
          description: "Your current location has been detected successfully!",
          status: "success",
          duration: 3000,
          isClosable: true,
        });

        setShowManualInput(false);
        setIsDetecting(false);
      },
      (error) => {
        setIsDetecting(false);
        toast({
          title: "Location Error",
          description:
            "Failed to detect location. Please enter your approximate location manually.",
          status: "warning",
          duration: 5000,
          isClosable: true,
        });
        setShowManualInput(true);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  const handleManualAddress = () => {
    setShowManualInput(true);
    setCurrentLocation(null);
  };

  const handleAddressChange = (address: string) => {
    setFormData((prev) => ({
      ...prev,
      location: address,
      latitude: null,
      longitude: null,
    }));
  };

  const resetLocation = () => {
    setCurrentLocation(null);
    setShowManualInput(false);
    setFormData((prev) => ({
      ...prev,
      latitude: null,
      longitude: null,
      location: "",
    }));
  };

  return (
    <FormControl>
      <FormLabel fontSize="lg" fontWeight="semibold" mb={4}>
        Where are you from?
      </FormLabel>

      {!currentLocation && !showManualInput && (
        <VStack spacing={4} align="stretch">
          <Button
            leftIcon={<Icon as={MdLocationOn} />}
            colorScheme="blue"
            size="lg"
            onClick={handleAutoLocation}
            isLoading={isDetecting}
            loadingText="Detecting Location..."
          >
            Use My Current Location
          </Button>

          <Text textAlign="center" color="gray.500" fontSize="sm">
            or
          </Text>

          <Button
            leftIcon={<Icon as={MdEdit} />}
            variant="outline"
            size="lg"
            onClick={handleManualAddress}
          >
            Enter My Address Manually
          </Button>
        </VStack>
      )}

      {currentLocation && (
        <Box
          p={4}
          bg={bgColor}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
        >
          <VStack spacing={3} align="start">
            <HStack>
              <Icon as={MdLocationOn} color="green.500" />
              <Text fontWeight="semibold" color="green.500">
                Location Detected
              </Text>
            </HStack>
            <VStack spacing={1} align="start" pl={6}>
              <Text fontSize="sm">
                <strong>Latitude:</strong> {currentLocation.latitude.toFixed(6)}
              </Text>
              <Text fontSize="sm">
                <strong>Longitude:</strong> {currentLocation.longitude.toFixed(6)}
              </Text>
              {currentLocation.address && (
                <Text fontSize="sm">
                  <strong>Address:</strong> {currentLocation.address}
                </Text>
              )}
            </VStack>
            <HStack spacing={2} pt={2}>
              <Button size="sm" variant="outline" onClick={resetLocation}>
                Change Location
              </Button>
              <Button size="sm" variant="ghost" onClick={handleManualAddress}>
                Enter Address Instead
              </Button>
            </HStack>
          </VStack>
        </Box>
      )}

      {showManualInput && (
        <VStack spacing={3} align="stretch">
          <Input
            placeholder="Enter your approximate location (City, Country)"
            value={formData.location || ""}
            onChange={(e) => handleAddressChange(e.target.value)}
            size="lg"
          />
          
          <HStack spacing={2}>
            <Button size="sm" variant="outline" onClick={resetLocation}>
              Back to Options
            </Button>
            <Button
              size="sm"
              colorScheme="blue"
              onClick={handleAutoLocation}
              leftIcon={<Icon as={MdLocationOn} />}
              isLoading={isDetecting}
            >
              Use Auto Location Instead
            </Button>
          </HStack>
        </VStack>
      )}

      {(currentLocation || showManualInput) && (
        <Text fontSize="xs" color="gray.500" mt={2}>
          Your location information will be used to show you nearby matches.
        </Text>
      )}
    </FormControl>
  );
};

export default LocationStep;
