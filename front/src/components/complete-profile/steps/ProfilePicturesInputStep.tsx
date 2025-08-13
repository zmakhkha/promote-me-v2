"use client";

import { 
  FormControl, 
  FormLabel, 
  Box, 
  Text, 
  Image, 
  SimpleGrid, 
  IconButton,
  VStack,
  Center,
  useColorModeValue,
  Flex,
  Badge
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { FormDataType } from "../CompleteProfileModal";
import getCorrectImage from "@/services/axios/getCorrectImage";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const ProfilePicturesInputStep = ({ formData, setFormData }: Props) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Chakra UI color mode values
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.400", "gray.500");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const countTextColor = useColorModeValue("gray.600", "gray.300");

  const handleFileChange = (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData((prev) => {
        // Create a copy of the formData and update the relevant field based on the index
        const updatedFormData = { ...prev };
        updatedFormData[`image_${index + 1}` as keyof FormDataType] = file;
        return updatedFormData;
      });
    }
  };

  const handlePlaceholderClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const removeImage = (index: number) => {
    setFormData((prev) => {
      const updatedFormData = { ...prev };
      updatedFormData[`image_${index + 1}` as keyof FormDataType] = "/media/images/default.png"; // Reset to default image URL
      return updatedFormData;
    });
  };

  return (
    <FormControl>
      <Flex justify="space-between" align="center" mb={6}>
        <FormLabel mb={0} fontSize="lg" fontWeight="semibold">
          Upload Profile Pictures
        </FormLabel>
        <Badge
          colorScheme={Object.values(formData)
            .filter((value) => value !== "/media/images/default.png")
            .length === 5 ? "green" : "blue"}
          variant="subtle"
          px={3}
          py={1}
          borderRadius="full"
        >
          {Object.values(formData).filter((value) => value !== "/media/images/default.png").length} / 5
        </Badge>
      </Flex>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
        {Array.from({ length: 5 }).map((_, index) => {
          const file = formData[`image_${index + 1}` as keyof FormDataType];
          const imageUrl = typeof file === "string" ? file : file ? URL.createObjectURL(file) : null;

          return (
            <Box key={index} position="relative">
              {/* Hidden file input */}
              <Box
                as="input"
                ref={(el) => (fileInputRefs.current[index] = el)}
                type="file"
                accept="image/*"
                srOnly
                onChange={handleFileChange(index)}
              />

              {/* Clickable placeholder/preview */}
              <Box
                w="120px"
                h="120px"
                border="2px"
                borderStyle="dashed"
                borderColor={file && file !== "/media/images/default.png" ? "transparent" : borderColor}
                borderRadius="md"
                cursor="pointer"
                position="relative"
                overflow="hidden"
                bg={file && file !== "/media/images/default.png" ? "transparent" : bgColor}
                transition="all 0.2s"
                _hover={{
                  borderColor: file && file !== "/media/images/default.png" ? "transparent" : hoverBorderColor,
                  bg: file && file !== "/media/images/default.png" ? "transparent" : hoverBgColor,
                  transform: "scale(1.02)",
                }}
                _active={{
                  transform: "scale(0.98)",
                }}
                onClick={() => handlePlaceholderClick(index)}
              >
                {imageUrl ? (
                  <Image
                    src={getCorrectImage(imageUrl)}
                    alt={`Profile picture ${index + 1}`}
                    w="full"
                    h="full"
                    objectFit="cover"
                    borderRadius="md"
                  />
                ) : (
                  <Center h="full">
                    <VStack spacing={2}>
                      <AddIcon color={textColor} boxSize={6} />
                      <Text fontSize="xs" color={textColor} textAlign="center" px={2}>
                        Add Photo
                      </Text>
                    </VStack>
                  </Center>
                )}
              </Box>

              {/* Remove button for uploaded images */}
              {file && file !== "/media/images/default.png" && (
                <IconButton
                  border="2px solid"
                  aria-label="Remove image"
                  icon={<CloseIcon />}
                  size="xs"
                  position="absolute"
                  top="-2"
                  right="-2"
                  colorScheme="red"
                  variant="solid"
                  borderRadius="full"
                  boxShadow="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(index);
                  }}
                  zIndex={2}
                  _hover={{
                    transform: "scale(1.1)",
                  }}
                />
              )}
            </Box>
          );
        })}
      </SimpleGrid>

      <Box mt={6} p={4} bg={bgColor} borderRadius="md" borderWidth="1px">
        <VStack spacing={2} align="start">
          <Text fontSize="sm" fontWeight="medium" color={countTextColor}>
            Upload Guidelines:
          </Text>
          <VStack spacing={1} align="start" pl={4}>
            <Text fontSize="xs" color={textColor}>
              • Maximum 5 photos allowed
            </Text>
            <Text fontSize="xs" color={textColor}>
              • Accepted formats: JPG, PNG, GIF
            </Text>
            <Text fontSize="xs" color={textColor}>
              • Click on any placeholder to add a photo
            </Text>
            <Text fontSize="xs" color={textColor}>
              • Click the × button to remove a photo
            </Text>
          </VStack>
        </VStack>
      </Box>
    </FormControl>
  );
};

export default ProfilePicturesInputStep;
