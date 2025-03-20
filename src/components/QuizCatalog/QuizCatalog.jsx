import { useState, useRef, useEffect } from "react";
import { DndContext, closestCenter} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { useQuizCatalogStore } from "../../store/zustand/quizCatalogStore";
import QuizConstructor from "../QuizConstructor/QuizConstructor";
import QuizItem from "../QuizCard/QuizCard";
import Modal from "../../pages/modalWindow";
import { useQuizConstructorStore } from "../../store/zustand/quizConstructorStore";
import { reorderFunc } from "../../utils/reorderFucntion";
import styles from "./quizCatalog.module.css";

const  ITEMS_PER_PAGE = 8;

const QuizCatalog = () => {
    const quizzes = useQuizCatalogStore((state) => state.quizzes);
    const setQuizzesOrder = useQuizCatalogStore((state) => state.setQuizzesOrder);
    
    const setSortBy = useQuizCatalogStore((state) => state.setSortBy);
    const {isOpen, toggleOpen} = useQuizConstructorStore();
    const [sortBy, setSortByState] = useState("order");

    const [visibleQuizzes, setVisibleQuizzes] = useState([]);
    const [page, setPage] = useState(1); 
    const observerRef = useRef(null);

    useEffect(() => {
        setVisibleQuizzes(quizzes.slice(0, ITEMS_PER_PAGE * page));
    }, [quizzes, page]);

    useEffect(() => {
        console.log(observerRef);
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && visibleQuizzes.length < quizzes.length) {
                    setPage((prev) => prev + 1);
                }
            },
            {root: document.querySelector(`.${styles.quizList}`), threshold: 0.1 }
        );

        if (observerRef.current) observer.observe(observerRef.current);
        return () => observer.disconnect();
    }, [visibleQuizzes]);


    const handleDragEnd = (event) => {
       const updateQuizzes =  reorderFunc(event, quizzes);
        if (updateQuizzes) {
            setQuizzesOrder(updateQuizzes);
        }
    };

    const handleSortChange = (e) => {
        const newSort = e.target.value;
        setSortByState(newSort);
        setSortBy(newSort);
    };
       
    

    return (
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
            <div className={styles.catalogContent}>
                <h2> Quizzies catalog</h2>
                <div className={styles.sortBar}>
                    <span>Sort by: </span>
                    <select value={sortBy} onChange={handleSortChange}>
                        <option value="order">Order</option>
                        <option value="amountOfQuestions">Amount of questions</option>
                        <option value="amountOfCompletions">Amount of completions</option>
                        <option value="averageScore">AverageScore</option>
                        <option value="averageTime">AverageTime</option>
                    </select>
                </div>
                    <SortableContext items={visibleQuizzes.map((quiz) => quiz.id)}>
                        <div className={styles.quizList}>
                            {visibleQuizzes.map((quiz) => (
                                <QuizItem 
                                key={quiz.id} 
                                quiz={quiz}
                                />
                            ))}
                            <div ref={observerRef} className={styles.placeholderItem} 
                                onClick={() => toggleOpen()}>
                                <div className={styles.addText}>+ Add new Test</div>
                            </div>
                        </div>
                    </SortableContext>
                            {isOpen && <Modal isOpen={isOpen}>
                                            <QuizConstructor />
                                       </Modal>}
            </div>
        </DndContext>
    );
};

export default QuizCatalog;

