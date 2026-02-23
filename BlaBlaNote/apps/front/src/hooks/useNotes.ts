import { useCallback, useEffect, useState } from 'react';
import { notesApi } from '../api/notes.api';
import { ApiError } from '../types/api.types';
import { Note } from '../types/notes.types';

export function useNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchNotes = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await notesApi.getAll();
      setNotes(data);
    } catch (err) {
      const apiError = err as ApiError;
      setError(apiError.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  return {
    notes,
    isLoading,
    error,
    refetch: fetchNotes,
  };
}
