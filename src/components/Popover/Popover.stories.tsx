import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, userEvent, within } from "storybook/test";
import { Popover, PopoverTrigger, PopoverContent } from "./Popover";
import { Button } from "../Button";

const meta: Meta<typeof Popover> = {
  title: "Components/Popover",
  component: Popover,
};

export default meta;
type Story = StoryObj<typeof Popover>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger className="text-sm font-medium text-(--color-text-primary) hover:text-(--color-action-primary)">
        Open Popover
      </PopoverTrigger>
      <PopoverContent placement="bottom start" className="p-4">
        <p className="text-sm text-(--color-text-primary)">
          This is popover content.
        </p>
      </PopoverContent>
    </Popover>
  ),
};

export const WithCloseFunction: Story = {
  name: "With Close Function",
  render: () => (
    <Popover>
      <PopoverTrigger>Pick an option</PopoverTrigger>
      <PopoverContent placement="bottom" className="p-2">
        {({ close }) => (
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded hover:bg-(--color-surface-muted) text-left"
              onClick={close}
            >
              Option A
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded hover:bg-(--color-surface-muted) text-left"
              onClick={close}
            >
              Option B
            </button>
            <button
              type="button"
              className="px-3 py-1.5 text-sm rounded hover:bg-(--color-surface-muted) text-left"
              onClick={close}
            >
              Option C
            </button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  ),
};

export const PlacementTop: Story = {
  name: "Placement Top",
  render: () => (
    <div className="pt-40">
      <Popover>
        <PopoverTrigger>Open Above</PopoverTrigger>
        <PopoverContent placement="top" className="p-4">
          <p className="text-sm">Content above the trigger.</p>
        </PopoverContent>
      </Popover>
    </div>
  ),
};

export const ColorPicker: Story = {
  name: "Color Picker Example",
  render: () => {
    const colors = [
      "#FF0000",
      "#00FF00",
      "#0088FF",
      "#FF00FF",
      "#FFAA00",
      "#00FFFF",
    ];
    const [selected, setSelected] = useState(colors[0]);
    return (
      <div className="flex items-center gap-3">
        <Popover>
          <PopoverTrigger>
            <span
              className="inline-block w-6 h-6 rounded-full border-2 border-(--color-border-default)"
              style={{ backgroundColor: selected }}
              aria-label="Pick a color"
            />
          </PopoverTrigger>
          <PopoverContent placement="bottom start" className="p-2">
            {({ close }) => (
              <div className="flex gap-2">
                {colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => {
                      setSelected(c);
                      close();
                    }}
                    className="w-5 h-5 rounded-full border border-(--color-border-default) cursor-pointer"
                    style={{ backgroundColor: c }}
                    aria-label={`Select color ${c}`}
                  />
                ))}
              </div>
            )}
          </PopoverContent>
        </Popover>
        <span className="text-sm text-(--color-text-secondary)">
          Selected: {selected}
        </span>
      </div>
    );
  },
};

export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
      <div className="flex items-center gap-3">
        <Popover isOpen={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger>Controlled Popover</PopoverTrigger>
          <PopoverContent placement="bottom" className="p-4">
            <p className="text-sm">Controlled via isOpen state.</p>
          </PopoverContent>
        </Popover>
        <Button variant="secondary" onPress={() => setIsOpen(!isOpen)}>
          Toggle externally
        </Button>
      </div>
    );
  },
};

export const OpenInteraction: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger>Open Popover</PopoverTrigger>
      <PopoverContent placement="bottom" className="p-4">
        <p>Popover is open</p>
      </PopoverContent>
    </Popover>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: "Open Popover" });

    await userEvent.click(trigger);

    const body = canvasElement.ownerDocument.body;
    const bodyCanvas = within(body);
    const dialog = await bodyCanvas.findByRole("dialog");
    await expect(dialog).toBeDefined();
  },
};
