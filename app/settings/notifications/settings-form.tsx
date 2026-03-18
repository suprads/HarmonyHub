"use client";

import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import type { NotificationSettings } from "@/generated/prisma/client";
import { ComponentProps, useActionState, useState } from "react";

type SettingsFormProps = {
  settings: Omit<NotificationSettings, "id" | "settingsId">;
  saveAction: (
    prevState: { message: string } | undefined,
    formData: FormData,
  ) => Promise<{ message: string } | undefined>;
};

export default function SettingsForm({
  settings,
  saveAction,
}: SettingsFormProps) {
  const [enabled, setEnabled] = useState(settings.enabled);
  const [error, formAction, pending] = useActionState(saveAction, undefined);

  return (
    <form action={formAction} className="w-full max-w-sm">
      <FieldGroup>
        <SettingsField
          checked={enabled}
          onCheckedChange={(checked) => setEnabled(checked)}
          disabled={pending}
          inputId="enabled"
          label="Enable notifications"
        />
        <FieldSeparator />
        <SettingsField
          disabled={pending || !enabled}
          defaultChecked={settings.friendRequests}
          inputId="friend-requests"
          label="Received friend requests"
        />
        <Field>
          <Button type="submit" disabled={pending}>
            {pending && <Spinner />} Save Changes
          </Button>
        </Field>
        {error?.message && <FieldError>{error?.message}</FieldError>}
      </FieldGroup>
    </form>
  );
}

type SettingsFieldProps = Pick<
  ComponentProps<typeof Switch>,
  "checked" | "defaultChecked" | "onCheckedChange"
> & {
  disabled?: boolean;
  description?: string;
  inputId: string;
  label: string;
};

function SettingsField({
  checked,
  disabled,
  description,
  defaultChecked,
  inputId,
  label,
  onCheckedChange,
}: SettingsFieldProps) {
  return (
    <Field
      orientation="horizontal"
      className="max-w-sm"
      data-disabled={disabled}
    >
      <FieldContent>
        <FieldLabel htmlFor={inputId}>{label}</FieldLabel>
        {description && <FieldDescription>{description}</FieldDescription>}
      </FieldContent>
      <Switch
        id={inputId}
        name={inputId}
        defaultChecked={defaultChecked}
        checked={checked}
        onCheckedChange={onCheckedChange}
        disabled={disabled}
      />
    </Field>
  );
}
