interface FloatingActionButtonProps {
  onClick: () => void;
  label: string;
}

export function FloatingActionButton({ onClick, label }: FloatingActionButtonProps) {
  return (
    <button type="button" className="fab" onClick={onClick}>
      {label}
    </button>
  );
}
