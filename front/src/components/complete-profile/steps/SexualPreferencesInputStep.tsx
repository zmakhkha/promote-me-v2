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
      value={formData.sexualPreferences}
      onChange={(e) =>
        setFormData((prev) => ({
          ...prev,
          sexualPreferences: e.target.value,
        }))
      }
      placeholder="Select preferences"
    >
      <option value="heterosexual">Heterosexual</option>
      <option value="homosexual">Homosexual</option>
      <option value="bisexual">Bisexual</option>
      <option value="pansexual">Pansexual</option>
      <option value="asexual">Asexual</option>
    </Select>
  </FormControl>
);

export default SexualPreferencesInputStep;
