import styles from "./modalWindow.module.css";

const Modal = ({ isOpen, children }) => {
    if (!isOpen) return null;

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {children}
            </div>
        </div>
    );
};

export default Modal;
