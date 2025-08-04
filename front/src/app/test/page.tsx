// pages/index.tsx

"use client";

import React, { useState, useEffect } from 'react';
import ProfileCompletionModal from '../../components/ProfileCompletionModal';

const HomePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userProfileComplete, setUserProfileComplete] = useState(false);

  useEffect(() => {
    // Here you can fetch the user profile data from an API or context
    // For demonstration purposes, we'll assume the profile is incomplete
    const userProfile = { complete: false }; // Mocked data
    setUserProfileComplete(userProfile.complete);

    if (!userProfile.complete) {
      setIsModalOpen(true);
    }
  }, []);

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <h1>Welcome to the Home Page</h1>

      <ProfileCompletionModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
};

export default HomePage;
