import {useState, useEffect} from "react";
import QuizResultModal from "./QuizResult/QuizResultModal";
import { useQuizPlayerStore } from "../../store/zustand/quizRunTestStore";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./quizPlayItem.module.css";
import { useQuizCatalogStore } from "../../store/zustand/quizCatalogStore";


const QuizPlayItem = () => {
     const { questions, currentQuestionIndex, selectAnswer, userAnswers, nextQuestion, prevQuestion, finishQuiz } = useQuizPlayerStore();
     const  recordQuizResult  = useQuizCatalogStore.getState().recordQuizResult;
   
     const navigate = useNavigate();
     const { id } = useParams();
     const currentQuestion = questions[currentQuestionIndex];

     const [showResult, setShowResult] = useState(false);
     const [result, setResult] = useState(null);
     const [startTime, setStartTime] = useState(Date.now());
     const [timeTaken, setTimeTaken] = useState(0);
     const [testAbandoned, setTestAbandoned] = useState(false);
     const [inactiveStart, setInactiveStart] = useState(null);


     useEffect(() => {
        setStartTime(Date.now());

        const handleBeforeUnload = (event) => {
            event.preventDefault();
            event.returnValue = "Are you sure you want to leave the test? Your result will not be counted!";
        };

        window.addEventListener("beforeunload", handleBeforeUnload);
        
        return () => {
            window.removeEventListener("beforeunload", handleBeforeUnload);
        };
    }, []);

    if (!currentQuestion) {
        return(
            <p>Тест не найден</p>
        );
    }

   

    const handleFinish = async () => {
        const resultData = finishQuiz();
        const totalTime = Math.round((Date.now() - startTime) / 1000);
        setTimeTaken(totalTime);
        setResult(resultData);
        setShowResult(true);

        await recordQuizResult(Number(id), resultData.correctCount, resultData.totalQuestions, totalTime)
    };

    const handleAbandonTest = () => {
        setTestAbandoned(true);
        setShowResult(true);
    };

    const handleCloseModal = () => {
        setShowResult(false);
        navigate("/");
    };

    return (
        <div className={styles.quizContainer}>
            <h2 className={styles.question}>{currentQuestion.text}</h2>

            <div className={styles.answers}>
                {currentQuestion.answers.map((answer) => (
                    <label key={answer.id} className={styles.answer}>
                        <input
                            type={currentQuestion.type === "multiple" ? "checkbox" : "radio"}
                            name={`question-${currentQuestion.id}`}
                            checked={userAnswers[currentQuestion.id]?.includes(answer.id) || false}
                            onChange={() => selectAnswer(currentQuestion.id, answer.id)}
                        />
                        {answer.text}
                    </label>
                ))}
            </div>

            <div className={styles.buttons}>
                {currentQuestionIndex > 0 && <button className={styles.back} onClick={prevQuestion}>Назад</button>}
                {currentQuestionIndex < questions.length - 1 ? (
                    <button className={styles.next} onClick={nextQuestion}>Далее</button>
                ) : (
                    <button className={styles.finish} onClick={handleFinish}>Завершить</button>
                )}
            </div>
            {showResult && 
                <QuizResultModal 
                    result={testAbandoned ? null : result} 
                    timeTaken={testAbandoned ? null : timeTaken} 
                    testAbandoned={testAbandoned}
                    onClose={handleCloseModal} 
                    
                />}
        </div>
    );
};

export default QuizPlayItem;