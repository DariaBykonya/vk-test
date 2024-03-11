import Modal from "react-modal";
import styles from './styles.module.css';

interface ModalProps {
  isOpen: boolean,
  onClose: () => void,
  friendsData?: User[],
  groupName: string
}

interface User {
  "first_name": string,
  "last_name": string
}

export function CustomModal({ isOpen, onClose, friendsData, groupName }: ModalProps) {
  return(
    <Modal
      isOpen={isOpen} 
      onRequestClose={() => onClose()} 
      overlayClassName={styles["modal-overlay"]}
      className={styles["modal-content"]}
      ariaHideApp={false}
    >
      <div className={styles["data-wrapper"]}>
        <h2 className={styles.title}>{groupName}</h2>
        <p className={styles.subtitle}>Список друзей</p>
        <ul className={styles["list-friends"]}>
        {friendsData && friendsData.map((friend, index) => (
          <li key={index} className={styles.friend}>{friend.first_name} {friend.last_name}</li>
        ))}
      </ul>
        <button onClick={onClose} className={styles["modal__close-button"]}></button>
      </div>
    </Modal>
  );
}