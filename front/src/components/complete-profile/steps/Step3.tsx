import React from "react";
import { VStack, Button, Input } from "@chakra-ui/react";

type Step3Props = {
  data: any;
  onChange: (field: string, value: any) => void;
};

const Step3: React.FC<Step3Props> = ({ data, onChange }) => {
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        onChange("latitude", position.coords.latitude);
        onChange("longitude", position.coords.longitude);
      },
      () => alert("Unable to retrieve your location")
    );
  };

  return (
    <VStack spacing={4} align="start" w="full">
      <Button onClick={handleGetLocation}>Use Current Location</Button>
      <Input
        placeholder="Latitude"
        type="number"
        step="any"
        value={data.latitude || ""}
        onChange={(e) => onChange("latitude", parseFloat(e.target.value))}
      />
      <Input
        placeholder="Longitude"
        type="number"
        step="any"
        value={data.longitude || ""}
        onChange={(e) => onChange("longitude", parseFloat(e.target.value))}
      />
    </VStack>
  );
};

export default Step3;
