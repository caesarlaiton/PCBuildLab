import { InventoryComponent, ComponentId } from '../types';
import { COMPONENT_INVENTORY } from '../data/inventoryData';

const USE_MOCK = true;

export const fetchInventoryByCategory = async (category: ComponentId): Promise<InventoryComponent[]> => {
  if (USE_MOCK) {
    return COMPONENT_INVENTORY.filter((item) => item.componentId === category);
  }

  const response = await fetch(`/api/v1/components?category=${category}`);
  if (!response.ok) {
    throw new Error('Error al obtener los componentes de la categoría especificada');
  }
  return response.json();
};

export const fetchAllInventory = async (): Promise<InventoryComponent[]> => {
  if (USE_MOCK) {
    return COMPONENT_INVENTORY;
  }

  const response = await fetch('/api/v1/components');
  if (!response.ok) {
    throw new Error('Error al obtener el inventario completo');
  }
  return response.json();
};