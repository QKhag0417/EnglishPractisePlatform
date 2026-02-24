import { useMemo, useState } from "react";
import type { ExerciseMetadata, TagFilter, TaskFilter } from "../types";

export function useExerciseFilters(params: { exercises: ExerciseMetadata[] }) {
  const { exercises } = params;

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTask, setSelectedTask] = useState<TaskFilter>("all");
  const [selectedQuestionType, setSelectedQuestionType] =
    useState<TagFilter>("all");
  const [selectedTopic, setSelectedTopic] = useState<TagFilter>("all");

  const allQuestionTypes = useMemo(() => {
    const set = new Set<string>();
    for (const ex of exercises)
      for (const qt of ex.questionTypes ?? []) set.add(qt);
    return Array.from(set).sort();
  }, [exercises]);

  const allTopics = useMemo(() => {
    const set = new Set<string>();
    for (const ex of exercises) for (const t of ex.topics ?? []) set.add(t);
    return Array.from(set).sort();
  }, [exercises]);

  const getFilteredExercises = (
    taskFilter: TaskFilter,
    questionTypeFilter: TagFilter,
    topicFilter: TagFilter,
  ) => {
    return exercises.filter((exercise) => {
      const matchesTask = taskFilter === "all" || exercise.task === taskFilter;
      const matchesQuestionType =
        questionTypeFilter === "all" ||
        exercise.questionTypes.includes(questionTypeFilter);
      const matchesTopic =
        topicFilter === "all" || exercise.topics.includes(topicFilter);
      return matchesTask && matchesQuestionType && matchesTopic;
    });
  };

  const availableTasks = useMemo(() => {
    return [1, 2, 3, 4].filter((task) => {
      const list = getFilteredExercises(
        task,
        selectedQuestionType,
        selectedTopic,
      );
      return list.length > 0;
    });
  }, [exercises, selectedQuestionType, selectedTopic]);

  const availableQuestionTypes = useMemo(() => {
    return allQuestionTypes.filter((type) => {
      const list = getFilteredExercises(selectedTask, type, selectedTopic);
      return list.length > 0;
    });
  }, [allQuestionTypes, exercises, selectedTask, selectedTopic]);

  const availableTopics = useMemo(() => {
    return allTopics.filter((topic) => {
      const list = getFilteredExercises(
        selectedTask,
        selectedQuestionType,
        topic,
      );
      return list.length > 0;
    });
  }, [allTopics, exercises, selectedTask, selectedQuestionType]);

  const filteredExercises = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    return exercises.filter((exercise) => {
      const matchesSearch =
        q === "" || exercise.title.toLowerCase().includes(q);
      const matchesTask =
        selectedTask === "all" || exercise.task === selectedTask;
      const matchesQuestionType =
        selectedQuestionType === "all" ||
        exercise.questionTypes.includes(selectedQuestionType);
      const matchesTopic =
        selectedTopic === "all" || exercise.topics.includes(selectedTopic);

      return (
        matchesSearch && matchesTask && matchesQuestionType && matchesTopic
      );
    });
  }, [
    exercises,
    searchQuery,
    selectedTask,
    selectedQuestionType,
    selectedTopic,
  ]);

  return {
    state: {
      searchQuery,
      selectedTask,
      selectedQuestionType,
      selectedTopic,
    },
    setters: {
      setSearchQuery,
      setSelectedTask,
      setSelectedQuestionType,
      setSelectedTopic,
    },
    derived: {
      allQuestionTypes,
      allTopics,
      availableTasks,
      availableQuestionTypes,
      availableTopics,
      filteredExercises,
    },
  };
}
