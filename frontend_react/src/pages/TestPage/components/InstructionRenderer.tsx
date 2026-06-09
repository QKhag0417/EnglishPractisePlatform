// InstructionRenderer.tsx
import React, { useMemo } from "react";
import { LogActivityInput, UserAnswers } from "../types";
import { buildImageUrl } from "../utils";

type FontWeight = React.CSSProperties["fontWeight"];
type FontStyle = React.CSSProperties["fontStyle"];

type InlineNode =
  | {
      type: "text";
      value: string;
      size?: number;
      weight?: FontWeight;
      style?: FontStyle;
      color?: string;
    }
  | { type: "gap"; n: number };

type TableCellNode = {
  colspan?: number;
  content: InlineNode[];
};

type TableRowNode = { cells: TableCellNode[] };

type MultipleChoiceOption = {
  key: string;
  label: string;
};

type DocNode =
  | { type: "paragraph"; inlines: InlineNode[] }
  | { type: "table"; rows: TableRowNode[] }
  | { type: "image"; src: string; alt?: string; width?: number }
  | {
      type: "multiple-choice";
      n: number;
      pick: number;
      options: MultipleChoiceOption[];
    };

function GapInput({
  n,
  userAnswers,
  onAnswerChange,
  onLogActivity,
}: {
  n: number;
  userAnswers: UserAnswers;
  onAnswerChange?: (questionNumber: number, value: string[]) => void;
  onLogActivity?: (input: LogActivityInput) => void;
}) {
  const selectedAnswers = userAnswers[n] ?? [];

  return (
    <span className="inline-flex max-w-full items-center gap-2 align-middle">
      <span className="flex items-center justify-center w-6 h-6 bg-[#1977f3] text-white rounded-full font-bold text-[12px] flex-shrink-0">
        {n}
      </span>
      <input
        className="h-8 min-w-0 flex-1 rounded-full border border-gray-300 px-3 text-[14px] outline-none focus:ring-2 focus:ring-[#1977f3]"
        value={selectedAnswers[0] ?? ""}
        onFocus={() =>
          onLogActivity?.({
            activityType: "GAP_FOCUS",
            questionNumber: n,
          })
        }
        onChange={(e) => {
          const nextValue = e.target.value;

          onAnswerChange?.(n, [nextValue]);

          onLogActivity?.({
            activityType: "GAP_INPUT",
            questionNumber: n,
            value: nextValue,
          });
        }}
        onBlur={(e) =>
          onLogActivity?.({
            activityType: "GAP_BLUR",
            questionNumber: n,
            value: e.target.value,
          })
        }
        placeholder=""
      />
    </span>
  );
}

function InlineRenderer({
  nodes,
  userAnswers,
  onAnswerChange,
  onLogActivity,
}: {
  nodes: InlineNode[];
  userAnswers: UserAnswers;
  onAnswerChange?: (questionNumber: number, value: string[]) => void;
  onLogActivity?: (input: LogActivityInput) => void;
}) {
  return (
    <>
      {nodes.map((node, idx) => {
        if (node.type === "text") {
          const spanStyle: React.CSSProperties = {
            color: node.color,
            fontSize: node.size != null ? `${node.size}px` : undefined,
            fontWeight: node.weight,
            fontStyle: node.style,
          };

          return (
            <span key={idx} style={spanStyle}>
              {node.value}
            </span>
          );
        } else if (node.type === "gap") {
          return (
            <GapInput
              key={idx}
              n={node.n}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              onLogActivity={onLogActivity}
            />
          );
        }

        return null;
      })}
    </>
  );
}

function ParagraphRenderer({
  node,
  userAnswers,
  onAnswerChange,
  onLogActivity,
}: {
  node: Extract<DocNode, { type: "paragraph" }>;
  userAnswers: UserAnswers;
  onAnswerChange?: (questionNumber: number, value: string[]) => void;
  onLogActivity?: (input: LogActivityInput) => void;
}) {
  return (
    <p className={"text-[14px] text-gray-700 leading-relaxed"}>
      <InlineRenderer
        nodes={node.inlines}
        userAnswers={userAnswers}
        onAnswerChange={onAnswerChange}
        onLogActivity={onLogActivity}
      />
    </p>
  );
}

function ImageRenderer({
  node,
}: {
  node: Extract<DocNode, { type: "image" }>;
}) {
  const imageUrl = buildImageUrl(node.src);
  return (
    <figure className="my-3">
      <img
        src={imageUrl}
        alt={node.alt ?? ""}
        style={node.width ? { width: node.width } : undefined}
        className="rounded-lg border border-gray-200"
      />
    </figure>
  );
}

function TableRenderer({
  node,
  userAnswers,
  onAnswerChange,
  onLogActivity,
}: {
  node: Extract<DocNode, { type: "table" }>;
  userAnswers: UserAnswers;
  onAnswerChange?: (questionNumber: number, value: string[]) => void;
  onLogActivity?: (input: LogActivityInput) => void;
}) {
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
                      userAnswers={userAnswers}
                      onAnswerChange={onAnswerChange}
                      onLogActivity={onLogActivity}
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

function MultipleChoiceRender({
  node,
  userAnswers,
  onAnswerChange,
  onLogActivity,
}: {
  node: Extract<DocNode, { type: "multiple-choice" }>;
  userAnswers: UserAnswers;
  onAnswerChange?: (questionNumber: number, value: string[]) => void;
  onLogActivity?: (input: LogActivityInput) => void;
}) {
  const pick = node.pick ?? 1;
  const startQuestionNumber = node.n;

  const questionNumbers = Array.from(
    { length: pick },
    (_, i) => startQuestionNumber + i,
  );

  const isSinglePick = pick <= 1;

  const selectedAnswers: string[] = isSinglePick
    ? (userAnswers[startQuestionNumber] ?? [])
    : questionNumbers
        .map((q) => (userAnswers[q] ?? [])[0])
        .filter((x): x is string => Boolean(x));

  const setSelected = (next: string[]) => {
    if (!onAnswerChange) return;

    if (isSinglePick) {
      onAnswerChange(startQuestionNumber, next);
      return;
    }

    for (let i = 0; i < pick; i++) {
      const qNo = startQuestionNumber + i;
      const letter = next[i];
      onAnswerChange(qNo, letter ? [letter] : []);
    }
  };

  const handleSelect = (letter: string) => {
    const isChecked = selectedAnswers.includes(letter);

    if (isSinglePick) {
      setSelected([letter]);

      onLogActivity?.({
        activityType: "MCQ_SELECT",
        questionNumber: startQuestionNumber,
        value: letter,
      });

      return;
    }

    if (isChecked) {
      setSelected(selectedAnswers.filter((x) => x !== letter));

      onLogActivity?.({
        activityType: "MCQ_DESELECT",
        questionNumber: startQuestionNumber,
        value: letter,
      });
    } else {
      if (selectedAnswers.length >= pick) return;

      setSelected([...selectedAnswers, letter]);

      onLogActivity?.({
        activityType: "MCQ_SELECT",
        questionNumber: startQuestionNumber,
        value: letter,
      });
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
                name={isSinglePick ? `q-${startQuestionNumber}` : undefined}
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

const isDocNodeArray = (v: unknown): v is DocNode[] =>
  Array.isArray(v) &&
  v.every((n): n is DocNode => !!n && typeof n === "object" && "type" in n);

const toDocNodes = (v: unknown): DocNode[] => {
  if (isDocNodeArray(v)) return v;

  if (typeof v === "string") {
    const s = v.trim();
    if (!s) return [];
    try {
      const parsed: unknown = JSON.parse(s);
      if (isDocNodeArray(parsed)) return parsed;
    } catch {}
  }

  return [];
};

export function InstructionRenderer({
  instruction,
  userAnswers = {},
  onAnswerChange,
  onLogActivity,
}: {
  instruction: string | DocNode[];
  userAnswers?: UserAnswers;
  onAnswerChange?: (questionNumber: number, value: string[]) => void;
  onLogActivity?: (input: LogActivityInput) => void;
}) {
  const doc = useMemo(() => toDocNodes(instruction), [instruction]);

  return (
    <div className="space-y-3 mb-8">
      {doc.map((node, idx) => {
        if (node.type === "paragraph") {
          return (
            <ParagraphRenderer
              key={idx}
              node={node}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              onLogActivity={onLogActivity}
            />
          );
        }

        if (node.type === "image") {
          return <ImageRenderer key={idx} node={node} />;
        }

        if (node.type === "table") {
          return (
            <TableRenderer
              key={idx}
              node={node}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              onLogActivity={onLogActivity}
            />
          );
        }

        if (node.type === "multiple-choice") {
          return (
            <MultipleChoiceRender
              key={idx}
              node={node}
              userAnswers={userAnswers}
              onAnswerChange={onAnswerChange}
              onLogActivity={onLogActivity}
            />
          );
        }

        return null;
      })}
    </div>
  );
}
