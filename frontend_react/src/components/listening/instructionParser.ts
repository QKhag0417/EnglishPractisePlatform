// instructionParser.ts
export type InlineNode =
  | {
      type: "text";
      value: string;
      size?: number;
      weight?: FontWeight;
      style?: FontStyle;
      color?: string;
    }
  | { type: "gap"; n: number };

export type TableCellNode = {
  colspan?: number;
  content: InlineNode[];
};

export type TableRowNode = { cells: TableCellNode[] };

export type MultipleChoiceOption = {
  key: string; // "A", "B", "C", "D"
  label: string;
};

export type DocNode =
  | { type: "paragraph"; inlines: InlineNode[] }
  | { type: "table"; rows: TableRowNode[] }
  | { type: "image"; src: string; alt?: string; width?: number }
  | {
      type: "multiple-choice";
      n: number;
      pick: number;
      options: MultipleChoiceOption[];
    };

function parseAttrs(attrStr: string): Record<string, string> {
  const attrs: Record<string, string> = {};
  const re = /(\w+)\s*=\s*"([^"]*)"/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(attrStr))) {
    attrs[m[1]] = m[2];
  }
  return attrs;
}

type FontWeight = number | "normal" | "bold" | "bolder" | "lighter";
type FontStyle = "normal" | "italic" | "oblique";

type Format = {
  size?: number;
  weight?: FontWeight;
  style?: FontStyle;
  color?: string;
};

function parseInline(text: string): InlineNode[] {
  const nodes: InlineNode[] = [];

  let active: Format | null = null;

  const pushText = (value: string) => {
    if (!value) return;
    nodes.push({
      type: "text",
      value,
      size: active?.size,
      weight: active?.weight,
      style: active?.style,
      color: active?.color,
    });
  };

  let i = 0;

  while (i < text.length) {
    const b = text.indexOf("[", i);
    if (b === -1) {
      pushText(text.slice(i));
      break;
    }

    if (b > i) pushText(text.slice(i, b));

    const rest = text.slice(b);

    // [gap:n]
    const gapM = rest.match(/^\[gap:(\d+)\]/);
    if (gapM) {
      nodes.push({ type: "gap", n: Number(gapM[1]) });
      i = b + gapM[0].length;
      continue;
    }

    // [f ...]
    const fOpen = rest.match(/^\[f([^\]]*)\]/);
    if (fOpen) {
      const attrs = parseAttrs(fOpen[1] ?? "");

      // size
      const sizeNum = attrs.size != null ? Number(attrs.size) : undefined;
      const size = Number.isFinite(sizeNum) ? sizeNum : undefined;

      // color
      const color = attrs.color != null ? String(attrs.color) : undefined;

      // weight: prefer attrs.weight; fallback from attrs.style (old markup)
      let weight: FontWeight | undefined;
      if (attrs.weight != null) {
        const wNum = Number(attrs.weight);
        weight = Number.isFinite(wNum) ? wNum : (attrs.weight as FontWeight);
      } else if (attrs.style === "bold" || attrs.style === "bold-italic") {
        weight = 700;
      }

      // style: prefer explicit font-style-ish values; fallback from attrs.style (old markup)
      let style: FontStyle | undefined;
      if (attrs.style === "italic" || attrs.style === "bold-italic")
        style = "italic";
      else if (attrs.style === "normal" || attrs.style === "regular")
        style = "normal";
      else if (attrs.style === "oblique") style = "oblique";

      active = { size, weight, style, color };

      i = b + fOpen[0].length;
      continue;
    }

    // [/f]
    if (rest.startsWith("[/f]")) {
      active = null;
      i = b + "[/f]".length;
      continue;
    }

    // unknown tag => treat '[' as text
    pushText("[");
    i = b + 1;
  }

  return nodes;
}

function parseTable(block: string): DocNode {
  const open = block.match(/^\[table([^\]]*)\]/);
  const closeIndex = block.lastIndexOf("[/table]");
  const inner = block.slice(open?.[0].length ?? 0, closeIndex);

  const rowRe = /\[row\]([\s\S]*?)\[\/row\]/g;
  const rows: TableRowNode[] = [];
  let rm: RegExpExecArray | null;

  while ((rm = rowRe.exec(inner))) {
    const rowInner = rm[1];

    const cellRe = /\[cell([^\]]*)\]([\s\S]*?)\[\/cell\]/g;
    const cells: TableCellNode[] = [];
    let cm: RegExpExecArray | null;

    while ((cm = cellRe.exec(rowInner))) {
      const cellAttrs = parseAttrs(cm[1] ?? "");
      const colspan = cellAttrs.colspan ? Number(cellAttrs.colspan) : undefined;
      const content = parseInline(cm[2].trim());
      cells.push({ colspan, content });
    }

    // Optional shortcut: allow [row]Some text [gap:1][/row] (no explicit [cell])
    if (cells.length === 0) {
      cells.push({ content: parseInline(rowInner.trim()) });
    }

    rows.push({ cells });
  }

  return { type: "table", rows };
}

function parseImage(tag: string): DocNode {
  const m = tag.match(/^\[img([^\]]*)\]$/);
  const attrs = parseAttrs(m?.[1] ?? "");

  const width = attrs.width ? Number(attrs.width) : undefined;
  return {
    type: "image",
    src: attrs.src,
    alt: attrs.alt,
    width: Number.isFinite(width) ? width : undefined,
  };
}

function parseMultipleChoice(block: string): DocNode {
  const open = block.match(/^\[multiple-choice([^\]]*)\]/);
  const closeIndex = block.lastIndexOf("[/multiple-choice]");
  const inner = block.slice(open?.[0].length ?? 0, closeIndex).trim();

  const attrs = parseAttrs(open?.[1] ?? "");

  const n = attrs.n ? Number(attrs.n) : -1;
  let pick = attrs.pick ? Number(attrs.pick) : 1;
  if (!Number.isFinite(pick) || pick < 1) pick = 1;

  const optionRe = /\[option([^\]]*)\]([\s\S]*?)\[\/option\]/g;
  const options: MultipleChoiceOption[] = [];

  let om: RegExpExecArray | null;
  while ((om = optionRe.exec(inner))) {
    const optAttrs = parseAttrs(om[1] ?? "");
    const key =
      optAttrs.key?.trim() || String.fromCharCode(65 + options.length); // fallback A, B, C...

    const label = om[2].trim();
    options.push({ key, label });
  }

  return {
    type: "multiple-choice",
    n,
    pick,
    options,
  };
}

function pushParagraphNodes(out: DocNode[], text: string) {
  const parts = text
    .split(/\n\s*\n/g) // blank lines -> paragraph breaks
    .map((s) => s.trim())
    .filter(Boolean);

  for (const p of parts) {
    out.push({ type: "paragraph", inlines: parseInline(p) });
  }
}

export function parseInstruction(input: string): DocNode[] {
  const nodes: DocNode[] = [];
  let i = 0;

  const TABLE_OPEN = "[table";
  const TABLE_CLOSE = "[/table]";
  const IMG_OPEN = "[img";
  const IMG_CLOSE = "]";
  const MC_OPEN = "[multiple-choice";
  const MC_CLOSE = "[/multiple-choice]";

  while (i < input.length) {
    const nextTable = input.indexOf(TABLE_OPEN, i);
    const nextImg = input.indexOf(IMG_OPEN, i);
    const nextMc = input.indexOf(MC_OPEN, i);

    const nextCandidates = [nextTable, nextImg, nextMc].filter((x) => x !== -1);
    if (nextCandidates.length === 0) {
      pushParagraphNodes(nodes, input.slice(i));
      break;
    }

    const nextPos = Math.min(...nextCandidates);

    if (nextPos > i) {
      pushParagraphNodes(nodes, input.slice(i, nextPos));
    }

    if (nextPos === nextTable) {
      const end = input.indexOf(TABLE_CLOSE, nextPos);
      if (end === -1) {
        // malformed table; fall back to text
        pushParagraphNodes(nodes, input.slice(nextPos));
        break;
      }
      const block = input.slice(nextPos, end + TABLE_CLOSE.length);
      nodes.push(parseTable(block));
      i = end + TABLE_CLOSE.length;
    } else if (nextPos == nextImg) {
      const end = input.indexOf(IMG_CLOSE, nextPos);
      if (end === -1) {
        pushParagraphNodes(nodes, input.slice(nextPos));
        break;
      }
      const tag = input.slice(nextPos, end + 1);
      nodes.push(parseImage(tag));
      i = end + 1;
    } else {
      const end = input.indexOf(MC_CLOSE, nextPos);
      if (end === -1) {
        pushParagraphNodes(nodes, input.slice(nextPos));
        break;
      }
      const block = input.slice(nextPos, end + MC_CLOSE.length);

      nodes.push(parseMultipleChoice(block));

      i = end + MC_CLOSE.length;
    }
  }

  return nodes;
}
