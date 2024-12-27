// utils/useColorModeStyles.ts
import { useColorMode, useColorModeValue } from '@chakra-ui/react';

const useColorModeStyles = () => {
  const { toggleColorMode } = useColorMode();
  
  // Define background, text, and other color values based on the color mode
  const bg = useColorModeValue('white', 'gray.800');  // General background
  const textColor = useColorModeValue('gray.800', 'gray.200');  // Text color for general content
  const borderColor = useColorModeValue('gray.300', 'gray.600');  // Border color
  const hoverColor = useColorModeValue('blue.500', 'blue.300');  // Hover effect color
  const bgColor = useColorModeValue('green.500', 'green.300');  // Background color for special elements
  const navBgColor = useColorModeValue('gray.100', 'gray.600');  // Background color for navigation

  // Define specific colors for indicators
  const humidityColors = {
    red: useColorModeValue('red.500', 'red.300'),
    yellow: useColorModeValue('yellow.500', 'yellow.300'),
    green: useColorModeValue('green.500', 'green.300'),
  };

  const solarRadiationColors = {
    red: useColorModeValue('red.500', 'red.300'),
    yellow: useColorModeValue('yellow.500', 'yellow.300'),
    green: useColorModeValue('green.500', 'green.300'),
  };

  const solarPanelVoltageColors = {
    red: useColorModeValue('red.500', 'red.300'),
    yellow: useColorModeValue('yellow.500', 'yellow.300'),
    green: useColorModeValue('green.500', 'green.300'),
  };

  return {
    bg,
    textColor,
    borderColor,
    hoverColor,
    bgColor,
    navBgColor,
    humidityColors,
    solarRadiationColors,
    solarPanelVoltageColors,
    toggleColorMode,
  };
};

export default useColorModeStyles;
