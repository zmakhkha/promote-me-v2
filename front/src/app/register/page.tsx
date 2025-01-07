import MainRegister from '@/components/register/MainRegister';
import React from 'react';
import { Box, Image } from '@chakra-ui/react';

const Page = () => {
  return (
    <Box position="relative" width="100vw" height="100vh" overflow="hidden">
      {/* Background Image */}
      <Image
        src="./register-bgc.png" // Use absolute path
        alt="Background"
        objectFit="cover"
        position="absolute"
        top={0}
        left={0}
        width="100%"
        height="100%"
        zIndex={-1}
      />

      {/* Main Content */}
      <Box position="relative" zIndex={1}>
        <MainRegister />
      </Box>
    </Box>
  );
};

export default Page;
