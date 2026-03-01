import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { expect, fn, userEvent, within } from "storybook/test";
import { FormWizard } from "./FormWizard";
import { FormWizardProgress } from "./FormWizardProgress";
import { FormWizardNav } from "./FormWizardNav";
import { Field } from "../Field";
import { Input } from "../Input";
import { Select } from "../Select";

const meta: Meta<typeof FormWizard> = {
  title: "Components/FormWizard",
  component: FormWizard,
  parameters: {
    layout: "padded",
  },
};

export default meta;
type Story = StoryObj<typeof FormWizard>;

/* -------------------------------------------------------------------------- */
/*  Helpers                                                                    */
/* -------------------------------------------------------------------------- */

const stepLabels = ["Storage Type", "Connection Details", "Confirm"];

const storageItems = [
  { id: "s3", name: "Amazon S3" },
  { id: "gcs", name: "Google Cloud Storage" },
  { id: "azure", name: "Azure Blob Storage" },
  { id: "minio", name: "MinIO (S3-compatible)" },
];

function StepContent({ step }: { step: number }) {
  switch (step) {
    case 0:
      return (
        <div className="flex flex-col gap-[var(--spacing-4)]">
          <Select
            label="Storage Provider"
            items={storageItems}
            placeholder="Select a provider"
            isRequired
          />
          <Input
            label="Connection Name"
            placeholder="e.g. Production S3"
            description="A friendly name to identify this storage connection."
            isRequired
          />
        </div>
      );
    case 1:
      return (
        <div className="flex flex-col gap-[var(--spacing-4)]">
          <Input
            label="Bucket Name"
            placeholder="my-pathology-bucket"
            isRequired
          />
          <Input
            label="Access Key ID"
            placeholder="AKIAIOSFODNN7EXAMPLE"
            isRequired
          />
          <Input
            label="Secret Access Key"
            placeholder="wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
            type="password"
            isRequired
          />
          <Input
            label="Region"
            placeholder="eu-central-1"
          />
        </div>
      );
    case 2:
      return (
        <div className="flex flex-col gap-[var(--spacing-4)]">
          <Field label="Summary">
            <div
              className={[
                "rounded-[var(--border-radius-md)]",
                "border border-[var(--color-border-default)]",
                "bg-[var(--color-surface-subtle)]",
                "p-[var(--spacing-4)]",
              ].join(" ")}
            >
              <dl className="flex flex-col gap-[var(--spacing-2)] text-[length:var(--font-size-sm)]">
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-secondary)]">Provider</dt>
                  <dd className="font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)]">
                    Amazon S3
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-secondary)]">Name</dt>
                  <dd className="font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)]">
                    Production S3
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-secondary)]">Bucket</dt>
                  <dd className="font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)]">
                    my-pathology-bucket
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[var(--color-text-secondary)]">Region</dt>
                  <dd className="font-[number:var(--font-weight-medium)] text-[var(--color-text-primary)]">
                    eu-central-1
                  </dd>
                </div>
              </dl>
            </div>
          </Field>
        </div>
      );
    default:
      return null;
  }
}

/* -------------------------------------------------------------------------- */
/*  Interactive wrapper                                                        */
/* -------------------------------------------------------------------------- */

function InteractiveWizard({
  initialStep = 0,
  onStepChange,
  onNext,
}: {
  initialStep?: number;
  onStepChange?: (step: number) => void;
  onNext?: () => void;
}) {
  const [step, setStep] = useState(initialStep);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleStepChange(newStep: number) {
    setStep(newStep);
    onStepChange?.(newStep);
  }

  function handleNext() {
    onNext?.();
    if (step < stepLabels.length - 1) {
      handleStepChange(step + 1);
    } else {
      setIsSubmitting(true);
      setTimeout(() => setIsSubmitting(false), 2000);
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <FormWizard
        currentStep={step}
        totalSteps={stepLabels.length}
        onStepChange={handleStepChange}
      >
        <div className="flex flex-col gap-[var(--spacing-6)]">
          <FormWizardProgress labels={stepLabels} />
          <StepContent step={step} />
          <FormWizardNav
            onNext={handleNext}
            isSubmitting={isSubmitting}
            submitLabel="Connect Storage"
          />
        </div>
      </FormWizard>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*  Stories                                                                     */
/* -------------------------------------------------------------------------- */

/** Fully interactive 3-step Connect Storage wizard. */
export const Default: Story = {
  render: (args) => (
    <InteractiveWizard
      onStepChange={args.onStepChange}
    />
  ),
  args: {
    currentStep: 0,
    totalSteps: 3,
    onStepChange: fn(),
  },
};

/** Just the progress indicator, isolated. */
export const ProgressOnly: Story = {
  render: () => (
    <div className="mx-auto max-w-lg">
      <FormWizard currentStep={1} totalSteps={3} onStepChange={fn()}>
        <FormWizardProgress labels={stepLabels} />
      </FormWizard>
    </div>
  ),
  args: {
    currentStep: 1,
    totalSteps: 3,
    onStepChange: fn(),
  },
};

/** Step 1: Storage Type selection. */
export const Step1: Story = {
  render: () => (
    <div className="mx-auto max-w-lg">
      <FormWizard currentStep={0} totalSteps={3} onStepChange={fn()}>
        <div className="flex flex-col gap-[var(--spacing-6)]">
          <FormWizardProgress labels={stepLabels} />
          <StepContent step={0} />
          <FormWizardNav onNext={fn()} />
        </div>
      </FormWizard>
    </div>
  ),
  args: {
    currentStep: 0,
    totalSteps: 3,
    onStepChange: fn(),
  },
};

/** Step 2: Connection Details with Back navigation. */
export const Step2: Story = {
  render: () => (
    <div className="mx-auto max-w-lg">
      <FormWizard currentStep={1} totalSteps={3} onStepChange={fn()}>
        <div className="flex flex-col gap-[var(--spacing-6)]">
          <FormWizardProgress labels={stepLabels} />
          <StepContent step={1} />
          <FormWizardNav onNext={fn()} />
        </div>
      </FormWizard>
    </div>
  ),
  args: {
    currentStep: 1,
    totalSteps: 3,
    onStepChange: fn(),
  },
};

/** Step 3: Confirm with Submit button. */
export const Step3: Story = {
  render: () => (
    <div className="mx-auto max-w-lg">
      <FormWizard currentStep={2} totalSteps={3} onStepChange={fn()}>
        <div className="flex flex-col gap-[var(--spacing-6)]">
          <FormWizardProgress labels={stepLabels} />
          <StepContent step={2} />
          <FormWizardNav onNext={fn()} submitLabel="Connect Storage" />
        </div>
      </FormWizard>
    </div>
  ),
  args: {
    currentStep: 2,
    totalSteps: 3,
    onStepChange: fn(),
  },
};

/** Verifies that clicking Next advances the wizard to Step 2. */
export const NavigationInteraction: Story = {
  render: (args) => (
    <InteractiveWizard
      onStepChange={args.onStepChange}
      onNext={() => {}}
    />
  ),
  args: {
    currentStep: 0,
    totalSteps: 3,
    onStepChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    // Step 1: only Next button, no Back
    const nextButton = canvas.getByRole("button", { name: "Next" });
    await expect(nextButton).toBeInTheDocument();
    expect(canvas.queryByRole("button", { name: "Back" })).toBeNull();

    // Advance to Step 2
    await userEvent.click(nextButton);

    // Step 2: both Back and Next should be visible
    await expect(
      canvas.getByRole("button", { name: "Back" }),
    ).toBeInTheDocument();
    await expect(
      canvas.getByRole("button", { name: "Next" }),
    ).toBeInTheDocument();

    // Advance to Step 3
    await userEvent.click(canvas.getByRole("button", { name: "Next" }));

    // Step 3: submit label should appear
    await expect(
      canvas.getByRole("button", { name: "Connect Storage" }),
    ).toBeInTheDocument();
  },
};
