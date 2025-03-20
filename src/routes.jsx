import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Main from './components/Main';
import QuizPlayItem from "./components/QuizRun/QuizPlayItem";

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/quiz/:id" element={<QuizPlayItem />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;
