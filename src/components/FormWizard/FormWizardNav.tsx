import { Button } from "../Button";
import { useFormWizard } from "./FormWizard";

export interface FormWizardNavProps {
  /** Callback invoked when the user presses Next or Submit */
  onNext: () => void;
  /** Whether the form is currently submitting (shows loading state on the submit button) */
  isSubmitting?: boolean;
  /** Label for the submit button on the last step (defaults to "Submit") */
  submitLabel?: string;
}

export function FormWizardNav({
  onNext,
  isSubmitting = false,
  submitLabel = "Submit",
}: FormWizardNavProps) {
  const { canGoBack, goBack, isLastStep } = useFormWizard();

  return (
    <div className="flex items-center justify-end gap-[var(--spacing-3)]">
      {canGoBack && (
        <Button
          variant="secondary"
          size="lg"
          onPress={goBack}
          isDisabled={isSubmitting}
        >
          Back
        </Button>
      )}
      <Button
        variant="primary"
        size="lg"
        onPress={onNext}
        isLoading={isSubmitting}
      >
        {isLastStep ? submitLabel : "Next"}
      </Button>
    </div>
  );
}
