import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../utils/firebaseConfig';
import { ShoppingListItem } from '../types';

export interface Order {
  id?: string;
  createdAt: string;
  status: string;
  items: ShoppingListItem[];
  totalItems: number;
}

export const saveOrder = async (items: ShoppingListItem[]): Promise<string> => {
  try {
    const ordersRef = collection(db, 'orders');
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const newOrder = {
      createdAt: new Date().toISOString(),
      status: 'Pendente',
      items,
      totalItems
    };
    const docRef = await addDoc(ordersRef, newOrder);
    return docRef.id;
  } catch (error) {
    console.error("Erro ao salvar pedido:", error);
    throw new Error("Não foi possível salvar o pedido.");
  }
};

export const getOrders = async (): Promise<Order[]> => {
  try {
    const ordersRef = collection(db, 'orders');
    const q = query(ordersRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    console.error("Erro ao buscar pedidos:", error);
    throw new Error("Não foi possível buscar o histórico de pedidos.");
  }
};
