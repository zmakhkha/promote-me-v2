import { SystemStyleObject } from "@chakra-ui/react";
import useColorModeStyles from "@/utils/useColorModeStyles";

export const useUserCardStyles = () => {
  const { bg, textColor, borderColor, hoverColor } = useColorModeStyles();

  return {
    card: {
      width: "sm",
      borderRadius: "xl",
      boxShadow: "lg",
      overflow: "hidden",
      transition: "transform 0.2s",
      _hover: {
        transform: "scale(1.05)",
        boxShadow: "xl",
        borderColor: hoverColor,
      },
      bg,
      border: "1px",
      borderColor,
    } as SystemStyleObject,

    imageContainer: {
      height: "200px",
      width: "100%",
      overflow: "hidden",
      borderRadius: "md",
      position: "relative",
      _hover: {
        transform: "scale(1.1)",
        transition: "all 0.3s ease-in-out",
      },
    } as SystemStyleObject,

    heading: {
      fontSize: "xl",
      fontWeight: "bold",
      color: textColor,
      mb: 2,
      textAlign: "center",
    } as SystemStyleObject,

    location: {
      color: "gray.500",
      fontSize: "sm",
      fontStyle: "italic",
    } as SystemStyleObject,

    interestsContainer: {
      wrap: "wrap",
      gap: 2,
    } as SystemStyleObject,

    badge: {
      colorScheme: "blue",
      fontSize: "sm",
      px: 2,
      borderRadius: "full",
      boxShadow: "md",
      bg: "blue.100",
      color: "blue.800",
    } as SystemStyleObject,

    instagramLink: {
      textAlign: "center",
      py: 2,
      color: "blue.400",
      fontWeight: "medium",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 2,
      _hover: { textDecoration: "underline" },
    } as SystemStyleObject,
  };
};
