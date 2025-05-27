import { Frequency } from "@/types/global";



export const translateFrequency = (frequency: Frequency): string => {
    const translations: Record<Frequency, string> = {
      ONCE: 'UNE FOIS',
      DAILY: 'JOURNALIER',
      WEEKLY: 'HEBDOMADAIRE',
      MONTHLY: 'MENSUEL',
      QUARTERLY: 'TRIMESTRIEL',
      YEARLY: 'ANNUEL',
    };
    return translations[frequency];
  };