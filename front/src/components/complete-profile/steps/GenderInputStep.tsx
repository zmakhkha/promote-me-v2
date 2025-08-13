import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { FormDataType } from "../CompleteProfileModal";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const GenderInputStep = ({ formData, setFormData }: Props) => (
  <FormControl>
    <FormLabel>Gender</FormLabel>
    <Select
      value={formData.gender}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, gender: e.target.value }))
      }
      placeholder="Select gender"
    >
      <option value="male">Male</option>
      <option value="female">Female</option>
      <option value="non-binary">Non-binary</option>
      <option value="other">Other</option>
    </Select>
  </FormControl>
);

export default GenderInputStep;
