import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState, type ComponentProps } from "react";
import { describe, expect, test, vi } from "vitest";

import { EmailTokenField } from "./EmailTokenField";

// jsdom's InputEvent has no getTargetRanges; react-aria's token field calls it
// on every edit and throws without it.
if (!("getTargetRanges" in InputEvent.prototype)) {
  (
    InputEvent.prototype as unknown as { getTargetRanges: () => Range[] }
  ).getTargetRanges = () => [];
}

type FieldProps = Partial<ComponentProps<typeof EmailTokenField>>;

function Controlled({
  initial = [],
  onChange,
  ...props
}: FieldProps & {
  initial?: string[];
  onChange?: (emails: string[], invalid: string[]) => void;
}) {
  const [value, setValue] = useState<string[]>(initial);
  return (
    <EmailTokenField
      label="Emails"
      value={value}
      onChange={(emails, invalid) => {
        setValue(emails);
        onChange?.(emails, invalid);
      }}
      {...props}
    />
  );
}

describe("EmailTokenField", () => {
  test("typing an address and a comma commits it as a token", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    await user.click(input);
    await user.keyboard("a@x.com,");

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(["a@x.com"], []));
  });

  test("a delimiter-separated list becomes one token per address", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    await user.click(input);
    await user.keyboard("a@x.com b@x.com;c@x.com ");

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith([
        "a@x.com",
        "b@x.com",
        "c@x.com",
      ], []),
    );
  });

  test("Enter commits the address still being typed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    await user.click(input);
    await user.keyboard("a@x.com{Enter}");

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(["a@x.com"], []));
  });

  test("an invalid fragment becomes an invalid token reported separately", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    await user.click(input);
    await user.keyboard("foo,");

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith([], ["foo"]));
    expect(screen.getByRole("button", { name: "Remove foo" })).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent(
      "foo is not a valid email address.",
    );
    expect(input).toHaveAttribute("aria-invalid", "true");
  });

  test("a duplicate address becomes an invalid token", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled initial={["a@x.com"]} onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    await user.click(input);
    await user.keyboard("{End}A@x.com,");

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith(["a@x.com"], ["A@x.com"]),
    );
    expect(screen.getByRole("alert")).toHaveTextContent(
      "A@x.com was already added.",
    );
  });

  test("removing the invalid token clears the error", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    await user.click(input);
    await user.keyboard("foo,");
    await user.click(await screen.findByRole("button", { name: "Remove foo" }));

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith([], []));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  test("blurring commits the address still being typed", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    await user.click(input);
    await user.keyboard("a@x.com");
    await user.tab();

    await waitFor(() =>
      expect(onChange).toHaveBeenLastCalledWith(["a@x.com"], []),
    );
  });

  test("removing a token drops it from the reported list", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled initial={["a@x.com", "b@x.com"]} onChange={onChange} />);

    await user.click(screen.getByRole("button", { name: "Remove a@x.com" }));

    await waitFor(() => expect(onChange).toHaveBeenLastCalledWith(["b@x.com"], []));
    expect(
      screen.queryByRole("button", { name: "Remove a@x.com" }),
    ).not.toBeInTheDocument();
  });

  test("refuses a token past maxTokens and surfaces the error", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(<Controlled maxTokens={1} onChange={onChange} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    await user.click(input);
    await user.keyboard("a@x.com,b@x.com,");

    await waitFor(() =>
      expect(screen.getByRole("alert")).toHaveTextContent(
        "Enter at most 1 email addresses.",
      ),
    );
    expect(onChange).toHaveBeenLastCalledWith(["a@x.com"], []);
    expect(
      screen.getByRole("button", { name: "Remove a@x.com" }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Remove b@x.com" }),
    ).not.toBeInTheDocument();
  });

  test("lays tokens out inline with a text node after each one", () => {
    render(<Controlled initial={["a@x.com", "b@x.com"]} />);

    const input = screen.getByRole("textbox", { name: "Emails" });
    expect(input).toHaveClass("block");
    expect(input).not.toHaveClass("flex");
    expect(
      Array.from(input.childNodes, (node) =>
        node.nodeType === Node.TEXT_NODE ? node.textContent : "token",
      ),
    ).toEqual(["token", " ", "token", " "]);
  });

  test("renders the label, description and error message", () => {
    render(
      <EmailTokenField
        label="Emails"
        value={[]}
        onChange={() => {}}
        description="Comma separated"
        errorMessage="Enter a valid email"
      />,
    );

    expect(screen.getByRole("textbox", { name: "Emails" })).toBeInTheDocument();
    expect(screen.getByText("Comma separated")).toBeInTheDocument();
    expect(screen.getByRole("alert")).toHaveTextContent("Enter a valid email");
  });
});
