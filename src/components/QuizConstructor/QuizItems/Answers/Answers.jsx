import { useQuizConstructorStore } from "../../../../store/zustand/quizConstructorStore";
import { DndContext, closestCenter} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import AnswerItem from "./AnswersItem";
import { reorderFunc } from "../../../../utils/reorderFucntion";
import styles from "./answer.module.css";

const Answers = ({ type, questionId }) => {
    const { getAnswers, addAnswer, removeAnswer, toggleCorrectAnswer, updateAnswerText, setAnswersOrder } = useQuizConstructorStore();
    const answers = getAnswers(questionId);


    const handleDragEnd = (event) => {
      console.log(event);
      const currentAnswers = getAnswers(questionId); 
      const newAnswOrder = reorderFunc(event, currentAnswers);
      setAnswersOrder(questionId, newAnswOrder);
  };

    return (
      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <div className={styles.answerArea}>
          {type === "text" ? (
            <input type="text" placeholder="User will type answer here" disabled />
          ) : (
            <SortableContext items={answers.map((a) => a.id)} strategy={verticalListSortingStrategy}>
                {answers.map((answer) => (
                  <AnswerItem key={answer.id} answer={answer} questionId={questionId} />
                ))}
            </SortableContext>
          )}
            {type !== "text" && (
              <button onClick={() => addAnswer(questionId)} >
                Add Answer
              </button>
            )}
        </div>
      </DndContext>
    );
  };
  
  export default Answers;
