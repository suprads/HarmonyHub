"use client";

import { useActionState } from "react";

type LoginFormProps = {
  loginAction: (
    prevState: unknown,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
}; //ComponentPropsWithRef<"form">;

export default function LoginForm({ loginAction }: LoginFormProps) {
  const [error, formAction, pending] = useActionState(loginAction, undefined);

  return (
    <div>
      <form action={formAction}>
        <label htmlFor="email">Email:</label>
        <input type="email" name="email" required />

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
