  import { useColorMode, useColorModeValue } from '@chakra-ui/react';

  const useColorModeStyles = () => {
    const { toggleColorMode } = useColorMode();

    // Instagram Theme Colors
    const instagramGradient = useColorModeValue(
      'linear(to-r, #feda75, #fa7e1e, #d62976, #962fbf, #4f5bd5)',
      'linear(to-r, #4f5bd5, #962fbf, #d62976, #fa7e1e, #feda75)'
    );
    const instagramTextColor = useColorModeValue('#d62976', '#feda75');
    const instagramIconColor = useColorModeValue('#d62976', '#feda75');

    // General Theme Colors
    const bg = useColorModeValue('white', 'gray.800');
    const tiktok = useColorModeValue('gray.800', 'white');
    const textColor = useColorModeValue('gray.800', 'gray.200');
    const borderColor = useColorModeValue('gray.300', 'gray.600');
    const hoverColor = useColorModeValue('#fa7e1e', '#d62976');
    const navBgColor = useColorModeValue('gray.100', 'gray.600');

    return {
      bg,
      tiktok,
      textColor,
      borderColor,
      hoverColor,
      navBgColor,
      instagramGradient,
      instagramTextColor,
      instagramIconColor,
      toggleColorMode,
    };
  };

  export default useColorModeStyles;
