import { create } from "zustand";
import { useQuizCatalogStore } from "./quizCatalogStore";

export const useQuizConstructorStore = create((set, get) => ({
  questions: [],
  isOpen: false,
  isEditMode: false,
  description: "",
  name: "",
  quizId: "",

  toggleOpen:  () => 
    set((state) => ({ isOpen : !state.isOpen })),

  clearConstructor: () => 
    set(() => ({ isOpen: false, isEditMode: false, questions: [], description: "", name: "", quizId: "", })),

  loadQuiz: (id) => {
    const quiz = useQuizCatalogStore.getState().getQuiz(id);
    if (!quiz) return;

    set(() => ({
      questions: quiz.questions,
      isOpen: true,
      isEditMode: true,
      description: quiz.description,
      name: quiz.name,
      quizId: id,
    }));
  },

    saveQuizToCatalog: (name, description) => {
      const { questions, isEditMode, quizId } = get();
      const { updateQuiz, saveQuiz } = useQuizCatalogStore.getState();
  
      if (isEditMode) {
        updateQuiz(quizId, { 
          name, 
          description, 
          questions,
          amountOfQuestions: questions.length 
        });
      } else {
        console.log(questions);
        saveQuiz( name, description , questions);
      }
  
      set(() => ({ isOpen: false, isEditMode: false, questions: [], description: "", name: "", quizId: "" }));
    },
   

    addQuestion: (text) => {
      const newQuestion = {
        id: Date.now(),
        text,
        type: "text",
        answers: [],
        order: get().questions.length,
      };
      set((state) => ({
        questions: [...state.questions, newQuestion].sort((a, b) => a.order - b.order),
      }));
    },

  setQuestionsOrder: (newQuestions) => {
      set({ questions: newQuestions });
    },

  removeQuestion: (id) => set((state) => ({
    questions: state.questions.filter((q) => q.id !== id)
  })),

  updateQuestion: (id, newText) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === id ? { ...q, text: newText } : q
    )
  })),

  updateAnswerText: (questionId, answerId, newText) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, text: newText } : a
            )
          }
        : q
    )
  })),
  
  updateQuestionType: (id, newType) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === id ? { ...q, type: newType } : q
    )
  })),

  addAnswer: (questionId) => 
    set((state) => ({
    questions: state.questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            answers: [
              ...q.answers, 
              { id: Date.now(), text: "", isCorrect: false, order: q.answers.length }
            ].sort((a, b) => a.order - b.order),
          }
        : q
    ),
  })),

  setAnswersOrder: (questionId, newAnswers) => {
    set((state) => ({
      questions: state.questions.map((q) =>
        q.id === questionId ? { ...q, answers: newAnswers } : q
      ),
    }));
  },

  removeAnswer: (questionId, answerId) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === questionId
        ? { ...q, answers: q.answers.filter((a) => a.id !== answerId) }
        : q
    )
  })),

  toggleCorrectAnswer: (questionId, answerId) => set((state) => ({
    questions: state.questions.map((q) =>
      q.id === questionId
        ? {
            ...q,
            answers: q.answers.map((a) =>
              a.id === answerId ? { ...a, isCorrect: !a.isCorrect } : a
            )
          }
        : q
    )
  })),

  getAnswers: (questionId) => {
    const question = get().questions.find((q) => q.id === questionId);
    return question ? question.answers : [];
  }
}));
