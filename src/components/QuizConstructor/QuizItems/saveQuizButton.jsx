import { useState } from "react";
import SaveQuizModal from "../../../pages/SaveQuizModal";
import { useQuizConstructorStore } from "../../../store/zustand/quizConstructorStore";

const SaveQuizButton = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { saveQuiz, isEditMode } = useQuizConstructorStore();

  const handleSave = () => {
      setModalOpen(true);
  };

  return (
    <>
      <button onClick={handleSave}>Save Quiz</button>
        <SaveQuizModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
};

export default SaveQuizButton;
