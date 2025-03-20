import { openDB } from "idb";

const DB_NAME = "QuizDB";
const STORE_NAME = "quizzes";

const dbPromise = openDB(DB_NAME, 1, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id" });
    }
  },
});

export const db = {
  async getAllQuizzes() {
    return (await dbPromise).getAll(STORE_NAME);
    return quizzes.sort((a, b) => a.order - b.order);
  },

  async getQuiz(id) {
    return (await dbPromise).get(STORE_NAME, id);
  },

  async saveQuiz(quiz) {
    return (await dbPromise).put(STORE_NAME, quiz);
  },

  async removeQuiz(id) {
    return (await dbPromise).delete(STORE_NAME, id);
  },

  async updateQuizOrder(newQuizzes) {
    console.log("Обновленный порядок перед записью:", newQuizzes.map(q => ({ name: q.name, order: q.order })));
    const dbInstance = await dbPromise;
    const tx = dbInstance.transaction(STORE_NAME, "readwrite");
    const store = tx.objectStore(STORE_NAME);

    for (const quiz of newQuizzes) {
        if (!quiz.id) {
            console.error("Ошибка: у теста нет ID", quiz);
            continue;
        }
        await store.put(quiz);
    }
    await tx.done;
    console.log("IndexedDB обновлена:", await this.getAllQuizzes());
  },

};
