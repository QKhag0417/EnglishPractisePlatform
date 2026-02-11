// InstructionScreen.tsx
import React, { useMemo } from "react";
import { IELTSMastermindLogo } from "../../../components/Logo.tsx";
import type { ExerciseInstruction, Skill } from "../types.ts";
import { exerciseInstructionsBySkill } from "../mock/instructions.mock.ts";

interface TestInstructionScreenProps {
  skill: Skill;
  onStartTest: () => void;
}

export function TestInstructionScreen({
  skill,
  onStartTest,
}: TestInstructionScreenProps) {
  const instruction = exerciseInstructionsBySkill[skill];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-8">
      <div className="bg-white rounded-lg shadow-lg max-w-[900px] w-full p-12">
        <h1 className="text-[32px] font-bold text-[#1977f3] mb-6">
          {instruction.title}
        </h1>

        <p className="text-[18px] text-gray-600 mb-8">
          <span className="font-bold">{instruction.timeInfo}</span>
        </p>

        <div className="mb-8">
          <h2 className="text-[20px] font-bold text-black mb-4">
            INSTRUCTIONS TO CANDIDATES
          </h2>
          <ul className="list-disc list-inside space-y-3 text-[16px] text-gray-700">
            {instruction.candidateInstructions.map((text, index) => (
              <li key={`${instruction.id}-ci-${index}`}>{text}</li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h2 className="text-[20px] font-bold text-black mb-4">
            INFORMATION FOR CANDIDATES
          </h2>
          <ul className="list-disc list-inside space-y-3 text-[16px] text-gray-700">
            {instruction.candidateInfo.map((text, index) => (
              <li key={`${instruction.id}-info-${index}`}>{text}</li>
            ))}
          </ul>
        </div>

        <p className="text-center text-[16px] text-gray-700 font-medium mb-6">
          Do not click 'Start test' until you are told to do so.
        </p>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={onStartTest}
            className="bg-[#dc3545] hover:bg-[#c82333] text-white px-12 py-3 rounded-lg font-semibold text-[18px] transition-colors"
          >
            Start test
          </button>
        </div>
      </div>
    </div>
  );
}
