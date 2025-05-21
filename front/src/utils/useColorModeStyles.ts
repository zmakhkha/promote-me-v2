// import { useColorMode, useColorModeValue } from '@chakra-ui/react';

// const useColorModeStyles = () => {
//   const { toggleColorMode } = useColorMode();

//   // Platform Colors
//   const snapchatColor = useColorModeValue('#FFFC00', '#FFFC00');
//   const snapchatTextColor = useColorModeValue('black', 'white'); // High contrast on yellow

//   const instagramTextColor = useColorModeValue('#d62976', '#feda75');
//   const instagramIconColor = useColorModeValue('#d62976', '#feda75');

//   const tiktok = useColorModeValue('#010101', '#ffffff');
//   const tiktokHoverColor = useColorModeValue('#00F2EA', '#FE2C55'); // TikTok cyan/pink
//   const tiktokTextColor = useColorModeValue('#FE2C55', '#00F2EA');  // Alternate hover

//   // General Colors
//   const bg = useColorModeValue('white', 'gray.800');
//   const textColor = useColorModeValue('gray.800', 'gray.200');
//   const borderColor = useColorModeValue('gray.300', 'gray.600');
//   const hoverColor = useColorModeValue('#fa7e1e', '#d62976');
//   const navBgColor = useColorModeValue('gray.100', 'gray.600');
//   const systemMessageColor = useColorModeValue('blue.100', 'blue.900');
//   const tableStripeClore = useColorModeValue('gray.400', 'gray.800');
//   const bgColor = useColorModeValue('green.500', 'green.300');

//   return {
//     bg,
//     textColor,
//     hoverColor,
//     borderColor,
//     systemMessageColor,
//     navBgColor,
//     tableStripeClore,
//     toggleColorMode,
//     bgColor,

//     // Platform Specific
//     snapchatColor,
//     tiktok,
//     tiktokHoverColor,
//     tiktokTextColor,
//   };
// };

// export default useColorModeStyles;

import { useColorMode, useColorModeValue } from "@chakra-ui/react";

const useColorModeStyles = () => {
  const { toggleColorMode } = useColorMode();

  // Primary Brand Colors
  const primaryColor = useColorModeValue("#FF6F61", "#FF6F61"); // Coral - evokes warmth and affection
  const secondaryColor = useColorModeValue("#6B5B95", "#6B5B95"); // Purple - suggests creativity and romance
  const accentColor = useColorModeValue("#88B04B", "#88B04B"); // Green - conveys harmony and freshness

  // Text and Background Colors
  const bg = useColorModeValue("#FFFFFF", "#1A202C"); // Light and dark backgrounds
  const textColor = useColorModeValue("#2D3748", "#E2E8F0"); // Dark and light text for contrast
  const borderColor = useColorModeValue("#E2E8F0", "#4A5568"); // Subtle borders for separation

  // Interactive Elements
  const hoverColor = useColorModeValue("#FFB6B9", "#FFB6B9"); // Light pink for hover states
  const navBgColor = useColorModeValue("#F7FAFC", "#2D3748"); // Navigation background
  const systemMessageColor = useColorModeValue("#EDF2F7", "#4A5568"); // System messages background
  const tableStripeColor = useColorModeValue("#F7FAFC", "#2D3748"); // Table row stripes
  const bgColor = useColorModeValue("white", "gray.700");
  const thBg = useColorModeValue("gray.100", "gray.800");

  const instagramIconColor = useColorModeValue('#d62976', '#feda75');
  const instagramTextColor = useColorModeValue('#d62976', '#feda75');
  const snapchatTextColor = useColorModeValue("gray.100", "gray.800");
  const tiktokTextColor = useColorModeValue('#FE2C55', '#00F2EA');  // Alternate hover


  return {
    toggleColorMode,
    primaryColor,
    secondaryColor,
    accentColor,
    bg,
    textColor,
    borderColor,
    hoverColor,
    navBgColor,
    systemMessageColor,
    tableStripeColor,
    bgColor,
    thBg,
    snapchatTextColor,
    instagramTextColor,
    instagramIconColor,
    tiktokTextColor,
  };
};

export default useColorModeStyles;
