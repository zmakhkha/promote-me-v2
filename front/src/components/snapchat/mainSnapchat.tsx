"use client";
import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  SimpleGrid,
  Button,
  HStack,
  Spinner,
} from "@chakra-ui/react";
import DateRangePicker from "@/common/DateRangePicker";
import useColorModeStyles from "@/utils/useColorModeStyles";
import api from "@/services/axios/api";
import SnapCard from "../user/SnapCard";

const USERS_PER_PAGE = 8;

const MainSnapchat = () => {
  const { bg, textColor, borderColor } = useColorModeStyles();
  const [users, setUsers] = useState<any[]>([]);
  const [gender, setGender] = useState<string>("");
  const [minAge, setMinAge] = useState<number>(13);
  const [maxAge, setMaxAge] = useState<number>(60);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const totalPages = Math.ceil(users.length / USERS_PER_PAGE);

  // Fetch users from API
  const fetchUsers = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await api.get("/api/v1/users/", {
        params: {
          page: currentPage,
          gender,
          age_from: minAge,
          age_to: maxAge,
        },
      });
      setUsers(response.data.results || response.data);
    } catch (err: any) {
      setError(err.response?.data?.detail || "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [currentPage, gender, minAge, maxAge]);

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  return (
    <Box p={1}>
      {/* Title Section */}
      <Box
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        p={1}
        mb={1}
        bg={bg}
      >
        <Text fontSize="3xl" fontWeight="bold" color={textColor}>
          Snapchat Users
        </Text>
      </Box>

      {/* Date Range Picker */}
      <Box
        border="1px solid"
        borderColor={borderColor}
        borderRadius="md"
        p={1}
        mb={1}
        bg={bg}
      >
        <DateRangePicker
          setGender={setGender}
          setAgeRange={(min: number, max: number) => {
            setMinAge(min);
            setMaxAge(max);
          }}
        />
      </Box>

      {/* User Cards Grid */}
      {isLoading ? (
        <Spinner size="xl" color={textColor} />
      ) : error ? (
        <Text color="red.500">{error}</Text>
      ) : (
        <SimpleGrid
          p={1}
          columns={{ base: 1, sm: 1, md: 3, lg: 4 }}
          spacing={4}
          w="100%"
        >
          {users
            .slice(
              (currentPage - 1) * USERS_PER_PAGE,
              currentPage * USERS_PER_PAGE
            )
            .map((user) => (
              <Box
                key={user.id}
                w="100%"
                display="flex"
                justifyContent="center"
              >
                <SnapCard user={user} />
              </Box>
            ))}
        </SimpleGrid>
      )}

      {/* Pagination Controls */}
      <HStack justifyContent="center" p={2} mt={4} spacing={2}>
        <Button
          onClick={() => handlePageChange(currentPage - 1)}
          isDisabled={currentPage === 1 || isLoading}
        >
          Previous
        </Button>
        <Text>
          Page {currentPage} of {totalPages || 1}
        </Text>
        <Button
          onClick={() => handlePageChange(currentPage + 1)}
          isDisabled={currentPage === totalPages || isLoading}
        >
          Next
        </Button>
      </HStack>
    </Box>
  );
};

export default MainSnapchat;
