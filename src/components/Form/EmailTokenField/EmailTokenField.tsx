import { X } from "lucide-react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import {
  Text,
  Token,
  TokenField,
  TokenFieldValue,
  TokenInput,
  type TokenFieldProps,
} from "react-aria-components";
import { twMerge } from "tailwind-merge";

import { Label } from "../Label";

/** Why a committed token is not a usable address; absent on valid tokens. */
type EmailIssue = "format" | "duplicate";

type TextSegment = { type: "text"; text: string };
type TokenSegment = { type: "token"; text: string; value?: EmailIssue };
type Segment = TextSegment | TokenSegment;

const DELIMITER_PARTS = /([,;\s]+)/;
const DELIMITER_ONLY = /^[,;\s]+$/;
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const SEPARATOR: TextSegment = { type: "text", text: " " };

function isToken(segment: Segment): segment is TokenSegment {
  return segment.type === "token";
}

function sameList(a: readonly string[], b: readonly string[]) {
  return a.length === b.length && a.every((item, index) => item === b[index]);
}

function pushText(segments: Segment[], text: string) {
  const last = segments.at(-1);
  if (last?.type === "text") {
    segments[segments.length - 1] = { type: "text", text: last.text + text };
  } else {
    segments.push({ type: "text", text });
  }
}

/**
 * Keeps every segment list in one shape — `token, " ", token, " ", pending` —
 * so the caret always has a text node after a token to sit in. Adjacent text
 * segments are merged, matching the base class, because RAC maps segments 1:1
 * onto the editable root's DOM children.
 */
class EmailTokenFieldValue extends TokenFieldValue<EmailIssue> {
  static fromTokens(tokens: readonly TokenSegment[]): EmailTokenFieldValue {
    return new EmailTokenFieldValue(
      tokens.flatMap((token) => [token, SEPARATOR]),
    ).withCaretAtEnd();
  }

  static fromEmails(emails: readonly string[]): EmailTokenFieldValue {
    return EmailTokenFieldValue.fromTokens(
      emails.map((text) => ({ type: "token", text })),
    );
  }

  private get tokens(): TokenSegment[] {
    return (this.segments as readonly Segment[]).filter(isToken);
  }

  get emails(): string[] {
    return this.tokens.filter((token) => !token.value).map(({ text }) => text);
  }

  get invalid(): string[] {
    return this.tokens.filter((token) => token.value).map(({ text }) => text);
  }

  get tokenCount(): number {
    return this.tokens.length;
  }

  withCaretAtEnd(): this {
    const last = this.segments.at(-1);
    return this.withCaretPosition(
      last
        ? { index: this.segments.length - 1, offset: last.text.length }
        : { index: 0, offset: 0 },
    );
  }

  /** Commits every fragment still typed as text; used for Enter and blur. */
  withPendingCommitted(): EmailTokenFieldValue {
    const segments = this.segments as readonly Segment[];
    const hasPending = segments.some(
      (segment) => segment.type === "text" && segment.text.trim() !== "",
    );
    if (!hasPending) return this;

    const seen = this.seenEmails();
    const tokens = segments.flatMap((segment) =>
      isToken(segment)
        ? [segment]
        : segment.text
            .split(DELIMITER_PARTS)
            .filter((part) => part && !DELIMITER_ONLY.test(part))
            .map((part) => classify(part, seen)),
    );
    return EmailTokenFieldValue.fromTokens(tokens);
  }

  /** Removes a token together with the separator that follows it. */
  withoutToken(index: number): this {
    const next = this.segments[index + 1];
    const end =
      next?.type === "text" && next.text.startsWith(" ")
        ? { index: index + 1, offset: 1 }
        : { index, offset: this.segments[index].text.length };
    return this.replaceRange({ index, offset: 0 }, end, "", false);
  }

  /** Turns the given tokens back into the text they were typed as. */
  withTokensAsText(indices: ReadonlySet<number>): EmailTokenFieldValue {
    const segments: Segment[] = [];
    (this.segments as readonly Segment[]).forEach((segment, index) => {
      if (segment.type === "token" && !indices.has(index)) {
        segments.push(segment);
      } else {
        pushText(segments, segment.text);
      }
    });
    return new EmailTokenFieldValue(segments).withCaretAtEnd();
  }

  private seenEmails(): Set<string> {
    return new Set(this.emails.map((email) => email.toLowerCase()));
  }

  /** Commits a fragment only once a delimiter closes it, so typing `a@x.co` is not frozen mid-address. */
  protected tokenize(text: string): Segment[] {
    const parts = text.split(DELIMITER_PARTS);
    const seen = this.seenEmails();
    const segments: Segment[] = [];

    parts.forEach((part, index) => {
      if (!part) return;
      if (DELIMITER_ONLY.test(part)) {
        pushText(segments, " ");
        return;
      }
      if (parts[index + 1]) {
        segments.push(classify(part, seen));
        return;
      }
      pushText(segments, part);
    });

    return segments;
  }
}

function classify(text: string, seen: Set<string>): TokenSegment {
  if (!EMAIL.test(text)) return { type: "token", text, value: "format" };
  const key = text.toLowerCase();
  if (seen.has(key)) return { type: "token", text, value: "duplicate" };
  seen.add(key);
  return { type: "token", text };
}

function issueMessage(value: EmailTokenFieldValue): string | null {
  const tokens = (value.segments as readonly Segment[]).filter(isToken);
  const issue = tokens.find((token) => token.value);
  if (!issue) return null;
  return issue.value === "duplicate"
    ? `${issue.text} was already added.`
    : `${issue.text} is not a valid email address.`;
}

export interface EmailTokenFieldProps extends Omit<
  TokenFieldProps<EmailTokenFieldValue>,
  "children" | "className" | "value" | "onChange" | "onSubmit"
> {
  label: string;
  /** The committed valid addresses; text still being typed is not included. */
  value: string[];
  /** Reports valid addresses and, separately, committed tokens that are invalid or duplicates. */
  onChange: (emails: string[], invalid: string[]) => void;
  description?: string;
  errorMessage?: string;
  placeholder?: string;
  /** Refuses further tokens once reached; default 100. */
  maxTokens?: number;
  isRequired?: boolean;
  className?: string;
}

export function EmailTokenField({
  label,
  value,
  onChange,
  description,
  errorMessage,
  placeholder,
  maxTokens = 100,
  isDisabled,
  isRequired,
  className,
  onBlur,
  ...props
}: EmailTokenFieldProps) {
  const [fieldValue, setFieldValue] = useState(() =>
    EmailTokenFieldValue.fromEmails(value),
  );
  const [limitError, setLimitError] = useState<string | null>(null);
  const latest = useRef(fieldValue);
  const emitted = useRef({ emails: value, invalid: [] as string[] });

  const apply = useCallback(
    (next: EmailTokenFieldValue) => {
      const current = latest.current;

      if (next.segments === current.segments) {
        latest.current = next;
        setFieldValue(next);
        return;
      }
      // RAC derives selection updates from the last rendered value; one that
      // lands after a programmatic edit in the same tick would revert it.
      if (next.segments === fieldValue.segments) return;

      let accepted = next;
      const overflow = next.tokenCount > maxTokens;
      if (overflow) {
        const known = new Map<string, number>();
        for (const token of (current.segments as readonly Segment[]).filter(
          isToken,
        )) {
          known.set(token.text, (known.get(token.text) ?? 0) + 1);
        }
        const refused = new Set<number>();
        let kept = 0;
        (next.segments as readonly Segment[]).forEach((segment, index) => {
          if (!isToken(segment)) return;
          const remaining = known.get(segment.text) ?? 0;
          if (remaining > 0) {
            known.set(segment.text, remaining - 1);
            kept += 1;
          } else if (kept >= maxTokens) {
            refused.add(index);
          } else {
            kept += 1;
          }
        });
        accepted = next.withTokensAsText(refused);
      }

      setLimitError(
        overflow ? `Enter at most ${maxTokens} email addresses.` : null,
      );
      latest.current = accepted;
      setFieldValue(accepted);

      const { emails, invalid } = accepted;
      if (
        !sameList(emails, emitted.current.emails) ||
        !sameList(invalid, emitted.current.invalid)
      ) {
        emitted.current = { emails, invalid };
        onChange(emails, invalid);
      }
    },
    [fieldValue, maxTokens, onChange],
  );

  useEffect(() => {
    if (!sameList(value, emitted.current.emails)) {
      const next = EmailTokenFieldValue.fromEmails(value);
      emitted.current = { emails: value, invalid: [] };
      latest.current = next;
      setFieldValue(next);
    }
  }, [value]);

  const commitPending = () => apply(latest.current.withPendingCommitted());

  const removeToken = (index: number) =>
    apply(latest.current.withoutToken(index));

  const message = errorMessage ?? limitError ?? issueMessage(fieldValue);
  const errorId = useId();
  const isEmpty = fieldValue.segments.length === 0;
  const inputRef = useRef<HTMLDivElement>(null);

  // RAC's TokenField filters aria-invalid out of the props it forwards.
  useEffect(() => {
    if (message) inputRef.current?.setAttribute("aria-invalid", "true");
    else inputRef.current?.removeAttribute("aria-invalid");
  }, [message]);

  return (
    <TokenField
      {...props}
      value={fieldValue}
      onChange={apply}
      onSubmit={commitPending}
      onBlur={(event) => {
        commitPending();
        onBlur?.(event);
      }}
      isDisabled={isDisabled}
      aria-describedby={
        [message && errorId, props["aria-describedby"]]
          .filter(Boolean)
          .join(" ") || undefined
      }
      className={twMerge("flex w-full flex-col gap-1", className)}
    >
      <Label isRequired={isRequired}>{label}</Label>

      <div className="relative">
        {isEmpty && placeholder && (
          <span
            aria-hidden="true"
            className="
              pointer-events-none absolute inset-0 truncate
              border border-transparent px-2 py-px
              text-base leading-7 text-muted-foreground
            "
          >
            {placeholder}
          </span>
        )}

        {/* Must stay a block: a flex root has no line boxes, and Firefox then misplaces or hides the caret. */}
        <TokenInput
          ref={inputRef}
          className={twMerge(
            `
              block min-h-8 w-full px-2 py-px
              rounded-md border bg-background
              text-base leading-7 text-foreground break-words
              outline-none transition-colors
              focus:ring-2 focus:ring-ring focus:border-ring
            `,
            message ? "border-destructive-border" : "border-border",
            isDisabled && "opacity-50 pointer-events-none",
          )}
        >
          {(segment) => {
            const index = fieldValue.segments.indexOf(segment);
            return (
              <Token
                className={twMerge(
                  `
                    my-0.5 inline-flex h-6 items-center gap-1 align-top
                    rounded-full border px-2 text-sm leading-none
                  `,
                  segment.value
                    ? "border-destructive-border bg-destructive-surface text-destructive-surface-foreground"
                    : "border-border bg-muted text-foreground",
                )}
              >
                {segment.text}
                <button
                  type="button"
                  tabIndex={-1}
                  aria-label={`Remove ${segment.text}`}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => removeToken(index)}
                  className="cursor-pointer opacity-70 hover:opacity-100"
                >
                  <X className="h-3 w-3" aria-hidden="true" />
                </button>
              </Token>
            );
          }}
        </TokenInput>
      </div>

      {description && (
        <Text slot="description" className="text-sm text-muted-foreground">
          {description}
        </Text>
      )}

      {message && (
        <span id={errorId} role="alert" className="text-sm text-destructive">
          {message}
        </span>
      )}
    </TokenField>
  );
}
