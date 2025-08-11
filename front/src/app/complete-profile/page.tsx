"use client";

import { useState } from "react";
import CompleteProfileModal from "@/components/complete-profile/CompleteProfileModal";

const CompleteProfilePage = () => {
  const [isModalOpen, setIsModalOpen] = useState(true); // Modal visibility state

  const handleModalClose = () => setIsModalOpen(false);

  const handleSubmit = (data: any) => {
    console.log("Submitted data:", data);
    // Further submission logic goes here (API call, etc.)
    setIsModalOpen(false); // Close modal after submission
  };

  return (
    <CompleteProfileModal
      isOpen={isModalOpen}
      onClose={handleModalClose}
      title="Complete Your Profile"
      onSubmit={handleSubmit}
    />
  );
};

export default CompleteProfilePage;
