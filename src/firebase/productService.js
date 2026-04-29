import { push, ref, set, get, remove, update } from 'firebase/database';
import { db } from './config';

export async function createProduct(product) {
  const productsRef = ref(db, 'products');
  const newProductRef = push(productsRef);

  await set(newProductRef, product);

  return newProductRef.key;
}

export async function getProducts() {
  const productsRef = ref(db, 'products');
  const snapshot = await get(productsRef);

  if (!snapshot.exists()) {
    return [];
  }

  const data = snapshot.val();

  return Object.keys(data).map((key) => ({
    id: key,
    ...data[key],
  }));
}

export async function deleteProduct(productId) {
  const productRef = ref(db, `products/${productId}`);
  await remove(productRef);
}

export async function updateProduct(productId, product) {
  const productRef = ref(db, `products/${productId}`);
  await update(productRef, product);
}