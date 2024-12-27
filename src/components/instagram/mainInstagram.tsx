import React, { useState } from "react";
import { Box, Avatar, Text, SimpleGrid, VStack, Badge } from "@chakra-ui/react";
import homeUsers from "@/data/homeUsers";
import DateRangePicker from "@/common/DateRangePicker";
import useColorModeStyles from "@/utils/useColorModeStyles"; // Import the custom hook

const MainInstagram = () => {
  const { bg, textColor, borderColor } = useColorModeStyles(); // Use the custom hook
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(new Date().toISOString().split("T")[0]);

  return (
    <Box p={1}>
      {/* Title Section with Border */}
      <Box 
        border="1px solid" 
        borderColor={borderColor} 
        borderRadius="md" 
        p={1} 
        mb={1} 
        bg={bg}
        className="title-container"
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
          Instagram Users
        </Text>
      </Box>

      {/* Date Range Picker with Border */}
      <Box
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        p={1}
        mb={1}
        bg={bg}
        className="date-range-picker-container"
      >
        <DateRangePicker setStartDate={setStartDate} setEndDate={setEndDate} />
      </Box>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {homeUsers.map((user) => (
          <Box
            key={user.id}
            border="1px solid"
            borderColor={borderColor} // Use the border color from the custom hook
            borderRadius="md"
            p={3}
            bg={bg} // Use the background color from the custom hook
            _hover={{ boxShadow: "lg", transform: "scale(1.05)" }}
            transition="transform 0.2s ease, box-shadow 0.2s ease"
            className="user-card"
          >
            <VStack align="center">
              {/* User Avatar */}
              <Avatar src={user.imageUrl} alt={user.username} size="lg" mb={2} />

              {/* User Info */}
              <Text fontSize="md" fontWeight="bold" color={textColor}>
                {user.username}
              </Text>
              <Text fontSize="sm" color={textColor} textAlign="center">
                {user.bio}
              </Text>

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
