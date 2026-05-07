import React, { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import { useUser } from '../context/UserContext';

export default function ProfileScreen() {
  const { user, updateProfile } = useUser();
  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [batch, setBatch] = useState(user?.batch || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [room, setRoom] = useState(user?.room || '');
  const [saving, setSaving] = useState(false);

  const onSave = async () => {
    setSaving(true);
    try {
      await updateProfile({ name, department, batch, phone, room });
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text variant="titleMedium">Profile</Text>

        <Text style={styles.label}>UID</Text>
        <Text style={styles.value}>{user?.uid || user?.id || 'N/A'}</Text>

        <TextInput label="Name" value={name} onChangeText={setName} style={styles.input} />
        <TextInput label="Department" value={department} onChangeText={setDepartment} style={styles.input} />
        <TextInput label="Batch" value={batch} onChangeText={setBatch} style={styles.input} />
        <TextInput label="Phone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
        <TextInput label="Room" value={room} onChangeText={setRoom} style={styles.input} />

        <Button mode="contained" onPress={onSave} loading={saving} disabled={saving} style={styles.saveBtn}>
          Save
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#f4f7f5' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 12 },
  label: { marginTop: 12, color: '#6d8b84', fontSize: 12 },
  value: { fontSize: 15, fontWeight: '600', color: '#153f37', marginTop: 4 },
  input: { marginTop: 8 },
  saveBtn: { marginTop: 12 }
});
