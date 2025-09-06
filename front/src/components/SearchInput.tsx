"use client";

import {
  Box,
  Flex,
  Input,
  InputLeftElement,
  InputGroup,
  Avatar,
  Text,
  useColorModeValue,
  Spinner,
} from "@chakra-ui/react";
import { useEffect, useRef, useState, useCallback } from "react";
import { BsSearch } from "react-icons/bs";
import { useOutsideClick } from "@chakra-ui/react";
import NextLink from "next/link";
import { AxiosError } from "axios";
import api from "@/services/axios/api";

// User interface matching your Django model
interface User {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  location: string;
  avatar?: string;
}

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<User[]>([]);
  const [error, setError] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const cancelTokenRef = useRef<any>(null);

  useOutsideClick({ ref: containerRef, handler: () => setOpen(false) });

  // Search function using your axios instance
  const searchUsers = useCallback(async (searchQuery: string) => {
    // Cancel previous request if it exists
    if (cancelTokenRef.current) {
      cancelTokenRef.current.cancel('Request canceled due to new search');
    }

    if (!searchQuery.trim()) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    // Create cancel token for this request
    const CancelToken = require('axios').CancelToken;
    const source = CancelToken.source();
    cancelTokenRef.current = source;

    try {
      const response = await api.get('/search/', {
        params: {
          q: searchQuery,
          // limit: 8
        },
        cancelToken: source.token
      });

      setResults(response.data);
    } catch (err) {
      if (!require('axios').isCancel(err)) {
        if (err instanceof AxiosError) {
          if (err.response?.status === 401) {
            setError('Please log in to search users');
          } else if (err.response?.status === 403) {
            setError('You do not have permission to search users');
          } else if (err.response?.status >= 500) {
            setError('Server error. Please try again later.');
          } else if (err.code === 'NETWORK_ERROR') {
            setError('Network error. Please check your connection.');
          } else {  
            setError(err.response?.data?.message || 'Failed to search users');
          }
        } else {
          setError('An unexpected error occurred');
        }
        setResults([]);
      }
    } finally {
      setLoading(false);
      cancelTokenRef.current = null;
    }
  }, []);

  // Debounce effect
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUsers(query);
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [query, searchUsers]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (cancelTokenRef.current) {
        cancelTokenRef.current.cancel('Component unmounted');
      }
    };
  }, []);

  const itemBg = useColorModeValue("white", "gray.800");
  const itemHover = useColorModeValue("gray.50", "gray.700");
  const border = useColorModeValue("gray.200", "gray.700");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!results.length) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlight((h) => (h + 1) % results.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => (h - 1 + results.length) % results.length);
    } else if (e.key === "Enter") {
      if (highlight >= 0 && highlight < results.length) {
        onSearch(results[highlight].username);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const getFullName = (user: User) => {
    return `${user.first_name} ${user.last_name}`.trim() || user.username;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
    setOpen(true);
    setHighlight(-1);
  };

  const handleUserSelect = (username: string) => {
    onSearch(username);
    setOpen(false);
  };

  return (
    <Box ref={containerRef} position="relative" w="full" maxW={{ base: "full", md: "560px" }}>
      <form
        onSubmit={handleSubmit}
        onFocus={() => setOpen(true)}
        autoComplete="off"
        role="search"
        aria-label="Search users"
      >
        <InputGroup width="100%">
          <InputLeftElement pointerEvents="none" children={<BsSearch />} />
          <Input
            value={query}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            borderRadius={20}
            placeholder="Search users by name, username, or location…"
            variant="filled"
          />
        </InputGroup>
      </form>

      {/* Dropdown */}
      {open && (
        <Box
          mt={2}
          position="absolute"
          zIndex={20}
          w="full"
          bg={itemBg}
          border="1px solid"
          borderColor={border}
          borderRadius="md"
          overflow="hidden"
          boxShadow="md"
          maxH="60vh"
          overflowY="auto"
        >
          {/* Loading state */}
          {loading && (
            <Flex align="center" gap={2} p={3}>
              <Spinner size="sm" />
              <Text fontSize="sm">Searching…</Text>
            </Flex>
          )}

          {/* Error state */}
          {error && !loading && (
            <Box p={3}>
              <Text fontSize="sm" color="red.500" mb={1}>
                {error}
              </Text>
              <Text fontSize="xs" color="gray.500">
                Try again or contact support if the problem persists.
              </Text>
            </Box>
          )}

          {/* Empty state - no query */}
          {!loading && !error && !query && (
            <Text p={3} fontSize="sm" color="gray.500">
              Start typing to search users.
            </Text>
          )}

          {/* Empty state - no results */}
          {!loading && !error && query && results.length === 0 && (
            <Text p={3} fontSize="sm" color="gray.500">
              No matches found for "{query}".
            </Text>
          )}

          {/* Results */}
          {!loading &&
            !error &&
            results.map((user, idx) => (
              <Box
                key={user.id}
                as={NextLink}
                href={`/profile/${user.username}`}
                onClick={() => handleUserSelect(user.username)}
                _hover={{ textDecoration: "none" }}
              >
                <Flex
                  align="center"
                  gap={3}
                  p={3}
                  bg={idx === highlight ? itemHover : "transparent"}
                  transition="background 120ms"
                  cursor="pointer"
                  role="option"
                  aria-selected={idx === highlight}
                  _hover={{ bg: itemHover }}
                >
                  <Avatar 
                    size="sm" 
                    name={getFullName(user)} 
                    src={user.avatar} 
                  />
                  <Box minW={0} flex="1">
                    <Text fontWeight="semibold" noOfLines={1}>
                      {getFullName(user)}
                    </Text>
                    <Flex gap={2} wrap="wrap" align="center">
                      <Text fontSize="sm" color="gray.500" noOfLines={1}>
                        @{user.username}
                      </Text>
                      {user.location && (
                        <>
                          <Text fontSize="sm" color="gray.400">
                            •
                          </Text>
                          <Text fontSize="sm" color="gray.500" noOfLines={1}>
                            {user.location}
                          </Text>
                        </>
                      )}
                    </Flex>
                  </Box>
                </Flex>
              </Box>
            ))}
        </Box>
      )}
    </Box>
  );
};

export default SearchInput;