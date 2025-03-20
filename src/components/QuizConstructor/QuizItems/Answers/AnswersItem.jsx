import { useQuizConstructorStore } from "../../../../store/zustand/quizConstructorStore";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import styles from "./answer.module.css";

const AnswerItem = ({ answer, questionId }) => {
    const { removeAnswer, toggleCorrectAnswer, updateAnswerText } = useQuizConstructorStore();

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: answer.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      
    };

    return (
        <div ref={setNodeRef} style={style} className={styles.answer}>
            <span>Mark as correct</span>
            <input
                className={styles.correctMark}
                type="checkbox"
                checked={answer.isCorrect}
                onChange={() => toggleCorrectAnswer(questionId, answer.id)}
            />
            <input
                type="text"
                className={styles.answerText}
                value={answer.text}
                onChange={(e) => updateAnswerText(questionId, answer.id, e.target.value)}
            />
            <button onClick={() => removeAnswer(questionId, answer.id)}>Remove</button>
                <span className={styles.dragHandle} {...listeners} {...attributes}>
                    <img src="/Icons/DnD.png" alt="dragIcon" width={25} heigth={25}/>   
                </span>
        </div>
    );
};

export default AnswerItem;
