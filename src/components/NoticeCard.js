import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Card } from 'react-native-paper';

export default function NoticeCard({ item }) {
  return (
    <Card style={styles.card}>
      <Card.Content>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.date}>{item.date}</Text>
        <View style={styles.divider} />
        <Text style={styles.description}>{item.description}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 10,
    borderRadius: 12
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f2f2a'
  },
  date: {
    marginTop: 2,
    color: '#3c6d64'
  },
  divider: {
    marginVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d9e7e4'
  },
  description: {
    color: '#29443f',
    lineHeight: 20
  }
});