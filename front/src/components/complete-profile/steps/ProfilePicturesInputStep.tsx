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
  Badge,
} from "@chakra-ui/react";
import { AddIcon, CloseIcon } from "@chakra-ui/icons";
import { useRef } from "react";
import { FormDataType } from "../CompleteProfileModal";
import getCorrectImage from "@/services/axios/getCorrectImage";
import api from "@/services/axios/api";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const IMAGE_KEYS: (keyof FormDataType)[] = [
  "image_profile",
  "image_2",
  "image_3",
  "image_4",
  "image_5",
];

// treat both FE & BE defaults as placeholders
const isDefaultImage = (val: unknown) =>
  typeof val === "string" &&
  (val.trim() === "" ||
    val.includes("images/default.png") ||
    val.includes("/media/images/default.png"));

const ProfilePicturesInputStep = ({ formData, setFormData }: Props) => {
  const fileInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Chakra UI color mode values
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const hoverBorderColor = useColorModeValue("gray.400", "gray.500");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const hoverBgColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.500", "gray.400");
  const countTextColor = useColorModeValue("gray.600", "gray.300");

  const handleFileChange = (key: keyof FormDataType) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFormData((prev) => ({ ...prev, [key]: file }));
  };

  const handlePlaceholderClick = (index: number) => {
    fileInputRefs.current[index]?.click();
  };

  const removeImage = async (key: keyof FormDataType) => {
    try{
      await api.delete("/profile/delete-image",{
        data: {image_field: key},
      })
    
      setFormData((prev) => ({ ...prev, [key]: "" }));
    } catch (err){
      console.error("Error deleting image:", err);
    }
  };

  const hasImage = (val: FormDataType[keyof FormDataType]) => {
    if (val instanceof File) return true;
    if (typeof val === "string" && !isDefaultImage(val)) return true;
    return false;
  };

  const uploadedCount = IMAGE_KEYS.reduce(
    (acc, key) => acc + (hasImage(formData[key]) ? 1 : 0),
    0
  );

  return (
    <FormControl>
      <Flex justify="space-between" align="center" mb={6}>
        <FormLabel mb={0} fontSize="lg" fontWeight="semibold">
          Upload Profile Pictures
        </FormLabel>
        <Badge
          colorScheme={uploadedCount === IMAGE_KEYS.length ? "green" : "blue"}
          variant="subtle"
          px={3}
          py={1}
          borderRadius="full"
        >
          {uploadedCount} / {IMAGE_KEYS.length}
        </Badge>
      </Flex>

      <SimpleGrid columns={{ base: 2, md: 3, lg: 5 }} spacing={4}>
        {IMAGE_KEYS.map((key, index) => {
          const val = formData[key];

          // build preview URL
          let previewUrl: string | null = null;
          if (val instanceof File) {
            previewUrl = URL.createObjectURL(val);
          } else if (typeof val === "string" && !isDefaultImage(val)) {
            previewUrl = getCorrectImage(val);
          }

          const showImage = !!previewUrl;

          return (
            <Box key={String(key)} position="relative">
              {/* hidden input */}
              <input
                ref={(el) => (fileInputRefs.current[index] = el)}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleFileChange(key)}
              />

              {/* card */}
              <Box
                w="120px"
                h="120px"
                border="2px"
                borderStyle="dashed"
                borderColor={showImage ? "transparent" : borderColor}
                borderRadius="md"
                cursor="pointer"
                position="relative"
                overflow="hidden"
                bg={showImage ? "transparent" : bgColor}
                transition="all 0.2s"
                _hover={{
                  borderColor: showImage ? "transparent" : hoverBorderColor,
                  bg: showImage ? "transparent" : hoverBgColor,
                  transform: "scale(1.02)",
                }}
                _active={{ transform: "scale(0.98)" }}
                onClick={() => handlePlaceholderClick(index)}
              >
                {showImage ? (
                  <Image
                    src={previewUrl!}
                    alt={`${key}`}
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
                        {index === 0 ? "Add Profile Photo" : "Add Photo"}
                      </Text>
                    </VStack>
                  </Center>
                )}
              </Box>

              {/* remove */}
              {showImage && (
                <IconButton
                  border="2px solid"
                  aria-label="Remove image"
                  icon={<CloseIcon />}
                  size="xs"
                  position="absolute"
                  top="-2"
                  colorScheme="red"
                  variant="solid"
                  borderRadius="full"
                  boxShadow="md"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeImage(key);
                  }}
                  zIndex={2}
                  _hover={{ transform: "scale(1.1)" }}
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
            <Text fontSize="xs" color={textColor}>• Maximum 5 photos allowed</Text>
            <Text fontSize="xs" color={textColor}>• Accepted formats: JPG, PNG, GIF</Text>
            <Text fontSize="xs" color={textColor}>• Click on any card to add a photo</Text>
            <Text fontSize="xs" color={textColor}>• Click the × button to remove a photo</Text>
          </VStack>
        </VStack>
      </Box>
    </FormControl>
  );
};

export default ProfilePicturesInputStep;
