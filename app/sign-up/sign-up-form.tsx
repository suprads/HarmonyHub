"use client";

import { useActionState } from "react";

type SignUpFormProps = {
  signUpAction: (
    prevState: unknown,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
};

export default function SignUpForm({ signUpAction }: SignUpFormProps) {
  const [error, formAction, pending] = useActionState(signUpAction, undefined);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" required />

        <label htmlFor="handle">Username:</label>
        <input name="handle" required />

        <label htmlFor="password">Password:</label>
        <input type="password" name="password" required />

        <button type="submit" disabled={pending}>
          Submit
        </button>
      </form>
      {error && <p style={{ color: "red" }}>{error?.message}</p>}
    </div>
  );
}
