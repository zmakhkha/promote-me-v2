import React, { useState } from "react";
import { Box, Text, SimpleGrid } from "@chakra-ui/react";
import homeUsers from "@/data/homeUsers";
import DateRangePicker from "@/common/DateRangePicker";
import useColorModeStyles from "@/utils/useColorModeStyles"; // Import the custom hook
import UserCard from "../user/UserCard"; // Import UserCard component

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

      {/* User Cards Grid */}
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing={4}>
        {homeUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </SimpleGrid>
    </Box>
  );
};

export default MainInstagram;
