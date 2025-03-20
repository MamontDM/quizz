import { create } from "zustand";
import { db } from "../indexedDB/indexedDB";
import { useQuizConstructorStore } from "./quizConstructorStore"; 

export const useQuizCatalogStore = create((set, get) => ({
  quizzes: [],

  sortBy: "order",

  setSortBy: (sortBy) => {
    set({ sortBy });
    get().sortQuizzes(); 
  },

  sortQuizzes: () => {
    const { quizzes, sortBy } = get();
    const sortedQuizzes = [...quizzes].sort((a, b) => {
      if (sortBy === "amountOfQuestions") return b.amountOfQuestions - a.amountOfQuestions;
      if (sortBy === "amountOfCompletions") return b.amountOfCompletions - a.amountOfCompletions;
      if (sortBy === "averageScore") return b.averageScore - a.averageScore;
      if (sortBy === "averageTime") return a.averageTime - b.averageTime;
      return a.order - b.order;
    });
    set({ quizzes: sortedQuizzes });
  },

  setQuizzesOrder: async (newQuizzes) => {
   set({ quizzes: newQuizzes });
    console.log("Обновляем IndexedDB с новым порядком:", newQuizzes);
    await db.updateQuizOrder(newQuizzes);
  },

  loadQuizzes: async () => {
    const quizzes = await db.getAllQuizzes();
    set({ quizzes});
    get().sortQuizzes();
  },

  getQuiz: (id) => {
    const quiz = useQuizCatalogStore.getState().quizzes.find((q) => q.id === id);
    return quiz ? { name: quiz.name, description: quiz.description, questions: quiz.questions } : null;
  },

  saveQuiz: (name, description, questions) => set((state) => {
    const newQuiz = {
      id: Date.now(),
      name,
      description,
      amountOfQuestions: questions.length,
      amountOfCompletions: 0,
      questions,
      averageScore: 0,
      averageTime: 0,
      order: get().quizzes.length,
    };
      set((state) => ({ quizzes: [...state.quizzes, newQuiz] }));
      get().sortQuizzes();
    return db.saveQuiz(newQuiz);
  }),

  updateQuiz: async (id, updatedData) => {
    set((state) => ({
      quizzes: state.quizzes.map((quiz) =>
        quiz.id === id ? { ...quiz, ...updatedData } : quiz
      ),
    }));
      const updateQuiz = {...get().quizzes.find((quiz) => quiz.id === id), ...updatedData};
      await db.saveQuiz(updateQuiz);
      get().sortQuizzes();
  },
  
  removeQuiz: async (id) => {
      set((state) => ({
      quizzes: state.quizzes.filter((quiz) => quiz.id !== id),
    }));
    await db.removeQuiz(id);
    get().sortQuizzes();
  },

  recordQuizResult: async (id, correctAnswers, totalQuestions, timeTaken) => {
    set((state) => {
      const quizzes = state.quizzes.map((quiz) => {
        if (quiz.id === id) {
          const newCompletions = quiz.amountOfCompletions + 1;
          const newAverageScore = ((quiz.averageScore * quiz.amountOfCompletions) + ((correctAnswers / totalQuestions) * 100)) / newCompletions;
          console.log(timeTaken)
          const newAverageTime = ((quiz.averageTime * quiz.amountOfCompletions) + timeTaken) / newCompletions;
          
          return {
            ...quiz,
            amountOfCompletions: newCompletions,
            averageScore: Math.round(newAverageScore),
            averageTime: Math.round(newAverageTime),
          };
        }
        return quiz;
      });

      return { quizzes };
    });

    const updatedQuiz = get().quizzes.find((quiz) => quiz.id === id);
    await db.saveQuiz(updatedQuiz);
  },
}));

useQuizCatalogStore.getState().loadQuizzes();

