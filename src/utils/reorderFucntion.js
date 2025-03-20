import {arrayMove} from "@dnd-kit/sortable";


export const reorderFunc = (event, questions) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    return arrayMove(questions, oldIndex, newIndex).map((q, index) => ({
        ...q,
        order: index,
      }));
  };