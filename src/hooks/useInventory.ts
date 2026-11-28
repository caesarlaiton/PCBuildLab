import { useState, useEffect } from 'react';
import { InventoryComponent, ComponentId } from '../types';
import { fetchInventoryByCategory } from '../services/api';

export const useInventory = (category: ComponentId | null) => {
  const [items, setItems] = useState<InventoryComponent[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!category) {
      setItems([]);
      return;
    }

    setLoading(true);
    fetchInventoryByCategory(category)
      .then((data) => {
        setItems(data);
        setError(null);
      })
      .catch((err) => {
        setError(err.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [category]);

  return { items, loading, error };
};