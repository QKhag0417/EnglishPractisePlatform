import { useEffect, useMemo, useState } from "react";
import type { ExerciseMetadata, TaskFilter } from "../types";

export function useFilterExercisesByTask(params: {
  exercises: ExerciseMetadata[];
}) {
  const { exercises } = params;

  const [selectedTask, setSelectedTask] = useState<TaskFilter>("all");

  const availableTasks = useMemo(() => {
    const set = new Set<number>();
    for (const ex of exercises) {
      if (typeof ex.task === "number") set.add(ex.task);
    }
    return [1, 2, 3, 4].filter((t) => set.has(t));
  }, [exercises]);

  useEffect(() => {
    if (selectedTask === "all") return;
    if (!availableTasks.includes(selectedTask)) setSelectedTask("all");
  }, [availableTasks, selectedTask]);

  const filteredExercises = useMemo(() => {
    if (selectedTask === "all") return exercises;
    return exercises.filter((ex) => ex.task === selectedTask);
  }, [exercises, selectedTask]);

  return {
    state: { selectedTask },
    setters: { setSelectedTask },
    derived: { availableTasks, filteredExercises },
  };
}
