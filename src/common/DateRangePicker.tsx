"use client";
import React, { useState } from "react";
import { Box, Button, HStack, Input, Text, Select } from "@chakra-ui/react";
import useColorModeStyles from "@/utils/useColorModeStyles";

interface DateRangePickerProps {
  setGender: (gender: string) => void;
  setAgeRange: (minAge: number, maxAge: number) => void;
}

const DateRangePicker: React.FC<DateRangePickerProps> = ({ setGender, setAgeRange }) => {
  const { textColor } = useColorModeStyles();

  const [gender, setSelectedGender] = useState<string>("");
  const [minAge, setMinAge] = useState<number>(18);
  const [maxAge, setMaxAge] = useState<number>(30);

  const handleGenderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedGender(e.target.value);
    setGender(e.target.value);
  };

  const handleAgeRangeChange = () => {
    setAgeRange(minAge, maxAge);
  };

  return (
    <HStack
      spacing={2}
      overflow="hidden" // Prevent overflow
      justifyContent="space-between"
      width="100%"
    >
      {/* Gender Filter */}
      <HStack>
        <Text color={textColor}>Gender:</Text>
        <Select 
          value={gender} 
          onChange={handleGenderChange}
          color={textColor}
          width="auto"
        >
          <option value="">Any</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </Select>
      </HStack>

      {/* Age Filter */}
      <HStack>
        <Text color={textColor}>Age:</Text>
        <Input
          type="number"
          value={minAge}
          onChange={(e) => setMinAge(Number(e.target.value))}
          placeholder="Min Age"
          width="auto"
          color={textColor}
        />
        <Text color={textColor}>to</Text>
        <Input
          type="number"
          value={maxAge}
          onChange={(e) => setMaxAge(Number(e.target.value))}
          placeholder="Max Age"
          width="auto"
          color={textColor}
        />
        <Button onClick={handleAgeRangeChange}>Apply</Button>
      </HStack>
    </HStack>
  );
};

export default DateRangePicker;
