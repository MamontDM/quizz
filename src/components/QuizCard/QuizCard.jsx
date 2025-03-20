import { useState, useRef, useEffect } from "react";
import { useQuizCatalogStore } from "../../store/zustand/quizCatalogStore";
import { useQuizConstructorStore } from "../../store/zustand/quizConstructorStore";
import { useQuizPlayerStore } from "../../store/zustand/quizRunTestStore";
import { useSortable } from "@dnd-kit/sortable";
import { useNavigate } from "react-router-dom";
import { CSS } from "@dnd-kit/utilities";
import styles from "./quizCard.module.css"


const QuizItem = ({ quiz }) => {
    const [menuOpen, setMenuOpen] = useState(false);
    const menuRef = useRef(null);
    const { loadQuiz } = useQuizConstructorStore();
    const { removeQuiz,  } = useQuizCatalogStore();
    const startQuiz = useQuizPlayerStore((state) => state.startQuiz);
    const navigate = useNavigate();

    const startTest = (quizId) => {
        startQuiz(quizId);
        navigate(`/quiz/${quizId}`);
      };

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: quiz.id });

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ${remainingSeconds} ${remainingSeconds === 1 ? "second" : "seconds"}`;
    };



    return (
        <div ref={setNodeRef} style={{ transform: CSS.Transform.toString(transform), transition }} className={styles.quizItem}>
            <button 
                    className={styles.menuButton}
                    data-no-dnd="true"
                    onClick={(event) => {
                        setMenuOpen((prev) => !prev);
                    }}
                >
                    ⋮
                </button>
            <div className={styles.quizInfo}>
                <h3>{quiz.name}</h3>
                <p>{quiz.description}</p>
                <p>Questions: {quiz.amountOfQuestions}</p>
                <p>Passed: {quiz.amountOfCompletions} times</p>
                <p>Average time: { quiz.averageTime === 0 ? 0 : formatTime(quiz.averageTime)} sec</p>
            </div>
            <span className={styles.dragHandle} {...listeners} {...attributes}>
                 <img src="/Icons/DnD.png" alt="dragIcon" width={35} heigth={35}/>   
            </span>
            <div className={styles.menuContainer} ref={menuRef}>
                
                {menuOpen && (
                    <ul className={styles.menuDropdown}>
                        <li onClick={() => { loadQuiz(quiz.id); setMenuOpen(false); }}>✏ Edit</li>
                        <li onClick={() => { startTest(quiz.id); setMenuOpen(false); }}>▶ Run</li>
                        <li onClick={() => { removeQuiz(quiz.id); setMenuOpen(false); }} className="delete">🗑 Remove</li>
                    </ul>
                )}
            </div>
        </div>
    );
};

export default QuizItem;

