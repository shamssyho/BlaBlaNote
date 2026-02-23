import { NoteProcessingStatus } from '../../types/notes.types';

interface StatusBadgeProps {
  status: NoteProcessingStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  return <span className={`status-badge ${status}`}>{status}</span>;
}
