import { useQuizConstructorStore } from "../../../store/zustand/quizConstructorStore";
import Answers from "./Answers/Answers";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { reorderFunc } from "../../../utils/reorderFucntion";
import styles from "./question.module.css";

const Question = ({ question, index }) => {

    const { updateQuestion, removeQuestion, updateQuestionType} = useQuizConstructorStore();

    const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ 
        id: question.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
      };

    return (
        <div ref={setNodeRef} style={style} className={styles.questionContent}>
            <div className={styles.questionArea}>
              <span>#{index + 1}</span>
                <input
                    type="text"
                    value={question.text}
                    onChange={(e) => updateQuestion(question.id, e.target.value)}
                    placeholder={`Question ${index + 1}`}
                    className={styles.questionInput}
                />
                <select
                    value={question.type}
                    onChange={(e) => updateQuestionType(question.id, e.target.value)}
                    className={styles.questionSelect}
                >
                    <option value="text">Text</option>
                    <option value="checkbox">Multiple Choice</option>
                    <option value="radio">Single Choice</option>
                </select>
                <button className={styles.removeBtn} onClick={() => removeQuestion(question.id)}>Remove</button>
            </div>
                    <Answers type={question.type} questionId={question.id} answers={question.answers} />
                    <span className={styles.dragHandle} {...listeners} {...attributes}>
                 <img src="/Icons/DnD.png" alt="dragIcon" width={35} heigth={35}/>   
            </span>
        </div>
    );
};

export default Question;

