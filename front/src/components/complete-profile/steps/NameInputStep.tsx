import { FormControl, FormLabel, Input } from "@chakra-ui/react";
import { FormDataType } from "../CompleteProfileModal";

interface Props {
  formData: FormDataType;
  setFormData: React.Dispatch<React.SetStateAction<FormDataType>>;
}

const NameInputStep = ({ formData, setFormData }: Props) => (
  <FormControl>
    <FormLabel>What is your name?</FormLabel>
    <Input
      value={formData.first_name}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, firstName: e.target.value }))
      }
      placeholder="First name"
    />
    <Input
      mt={2}
      value={formData.last_name}
      onChange={(e) =>
        setFormData((prev) => ({ ...prev, lastName: e.target.value }))
      }
      placeholder="Last name"
    />
  </FormControl>
);

export default NameInputStep;
