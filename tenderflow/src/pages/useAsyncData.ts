import {useEffect, useState, type DependencyList} from 'react';

export function useAsyncData<T>(loader: () => Promise<T>, deps: DependencyList) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);
    setError(null);
    loader()
      .then((result) => {
        if (active) setData(result);
      })
      .catch((caught: unknown) => {
        if (active) setError(caught instanceof Error ? caught.message : 'Unknown error');
      })
      .finally(() => {
        if (active) setIsLoading(false);
      });

    return () => {
      active = false;
    };
  }, deps);

  return {data, error, isLoading};
}
