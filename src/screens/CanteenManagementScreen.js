import React, { useEffect, useState } from 'react';
import { Alert, FlatList, Modal, StyleSheet, View } from 'react-native';
import { Button, Card, FAB, Switch, Text, TextInput } from 'react-native-paper';

import { canteenService } from '../services/canteenService';

const emptyForm = { dishName: '', price: '', available: true, description: '' };

export default function CanteenManagementScreen() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const items = await canteenService.getMenuItems();
      setMenu(items);
    } catch (error) {
      Alert.alert('Canteen Menu', error.message || 'Failed to load menu.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  const openAdd = () => {
    setFormMode('add');
    setEditingId(null);
    setForm(emptyForm);
    setShowModal(true);
  };

  const openEdit = (item) => {
    setFormMode('edit');
    setEditingId(item.id);
    setForm({
      dishName: item.dishName || '',
      price: String(item.price ?? ''),
      available: item.available !== false,
      description: item.description || ''
    });
    setShowModal(true);
  };

  const saveItem = async () => {
    if (!form.dishName.trim() || !form.price.trim()) {
      Alert.alert('Validation', 'Dish name and price are required.');
      return;
    }

    try {
      setSaving(true);
      if (formMode === 'add') {
        await canteenService.createMenuItem(form);
      } else {
        await canteenService.updateMenuItem(editingId, form);
      }
      setShowModal(false);
      setForm(emptyForm);
      setEditingId(null);
      await loadMenu();
    } catch (error) {
      Alert.alert('Canteen Menu', error.message || 'Failed to save item.');
    } finally {
      setSaving(false);
    }
  };

  const deleteItem = async (item) => {
    Alert.alert('Delete Menu Item', `Delete ${item.dishName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await canteenService.deleteMenuItem(item.id);
            await loadMenu();
          } catch (error) {
            Alert.alert('Canteen Menu', error.message || 'Failed to delete item.');
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        onRefresh={loadMenu}
        refreshing={loading}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.title}>
                {item.dishName}
              </Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              <Text style={styles.price}>Tk {item.price}</Text>
              <View style={styles.switchRow}>
                <Text>{item.available ? 'Available' : 'Out of Stock'}</Text>
                <Switch value={item.available} onValueChange={(val) => canteenService.updateMenuItem(item.id, { ...item, available: val })} />
              </View>
            </Card.Content>
            <Card.Actions>
              <Button onPress={() => openEdit(item)}>Edit</Button>
              <Button textColor="#b3261e" onPress={() => deleteItem(item)}>Delete</Button>
            </Card.Actions>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>{loading ? 'Loading...' : 'No menu items yet.'}</Text>}
      />

      <FAB style={styles.fab} icon="plus" label="Add Item" onPress={openAdd} />

      <Modal visible={showModal} transparent animationType="slide" onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text variant="titleMedium" style={styles.modalTitle}>
              {formMode === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
            </Text>

            <TextInput mode="outlined" label="Dish Name" value={form.dishName} onChangeText={(text) => setForm((prev) => ({ ...prev, dishName: text }))} style={styles.input} />
            <TextInput mode="outlined" label="Price" value={form.price} keyboardType="numeric" onChangeText={(text) => setForm((prev) => ({ ...prev, price: text }))} style={styles.input} />
            <TextInput mode="outlined" label="Description" value={form.description} onChangeText={(text) => setForm((prev) => ({ ...prev, description: text }))} style={styles.input} />

            <View style={styles.switchRow}>
              <Text>{form.available ? 'Available' : 'Out of Stock'}</Text>
              <Switch value={form.available} onValueChange={(val) => setForm((prev) => ({ ...prev, available: val }))} />
            </View>

            <View style={styles.modalActions}>
              <Button mode="contained" onPress={saveItem} loading={saving} disabled={saving}>
                Save
              </Button>
              <Button mode="text" disabled={saving} onPress={() => setShowModal(false)}>
                Cancel
              </Button>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5',
    padding: 12
  },
  card: {
    marginBottom: 10,
    borderRadius: 12
  },
  title: {
    color: '#153f37'
  },
  description: {
    marginTop: 4,
    color: '#5f7771'
  },
  price: {
    marginTop: 6,
    fontWeight: '700',
    color: '#005b4f'
  },
  input: {
    marginBottom: 10
  },
  switchRow: {
    marginTop: 4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#5f7771'
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#005b4f'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16
  },
  modalTitle: {
    marginBottom: 12,
    color: '#153f37'
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8
  }
});