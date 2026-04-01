import { useState } from "react";
import type { Meta, StoryObj } from "storybook/react";
import { Eye, EyeOff } from "lucide-react";

import { Banner } from "../Banner";
import { Button } from "../Button";
import { Checkbox } from "../Form/Checkbox";
import { Heading } from "../Heading";
import { IconButton } from "../IconButton";
import { Input } from "../Form/Input";
import { InputGroup } from "../Form/InputGroup";
import { Link } from "../Link";

/* ------------------------------------------------------------------ */
/*  Story-local helpers                                                */
/* ------------------------------------------------------------------ */

/**
 * Shared page wrapper: neutral-50 background, centered card with logo.
 */
function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-(--color-surface-subtle) px-4 py-8">
      <main aria-label="Authentication" className="w-full max-w-[420px]">
        <div className="bg-(--color-surface-default) border border-(--color-border-default) rounded-lg shadow-md overflow-hidden">
          <div className="px-8 pt-10 pb-8">
            {/* Logo */}
            <div className="flex justify-center mb-6">
              <img
                src="logos/cytario-logo-purple.svg"
                alt="cytario"
                className="h-10"
              />
            </div>
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}

/**
 * Password input with visibility toggle, using InputGroup + IconButton.
 */
let passwordFieldId = 0;
function PasswordField({
  label = "Password",
  placeholder = "Enter password",
  value,
  onChange,
  errorMessage,
  isDisabled,
  isRequired,
}: {
  label?: string;
  placeholder?: string;
  value: string;
  onChange: (v: string) => void;
  errorMessage?: string;
  isDisabled?: boolean;
  isRequired?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const [id] = useState(() => `password-field-${++passwordFieldId}`);

  return (
    <div className="flex flex-col gap-1">
      <label
        htmlFor={id}
        className="text-sm font-medium text-(--color-text-primary)"
      >
        {label}
        {isRequired && (
          <span
            aria-hidden="true"
            className="ml-0.5 text-(--color-text-danger)"
          >
            *
          </span>
        )}
      </label>
      <InputGroup>
        <Input
          id={id}
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          errorMessage={errorMessage}
          isDisabled={isDisabled}
        />
        <IconButton
          icon={visible ? EyeOff : Eye}
          aria-label={visible ? "Hide password" : "Show password"}
          variant="ghost"
          showTooltip={false}
          onPress={() => setVisible(!visible)}
          isDisabled={isDisabled}
        />
      </InputGroup>
    </div>
  );
}

/**
 * Sub-heading for auth screens — light weight, default color.
 * Renders as h2 (logo area is the implicit h1-level element).
 */
function AuthHeading({ children }: { children: React.ReactNode }) {
  return (
    <Heading
      as="h2"
      size="lg"
      className="font-normal text-center mb-4"
    >
      {children}
    </Heading>
  );
}

/**
 * Footer separator + secondary action link.
 */
function AuthFooter({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 pt-6 border-t border-(--color-border-default)">
      <p className="text-center text-sm text-(--color-text-secondary)">
        {children}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Sign In                                                            */
/* ------------------------------------------------------------------ */

function SignInPage({ showError = false }: { showError?: boolean }) {
  const [email, setEmail] = useState(showError ? "user@example.com" : "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <AuthLayout>
      <AuthHeading>Sign in</AuthHeading>

      {showError && (
        <div className="mb-4">
          <Banner variant="danger">
            Invalid email or password. Please try again.
          </Banner>
        </div>
      )}

      <div className="flex flex-col gap-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          isRequired
          isDisabled={isLoading}
        />

        <PasswordField
          value={password}
          onChange={setPassword}
          isRequired
          isDisabled={isLoading}
        />

        {/* Remember me + Forgot password row */}
        <div className="flex items-center justify-between">
          <Checkbox
            isSelected={rememberMe}
            onChange={setRememberMe}
            isDisabled={isLoading}
          >
            Remember me
          </Checkbox>
          <Link href="#" className="text-sm">
            Forgot password?
          </Link>
        </div>

        <Button
          variant="primary"
          className="w-full mt-2"
          onPress={handleSubmit}
          isLoading={isLoading}
        >
          Sign in
        </Button>
      </div>

      <AuthFooter>
        Don&apos;t have an account? <Link href="#">Create one</Link>
      </AuthFooter>
    </AuthLayout>
  );
}

/* ------------------------------------------------------------------ */
/*  Register                                                           */
/* ------------------------------------------------------------------ */

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const passwordMismatch =
    confirmPassword.length > 0 && password !== confirmPassword
      ? "Passwords do not match."
      : undefined;

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 2000);
  };

  return (
    <AuthLayout>
      <AuthHeading>Create account</AuthHeading>

      <div className="flex flex-col gap-4">
        {/* Name fields — two columns */}
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="First name"
            placeholder="Jane"
            value={firstName}
            onChange={setFirstName}
            isRequired
            isDisabled={isLoading}
          />
          <Input
            label="Last name"
            placeholder="Doe"
            value={lastName}
            onChange={setLastName}
            isRequired
            isDisabled={isLoading}
          />
        </div>

        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
          isRequired
          isDisabled={isLoading}
        />

        <PasswordField
          label="Password"
          value={password}
          onChange={setPassword}
          isRequired
          isDisabled={isLoading}
        />

        <PasswordField
          label="Confirm password"
          placeholder="Re-enter password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          errorMessage={passwordMismatch}
          isRequired
          isDisabled={isLoading}
        />

        <Button
          variant="primary"
          className="w-full mt-2"
          onPress={handleSubmit}
          isLoading={isLoading}
        >
          Create account
        </Button>
      </div>

      <AuthFooter>
        Already have an account? <Link href="#">Sign in</Link>
      </AuthFooter>
    </AuthLayout>
  );
}

/* ------------------------------------------------------------------ */
/*  Forgot Password                                                    */
/* ------------------------------------------------------------------ */

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <AuthLayout>
      <AuthHeading>Reset password</AuthHeading>

      {isSubmitted ? (
        <div className="flex flex-col gap-4">
          <Banner variant="success">
            Check your email. We sent a reset link to <strong>{email}</strong>.
            It may take a few minutes to arrive.
          </Banner>

          <p className="text-center text-sm text-(--color-text-secondary)">
            Didn&apos;t receive the email?{" "}
            <Link href="#" onPress={() => setIsSubmitted(false)}>
              Send again
            </Link>
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          <p className="text-sm text-(--color-text-secondary)">
            Enter the email address associated with your account and we will
            send you a link to reset your password.
          </p>

          <Input
            label="Email"
            type="email"
            placeholder="you@example.com"
            value={email}
            onChange={setEmail}
            isRequired
            isDisabled={isLoading}
          />

          <Button
            variant="primary"
            className="w-full mt-2"
            onPress={handleSubmit}
            isLoading={isLoading}
          >
            Send reset link
          </Button>
        </div>
      )}

      <div className="mt-6 text-center">
        <Link href="#" className="text-sm">
          Back to sign in
        </Link>
      </div>
    </AuthLayout>
  );
}

/* ------------------------------------------------------------------ */
/*  Story meta & exports                                               */
/* ------------------------------------------------------------------ */

const meta: Meta = {
  title: "Compositions/Auth Screens",
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;
type Story = StoryObj;

/** Default sign-in screen with email and password fields. */
export const SignIn: Story = {
  render: () => <SignInPage />,
};

/** Sign-in screen showing an invalid credentials error. */
export const SignInError: Story = {
  name: "Sign In — Error",
  render: () => <SignInPage showError />,
};

/** Account registration form with name, email, and password fields. */
export const Register: Story = {
  render: () => <RegisterPage />,
};

/** Password reset flow with email input and success confirmation. */
export const ForgotPassword: Story = {
  name: "Forgot Password",
  render: () => <ForgotPasswordPage />,
};
