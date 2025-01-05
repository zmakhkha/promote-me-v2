import React, { useState } from "react";
import { Box, Text, SimpleGrid, Button, HStack } from "@chakra-ui/react";
import homeUsers from "@/data/homeUsers";
import DateRangePicker from "@/common/DateRangePicker";
import useColorModeStyles from "@/utils/useColorModeStyles"; // Import the custom hook
import TiktokCard from "../user/TiktokCard";

const USERS_PER_PAGE = 8; // Define the number of users per page

const MainTiktok = () => {
  const { bg, textColor, borderColor } = useColorModeStyles(); // Use the custom hook
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [currentPage, setCurrentPage] = useState<number>(1);

  const totalPages = Math.ceil(homeUsers.length / USERS_PER_PAGE);

  // Get the users for the current page
  const currentUsers = homeUsers.slice(
    (currentPage - 1) * USERS_PER_PAGE,
    currentPage * USERS_PER_PAGE
  );

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

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
          Tiktok Users
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
      <SimpleGrid
        p={1}
        columns={{ base: 2, sm: 2, md: 3, lg: 4 }}
        spacing={4}
        w="100%"
      >
        {currentUsers.map((user) => (
          <Box
            key={user.id}
            w="100%"
            display="flex"
            justifyContent="center"
          >
            <TiktokCard user={user} />
          </Box>
        ))}
      </SimpleGrid>

      {/* Pagination Controls */}
      <HStack justifyContent="center" p={2} mt={4} spacing={2}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages}
        </Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default MainTiktok;
