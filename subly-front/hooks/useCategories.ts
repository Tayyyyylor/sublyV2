import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { CategoryType } from '@/types/global';
import { getAllCategories } from '@/services/categoryService';

export const useCategories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getAllCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        setError('Impossible de charger les catégories');
        Alert.alert('Erreur', 'Impossible de charger les catégories');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isLoading, error };
};
