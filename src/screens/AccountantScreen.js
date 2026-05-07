import React, { useMemo, useState } from 'react';
import { FlatList, Modal, StyleSheet, View } from 'react-native';
import { Button, Card, SegmentedButtons, Text, TextInput } from 'react-native-paper';

const payments = [
  { id: 'p1', name: 'Asha Karim', amount: 2500, date: '2026-04-16' },
  { id: 'p2', name: 'Tariq Hasan', amount: 3000, date: '2026-04-17' }
];

const initialDueList = [
  { id: 'd1', name: 'Mili Saha', due: 3200 },
  { id: 'd2', name: 'Nafis Islam', due: 2800 }
];

export default function AccountantScreen() {
  const [tab, setTab] = useState('payments');
  const [dueList, setDueList] = useState(initialDueList);
  const [showModal, setShowModal] = useState(false);
  const [selectedDueId, setSelectedDueId] = useState(null);
  const [amount, setAmount] = useState('');

  const selectedDue = useMemo(
    () => dueList.find((student) => student.id === selectedDueId),
    [dueList, selectedDueId]
  );

  const openCollectModal = (dueId) => {
    setSelectedDueId(dueId);
    setAmount('');
    setShowModal(true);
  };

  const collectPayment = () => {
    const numericAmount = Number(amount || 0);
    if (!selectedDue || Number.isNaN(numericAmount) || numericAmount <= 0) return;

    setDueList((prev) =>
      prev
        .map((student) =>
          student.id === selectedDue.id ? { ...student, due: Math.max(student.due - numericAmount, 0) } : student
        )
        .filter((student) => student.due > 0)
    );
    setShowModal(false);
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { label: 'Payments', value: 'payments' },
          { label: 'Due List', value: 'dues' }
        ]}
        style={styles.tabs}
      />

      {tab === 'payments' ? (
        <FlatList
          data={payments}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={`Paid: ${item.amount} | ${item.date}`} />
            </Card>
          )}
        />
      ) : (
        <FlatList
          data={dueList}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <Card style={styles.card}>
              <Card.Title title={item.name} subtitle={`Outstanding: ${item.due}`} />
              <Card.Actions>
                <Button mode="contained" onPress={() => openCollectModal(item.id)}>
                  Collect Payment
                </Button>
              </Card.Actions>
            </Card>
          )}
          ListEmptyComponent={<Text style={styles.empty}>No outstanding balances.</Text>}
        />
      )}

      <Modal animationType="slide" visible={showModal} transparent onRequestClose={() => setShowModal(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text variant="titleMedium">Collect Payment</Text>
            <Text style={styles.modalText}>{selectedDue?.name || 'Student'}</Text>
            <TextInput
              mode="outlined"
              label="Amount"
              keyboardType="numeric"
              value={amount}
              onChangeText={setAmount}
              style={styles.modalInput}
            />
            <Button mode="contained" onPress={collectPayment}>
              Confirm
            </Button>
            <Button mode="text" onPress={() => setShowModal(false)}>
              Cancel
            </Button>
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
  tabs: {
    marginBottom: 10
  },
  card: {
    marginBottom: 10,
    borderRadius: 12
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#4a6d66'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16
  },
  modalText: {
    marginTop: 4,
    color: '#476b64'
  },
  modalInput: {
    marginVertical: 10
  }
});