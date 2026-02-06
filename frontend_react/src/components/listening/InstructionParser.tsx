// InstructionRenderer.tsx
import React from "react";
import { DocNode, InlineNode, parseInstruction } from "./instructionParser";

type UserAnswers = Record<number, string | string[]>;

function GapInput({
  n,
  onAnswerChange,
}: {
  n: number;
  onAnswerChange?: (questionNumber: number, value: string) => void;
}) {
  return (
    <span className="inline-flex items-center gap-2 align-middle">
      <span className="flex items-center justify-center w-6 h-6 bg-[#1977f3] text-white rounded-full font-bold text-[12px] flex-shrink-0">
        {n}
      </span>
      <input
        className="h-8 w-[220px] rounded-full border border-gray-300 px-3 text-[14px] outline-none focus:ring-2 focus:ring-[#1977f3]"
        onChange={(e) => onAnswerChange?.(n, e.target.value)}
        placeholder=""
      />
    </span>
  );
}

function InlineRenderer({
  nodes,
  onAnswerChange,
}: {
  nodes: InlineNode[];
  onAnswerChange?: (questionNumber: number, value: string) => void;
}) {
  return (
    <>
      {nodes.map((node, idx) => {
        if (node.type === "text") {
          const spanStyle: React.CSSProperties = {
            color: node.color,
            fontSize: node.size != null ? `${node.size}px` : undefined,
            fontWeight: node.weight, // number | "normal" | "bold" | ...
            fontStyle: node.style, // "normal" | "italic" | "oblique"
          };

          return (
            <span key={idx} style={spanStyle}>
              {node.value}
            </span>
          );
        }

        // gap
        return (
          <GapInput key={idx} n={node.n} onAnswerChange={onAnswerChange} />
        );
      })}
    </>
  );
}

function TableRenderer({
  node,
  onAnswerChange,
}: {
  node: Extract<DocNode, { type: "table" }>;
  onAnswerChange?: (questionNumber: number, value: string) => void;
}) {
  // Total logical columns in the widest row (respecting colspan)
  const colCount = Math.max(
    1,
    ...node.rows.map((row) =>
      row.cells.reduce((sum, cell) => sum + Math.max(cell.colspan ?? 1, 1), 0),
    ),
  );

  return (
    <div className="my-4 overflow-hidden rounded-xl border border-gray-200">
      <div className="divide-y divide-gray-200">
        {node.rows.map((row, rIdx) => (
          <div
            key={rIdx}
            className="grid"
            style={{
              gridTemplateColumns: `repeat(${colCount}, minmax(0, 1fr))`,
              gap: 0,
            }}
          >
            {row.cells.map((cell, cIdx) => {
              const span = Math.max(cell.colspan ?? 1, 1);

              return (
                <div
                  key={cIdx}
                  className={`border-gray-200 px-4 py-3 ${
                    cIdx < row.cells.length - 1 ? "border-r" : ""
                  }`}
                  style={{
                    gridColumn: `span ${span} / span ${span}`,
                  }}
                >
                  <div className="text-[14px] text-gray-800">
                    <InlineRenderer
                      nodes={cell.content}
                      onAnswerChange={onAnswerChange}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MultipleChoiceRenderer({
  node,
  value,
  onAnswerChange,
}: {
  node: Extract<DocNode, { type: "multiple-choice" }>;
  value?: string | string[];
  onAnswerChange?: (questionNumber: number, value: string | string[]) => void;
}) {
  const pick = node.pick ?? 1;
  const questionNumber = node.n;

  const isSinglePick = pick <= 1;

  const selectedAnswers: string[] = Array.isArray(value)
    ? value
    : typeof value === "string" && value
      ? [value]
      : [];

  const setSelected = (next: string[]) => {
    if (isSinglePick) {
      onAnswerChange?.(questionNumber, next[0] ?? "");
    } else {
      onAnswerChange?.(questionNumber, next);
    }
  };

  const handleSelect = (letter: string) => {
    const isChecked = selectedAnswers.includes(letter);

    if (isSinglePick) {
      // radio behavior: set one answer
      setSelected([letter]);
      return;
    }

    // checkbox behavior with max limit
    if (isChecked) {
      setSelected(selectedAnswers.filter((x) => x !== letter));
    } else {
      if (selectedAnswers.length >= pick) return;
      setSelected([...selectedAnswers, letter]);
    }
  };

  const inputClassName = isSinglePick
    ? "w-5 h-5 text-[#1977f3] rounded-full border-gray-300 focus:ring-[#1977f3]"
    : "w-5 h-5 text-[#1977f3] rounded-sm border-gray-300 focus:ring-[#1977f3]";

  return (
    <div className="bg-white">
      <div className="space-y-3">
        {node.options.map((opt) => {
          const optionLetter = opt.key; // "A", "B", "C", ...
          const isChecked = selectedAnswers.includes(optionLetter);

          return (
            <label
              key={optionLetter}
              className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded"
            >
              <input
                type={isSinglePick ? "radio" : "checkbox"}
                name={isSinglePick ? `q-${questionNumber}` : undefined}
                checked={isChecked}
                onChange={() => handleSelect(optionLetter)}
                className={inputClassName}
              />

              <span className="text-[14px] text-black font-semibold mr-2">
                {optionLetter}
              </span>
              <span className="text-[14px] text-black">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </div>
  );
}

export function InstructionRenderer({
  instruction,
  userAnswers,
  onAnswerChange,
}: {
  instruction: string;
  userAnswers: UserAnswers;
  onAnswerChange?: (questionNumber: number, value: string | string[]) => void;
}) {
  const doc = React.useMemo(() => parseInstruction(instruction), [instruction]);

  return (
    <div className="space-y-3 mb-8">
      {doc.map((node, idx) => {
        if (node.type === "paragraph") {
          return (
            <p key={idx} className="text-[14px] text-gray-700 leading-relaxed">
              <InlineRenderer
                nodes={node.inlines}
                onAnswerChange={onAnswerChange}
              />
            </p>
          );
        }

        if (node.type === "image") {
          return (
            <figure key={idx} className="my-3">
              <img
                src={node.src}
                alt={node.alt ?? ""}
                style={node.width ? { width: node.width } : undefined}
                className="rounded-lg border border-gray-200"
              />
            </figure>
          );
        }

        if (node.type === "table") {
          return (
            <TableRenderer
              key={idx}
              node={node}
              onAnswerChange={onAnswerChange}
            />
          );
        }

        if (node.type === "multiple-choice") {
          return (
            <MultipleChoiceRenderer
              key={idx}
              node={node}
              value={userAnswers[node.n]}
              onAnswerChange={onAnswerChange}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
