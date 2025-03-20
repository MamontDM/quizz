import { useQuizConstructorStore } from "../../store/zustand/quizConstructorStore";
import { useQuizCatalogStore } from "../../store/zustand/quizCatalogStore";
import Question from "../../components/QuizConstructor/QuizItems/Question";
import SaveQuizButton from "./QuizItems/saveQuizButton";
import { reorderFunc } from "../../utils/reorderFucntion";
import { DndContext, closestCenter} from "@dnd-kit/core";
import { SortableContext, arrayMove, verticalListSortingStrategy } from "@dnd-kit/sortable";
import styles from "./quizConstructor.module.css";

const QuizConstructor = () => {
  const { questions, addQuestion, toggleOpen, setQuestionsOrder } = useQuizConstructorStore();
  const saveQuiz = useQuizCatalogStore((state) => state.saveQuiz);

  const handleDragEnd = (event) => {
    const newQuestions =  reorderFunc(event, questions);
    if (newQuestions) {
      setQuestionsOrder(newQuestions);
    }
  }


  return (
    <div className={styles.quizConstructor}>
      <h2>Create Quiz</h2>
        <button className={styles.closeBtn} onClick={() => toggleOpen()}>×</button>
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={questions.map((q) => q.id)} strategy={verticalListSortingStrategy}>
            {questions.map((question, index) => (
              <Question key={question.id} question={question} index={index} />
            ))}
          </SortableContext>
        </DndContext>

        <button className={styles.addButton} onClick={() => addQuestion("")}>Add Question</button>
        <SaveQuizButton />
    </div>
  );
};

export default QuizConstructor;
