// src/hooks/useRecurrences.ts
import { getAllRecurrences } from '@/services/recurrenceService';
import { FrequencyType } from '@/types/global';
import { useQuery } from '@tanstack/react-query';

export const useRecurrences = () => {
  return useQuery<FrequencyType[]>({
    queryKey: ['recurrences'],
    queryFn: getAllRecurrences,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });
};
