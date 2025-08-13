import {
  FormControl,
  FormLabel,
  Input,
  Tag,
  TagLabel,
  TagCloseButton,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { useState } from "react";
import { FormDataType } from "../CompleteProfileModal";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const InterestsInputStep = ({ formData, setFormData }: Props) => {
  const [inputValue, setInputValue] = useState("");

  const handleAddTag = () => {
    if (inputValue && !formData.interests.includes(inputValue)) {
      setFormData((prev) => ({
        ...prev,
        interests: [...prev.interests, inputValue],
      }));
      setInputValue("");
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.filter((t) => t !== tag),
    }));
  };

  return (
    <FormControl>
      <FormLabel>Interests</FormLabel>
      <Input
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? handleAddTag() : null)}
        placeholder="Add interest (e.g. #vegan)"
      />
      <Wrap spacing={2} mt={2}>
        {formData.interests.map((tag, index) => (
          <WrapItem key={index}>
            <Tag size="lg" colorScheme="blue">
              <TagLabel>{tag}</TagLabel>
              <TagCloseButton onClick={() => handleRemoveTag(tag)} />
            </Tag>
          </WrapItem>
        ))}
      </Wrap>
    </FormControl>
  );
};

export default InterestsInputStep;
