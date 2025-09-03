// MainSwipeableCardsPage.tsx
"use client";

import type React from "react";
import { useRef, useState, useEffect } from "react";
import {
  Box, Button, Text, Image, Badge, VStack, HStack, IconButton,
  Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  useColorMode, useToast, Spinner, Wrap, WrapItem
} from "@chakra-ui/react";
import { Heart, X, MapPin, Star, Users, Flag, Sun, Moon } from "lucide-react";
import { useDisclosure } from "@chakra-ui/react";
import api from "@/services/axios/api";
import getCorrectImage from "@/services/axios/getCorrectImage";

interface UserProfile {
  id: number; username: string; first_name: string; last_name: string;
  is_verified: boolean; age: number; bio: string; interests: string[];
  location: string; latitude: number; longitude: number; points: number;
  image_profile: string; distance: number; common_tags: number;
}

type UserStage = "unseen_users" | "other_users" | "no_more_users";

const MainSwipeableCardsPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isOpen: isReportOpen, onOpen: onReportOpen, onClose: onReportClose } = useDisclosure();
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
      const { data } = await api.get("/discover/");
      setUnseenUsers(data.unseen_users || []);
      setOtherUsers(data.other_users || []);
      setCurrentStage("unseen_users");
      toast({
        title: "Users loaded",
        description: `Found ${data.unseen_users?.length || 0} new and ${data.other_users?.length || 0} other users`,
        status: "success", duration: 1500, isClosable: true
      });
    } catch (err: any) {
      setError(err?.message ?? "Failed to fetch users");
      toast({ title: "Error loading users", status: "error", duration: 2000 });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchUsers(); }, []);

  useEffect(() => {
    if (isLoading) return;
    if (currentStage === "unseen_users") setCurrentCards(unseenUsers);
    else if (currentStage === "other_users") setCurrentCards(otherUsers);
    else setCurrentCards([]);
  }, [currentStage, unseenUsers, otherUsers, isLoading]);

  const [feedback, setFeedback] = useState<"like" | "dislike" | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  const handleStart = (x: number, y: number) => { setIsDragging(true); setStartPos({ x, y }); };
  const handleMove = (x: number, y: number) => { if (isDragging) setDragOffset({ x: x - startPos.x, y: y - startPos.y }); };
  const handleEnd = () => {
    if (!isDragging) return;
    const threshold = 100;
    if (Math.abs(dragOffset.x) > threshold) swipeCard(dragOffset.x > 0 ? "right" : "left");
    setIsDragging(false);
    setDragOffset({ x: 0, y: 0 });
  };

  const sendSwipeToBackend = async (action: "like" | "dislike") => {
    if (!currentCards.length) return;
    const targetUserId = currentCards[0].username;
    try { await api.post(`/users/${targetUserId}/action/`, { action }); } catch {}
  };

  const swipeCard = (dir: "left" | "right") => {
    void sendSwipeToBackend(dir === "right" ? "like" : "dislike");
    setFeedback(dir === "right" ? "like" : "dislike");
    setTimeout(() => {
      setCurrentCards(prev => {
        const next = prev.slice(1);
        if (currentStage === "unseen_users") {
          setUnseenUsers(u => u.slice(1));
          if (next.length === 0 && otherUsers.length === 0) setCurrentStage("no_more_users");
        } else if (currentStage === "other_users") {
          setOtherUsers(u => u.slice(1));
          if (next.length === 0) setCurrentStage("no_more_users");
        }
        return next;
      });
      setDragOffset({ x: 0, y: 0 });
      setFeedback(null);
    }, 250);
  };

  const handleShowOtherUsers = () => {
    setCurrentStage("other_users");
    toast({ title: "Now showing other users", status: "info", duration: 1200 });
  };

  // layout helpers
  const rotation = dragOffset.x * 0.1;
  const opacity = Math.max(0.72, 1 - Math.abs(dragOffset.x) / 220);

  if (isLoading) {
    return (
      <Box h="100%" minH="100%" bg={bgColor} display="flex" alignItems="center" justifyContent="center" overflow="hidden">
        <VStack spacing={4}>
          <Spinner size="xl" color="pink.500" />
          <HStack>
            <IconButton aria-label="Toggle color mode" icon={colorMode === "light" ? <Moon size={20} /> : <Sun size={20} />} onClick={toggleColorMode} variant="ghost" />
          </HStack>
        </VStack>
      </Box>
    );
  }

  if (error) {
    return (
      <Box h="100%" bg={bgColor} display="flex" alignItems="center" justifyContent="center" overflow="hidden">
        <VStack spacing={4}>
          <X size={48} color="#E53E3E" />
          <Text color={textColor}>Failed to load profiles</Text>
          <Text color="gray.500" maxW="sm" textAlign="center">{error}</Text>
          <Button colorScheme="pink" onClick={fetchUsers}>Try Again</Button>
        </VStack>
      </Box>
    );
  }

  // no more in current stage
  if (currentCards.length === 0) {
    if (currentStage === "unseen_users" && otherUsers.length > 0) {
      return (
        <Box h="100%" bg={bgColor} display="flex" alignItems="center" justifyContent="center" overflow="hidden">
          <VStack spacing={4}>
            <Heart size={48} color="#E53E3E" />
            <Text color={textColor}>No more new users</Text>
            <Button colorScheme="pink" onClick={handleShowOtherUsers} leftIcon={<Users size={18} />}>Show Other Users</Button>
            <Button variant="outline" onClick={fetchUsers}>Refresh</Button>
          </VStack>
        </Box>
      );
    }
    return (
      <Box h="100%" bg={bgColor} display="flex" alignItems="center" justifyContent="center" overflow="hidden">
        <VStack spacing={4}>
          <Heart size={48} color="#E53E3E" />
          <Text color={textColor}>No more users</Text>
          <Button variant="outline" onClick={fetchUsers}>Refresh</Button>
        </VStack>
      </Box>
    );
  }

  return (
    <Box
      h="100%"                       // <-- fills MainLayout main area
      bg={bgColor}
      overflow="hidden"              // <-- hard stop any scrollbars
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      {/* feedback pulse */}
      {feedback && (
        <Box position="fixed" inset={0} display="flex" alignItems="center" justifyContent="center" pointerEvents="none" zIndex={5}>
          <Box p={4} borderRadius="full" bg={feedback === "like" ? "green.500" : "red.500"} color="white">
            {feedback === "like" ? <Heart size={44} /> : <X size={44} />}
          </Box>
        </Box>
      )}

      {/* Card stack wrapper — sized to never overflow */}
      <Box
        position="relative"
        // width clamps to viewport; height clamps to main area height
        // avoids both horizontal & vertical scroll
        w="clamp(280px, 90vw, 450px)"
        h="clamp(420px, 88vh, 760px)"
        // remove outer margins that could force scroll
        m={0}
      >
        {currentCards.slice(0, 3).map((profile, index) => {
          const isTop = index === 0;
          const zIndex = currentCards.length - index;
          const scale = 1 - index * 0.05;
          const yOffset = index * 8;

          return (
            <Box
              key={profile.id}
              ref={isTop ? cardRef : null}
              position="absolute"
              inset={0}
              bg={cardBg}
              borderRadius="2xl"
              boxShadow="2xl"
              overflow="hidden"            // <- no inner scrollbars
              border="1px"
              borderColor={colorMode === "light" ? "gray.200" : "gray.600"}
              transform={
                isTop
                  ? `translateX(${dragOffset.x}px) translateY(${dragOffset.y + yOffset}px) rotate(${rotation}deg) scale(${scale})`
                  : `translateY(${yOffset}px) scale(${scale})`
              }
              zIndex={zIndex}
              opacity={isTop ? opacity : 1}
              transition={isDragging ? "none" : "transform 0.25s ease-out"}
              cursor={isTop ? "grab" : "default"}
              _active={{ cursor: isTop ? "grabbing" : "default" }}
              onMouseDown={isTop ? (e) => handleStart(e.clientX, e.clientY) : undefined}
              onMouseMove={isTop ? (e) => handleMove(e.clientX, e.clientY) : undefined}
              onMouseUp={isTop ? handleEnd : undefined}
              onMouseLeave={isTop ? handleEnd : undefined}
              onTouchStart={isTop ? (e) => handleStart(e.touches[0].clientX, e.touches[0].clientY) : undefined}
              onTouchMove={isTop ? (e) => handleMove(e.touches[0].clientX, e.touches[0].clientY) : undefined}
              onTouchEnd={isTop ? handleEnd : undefined}
            >
              {/* content split: 62% image, 38% details — guaranteed fit */}
              <Box position="relative" h="62%">
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
                <Box position="absolute" inset={0} bgGradient="linear(to-t, blackAlpha.700, transparent, blackAlpha.200)" />
                <HStack position="absolute" top={3} left={3} spacing={2}>
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
                <HStack position="absolute" top={3} right={3} bg="blackAlpha.500" borderRadius="full" px={3} py={1} spacing={1}>
                  <Star size={16} color="#F6E05E" />
                  <Text color="white" fontWeight="semibold" fontSize="sm">{profile.points}</Text>
                </HStack>
                <Box position="absolute" bottom={3} left={3} color="white">
                  <HStack spacing={2} mb={1}>
                    <Text color="white" fontSize="lg" noOfLines={1}>
                      {profile.first_name} {profile.last_name}
                    </Text>
                    <Text color="white" fontSize="xl">{profile.age}</Text>
                    {profile.is_verified && <Badge colorScheme="blue" variant="solid" fontSize="xs">✓</Badge>}
                  </HStack>
                  <HStack spacing={1} color="whiteAlpha.900">
                    <MapPin size={16} />
                    <Text color="white" fontSize="sm" noOfLines={1}>
                      {profile.location} • {profile.distance.toFixed(1)} km
                    </Text>
                  </HStack>
                </Box>

                {isTop && dragOffset.x > 50 && (
                  <Box position="absolute" top={8} right={8} bg="green.500" color="white" px={4} py={2} borderRadius="full" fontWeight="bold" transform="rotate(12deg)">
                    LIKE
                  </Box>
                )}
                {isTop && dragOffset.x < -50 && (
                  <Box position="absolute" top={8} left={8} bg="red.500" color="white" px={4} py={2} borderRadius="full" fontWeight="bold" transform="rotate(-12deg)">
                    NOPE
                  </Box>
                )}
              </Box>

              <VStack h="38%" p={4} spacing={2} align="stretch">
                <HStack spacing={3} fontSize="sm">
                  <HStack spacing={1}>
                    <Users size={16} color="#3182CE" />
                    <Text color={textColor} fontSize="sm">{profile.common_tags} common tags</Text>
                  </HStack>
                </HStack>

                <Text color={textColor} fontSize="sm" lineHeight="relaxed" noOfLines={3}>
                  {profile.bio}
                </Text>

                <Box>
                  <Text color={textColor} fontSize="sm" fontWeight="semibold" mb={1}>
                    Interests
                  </Text>
                  <Wrap spacing={1} maxH="64px" overflow="hidden">
                    {profile.interests.map((interest) => (
                      <WrapItem key={interest}>
                        <Badge variant="outline" fontSize="xs" borderColor={colorMode === "light" ? "gray.300" : "gray.500"} color={textColor}>
                          {interest}
                        </Badge>
                      </WrapItem>
                    ))}
                  </Wrap>
                </Box>
              </VStack>
            </Box>
          );
        })}
      </Box>

      {/* Report Modal */}
      <Modal isOpen={isReportOpen} onClose={onReportClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Report Profile</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack align="stretch" spacing={3}>
              <Text color="gray.500" fontSize="sm">Select a reason:</Text>
              <VStack align="stretch" spacing={2}>
                {["abuse","nudity","fake","spam","other"].map(val => (
                  <Button
                    key={val}
                    variant={reportReason === val ? "solid" : "outline"}
                    colorScheme="red"
                    onClick={() => setReportReason(val)}
                  >
                    {val === "abuse" ? "Abusive behavior"
                      : val === "nudity" ? "Inappropriate content/nudity"
                      : val === "fake" ? "Fake profile"
                      : val === "spam" ? "Spam or scam" : "Other"}
                  </Button>
                ))}
              </VStack>
              <HStack justify="flex-end" pt={2}>
                <Button onClick={onReportClose} variant="ghost">Cancel</Button>
                <Button colorScheme="red" onClick={() => { 
                  // your submit hook here
                  toast({ title: "Report submitted", status: "success", duration: 1200 });
                  onReportClose();
                }} isDisabled={!reportReason}>
                  Submit
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
