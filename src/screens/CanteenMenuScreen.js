import React, { useEffect, useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { Card, Text } from 'react-native-paper';

import { canteenService } from '../services/canteenService';

export default function CanteenMenuScreen() {
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadMenu = async () => {
    try {
      setLoading(true);
      const items = await canteenService.getMenuItems();
      setMenu(items.filter((item) => item.available !== false));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenu();
  }, []);

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>
        Today's Canteen Menu
      </Text>

      <FlatList
        data={menu}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadMenu} />}
        renderItem={({ item }) => (
          <Card style={styles.card}>
            <Card.Content>
              <Text variant="titleMedium" style={styles.title}>
                {item.dishName}
              </Text>
              {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
              <Text style={styles.price}>Tk {item.price}</Text>
            </Card.Content>
          </Card>
        )}
        ListEmptyComponent={<Text style={styles.emptyText}>{loading ? 'Loading menu...' : 'No menu items available right now.'}</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f4f7f5'
  },
  heading: {
    color: '#153f37',
    marginBottom: 12,
    fontWeight: '700'
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
  emptyText: {
    textAlign: 'center',
    marginTop: 24,
    color: '#5f7771'
  }
});