import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const useColorModeStyles = () => {
  const { toggleColorMode } = useColorMode();

  // Platform Colors
  const snapchatColor = useColorModeValue('#FFFC00', '#FFFC00');
  const snapchatTextColor = useColorModeValue('black', 'white'); // High contrast on yellow

  const instagramTextColor = useColorModeValue('#d62976', '#feda75');
  const instagramIconColor = useColorModeValue('#d62976', '#feda75');

  const tiktok = useColorModeValue('#010101', '#ffffff');
  const tiktokHoverColor = useColorModeValue('#00F2EA', '#FE2C55'); // TikTok cyan/pink
  const tiktokTextColor = useColorModeValue('#FE2C55', '#00F2EA');  // Alternate hover

  // General Colors
  const bg = useColorModeValue('white', 'gray.800');
  const textColor = useColorModeValue('gray.800', 'gray.200');
  const borderColor = useColorModeValue('gray.300', 'gray.600');
  const hoverColor = useColorModeValue('#fa7e1e', '#d62976');
  const navBgColor = useColorModeValue('gray.100', 'gray.600');
  const systemMessageColor = useColorModeValue('blue.100', 'blue.900');
  const tableStripeClore = useColorModeValue('gray.400', 'gray.800');
  const bgColor = useColorModeValue('green.500', 'green.300');

  return {
    bg,
    textColor,
    hoverColor,
    borderColor,
    systemMessageColor,
    navBgColor,
    tableStripeClore,
    toggleColorMode,
    bgColor,

    // Platform Specific
    snapchatColor,
    snapchatTextColor,
    instagramTextColor,
    instagramIconColor,
    tiktok,
    tiktokHoverColor,
    tiktokTextColor,
  };
};

export default useColorModeStyles;
