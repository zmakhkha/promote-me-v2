import { FormControl, FormLabel, Textarea } from "@chakra-ui/react";
import { FormDataType } from "../CompleteProfileModal";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const BiographyInputStep = ({ formData, setFormData }: Props) => (
  <FormControl>
    <FormLabel>Biography</FormLabel>
    <Textarea
      value={formData.bio}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, bio: e.target.value }))
      }
      placeholder="Tell us about yourself..."
    />
  </FormControl>
);

export default BiographyInputStep;
