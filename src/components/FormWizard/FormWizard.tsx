import { createContext, useContext, useCallback, useMemo } from "react";
import type React from "react";

export interface FormWizardContextValue {
  /** Zero-based index of the currently active step */
  currentStep: number;
  /** Total number of steps in the wizard */
  totalSteps: number;
  /** Whether the user can navigate backwards */
  canGoBack: boolean;
  /** Navigate to the previous step */
  goBack: () => void;
  /** Whether the current step is the last step */
  isLastStep: boolean;
}

const FormWizardContext = createContext<FormWizardContextValue>({
  currentStep: 0,
  totalSteps: 1,
  canGoBack: false,
  goBack: () => {},
  isLastStep: true,
});

export function useFormWizard(): FormWizardContextValue {
  return useContext(FormWizardContext);
}

export interface FormWizardProps {
  /** Zero-based index of the currently active step */
  currentStep: number;
  /** Total number of steps in the wizard */
  totalSteps: number;
  /** Callback invoked when the step should change */
  onStepChange: (step: number) => void;
  /** Wizard content (step panels, progress indicator, navigation) */
  children: React.ReactNode;
}

export function FormWizard({
  currentStep,
  totalSteps,
  onStepChange,
  children,
}: FormWizardProps) {
  const canGoBack = currentStep > 0;
  const isLastStep = currentStep >= totalSteps - 1;

  const goBack = useCallback(() => {
    if (currentStep > 0) {
      onStepChange(currentStep - 1);
    }
  }, [currentStep, onStepChange]);

  const value = useMemo<FormWizardContextValue>(
    () => ({
      currentStep,
      totalSteps,
      canGoBack,
      goBack,
      isLastStep,
    }),
    [currentStep, totalSteps, canGoBack, goBack, isLastStep],
  );

  return (
    <FormWizardContext.Provider value={value}>
      {children}
    </FormWizardContext.Provider>
  );
}
