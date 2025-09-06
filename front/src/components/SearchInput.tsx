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
import { useEffect, useMemo, useRef, useState } from "react";
import { BsSearch } from "react-icons/bs";
import { useOutsideClick } from "@chakra-ui/react";
import NextLink from "next/link";
import { User, USERS } from "@/lib/data";

interface Props {
  onSearch: (searchText: string) => void;
}

const SearchInput = ({ onSearch }: Props) => {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [highlight, setHighlight] = useState<number>(-1);
  const [loading, setLoading] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  useOutsideClick({ ref: containerRef, handler: () => setOpen(false) });

  // Simulate async filtering latency (debounce-ish, feels real)
  const [debouncedQuery, setDebouncedQuery] = useState("");
  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => {
      setDebouncedQuery(query.trim());
      setLoading(false);
    }, 150);
    return () => clearTimeout(t);
  }, [query]);

  const results = useMemo<User[]>(() => {
    if (!debouncedQuery) return [];
    const q = debouncedQuery.toLowerCase();
    return USERS.filter(
      (u) =>
        u.fullName.toLowerCase().includes(q) ||
        u.username.toLowerCase().includes(q) ||
        u.location.toLowerCase().includes(q)
    ).slice(0, 8); // cap results for UX
  }, [debouncedQuery]);

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
        // Simulate navigation/selection: call onSearch with username
        onSearch(results[highlight].username);
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
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
            onChange={(e) => {
              setQuery(e.target.value);
              setOpen(true);
              setHighlight(-1);
            }}
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

          {!loading && !query && (
            <Text p={3} fontSize="sm" color="gray.500">
              Start typing to search users.
            </Text>
          )}

          {!loading && query && results.length === 0 && (
            <Text p={3} fontSize="sm" color="gray.500">
              No matches found.
            </Text>
          )}

          {!loading &&
            results.map((u, idx) => (
              <Box
                key={u.id}
                as={NextLink}
                href={`/users/${u.username}`} // adjust to your route
                onClick={() => setOpen(false)}
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
                >
                  <Avatar size="sm" name={u.fullName} src={u.avatarUrl} />
                  <Box minW={0}>
                    <Text fontWeight="semibold" noOfLines={1}>
                      {u.fullName}
                    </Text>
                    <Flex gap={2} wrap="wrap">
                      <Text fontSize="sm" color="gray.500" noOfLines={1}>
                        @{u.username}
                      </Text>
                      <Text fontSize="sm" color="gray.500" noOfLines={1}>
                        • {u.location}
                      </Text>
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
