import { ExerciseIntroduction, Skill } from "../types.ts";

export const exerciseIntroductionBySkill: Record<Skill, ExerciseIntroduction> =
  {
    listening: {
      id: "1",
      skill: "LISTENING",
      title: "IELTS Academic Listening",
      timeInfo: "Follow the on-screen instructions before you begin.",
      candidateInstructions: [
        "Read the questions carefully before you listen.",
        "Answer every question and keep an eye on keywords (names, numbers, places).",
        "You can change your answers at any time before you submit.",
        "Make sure your spelling and grammar are correct where required.",
      ],
      candidateInfo: [
        "You will hear the audio without pausing during the test.",
        "Use the preparation and review time to check your answers.",
        "Pay attention to signposting language (e.g., 'first', 'however', 'finally').",
        "Write only what the question asks for (e.g., ONE WORD, a number, or letters).",
      ],
    },

    reading: {
      id: "2",
      skill: "READING",
      title: "IELTS Academic Reading",
      timeInfo: "Work at a steady pace and manage your time wisely.",
      candidateInstructions: [
        "Skim the passage first to understand the main idea.",
        "Then scan for keywords and paraphrases to find answers quickly.",
        "Answer every question and return to difficult ones later if needed.",
        "You can change your answers at any time before you submit.",
      ],
      candidateInfo: [
        "Not all answers appear in the same order as the passage—follow the task type.",
        "Check instructions for word limits (e.g., NO MORE THAN TWO WORDS).",
        "Copy words exactly from the passage when required.",
        "Spend a final moment reviewing spelling, word forms, and grammar.",
      ],
    },

    writing: {
      id: "3",
      skill: "WRITING",
      title: "IELTS Academic Writing",
      timeInfo: "Plan, write, and review your response before submitting.",
      candidateInstructions: [
        "Read the task carefully and highlight what you must include.",
        "Plan your response before you start writing.",
        "Organize your ideas into clear paragraphs with logical flow.",
        "Leave time to review and improve your writing before submitting.",
      ],
      candidateInfo: [
        "Address all parts of the task to avoid missing key requirements.",
        "Use a range of vocabulary and sentence structures naturally.",
        "Support your ideas with clear explanations and relevant examples.",
        "Check your work for grammar, punctuation, and spelling mistakes.",
      ],
    },

    speaking: {
      id: "4",
      skill: "SPEAKING",
      title: "IELTS Speaking",
      timeInfo: "Speak naturally and focus on clear communication.",
      candidateInstructions: [
        "Speak clearly at a natural pace—don’t rush.",
        "Answer the question directly, then add detail to develop your response.",
        "If you make a mistake, correct yourself and continue confidently.",
        "Try to use a range of vocabulary and grammatical structures.",
      ],
      candidateInfo: [
        "It’s okay to pause briefly to think, but avoid long silences.",
        "Use linking words to organize your ideas (e.g., 'because', 'however', 'for example').",
        "Focus on pronunciation and stress so your meaning is easy to understand.",
        "Stay on topic and respond fully to follow-up questions.",
      ],
    },
  };
