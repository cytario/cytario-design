import {
  noStyle,
  parseAnsiLine,
  parseAnsiLineCached,
} from "./ansi";

const text = (line: string): string =>
  parseAnsiLine(line).map((s) => s.text).join("");

const styles = (line: string) => parseAnsiLine(line).map((s) => s.style);

describe("parseAnsiLine — real-world SGR samples", () => {
  it("cyan-wrapped line yields a cyan segment plus plain reset", () => {
    const segments = parseAnsiLine("\u001b[36m09:42:03 INFO pulling image\u001b[0m");
    expect(segments).toHaveLength(1);
    expect(segments[0].text).toBe("09:42:03 INFO pulling image");
    expect(segments[0].style.fg).toBe("#6fc9d4");
    expect(text("\u001b[36m09:42:03 INFO pulling image\u001b[0m")).toBe(
      "09:42:03 INFO pulling image",
    );
  });

  it("yellow warning line", () => {
    const segments = parseAnsiLine("\u001b[33mWARN deprecated flag\u001b[0m");
    expect(segments[0].style.fg).toBe("#e8cd8a");
  });

  it("reset-then-bright-yellow sequence clears prior style", () => {
    const segments = parseAnsiLine("\u001b[0;93mFAILED\u001b[0m");
    expect(segments[0].text).toBe("FAILED");
    expect(segments[0].style.fg).toBe("#ffe0a0");
    expect(segments[0].style.bold).toBe(false);
  });

  it("multi-parameter mixed codes in one sequence", () => {
    const segments = parseAnsiLine("\u001b[36;1mcyan bold\u001b[0m");
    expect(segments[0].style.fg).toBe("#6fc9d4");
    expect(segments[0].style.bold).toBe(true);
  });

  it("empty parameter sequence acts as reset", () => {
    const after = styles("a\u001b[36;1mb\u001b[mc");
    expect(after).toHaveLength(3);
    expect(after[2].fg).toBeNull();
    expect(after[2].bold).toBe(false);
    expect(text("a\u001b[36;1mb\u001b[mc")).toBe("abc");
  });

  it("the dark-surface palette maps every standard and bright SGR index", () => {
    const standard = styles(
      "\u001b[30mA\u001b[31mB\u001b[32mC\u001b[33mD\u001b[34mE\u001b[35mF\u001b[36mG\u001b[37mH",
    ).map((s) => s.fg);
    expect(standard).toEqual([
      "#7d8697", "#ff8b93", "#a8d98a", "#e8cd8a",
      "#7db8f5", "#d79ae8", "#6fc9d4", "#e2e5ea",
    ]);
    const bright = styles(
      "\u001b[90mA\u001b[91mB\u001b[92mC\u001b[93mD\u001b[94mE\u001b[95mF\u001b[96mG\u001b[97mH",
    ).map((s) => s.fg);
    expect(bright).toEqual([
      "#8a93a4", "#ff9aa2", "#b6e89b", "#ffe0a0",
      "#96c8ff", "#e7b6f5", "#8adde6", "#ffffff",
    ]);
  });
});

describe("parseAnsiLine — style toggles", () => {
  it("bold, dim, italic, underline set and clear independently", () => {
    const [on] = styles("\u001b[1;2;3;4mx\u001b[22;23;24my");
    expect(on.bold).toBe(true);
    expect(on.dim).toBe(true);
    expect(on.italic).toBe(true);
    expect(on.underline).toBe(true);
    const [, off] = styles("\u001b[1;2;3;4mx\u001b[22;23;24my");
    expect(off.bold).toBe(false);
    expect(off.dim).toBe(false);
    expect(off.italic).toBe(false);
    expect(off.underline).toBe(false);
  });

  it("nested and repeated codes accumulate until reset", () => {
    const [a, b, c] = styles("\u001b[31mA\u001b[1mB\u001b[4mC\u001b[0mD");
    expect(a.fg).toBe("#ff8b93");
    expect(b.bold).toBe(true);
    expect(b.fg).toBe("#ff8b93");
    expect(c.underline).toBe(true);
    expect(c.bold).toBe(true);
    expect(c.fg).toBe("#ff8b93");
  });

  it("39 and 49 restore default fg/bg without clearing emphasis", () => {
    const [colored, restored] = styles("\u001b[31;44;1mA\u001b[39;49mB");
    expect(colored.fg).toBe("#ff8b93");
    expect(colored.bg).toBe("#7db8f5");
    expect(restored.fg).toBeNull();
    expect(restored.bg).toBeNull();
    expect(restored.bold).toBe(true);
  });

  it("standard and bright fg/bg ranges map to palette hexes", () => {
    const [fg] = styles("\u001b[35;46mA");
    expect(fg.fg).toBe("#d79ae8");
    expect(fg.bg).toBe("#6fc9d4");
    const [bright] = styles("\u001b[97;105mA");
    expect(bright.fg).toBe("#ffffff");
    expect(bright.bg).toBe("#e7b6f5");
  });
});

describe("parseAnsiLine — extended color", () => {
  it("256-color fg and bg resolve to palette entries", () => {
    const segments = parseAnsiLine("\u001b[38;5;196mA\u001b[48;5;21mB");
    // 196 = 16 + 6*6*5 + 0*6 + 0 → cube index r=5,g=0,b=0
    expect(segments[0].style.fg).toBe("#ff0000");
    expect(segments[1].style.bg).toBe("#0000ff");
  });

  it("truecolor fg and bg clamp and format as hex", () => {
    const segments = parseAnsiLine("\u001b[38;2;10;20;30;48;2;255;128;0mA");
    expect(segments[0].style.fg).toBe("#0a141e");
    expect(segments[0].style.bg).toBe("#ff8000");
  });

  it("malformed extended color degrades without emitting bytes", () => {
    expect(text("\u001b[38;5mcolorless\u001b[0m")).toBe("colorless");
    // Truncated truecolor at end of line: text is kept, color is not.
    expect(text("a\u001b[38;2;10;20b")).toBe("a");
    // A truncated CSI at end of line consumes the rest without text loss here.
    expect(text("a\u001b[38;5;999mb")).toBe("ab");
  });
});

describe("parseAnsiLine — unsupported and malformed sequences", () => {
  it("unrecognized CSI sequences are consumed", () => {
    expect(text("a\u001b[2Kb")).toBe("ab");
    expect(text("a\u001b[1;32Hb")).toBe("ab");
    expect(text("a\u001b[?25lb")).toBe("ab");
  });

  it("OSC sequences are consumed up to their terminator", () => {
    expect(text("a\u001b]0;title\u0007b")).toBe("ab");
    expect(text("a\u001b]8;;http://x\u001b\\b")).toBe("ab");
  });

  it("an unterminated OSC consumes the rest of the line", () => {
    expect(text("a\u001b]0;trailing")).toBe("a");
  });

  it("a truncated trailing escape is dropped without losing text", () => {
    expect(text("done\u001b[3")).toBe("done");
    expect(text("done\u001b")).toBe("done");
  });

  it("C0 control characters are consumed and never emitted", () => {
    expect(text("a\u0000b")).toBe("ab");
    expect(text("a\u0008b\u007fb")).toBe("abb");
    expect(text("progress\u0000done")).toBe("progressdone");
  });

  it("plain text without escapes passes through unchanged", () => {
    expect(text("09:42:03 INFO pulling image")).toBe("09:42:03 INFO pulling image");
  });

  it("no escape byte ever survives into output text", () => {
    const samples = [
      "\u001b[36m...\u001b[0m",
      "\u001b[33m",
      "\u001b[0;93m",
      "\u001b[m",
      "\u001b[2K",
      "\u001b]0;t\u0007",
      "a\u001b[38;5;10b",
      "x\u001b[",
    ];
    const isControl = (ch: string): boolean => {
      const code = ch.charCodeAt(0);
      return code === 0x1b || (code < 0x20 && ch !== "") || code === 0x7f;
    };
    for (const sample of samples) {
      for (const segment of parseAnsiLine(sample)) {
        for (const ch of segment.text) expect(isControl(ch)).toBe(false);
      }
    }
  });
});

describe("parseAnsiLineCached — memoization", () => {
  it("returns the same segment array instance for a repeated line", () => {
    const first = parseAnsiLineCached("\u001b[36mcached\u001b[0m");
    const second = parseAnsiLineCached("\u001b[36mcached\u001b[0m");
    expect(second).toBe(first);
    expect(first[0].style.fg).toBe("#6fc9d4");
  });

  it("evicts the oldest entry once the cache reaches its limit", () => {
    const first = parseAnsiLineCached("first-line");
    for (let i = 0; i < 500; i++) parseAnsiLineCached(`filler-${i}`);
    const evicted = parseAnsiLineCached("first-line");
    expect(evicted).not.toBe(first);
    expect(evicted).toEqual(first);
  });

  it("noStyle identifies unstyled segments", () => {
    expect(noStyle(parseAnsiLine("plain")[0].style)).toBe(true);
    expect(noStyle(parseAnsiLine("\u001b[4mx")[0].style)).toBe(false);
  });
});
