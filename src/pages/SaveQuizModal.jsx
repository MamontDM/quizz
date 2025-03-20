import { useState, useEffect, useRef } from "react";
import { useQuizCatalogStore } from "../store/zustand/quizCatalogStore";
import { useQuizConstructorStore } from "../store/zustand/quizConstructorStore";
import styles from "./saveQuizModal.module.css";

const SaveQuizModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState("");
  const [localDescription, setLocalDescription] = useState("");
  const [holdProgress, setHoldProgress] = useState(0);
  const holdTimeout = useRef(null);
  const intervalRef = useRef(null);

  const saveQuizToCatalog = useQuizConstructorStore((state) => state.saveQuizToCatalog);
  const { name, description, isEditMode, clearConstructor} = useQuizConstructorStore();
  
  useEffect(() => {
    if(isEditMode){
      setTitle(name);
      setLocalDescription(description);
   }
  }, [isEditMode])
   


  const handleSave = () => {
    if (!title.trim()) return alert("Введите название опросника");
    saveQuizToCatalog(title, localDescription);
    onClose();
    clearConstructor();
  };
  const handleCancel = () => {
    onClose();
    clearConstructor();
  }

  const startHold = () => {
    setHoldProgress(0);
    intervalRef.current = setInterval(() => {
      setHoldProgress((prev) => {
        if (prev >= 100) {
          clearInterval(intervalRef.current);
          return 100;
        }
        return prev + 1;
      });
    }, 7);

    holdTimeout.current = setTimeout(() => {
      handleCancel();
    }, 1000);
  };

  const stopHold = () => {
    clearTimeout(holdTimeout.current);
    clearInterval(intervalRef.current);
    setHoldProgress(0);
  };
  if (!isOpen) return null;

  return (
    <div className={styles.saveContextWrapper}>
      <h2>Saving menu</h2>
      <div className={styles.saveContent}>
        <span>Title</span>
          <input 
            type="text" 
            placeholder={"Title"} 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
          />
        <span>Description</span>
            <textarea
            className={styles.textArea}
              placeholder="Description"
              value={localDescription}
              onChange={(e) => setLocalDescription(e.target.value)}
            />
        <button className={styles.saveBtn} onClick={handleSave}>Сохранить</button>
        <button className={styles.closeBtn} onClick={onClose}>×</button>

        <button
            className={styles.cancelBtn}
            onMouseDown={startHold}
            onMouseUp={stopHold}
            onMouseLeave={stopHold}
            style={{ background: `linear-gradient(to right,rgb(255, 39, 39) ${holdProgress}%, #eee ${holdProgress}%)` }}
          >
          Abort creation Test
          </button>
        </div>
    </div>
  );
};

export default SaveQuizModal;
