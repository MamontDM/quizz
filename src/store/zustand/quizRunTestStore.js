import { create } from "zustand";
import { useQuizCatalogStore } from "./quizCatalogStore";

export const useQuizPlayerStore = create((set, get) => ({
  quizId: null,
  name: "",
  description: "",
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},

  startQuiz: (quizId) => {
    const quiz = useQuizCatalogStore.getState().getQuiz(quizId);
    if (quiz) {
      set({
        quizId: quizId,
        name: quiz.name,
        description: quiz.description,
        questions: quiz.questions,
        currentQuestionIndex: 0,
        userAnswers: {},
      });
    }
  },

  selectAnswer: (questionId, answerId) => {
    set((state) => {
      const currentAnswers = state.userAnswers[questionId] || [];
      let updatedAnswers;

      const question = state.questions.find((q) => q.id === questionId);
      if (question?.type === "multiple") {
        updatedAnswers = currentAnswers.includes(answerId)
          ? currentAnswers.filter((id) => id !== answerId)
          : [...currentAnswers, answerId]; 
      } else {
        updatedAnswers = [answerId];
      }

      return {
        userAnswers: { ...state.userAnswers, [questionId]: updatedAnswers },
      };
    });
  },


  nextQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.min(state.currentQuestionIndex + 1, state.questions.length - 1),
    }));
  },


  prevQuestion: () => {
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    }));
  },


  finishQuiz: () => {
    const { questions, userAnswers } = get();
    let correctCount = 0;

    questions.forEach((question) => {
      const correctAnswers = question.answers.filter((a) => a.isCorrect).map((a) => a.id);
      const userSelected = userAnswers[question.id] || [];

      if (correctAnswers.length === userSelected.length && correctAnswers.every((id) => userSelected.includes(id))) {
        correctCount++;
      }
    });

    return {
      correctCount,
      totalQuestions: questions.length,
      score: Math.round((correctCount / questions.length) * 100),
    };
  },
}));
