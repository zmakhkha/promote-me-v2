// components/ProfileCompletionModal.tsx

import React from 'react';
import styles from './ProfileCompletionModal.module.css';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
}

class ProfileCompletionModal extends React.Component<ModalProps> {
  render() {
    const { isOpen, onClose } = this.props;

    if (!isOpen) return null;

    return (
      <div className={styles.modalBackdrop} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
          <h2>Complete Your Profile!</h2>
          <p>To increase your chances of matching with others, please complete your profile. Head over to the <a href="/settings" className={styles.link}>Settings</a> to update your profile.</p>
          <button className={styles.closeButton} onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }
}

export default ProfileCompletionModal;
