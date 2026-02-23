interface LoaderProps {
  label?: string;
}

export function Loader({ label = 'Loading...' }: LoaderProps) {
  return (
    <div className="loader-wrapper" role="status" aria-live="polite">
      <div className="loader" />
      <p>{label}</p>
    </div>
  );
}
