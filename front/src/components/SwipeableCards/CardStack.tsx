"use client";

import { Box } from "@chakra-ui/react";
import { useRef } from "react";
import UserCard, { UserProfile } from "./UserCard";

interface CardStackProps {
  cards: UserProfile[];
  dragOffset: { x: number; y: number };
  rotation: number;
  opacity: number;
  isDragging: boolean;
  mouseHandlers: React.HTMLAttributes<HTMLDivElement>;
  touchHandlers: React.HTMLAttributes<HTMLDivElement>;
  onReport: () => void;
}

const CardStack = ({
  cards,
  dragOffset,
  rotation,
  opacity,
  isDragging,
  mouseHandlers,
  touchHandlers,
  onReport,
}: CardStackProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <Box position="relative" w="450px" h="800px" mb={8}>
      {cards.slice(0, 3).map((profile, index) => {
        const isTopCard = index === 0;
        const zIndex = cards.length - index;
        const yOffset = index * 8;
        const scale = 1 - index * 0.05;

        return (
          <UserCard
            key={profile.id}
            profile={profile}
            isTopCard={isTopCard}
            dragOffset={isTopCard ? dragOffset : { x: 0, y: yOffset }}
            rotation={isTopCard ? rotation : 0}
            opacity={isTopCard ? opacity : 1}
            isDragging={isDragging}
            onReport={onReport}
            mouseHandlers={isTopCard ? mouseHandlers : {}}
            touchHandlers={isTopCard ? touchHandlers : {}}
          />
        );
      })}
    </Box>
  );
};

export default CardStack;
