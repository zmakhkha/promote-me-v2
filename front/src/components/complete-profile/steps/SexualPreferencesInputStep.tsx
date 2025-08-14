import { FormControl, FormLabel, Select } from "@chakra-ui/react";
import { FormDataType } from "../CompleteProfileModal";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const SexualPreferencesInputStep = ({ formData, setFormData }: Props) => (
  <FormControl>
    <FormLabel>Sexual Preferences</FormLabel>
    <Select
      value={formData.sexual_orientation}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          sexual_orientation: e.target.value,
        }))
      }
      placeholder="Select preferences"
    >
      <option value="male">interested in Males</option>
      <option value="female">interested in Females</option>
      <option value="bisexual">interested in Both</option>
    </Select>
  </FormControl>
);

export default SexualPreferencesInputStep;
