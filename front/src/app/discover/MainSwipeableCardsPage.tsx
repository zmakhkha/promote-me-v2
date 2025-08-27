"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import {
  Box,
  Button,
  Text,
  Image,
  Badge,
  VStack,
  HStack,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  ModalFooter,
  Input,
  FormControl,
  FormLabel,
  Select,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  RadioGroup,
  Radio,
  Stack,
  useColorMode,
  useToast,
  Container,
  Wrap,
  WrapItem,
  Spinner,
} from "@chakra-ui/react";
import {
  Heart,
  X,
  MapPin,
  Star,
  Users,
  Settings,
  Flag,
  Sun,
  Moon,
} from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";
import api from "@/services/axios/api";
import getCorrectImage from "@/services/axios/getCorrectImage";

interface UserProfile {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_verified: boolean;
  age: number;
  bio: string;
  interests: string[];
  location: string;
  latitude: number;
  longitude: number;
  points: number;
  image_profile: string;
  distance: number;
  common_tags: number;
}

type UserStage = "unseen_users" | "other_users" | "no_more_users";

const MainSwipeableCardsPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const {
    isOpen: isSettingsOpen,
    onOpen: onSettingsOpen,
    onClose: onSettingsClose,
  } = useDisclosure();
  const {
    isOpen: isReportOpen,
    onOpen: onReportOpen,
    onClose: onReportClose,
  } = useDisclosure();
  const toast = useToast();

  const [reportReason, setReportReason] = useState("");

  const [currentStage, setCurrentStage] = useState<UserStage>("unseen_users");
  const [unseenUsers, setUnseenUsers] = useState<UserProfile[]>([]);
  const [otherUsers, setOtherUsers] = useState<UserProfile[]>([]);
  const [currentCards, setCurrentCards] = useState<UserProfile[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const bgColor = colorMode === "light" ? "gray.50" : "gray.900";
  const cardBg = colorMode === "light" ? "white" : "gray.800";
  const textColor = colorMode === "light" ? "gray.800" : "white";

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log("Fetching users from API...");

      const response = await api.get("/discover/");
      const data = response.data;
      console.log("API response received:", data);

      setUnseenUsers(data.unseen_users || []);
      setOtherUsers(data.other_users || []);
      setCurrentStage("unseen_users");

      toast({
        title: "Users loaded",
        description: `Found ${data.unseen_users?.length || 0} new users and ${
          data.other_users?.length || 0
        } other users`,
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error("Error fetching users:", err);
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      toast({
        title: "Error loading users",
        description: "Please check your connection and try again",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update current cards based on current stage
  useEffect(() => {
    if (!isLoading) {
      if (currentStage === "unseen_users") {
        setCurrentCards(unseenUsers);
      } else if (currentStage === "other_users") {
        setCurrentCards(otherUsers);
      } else {
        setCurrentCards([]);
      }
    }
  }, [currentStage, unseenUsers, otherUsers, isLoading]);

  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (clientX: number, clientY: number) => {
    setIsDragging(true);
    setStartPos({ x: clientX, y: clientY });
  };

  const handleMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    const deltaX = clientX - startPos.x;
    const deltaY = clientY - startPos.y;
    setDragOffset({ x: deltaX, y: deltaY });
  };

  const handleEnd = () => {
    if (!isDragging) return;
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) {
      swipeCard(dragOffset.x > 0 ? "right" : "left");
    } else {
      setDragOffset({ x: 0, y: 0 });
    }
    setIsDragging(false);
  };

  const handleMouseDown = (e: React.MouseEvent) =>
    handleStart(e.clientX, e.clientY);
  const handleMouseMove = (e: React.MouseEvent) =>
    handleMove(e.clientX, e.clientY);
  const handleMouseUp = () => handleEnd();

  const handleTouchStart = (e: React.TouchEvent) =>
    handleStart(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchMove = (e: React.TouchEvent) =>
    handleMove(e.touches[0].clientX, e.touches[0].clientY);
  const handleTouchEnd = () => handleEnd();

  const sendSwipeToBackend = async (action: "like" | "dislike") => {
    if (!currentCards.length) return;

    const targetUserId = currentCards[0].username;

    try {
      console.log(`Sending swipe action: ${action} to backend...`);

      const response = await api.post(`/users/${targetUserId}/action/`, {
        action,
      });

      console.log("Swipe response:", response.data);
    } catch (error) {
      console.error("Error sending swipe:", error);
    }
  };

  const swipeCard = (direction: "left" | "right") => {
    if (direction === "right") {
      sendSwipeToBackend("like");
    } else {
      sendSwipeToBackend("dislike");
    }
    setFeedback(direction === "right" ? "like" : "dislike");
    setTimeout(() => {
      setCurrentCards((prev) => {
        const newCards = prev.slice(1);
        
        // Update the original arrays based on current stage
        if (currentStage === "unseen_users") {
          setUnseenUsers(current => current.slice(1));
          
          // If no more unseen users, check if we should move to other users
          if (newCards.length === 0 && otherUsers.length > 0) {
            // Stay in unseen_users stage, let user choose to see other_users
          } else if (newCards.length === 0) {
            setCurrentStage("no_more_users");
          }
        } else if (currentStage === "other_users") {
          setOtherUsers(current => current.slice(1));
          
          if (newCards.length === 0) {
            setCurrentStage("no_more_users");
          }
        }
        
        return newCards;
      });
      setDragOffset({ x: 0, y: 0 });
      setFeedback(null);
    }, 300);
  };

  const handleShowOtherUsers = () => {
    setCurrentStage("other_users");
    toast({
      title: "Loading other users",
      description: "Now showing users you've seen before",
      status: "info",
      duration: 2000,
      isClosable: true,
    });
  };

  const handleReport = () => {
    toast({
      title: "Report Submitted",
      description: "Your report has been successfully submitted.",
      status: "success",
      duration: 2000,
      isClosable: true,
    });
    onReportClose();
  };

  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.7, 1 - Math.abs(dragOffset.x) / 200);

  if (isLoading) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="md" centerContent>
          <VStack spacing={6} justify="center" minH="100vh">
            <Spinner size="xl" color="pink.500" />
            <Text color={textColor} fontSize="lg">
              Loading profiles...
            </Text>
            <IconButton
              aria-label="Toggle color mode"
              icon={
                colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />
              }
              onClick={toggleColorMode}
              variant="ghost"
            />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box minH="100vh" bg={bgColor}>
        <Container maxW="md" centerContent>
          <VStack spacing={6} justify="center" minH="100vh">
            <X size={64} color="#E53E3E" />
            <Text color={textColor} fontSize="lg">
              Failed to load profiles
            </Text>
            <Text color="gray.500" textAlign="center">
              {error}
            </Text>
            <Button colorScheme="pink" size="lg" onClick={() => fetchUsers()}>
              Try Again
            </Button>
            <IconButton
              aria-label="Toggle color mode"
              icon={
                colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />
              }
              onClick={toggleColorMode}
              variant="ghost"
            />
          </VStack>
        </Container>
      </Box>
    );
  }

  if (currentCards.length === 0 && !isLoading && !error) {
    if (currentStage === "unseen_users" && otherUsers.length > 0) {
      // Stage 1: Ask if user wants to see other users
      return (
        <Box minH="100vh" bg={bgColor}>
          <Container maxW="md" centerContent>
            <VStack spacing={6} justify="center" minH="100vh">
              <Heart size={64} color="#E53E3E" />
              <Text color={textColor} fontSize="lg">
                No more new users!
              </Text>
              <Text color="gray.500" textAlign="center">
                Would you like to see other users you've interacted with before?
              </Text>
              <Button
                colorScheme="pink"
                size="lg"
                onClick={handleShowOtherUsers}
                leftIcon={<Users size={20} />}
              >
                Show Other Users
              </Button>
              <Button
                colorScheme="gray"
                variant="outline"
                onClick={() => fetchUsers()}
              >
                Refresh
              </Button>
              <IconButton
                aria-label="Toggle color mode"
                icon={
                  colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />
                }
                onClick={toggleColorMode}
                variant="ghost"
              />
            </VStack>
          </Container>
        </Box>
      );
    } else {
      // Stage 2 & 3: No more users available
      return (
        <Box minH="100vh" bg={bgColor}>
          <Container maxW="md" centerContent>
            <VStack spacing={6} justify="center" minH="100vh">
              <Heart size={64} color="#E53E3E" />
              <Text color={textColor} fontSize="lg">
                No more users available!
              </Text>
              <Text color="gray.500" textAlign="center">
                Check back later for new profiles or refresh to try again.
              </Text>
              <Button
                colorScheme="blue"
                variant="outline"
                onClick={() => fetchUsers()}
              >
                Refresh
              </Button>
              <Button
                colorScheme="gray"
                variant="ghost"
                onClick={() => setCurrentStage("unseen_users")}
              >
                Back to Start
              </Button>
              <IconButton
                aria-label="Toggle color mode"
                icon={
                  colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />
                }
                onClick={toggleColorMode}
                variant="ghost"
              />
            </VStack>
          </Container>
        </Box>
      );
    }
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {/* Feedback Animation */}
      {feedback && (
        <Box
          position="fixed"
          inset={0}
          display="flex"
          alignItems="center"
          justifyContent="center"
          pointerEvents="none"
          zIndex={50}
        >
          <Box
            p={4}
            borderRadius="full"
            bg={feedback === "like" ? "green.500" : "red.500"}
            color="white"
            animation="pulse 0.3s ease-in-out"
          >
            {feedback === "like" ? <Heart size={48} /> : <X size={48} />}
          </Box>
        </Box>
      )}

      <Container maxW="lg" centerContent py={8}>
        <Box position="relative" w="450px" h="800px" mb={8}>
          {currentCards.slice(0, 3).map((profile, index) => {
            const isTopCard = index === 0;
            const zIndex = currentCards.length - index;
            const scale = 1 - index * 0.05;
            const yOffset = index * 8;

            return (
              <Box
                key={profile.id}
                ref={isTopCard ? cardRef : null}
                position="absolute"
                inset={0}
                bg={cardBg}
                borderRadius="2xl"
                boxShadow="2xl"
                overflow="hidden"
                cursor={isTopCard ? "grab" : "default"}
                _active={{ cursor: isTopCard ? "grabbing" : "default" }}
                border="1px"
                borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
                transform={
                  isTopCard
                    ? `translateX(${dragOffset.x}px) translateY(${
                        dragOffset.y + yOffset
                      }px) rotate(${rotation}deg) scale(${scale})`
                    : `translateY(${yOffset}px) scale(${scale})`
                }
                zIndex={zIndex}
                opacity={isTopCard ? opacity : 1}
                transition={isDragging ? "none" : "transform 0.3s ease-out"}
                onMouseDown={isTopCard ? handleMouseDown : undefined}
                onMouseMove={isTopCard ? handleMouseMove : undefined}
                onMouseUp={isTopCard ? handleMouseUp : undefined}
                onMouseLeave={isTopCard ? handleMouseUp : undefined}
                onTouchStart={isTopCard ? handleTouchStart : undefined}
                onTouchMove={isTopCard ? handleTouchMove : undefined}
                onTouchEnd={isTopCard ? handleTouchEnd : undefined}
              >
                <Box position="relative" h="full" overflowY="auto">
                  <Box position="relative" h="65%" minH="520px">
                    <Image
                      src={
                        profile.image_profile?.startsWith("/")
                          ? getCorrectImage(profile.image_profile)
                          : `/placeholder.svg?height=520&width=450&query=${profile.first_name} profile photo`
                      }
                      alt={`${profile.first_name} ${profile.last_name}`}
                      w="full"
                      h="full"
                      objectFit="cover"
                      draggable={false}
                    />
                    <Box
                      position="absolute"
                      inset={0}
                      bgGradient="linear(to-t, blackAlpha.700, transparent, blackAlpha.200)"
                    />

                    <HStack position="absolute" top={4} left={4} spacing={2}>
                      <IconButton
                        aria-label="Report"
                        icon={<Flag size={16} />}
                        size="sm"
                        variant="ghost"
                        bg="blackAlpha.500"
                        color="white"
                        _hover={{ bg: "blackAlpha.700" }}
                        borderRadius="full"
                        onClick={onReportOpen}
                      />
                    </HStack>

                    <HStack
                      position="absolute"
                      top={4}
                      right={4}
                      bg="blackAlpha.500"
                      borderRadius="full"
                      px={3}
                      py={1}
                      spacing={1}
                    >
                      <Star size={16} color="#F6E05E" />
                      <Text color="white" fontWeight="semibold" fontSize="sm">
                        {profile.points}
                      </Text>
                    </HStack>

                    <Box position="absolute" bottom={4} left={4} color="white">
                      <HStack spacing={2} mb={1}>
                        <Text color="white" fontSize="lg">
                          {profile.first_name} {profile.last_name}
                        </Text>
                        <Text color="white" fontSize="xl">
                          {profile.age}
                        </Text>
                        {profile.is_verified && (
                          <Badge
                            colorScheme="blue"
                            variant="solid"
                            fontSize="xs"
                          >
                            ✓
                          </Badge>
                        )}
                      </HStack>
                      <HStack spacing={1} color="whiteAlpha.900">
                        <MapPin size={16} />
                        <Text color="white" fontSize="sm">
                          {profile.location} • {profile.distance.toFixed(1)} km
                        </Text>
                      </HStack>
                    </Box>

                    {isTopCard && dragOffset.x > 50 && (
                      <Box
                        position="absolute"
                        top={8}
                        right={8}
                        bg="green.500"
                        color="white"
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontWeight="bold"
                        transform="rotate(12deg)"
                      >
                        LIKE
                      </Box>
                    )}
                    {isTopCard && dragOffset.x < -50 && (
                      <Box
                        position="absolute"
                        top={8}
                        left={8}
                        bg="red.500"
                        color="white"
                        px={4}
                        py={2}
                        borderRadius="full"
                        fontWeight="bold"
                        transform="rotate(-12deg)"
                      >
                        NOPE
                      </Box>
                    )}
                  </Box>

                  <VStack p={4} spacing={3} align="stretch">
                    <HStack spacing={4} fontSize="sm">
                      <HStack spacing={1}>
                        <Users size={16} color="#3182CE" />
                        <Text color={textColor} fontSize="sm">
                          {profile.common_tags} common tags
                        </Text>
                      </HStack>
                    </HStack>

                    <Text color={textColor} fontSize="sm" lineHeight="relaxed">
                      {profile.bio}
                    </Text>

                    <Box>
                      <Text
                        color={textColor}
                        fontSize="sm"
                        fontWeight="semibold"
                        mb={2}
                      >
                        Interests
                      </Text>
                      <Wrap spacing={1}>
                        {profile.interests.map((interest) => (
                          <WrapItem key={interest}>
                            <Badge
                              variant="outline"
                              fontSize="xs"
                              colorScheme={
                                colorMode === "light" ? "gray" : "whiteAlpha"
                              }
                              borderColor={
                                colorMode === "light" ? "gray.300" : "gray.500"
                              }
                              color={textColor}
                            >
                              {interest}
                            </Badge>
                          </WrapItem>
                        ))}
                      </Wrap>
                    </Box>
                  </VStack>
                </Box>
              </Box>
            );
          })}
        </Box>
      </Container>

      {/* Report Modal */}
      <Modal isOpen={isReportOpen} onClose={onReportClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4} align="stretch">
              <Text color="gray.500" fontSize="sm">
                Please select a reason for reporting this profile:
              </Text>
              <RadioGroup value={reportReason} onChange={setReportReason}>
                <Stack spacing={2}>
                  <Radio value="abuse">Abusive behavior</Radio>
                  <Radio value="nudity">Inappropriate content/nudity</Radio>
                  <Radio value="fake">Fake profile</Radio>
                  <Radio value="spam">Spam or scam</Radio>
                  <Radio value="other">Other</Radio>
                </Stack>
              </RadioGroup>
              <HStack justify="flex-end" spacing={2} pt={4}>
                <Button variant="outline" onClick={onReportClose}>
                  Cancel
                </Button>
                <Button
                  colorScheme="red"
                  onClick={handleReport}
                  isDisabled={!reportReason}
                >
                  Submit Report
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MainSwipeableCardsPage;