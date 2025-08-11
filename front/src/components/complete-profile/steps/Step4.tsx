import React from "react";
import {
  VStack,
  Button,
  Wrap,
  Box,
  Image,
  IconButton,
} from "@chakra-ui/react";
import { CloseIcon } from "@chakra-ui/icons";

export type ImageItem = {
  id: string;
  file?: File;
  url?: string;
  isProfile: boolean;
};

type Step4Props = {
  images: ImageItem[];
  setImages: React.Dispatch<React.SetStateAction<ImageItem[]>>;
};

const Step4: React.FC<Step4Props> = ({ images, setImages }) => {
  const handleAddImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      id: URL.createObjectURL(file),
      file,
      url: URL.createObjectURL(file),
      isProfile: false,
    }));
    setImages((old) => [...old, ...newImages].slice(0, 5));
  };

  const handleSetProfilePicture = (id: string) => {
    setImages((imgs) =>
      imgs.map((img) => ({ ...img, isProfile: img.id === id }))
    );
  };

  const handleRemoveImage = (id: string) => {
    setImages((imgs) => imgs.filter((img) => img.id !== id));
  };

  return (
    <VStack spacing={4} align="start" w="full">
      <Button as="label" cursor="pointer">
        Upload Images (max 5)
        <input
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={handleAddImage}
        />
      </Button>

      <Wrap spacing={4}>
        {images.map((img) => (
          <Box
            key={img.id}
            position="relative"
            border={img.isProfile ? "2px solid green" : "1px solid gray"}
            borderRadius="md"
            overflow="hidden"
            maxW="100px"
            maxH="100px"
          >
            <Image src={img.url} alt="User pic" objectFit="cover" />
            <IconButton
              aria-label="Remove Image"
              icon={<CloseIcon />}
              size="xs"
              position="absolute"
              top={1}
              right={1}
              onClick={() => handleRemoveImage(img.id)}
            />
            {!img.isProfile && (
              <Button
                size="xs"
                position="absolute"
                bottom={1}
                left={1}
                onClick={() => handleSetProfilePicture(img.id)}
              >
                Set Profile
              </Button>
            )}
            {img.isProfile && (
              <Box
                position="absolute"
                bottom={1}
                left={1}
                bg="green.500"
                color="white"
                px={1}
                fontSize="xs"
              >
                Profile
              </Box>
            )}
          </Box>
        ))}
      </Wrap>
    </VStack>
  );
};

export default Step4;
