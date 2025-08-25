"use client";

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  VStack,
  Text,
  RadioGroup,
  Stack,
  Radio,
  HStack,
  Button,
} from "@chakra-ui/react";

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportReason: string;
  setReportReason: (value: string) => void;
  onSubmit: () => void;
}

const ReportModal = ({ isOpen, onClose, reportReason, setReportReason, onSubmit }: ReportModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Report Profile</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <VStack spacing={4} align="stretch">
            <Text color="gray.500" fontSize="sm">
              Please select a reason for reporting this profile:
            </Text>
            <RadioGroup value={reportReason} onChange={setReportReason}>
              <Stack spacing={2}>
                <Radio value="abuse">Abusive behavior</Radio>
                <Radio value="nudity">Inappropriate content/nudity</Radio>
                <Radio value="fake">Fake profile</Radio>
                <Radio value="spam">Spam or scam</Radio>
                <Radio value="other">Other</Radio>
              </Stack>
            </RadioGroup>
            <HStack justify="flex-end" spacing={2} pt={4}>
              <Button variant="outline" onClick={onClose}>Cancel</Button>
              <Button colorScheme="red" onClick={onSubmit} isDisabled={!reportReason}>Submit Report</Button>
            </HStack>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default ReportModal;
