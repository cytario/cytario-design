import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";

import { Dialog } from "../components/Dialog";
import { Input } from "../components/Input";
import { Select } from "../components/Select";
import type { SelectItem } from "../components/Select";
import { Field } from "../components/Field";
import { Fieldset } from "../components/Fieldset";
import { RadioGroup, RadioButton } from "../components/Radio";
import { InputGroup } from "../components/InputGroup";
import { InputAddon } from "../components/InputAddon";
import { FormWizard } from "../components/FormWizard/FormWizard";
import { FormWizardProgress } from "../components/FormWizard/FormWizardProgress";
import { FormWizardNav } from "../components/FormWizard/FormWizardNav";

/* ------------------------------------------------------------------ */
/*  AWS Regions (subset)                                               */
/* ------------------------------------------------------------------ */

const awsRegions: SelectItem[] = [
  { id: "eu-central-1", name: "eu-central-1" },
  { id: "eu-west-1", name: "eu-west-1" },
  { id: "eu-west-2", name: "eu-west-2" },
  { id: "eu-north-1", name: "eu-north-1" },
  { id: "us-east-1", name: "us-east-1" },
  { id: "us-east-2", name: "us-east-2" },
  { id: "us-west-1", name: "us-west-1" },
  { id: "us-west-2", name: "us-west-2" },
  { id: "ap-southeast-1", name: "ap-southeast-1" },
  { id: "ap-northeast-1", name: "ap-northeast-1" },
];

const visibilityOptions: SelectItem[] = [
  { id: "personal", name: "Personal" },
  { id: "/cytario", name: "/cytario" },
  { id: "/cytario/engineering", name: "/cytario/engineering" },
];

/* ------------------------------------------------------------------ */
/*  Step 1: Provider                                                   */
/* ------------------------------------------------------------------ */

function ProviderStep({
  providerType,
  onProviderTypeChange,
  visibility,
  onVisibilityChange,
}: {
  providerType: string;
  onProviderTypeChange: (v: string) => void;
  visibility: string;
  onVisibilityChange: (v: string) => void;
}) {
  return (
    <Fieldset>
      <Field
        label="Visibility"
        description="Choose who can access this storage connection. Personal connections are only visible to you."
      >
        <Select
          label="Visibility"
          items={visibilityOptions}
          selectedKey={visibility}
          onSelectionChange={(k) => onVisibilityChange(String(k))}
        />
      </Field>

      <Field
        label="Provider"
        description="Choose the type of cloud storage you want to connect. cytario supports AWS S3 and S3-compatible object storage."
      >
        <RadioGroup
          value={providerType}
          onChange={onProviderTypeChange}
          orientation="horizontal"
        >
          <RadioButton value="aws">AWS S3</RadioButton>
          <RadioButton value="other">Other</RadioButton>
        </RadioGroup>
      </Field>

      {providerType === "other" && (
        <Field
          label="Provider Name"
          description="A user-friendly name to identify this storage connection."
        >
          <Input aria-label="Provider name" placeholder="minio" size="lg" />
        </Field>
      )}
    </Fieldset>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 2: Location                                                   */
/* ------------------------------------------------------------------ */

function LocationStep({
  isAWS,
  region,
  onRegionChange,
}: {
  isAWS: boolean;
  region: string;
  onRegionChange: (v: string) => void;
}) {
  return (
    <Fieldset>
      <Field
        label="S3 URI"
        description="Enter the bucket name and optional path prefix where your whole-slide images are stored (e.g. my-bucket/data/images)."
      >
        <InputGroup>
          <InputAddon>s3://</InputAddon>
          <Input
            aria-label="S3 URI"
            placeholder="my-bucket/path/prefix"
            size="lg"
          />
        </InputGroup>
      </Field>

      {isAWS && (
        <Field
          label="Region"
          description="The AWS region where this bucket is located."
        >
          <Select
            label="Region"
            items={awsRegions}
            selectedKey={region}
            onSelectionChange={(k) => onRegionChange(String(k))}
          />
        </Field>
      )}
    </Fieldset>
  );
}

/* ------------------------------------------------------------------ */
/*  Step 3: Access                                                     */
/* ------------------------------------------------------------------ */

function AccessStep({ isAWS }: { isAWS: boolean }) {
  return (
    <Fieldset>
      {isAWS ? (
        <Field
          label="Role ARN"
          description="The IAM role cytario will assume to access your S3 data. The role must grant read access to the specified bucket and path."
        >
          <Input
            aria-label="Role ARN"
            placeholder="arn:aws:iam::123456789012:role/MyRole"
            size="lg"
          />
        </Field>
      ) : (
        <Field
          label="Endpoint"
          description="The endpoint URL of your S3-compatible storage."
        >
          <Input
            aria-label="Endpoint URL"
            placeholder="http://localhost:9000"
            size="lg"
          />
        </Field>
      )}
    </Fieldset>
  );
}

/* ------------------------------------------------------------------ */
/*  Full wizard composition                                            */
/* ------------------------------------------------------------------ */

const STEP_LABELS = ["Storage Provider", "Data Location", "Access"];

function ConnectStorageWizardPage({ initialStep = 0 }: { initialStep?: number }) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [providerType, setProviderType] = useState("aws");
  const [visibility, setVisibility] = useState("personal");
  const [region, setRegion] = useState("eu-central-1");
  const isAWS = providerType === "aws";

  const goNext = () => setCurrentStep((s) => Math.min(2, s + 1));

  return (
    <Dialog isOpen={true} onOpenChange={() => {}} title="Connect Storage" size="lg">
      <FormWizard
        currentStep={currentStep}
        totalSteps={STEP_LABELS.length}
        onStepChange={setCurrentStep}
      >
        <div className="flex flex-col gap-[var(--spacing-6)]">
          <FormWizardProgress labels={STEP_LABELS} />

          {currentStep === 0 && (
            <ProviderStep
              providerType={providerType}
              onProviderTypeChange={setProviderType}
              visibility={visibility}
              onVisibilityChange={setVisibility}
            />
          )}
          {currentStep === 1 && (
            <LocationStep
              isAWS={isAWS}
              region={region}
              onRegionChange={setRegion}
            />
          )}
          {currentStep === 2 && <AccessStep isAWS={isAWS} />}

          <div className="border-t border-[var(--color-border-default)] pt-4">
            <FormWizardNav
              onNext={goNext}
              submitLabel="Connect Storage"
            />
          </div>
        </div>
      </FormWizard>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  S3-compatible wizard variant (Other provider)                      */
/* ------------------------------------------------------------------ */

function ConnectStorageWizardOtherProvider() {
  const [currentStep, setCurrentStep] = useState(0);
  const [providerType, setProviderType] = useState("other");
  const [visibility, setVisibility] = useState("personal");
  const [region, setRegion] = useState("");
  const isAWS = false;

  const goNext = () => setCurrentStep((s) => Math.min(2, s + 1));

  return (
    <Dialog isOpen={true} onOpenChange={() => {}} title="Connect Storage" size="lg">
      <FormWizard
        currentStep={currentStep}
        totalSteps={STEP_LABELS.length}
        onStepChange={setCurrentStep}
      >
        <div className="flex flex-col gap-[var(--spacing-6)]">
          <FormWizardProgress labels={STEP_LABELS} />

          {currentStep === 0 && (
            <ProviderStep
              providerType={providerType}
              onProviderTypeChange={setProviderType}
              visibility={visibility}
              onVisibilityChange={setVisibility}
            />
          )}
          {currentStep === 1 && (
            <LocationStep isAWS={isAWS} region={region} onRegionChange={setRegion} />
          )}
          {currentStep === 2 && <AccessStep isAWS={isAWS} />}

          <div className="border-t border-[var(--color-border-default)] pt-4">
            <FormWizardNav
              onNext={goNext}
              submitLabel="Connect Storage"
            />
          </div>
        </div>
      </FormWizard>
    </Dialog>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta                                                         */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Connect Storage Wizard",
  parameters: {
    layout: "centered",
  },
};

export default meta;
type Story = StoryObj;

/** Interactive 3-step wizard for connecting AWS S3 storage. Mirrors the cytario-web /connect-bucket modal. */
export const AWSProvider: Story = {
  render: () => <ConnectStorageWizardPage />,
};

/** Step 2: Data Location with S3 URI input and region selector. */
export const Step2Location: Story = {
  name: "Step 2: Data Location",
  render: () => <ConnectStorageWizardPage initialStep={1} />,
};

/** Step 3: Access credentials (Role ARN for AWS). */
export const Step3Access: Story = {
  name: "Step 3: Access",
  render: () => <ConnectStorageWizardPage initialStep={2} />,
};

/** S3-compatible provider (MinIO, etc.) variant with endpoint URL instead of Role ARN. */
export const OtherProvider: Story = {
  name: "Other Provider (MinIO)",
  render: () => <ConnectStorageWizardOtherProvider />,
};
