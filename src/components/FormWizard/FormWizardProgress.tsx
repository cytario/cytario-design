import { useFormWizard } from "./FormWizard";

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4 text-primary-foreground"
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 8.5l3.5 3.5 6.5-7" />
    </svg>
  );
}

export interface FormWizardProgressProps {
  /** Labels for each step, displayed below the step circles */
  labels: string[];
}

export function FormWizardProgress({ labels }: FormWizardProgressProps) {
  const { currentStep, totalSteps } = useFormWizard();

  return (
    <nav aria-label="Form progress">
      <ol className="flex items-start" role="list">
        {labels.map((label, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isFuture = index > currentStep;

          return (
            <li
              key={label}
              className="flex flex-1 flex-col items-center"
              aria-current={isCurrent ? "step" : undefined}
            >
              {/* Row with optional connector lines and the step circle */}
              <div className="flex w-full items-center">
                {/* Left connector line */}
                {index > 0 ? (
                  <div
                    aria-hidden="true"
                    className={[
                      "h-0.5 flex-1",
                      index <= currentStep
                        ? "bg-primary"
                        : "bg-border",
                    ].join(" ")}
                  />
                ) : (
                  <div className="flex-1" aria-hidden="true" />
                )}

                {/* Step circle */}
                <div
                  className={[
                    "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                    "text-sm font-medium",
                    "transition-colors",
                    isCompleted
                      ? "bg-primary text-primary-foreground"
                      : "",
                    isCurrent
                      ? "border-2 border-primary bg-background text-primary"
                      : "",
                    isFuture
                      ? "border-2 border-border bg-background text-muted-foreground"
                      : "",
                  ].join(" ")}
                  aria-hidden="true"
                >
                  {isCompleted ? <CheckIcon /> : index + 1}
                </div>

                {/* Right connector line */}
                {index < totalSteps - 1 ? (
                  <div
                    aria-hidden="true"
                    className={[
                      "h-0.5 flex-1",
                      index < currentStep
                        ? "bg-primary"
                        : "bg-border",
                    ].join(" ")}
                  />
                ) : (
                  <div className="flex-1" aria-hidden="true" />
                )}
              </div>

              {/* Label */}
              <span
                className={[
                  "mt-2 text-center text-sm",
                  isCurrent
                    ? "font-semibold text-foreground"
                    : "font-normal text-muted-foreground",
                ].join(" ")}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
