  import { useColorMode, useColorModeValue } from '@chakra-ui/react';

  const useColorModeStyles = () => {
    const { toggleColorMode } = useColorMode();

    // Instagram Theme Colors
    // const instagramGradient = useColorModeValue(
    //   'linear(to-r, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)',
    //   'linear(to-r, #4f5bd5, #962fbf, #d62976, #fa7e1e, #feda75)'
    // );
    const instagramTextColor = useColorModeValue('#d62976', '#feda75');
    const instagramIconColor = useColorModeValue('#d62976', '#feda75');
    const bgColor = useColorModeValue('green.500', 'green.300');

    // General Theme Colors
    const bg = useColorModeValue('white', 'gray.800');
    const tiktok = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.800', 'gray.200');
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const hoverColor = useColorModeValue('#fa7e1e', '#d62976');
    const navBgColor = useColorModeValue('gray.100', 'gray.600');
    const systemMessageColor = useColorModeValue('blue.100', 'blue.900');

    const tiktokHoverColor = useColorModeValue("blue.700", "blue.200");
    const tableStripeClore = useColorModeValue('gray.400', 'gray.800');


return {
      bg,
      textColor,
      hoverColor,
      borderColor,
      systemMessageColor,
      tiktok,
      navBgColor,
      // instagramGradient,
      instagramTextColor,
      instagramIconColor,
      toggleColorMode,
      tiktokHoverColor,
      tableStripeClore,
      bgColor,
    };
  };

  export default useColorModeStyles;
