import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

export default function DashboardCard({ title, icon: Icon, onPress }) {
  return (
    <Pressable onPress={onPress} style={styles.wrapper}>
      <Card style={styles.card}>
        <Card.Content style={styles.content}>
          <View style={styles.iconWrap}>
            <Icon size={24} color="#005b4f" />
          </View>
          <Text style={styles.title}>{title}</Text>
        </Card.Content>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '48%'
  },
  card: {
    borderRadius: 16,
    marginBottom: 12
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20
  },
  iconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#e8f1ef',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    marginTop: 10,
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
    color: '#123d36'
  }
});