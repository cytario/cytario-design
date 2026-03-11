import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { InputGroup } from "./InputGroup";
import { Input } from "../Input";
import { InputAddon } from "../InputAddon";
import { Button } from "../Button";
import { IconButton } from "../IconButton";
import {
  SegmentedControl,
  SegmentedControlItem,
} from "../SegmentedControl";
import { Eye, EyeOff, Search, X } from "lucide-react";

const meta: Meta<typeof InputGroup> = {
  title: "Components/InputGroup",
  component: InputGroup,
};

export default meta;
type Story = StoryObj<typeof InputGroup>;

// --- Real-world usage stories (from cytario-web) ---

export const MagnificationButtons: Story = {
  name: "Magnification Controls",
  render: () => (
    <div className="flex items-center gap-2">
      <Input
        isReadOnly
        value="20.0"
        className="w-12 text-sm text-right"
        aria-label="Current magnification"
      />
      <SegmentedControl
        selectionMode="none"
        size="sm"
        aria-label="Magnification presets"
      >
        {[5, 10, 20, 40].map((mag) => (
          <SegmentedControlItem key={mag} id={`${mag}x`}>
            {mag}x
          </SegmentedControlItem>
        ))}
      </SegmentedControl>
    </div>
  ),
};

// --- Generic stories ---

export const WithPrefix: Story = {
  render: () => (
    <InputGroup>
      <InputAddon>https://</InputAddon>
      <Input placeholder="example.com" aria-label="URL" />
    </InputGroup>
  ),
};

export const WithSuffix: Story = {
  render: () => (
    <InputGroup>
      <Input placeholder="0.00" aria-label="Weight" />
      <InputAddon>.kg</InputAddon>
    </InputGroup>
  ),
};

export const WithButton: Story = {
  render: () => (
    <InputGroup>
      <Input placeholder="Search cases..." aria-label="Search" />
      <Button variant="primary" iconLeft={Search}>
        Search
      </Button>
    </InputGroup>
  ),
};

export const WithIconButton: Story = {
  render: () => (
    <InputGroup>
      <Input placeholder="Filter..." aria-label="Filter" />
      <IconButton
        icon={X}
        aria-label="Clear"
        variant="ghost"
        showTooltip={false}
      />
    </InputGroup>
  ),
};

export const WithAddonAndButton: Story = {
  render: () => (
    <InputGroup>
      <InputAddon>https://</InputAddon>
      <Input placeholder="example.com" aria-label="URL" />
      <Button variant="primary">Go</Button>
    </InputGroup>
  ),
};

export const CurrencyInput: Story = {
  render: () => (
    <InputGroup>
      <InputAddon>$</InputAddon>
      <Input placeholder="0.00" align="right" aria-label="Amount" />
    </InputGroup>
  ),
};

export const PasswordField: Story = {
  name: "Password Field",
  render: function PasswordFieldStory() {
    const [visible, setVisible] = useState(false);
    return (
      <InputGroup>
        <Input
          type={visible ? "text" : "password"}
          placeholder="Enter password"
          aria-label="Password"
        />
        <IconButton
          icon={visible ? EyeOff : Eye}
          aria-label={visible ? "Hide password" : "Show password"}
          variant="ghost"
          onPress={() => setVisible((v) => !v)}
          showTooltip={false}
        />
      </InputGroup>
    );
  },
};

export const AllCompositions: Story = {
  render: () => (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "1fr",
        gap: "24px",
        maxWidth: "480px",
      }}
    >
      <div>
        <p className="mb-2 text-sm text-(--color-text-secondary)">
          Addon + Input
        </p>
        <InputGroup>
          <InputAddon>https://</InputAddon>
          <Input placeholder="example.com" aria-label="URL" />
        </InputGroup>
      </div>

      <div>
        <p className="mb-2 text-sm text-(--color-text-secondary)">
          Input + Addon
        </p>
        <InputGroup>
          <Input placeholder="0.00" aria-label="Weight" />
          <InputAddon>.kg</InputAddon>
        </InputGroup>
      </div>

      <div>
        <p className="mb-2 text-sm text-(--color-text-secondary)">
          Input + Button
        </p>
        <InputGroup>
          <Input placeholder="Search cases..." aria-label="Search" />
          <Button variant="primary" iconLeft={Search}>
            Search
          </Button>
        </InputGroup>
      </div>

      <div>
        <p className="mb-2 text-sm text-(--color-text-secondary)">
          Input + ghost IconButton
        </p>
        <InputGroup>
          <Input placeholder="Filter..." aria-label="Filter" />
          <IconButton
            icon={X}
            aria-label="Clear"
            variant="ghost"
            showTooltip={false}
          />
        </InputGroup>
      </div>

      <div>
        <p className="mb-2 text-sm text-(--color-text-secondary)">
          Addon + Input + Button
        </p>
        <InputGroup>
          <InputAddon>https://</InputAddon>
          <Input placeholder="example.com" aria-label="URL" />
          <Button variant="primary">Go</Button>
        </InputGroup>
      </div>

      <div>
        <p className="mb-2 text-sm text-(--color-text-secondary)">
          Currency (addon + right-aligned input)
        </p>
        <InputGroup>
          <InputAddon>$</InputAddon>
          <Input placeholder="0.00" align="right" aria-label="Amount" />
        </InputGroup>
      </div>
    </div>
  ),
};
