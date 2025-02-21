import React from "react";
import { useBreakpointValue } from "@chakra-ui/react";
import NonAuthHeaderBig from "./NonAuthHeaderBig";
import NonAuthHeaderSmall from "./NonAuthHeaderSmall";

const NonAuthHeader = () => {
  const isMobile = useBreakpointValue({ base: true, md: false });

  return <div>{isMobile ? <NonAuthHeaderSmall /> : <NonAuthHeaderBig />}</div>;
};

export default NonAuthHeader;
