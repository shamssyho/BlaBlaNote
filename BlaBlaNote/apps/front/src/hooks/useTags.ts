import { useCallback, useEffect, useState } from 'react';
import { tagsApi } from '../api/tags.api';
import { ApiError } from '../types/api.types';
import { Tag } from '../types/tags.types';

export function useTags() {
  const [tags, setTags] = useState<Tag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTags = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setTags(await tagsApi.getAll());
    } catch (err) {
      setError((err as ApiError).message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchTags();
  }, [fetchTags]);

  return { tags, isLoading, error, refetch: fetchTags };
}
