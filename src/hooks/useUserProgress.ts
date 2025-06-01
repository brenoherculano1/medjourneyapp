import { useState, useCallback } from 'react';

interface Progress {
  ankiTotal: number;
  uworldTotal: number;
}

export const useUserProgress = () => {
  const [progress, setProgress] = useState<Progress>({
    ankiTotal: 0,
    uworldTotal: 0,
  });

  const incrementProgress = useCallback((key: keyof Progress, value: number) => {
    setProgress(prev => ({
      ...prev,
      [key]: prev[key] + value,
    }));
  }, []);

  return { progress, incrementProgress };
}; 