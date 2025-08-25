"use client";

import { Box } from "@chakra-ui/react";
import { Heart, X } from "lucide-react";

interface FeedbackOverlayProps {
  feedback: "like" | "dislike" | null;
}

const FeedbackOverlay = ({ feedback }: FeedbackOverlayProps) => {
  if (!feedback) return null;

  return (
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
  );
};

export default FeedbackOverlay;
