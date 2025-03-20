import styles from "./quizResult.module.css";

const QuizResultModal = ({ result, timeTaken, testAbandoned, onClose }) => {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                {testAbandoned ? (
                    <p className={styles.modal-stats}>Your result was not counted.</p>
                ) : (
                    <>
                        <h2 className={styles.modalTitle}>Tests result</h2>
                        <p className={styles.modalStats}>Correct answers: {result.correctCount} of {result.totalQuestions}</p>
                        <p className={styles.modalStats}>Is correct: {result.score}%</p>
                        <p className={styles.modalStats}>Test completion time: {timeTaken} sec.</p>
                    </>
            )}
                <button className={styles.modalButton} onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default QuizResultModal;

