import React from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Card, Text } from 'react-native-paper';

export default function HallRepScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge">Hall Representative Panel</Text>
          <Text style={styles.text}>Track floor-level issues and coordinate with Admin and Student bodies.</Text>
          <Button mode="contained" style={styles.button} onPress={() => navigation.navigate('NoticeBoard')}>
            Open Notice Board
          </Button>
        </Card.Content>
      </Card>
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
    borderRadius: 12
  },
  text: {
    marginTop: 8,
    color: '#476b64'
  },
  button: {
    marginTop: 14
  }
});