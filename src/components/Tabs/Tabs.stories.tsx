import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { Tabs, TabList, Tab, TabPanel } from "./Tabs";

const meta: Meta<typeof Tabs> = {
  title: "Components/Tabs",
  component: Tabs,
  argTypes: {
    variant: {
      control: "select",
      options: ["underline", "pills"],
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
    isDisabled: { control: "boolean" },
  },
};

export default meta;
type Story = StoryObj<typeof Tabs>;

// --- The canonical visual reference: every variant × size ---

const variants = ["underline", "pills"] as const;
const sizes = ["sm", "md", "lg"] as const;

export const AllVariants: Story = {
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
      {variants.map((variant) =>
        sizes.map((size) => (
          <div key={`${variant}-${size}`}>
            <p className="mb-2 text-sm font-semibold text-muted-foreground">
              {variant} / {size}
            </p>
            <Tabs variant={variant} size={size}>
              <TabList aria-label={`${variant} ${size}`}>
                <Tab id="a">Alpha</Tab>
                <Tab id="b">Beta</Tab>
                <Tab id="c">Gamma</Tab>
              </TabList>
              <TabPanel id="a">Alpha content.</TabPanel>
              <TabPanel id="b">Beta content.</TabPanel>
              <TabPanel id="c">Gamma content.</TabPanel>
            </Tabs>
          </div>
        )),
      )}
    </div>
  ),
};

// --- Vertical orientation ---

export const Vertical: Story = {
  args: {
    variant: "underline",
    size: "md",
    orientation: "vertical",
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Settings">
        <Tab id="general">General</Tab>
        <Tab id="security">Security</Tab>
        <Tab id="notifications">Notifications</Tab>
      </TabList>
      <TabPanel id="general">General settings content.</TabPanel>
      <TabPanel id="security">Security settings content.</TabPanel>
      <TabPanel id="notifications">Notification settings content.</TabPanel>
    </Tabs>
  ),
};

// --- Disabled tabs ---

export const DisabledTabs: Story = {
  args: { variant: "underline", size: "md" },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Mixed">
        <Tab id="active">Active</Tab>
        <Tab id="disabled" isDisabled>
          Disabled
        </Tab>
        <Tab id="also-active">Also Active</Tab>
      </TabList>
      <TabPanel id="active">This tab is active.</TabPanel>
      <TabPanel id="disabled">This tab is disabled.</TabPanel>
      <TabPanel id="also-active">This tab is also active.</TabPanel>
    </Tabs>
  ),
};

// --- Controlled ---

export const Controlled: Story = {
  args: { variant: "underline", size: "md" },
  render: function ControlledTabs(args) {
    const [selectedKey, setSelectedKey] = useState<string | number>("second");
    return (
      <div>
        <p className="mb-4 text-sm text-muted-foreground">
          Selected: <strong>{String(selectedKey)}</strong>
        </p>
        <Tabs
          {...args}
          selectedKey={selectedKey}
          onSelectionChange={(key) => setSelectedKey(key as string)}
        >
          <TabList aria-label="Controlled">
            <Tab id="first">First</Tab>
            <Tab id="second">Second</Tab>
            <Tab id="third">Third</Tab>
          </TabList>
          <TabPanel id="first">First panel.</TabPanel>
          <TabPanel id="second">Second panel.</TabPanel>
          <TabPanel id="third">Third panel.</TabPanel>
        </Tabs>
      </div>
    );
  },
};

// --- Interaction test ---

export const ClickInteraction: Story = {
  args: {
    variant: "underline",
    size: "md",
    onSelectionChange: fn(),
  },
  render: (args) => (
    <Tabs {...args}>
      <TabList aria-label="Interactive">
        <Tab id="tab1">Tab One</Tab>
        <Tab id="tab2">Tab Two</Tab>
        <Tab id="tab3">Tab Three</Tab>
      </TabList>
      <TabPanel id="tab1">Panel one content.</TabPanel>
      <TabPanel id="tab2">Panel two content.</TabPanel>
      <TabPanel id="tab3">Panel three content.</TabPanel>
    </Tabs>
  ),
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement);

    // Initially the first tab is selected and its panel is visible
    await expect(canvas.getByText("Panel one content.")).toBeInTheDocument();

    // Click the second tab
    const tab2 = canvas.getByRole("tab", { name: "Tab Two" });
    await userEvent.click(tab2);

    // Panel should switch
    await expect(canvas.getByText("Panel two content.")).toBeInTheDocument();
    await expect(args.onSelectionChange).toHaveBeenCalled();
  },
};
