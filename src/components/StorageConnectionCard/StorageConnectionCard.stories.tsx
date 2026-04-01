import type { Meta, StoryObj } from "storybook/react";
import { fn } from "storybook/test";
import { Pill } from "../Pill";
import { StorageConnectionCard } from "./StorageConnectionCard";

const meta: Meta<typeof StorageConnectionCard> = {
  title: "Components/StorageConnectionCard",
  component: StorageConnectionCard,
};

export default meta;
type Story = StoryObj<typeof StorageConnectionCard>;

function MockTissuePreview() {
  return (
    <div
      className="h-full w-full"
      style={{
        backgroundColor: "#000000",
        backgroundImage: [
          "radial-gradient(ellipse 120px 90px at 35% 40%, rgba(70, 130, 230, 0.4) 0%, transparent 70%)",
          "radial-gradient(ellipse 80px 100px at 55% 60%, rgba(70, 130, 230, 0.3) 0%, transparent 65%)",
          "radial-gradient(ellipse 150px 70px at 70% 30%, rgba(70, 130, 230, 0.25) 0%, transparent 60%)",
          "radial-gradient(ellipse 60px 80px at 20% 70%, rgba(70, 130, 230, 0.35) 0%, transparent 70%)",
          "radial-gradient(ellipse 100px 60px at 40% 45%, rgba(230, 130, 50, 0.3) 0%, transparent 70%)",
          "radial-gradient(ellipse 70px 90px at 60% 55%, rgba(230, 130, 50, 0.2) 0%, transparent 65%)",
          "radial-gradient(ellipse 90px 110px at 45% 50%, rgba(80, 200, 80, 0.2) 0%, transparent 65%)",
          "radial-gradient(ellipse 60px 70px at 25% 35%, rgba(80, 200, 80, 0.15) 0%, transparent 60%)",
          "radial-gradient(circle 30px at 50% 40%, rgba(200, 60, 60, 0.35) 0%, transparent 80%)",
          "radial-gradient(circle 20px at 35% 55%, rgba(200, 60, 60, 0.25) 0%, transparent 80%)",
          "radial-gradient(circle 25px at 65% 65%, rgba(200, 60, 60, 0.3) 0%, transparent 80%)",
        ].join(", "),
      }}
    />
  );
}

export const Connected: Story = {
  args: {
    name: "cytario-research-data",
    status: "connected",
    meta: (
      <>
        <Pill color="purple">AWS</Pill>
        <span className="text-xs text-(--color-text-secondary)">eu-central-1</span>
      </>
    ),
    href: "/buckets/aws/cytario-research-data",
    onInfo: fn(),
    children: <MockTissuePreview />,
  },
};

export const Error: Story = {
  args: {
    name: "failing-bucket",
    status: "error",
    errorMessage: "Request failed: Access Denied",
    meta: <Pill color="purple">AWS</Pill>,
    onInfo: fn(),
  },
};

export const Loading: Story = {
  args: {
    name: "new-connection",
    status: "loading",
    meta: <Pill color="rose">MinIO</Pill>,
  },
};

export const NoPreview: Story = {
  name: "No Preview",
  args: {
    name: "archive-bucket",
    status: "connected",
    meta: (
      <>
        <Pill color="teal">Azure</Pill>
        <span className="text-xs text-(--color-text-secondary)">westeurope</span>
      </>
    ),
    href: "/buckets/azure/archive-bucket",
    onInfo: fn(),
  },
};

export const WithOnPress: Story = {
  name: "With onPress",
  args: {
    name: "cytario-uploads",
    status: "connected",
    meta: (
      <>
        <Pill color="purple">AWS</Pill>
        <span className="text-xs text-(--color-text-secondary)">eu-central-1</span>
      </>
    ),
    onPress: fn(),
    onInfo: fn(),
    children: <MockTissuePreview />,
  },
};
