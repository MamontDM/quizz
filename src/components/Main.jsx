import '../App.css'
import { useQuizCatalogStore } from "../store/zustand/quizCatalogStore";
import QuizCatalog from "./QuizCatalog/QuizCatalog";

const Main = () => {
const quizzes = useQuizCatalogStore((state) => state.quizzes);
console.log(quizzes);

    return (
        <div className="app-wrapper">
            <QuizCatalog />  
        </div>
    )
};

export default Main;