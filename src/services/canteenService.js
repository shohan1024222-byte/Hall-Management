import { addDoc, collection, deleteDoc, doc, getDocs, updateDoc } from 'firebase/firestore';
import { db } from './firebaseConfig';

const collectionRef = collection(db, 'canteenMenus');

export const canteenService = {
  async getMenuItems() {
    try {
      const snapshot = await getDocs(collectionRef);
      const items = [];
      snapshot.forEach((menuDoc) => {
        items.push({ id: menuDoc.id, ...menuDoc.data() });
      });
      return items
        .filter((item) => item.active !== false)
        .sort((a, b) => (a.createdAt?.seconds || 0) - (b.createdAt?.seconds || 0));
    } catch (error) {
      throw new Error(`Failed to load canteen menu: ${error.message}`);
    }
  },

  async createMenuItem(menuItem) {
    try {
      const docRef = await addDoc(collectionRef, {
        ...menuItem,
        price: Number(menuItem.price) || 0,
        available: menuItem.available !== false,
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      return { id: docRef.id, ...menuItem };
    } catch (error) {
      throw new Error(`Failed to add menu item: ${error.message}`);
    }
  },

  async updateMenuItem(itemId, updates) {
    try {
      const menuRef = doc(db, 'canteenMenus', itemId);
      await updateDoc(menuRef, {
        ...updates,
        price: Number(updates.price) || 0,
        updatedAt: new Date()
      });
      return { id: itemId, ...updates };
    } catch (error) {
      throw new Error(`Failed to update menu item: ${error.message}`);
    }
  },

  async deleteMenuItem(itemId) {
    try {
      const menuRef = doc(db, 'canteenMenus', itemId);
      await deleteDoc(menuRef);
      return { id: itemId };
    } catch (error) {
      throw new Error(`Failed to delete menu item: ${error.message}`);
    }
  }
};