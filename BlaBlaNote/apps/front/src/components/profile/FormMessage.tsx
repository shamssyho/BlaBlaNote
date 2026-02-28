export function FormMessage({
  type,
  message,
}: {
  type: 'success' | 'error';
  message: string | null;
}) {
  if (!message) {
    return null;
  }

  return (
    <p className={type === 'success' ? 'text-sm text-emerald-700' : 'text-sm text-red-600'}>
      {message}
    </p>
  );
}
