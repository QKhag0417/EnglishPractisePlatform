import { useEffect, useMemo, useState } from "react";
import type { ExerciseMetadata, TopicFilter } from "../types";
import { TopicTag } from "../../ListeningContentEditorPage/types";

export function useFilterExercisesByTopic(params: {
  exercises: ExerciseMetadata[];
}) {
  const { exercises } = params;

  const [selectedTopic, setSelectedTopic] = useState<TopicFilter>("all");

  const availableTopics = useMemo(() => {
    const set = new Set<TopicTag>();
    for (const ex of exercises) {
      for (const t of ex.topics ?? []) set.add(t);
    }
    return Array.from(set).sort();
  }, [exercises]);

  useEffect(() => {
    if (selectedTopic === "all") return;
    if (!availableTopics.includes(selectedTopic)) setSelectedTopic("all");
  }, [availableTopics, selectedTopic]);

  const filteredExercises = useMemo(() => {
    if (selectedTopic === "all") return exercises;
    return exercises.filter((ex) => (ex.topics ?? []).includes(selectedTopic));
  }, [exercises, selectedTopic]);

  return {
    state: { selectedTopic },
    setters: { setSelectedTopic },
    derived: { availableTopics, filteredExercises },
  };
}
