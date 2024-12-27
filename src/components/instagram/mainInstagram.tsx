import React, { useState } from 'react';
import { Box, Avatar, Text, SimpleGrid, useColorModeValue, VStack, Badge } from '@chakra-ui/react';
import homeUsers from '@/data/homeUsers';
import './mainInstagram.css'
import DateRangePicker from '@/common/DateRangePicker';


const MainInstagram = () => {
  // Chakra UI color mode handling for dark and light mode
  const bg = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.800", "white");
  const borderColor = useColorModeValue("gray.300", "gray.600");
  const [startDate, setStartDate] = useState<string>(""); 
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split('T')[0]);



  return (
    <Box>
      {/* Title Section */}
      <Text fontSize="3xl" fontWeight="bold" mb={6} color={textColor} className="header">
        Instagram Users
      </Text>

      <Box bg={bg} className="header" mt={0} mb={0}>
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>

      {/* User Grid Section */}
      <Text fontSize="2xl" fontWeight="bold" mb={4} color={textColor}>
        Featured Users
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {homeUsers.map((user) => (
          <Box
            key={user.id}
            border="1px solid"
            borderColor={borderColor}
            borderRadius="md"
            p={3}
            bg={bg}
            _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
            transition="transform 0.2s ease, box-shadow 0.2s ease"
          >
            <VStack align="center">
              {/* User Avatar */}
              <Avatar src={user.imageUrl} alt={user.username} size="lg" mb={2} />
              
              {/* User Info */}
              <Text fontSize="md" fontWeight="bold" color={textColor}>{user.username}</Text>
              <Text fontSize="sm" color={textColor} textAlign="center">{user.bio}</Text>

              {/* User Location and Age */}
              <Text fontSize="sm" color={textColor}>
                {user.age} years old, {user.location}
              </Text>

              {/* User Interests */}
              <Text fontSize="sm" color={textColor}>
                Interests: {user.interests.join(", ")}
              </Text>

              {/* Online Status */}
              <Badge colorScheme={user.isOnline ? "green" : "red"} mt={2}>
                {user.isOnline ? "Online" : "Offline"}
              </Badge>
            </VStack>
          </Box>
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MainInstagram;
