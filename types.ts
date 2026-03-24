
export interface ShoppingListItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  price: number;
}

export interface ProductData {
  unidade: string;
  preco: number;
  peso_cx?: number; // Peso da caixa em KG
  [key: string]: any;
}

export interface ProductDatabase {
  [key: string]: ProductData;
}
