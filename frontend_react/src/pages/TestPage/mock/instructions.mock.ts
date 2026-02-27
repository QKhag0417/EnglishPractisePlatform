import { ExerciseInstruction, Skill } from "../types.ts";

export const exerciseInstructionsBySkill: Record<Skill, ExerciseInstruction> = {
  listening: {
    id: "1",
    skill: "LISTENING",
    title: "IELTS Academic Listening",
    timeInfo: "Time: Approximately 12 minutes",
    candidateInstructions: [
      "Answer all the questions.",
      "You can change your answers at any time during the test.",
      "Do not click 'Start test' until you are told to do so.",
    ],
    candidateInfo: [
      "There are 10 questions in this test.",
      "Each question carries one mark.",
      "You will hear the recording once.",
      "For this part of the test there will be time for you to look through the questions and time for you to check your answers.",
    ],
  },

  reading: {
    id: "2",
    skill: "READING",
    title: "IELTS Academic Reading",
    timeInfo: "Time: 60 minutes",
    candidateInstructions: [
      "Answer all the questions.",
      "You can change your answers at any time during the test.",
      "Do not click 'Start test' until you are told to do so.",
    ],
    candidateInfo: [
      "There are 40 questions in this test.",
      "Each question carries one mark.",
      "You may write your answers on the question paper.",
      "You will NOT have extra time at the end to transfer your answers to an answer sheet.",
    ],
  },

  writing: {
    id: "3",
    skill: "WRITING",
    title: "IELTS Academic Writing",
    timeInfo: "Time: 60 minutes",
    candidateInstructions: [
      "Complete both Task 1 and Task 2.",
      "You can edit your response at any time during the test.",
      "Do not click 'Start test' until you are told to do so.",
    ],
    candidateInfo: [
      "Task 1 should take about 20 minutes.",
      "Task 2 should take about 40 minutes.",
      "Task 2 contributes twice as much to the final writing band score as Task 1.",
      "Write at least 150 words for Task 1 and at least 250 words for Task 2.",
    ],
  },

  speaking: {
    id: "4",
    skill: "SPEAKING",
    title: "IELTS Speaking",
    timeInfo: "Time: 11–14 minutes",
    candidateInstructions: [
      "Speak clearly and naturally.",
      "Answer the questions as fully as you can.",
      "Do not click 'Start test' until you are told to do so.",
    ],
    candidateInfo: [
      "The test has 3 parts.",
      "Part 2 includes 1 minute to prepare and up to 2 minutes to speak.",
      "You may be asked follow-up questions in Part 3.",
      "Your responses are assessed on fluency, vocabulary, grammar, and pronunciation.",
    ],
  },
};
