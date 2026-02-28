import { PropsWithChildren } from 'react';

export function SettingsField({
  label,
  children,
}: PropsWithChildren<{ label: string }>) {
  return (
    <label className="grid gap-2 text-sm font-medium text-slate-700">
      <span>{label}</span>
      {children}
    </label>
  );
}
