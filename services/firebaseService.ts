import { collection, addDoc, getDocs, query, orderBy, where, getDocFromServer, doc, updateDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { ShoppingListItem } from '../types';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string;
    email?: string | null;
    emailVerified?: boolean;
    isAnonymous?: boolean;
    tenantId?: string | null;
    providerInfo: {
      providerId: string;
      displayName: string | null;
      email: string | null;
      photoUrl: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData.map(provider => ({
        providerId: provider.providerId,
        displayName: provider.displayName,
        email: provider.email,
        photoUrl: provider.photoURL
      })) || []
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface Order {
  id?: string;
  createdAt: string;
  status: string;
  items: ShoppingListItem[];
  totalItems: number;
  authorUID: string;
}

export const saveOrder = async (items: ShoppingListItem[]): Promise<string> => {
  const path = 'orders';
  try {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado.");
    }
    const ordersRef = collection(db, path);
    const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);
    const newOrder = {
      createdAt: new Date().toISOString(),
      status: 'Pendente',
      items,
      totalItems,
      authorUID: auth.currentUser.uid
    };
    const docRef = await addDoc(ordersRef, newOrder);
    return docRef.id;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
    throw error;
  }
};

export const getOrders = async (): Promise<Order[]> => {
  const path = 'orders';
  try {
    if (!auth.currentUser) {
      return [];
    }
    const ordersRef = collection(db, path);
    const q = query(ordersRef, where('authorUID', '==', auth.currentUser.uid), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const orders: Order[] = [];
    querySnapshot.forEach((doc) => {
      orders.push({ id: doc.id, ...doc.data() } as Order);
    });
    
    return orders;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
    throw error;
  }
};

export const updateOrderStatus = async (orderId: string, newStatus: string): Promise<void> => {
  const path = `orders/${orderId}`;
  try {
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { status: newStatus });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, path);
    throw error;
  }
};

export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if(error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. ");
    }
  }
}
