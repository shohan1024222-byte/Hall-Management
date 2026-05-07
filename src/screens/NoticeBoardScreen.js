import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Button, TextInput } from 'react-native-paper';

import { useUser } from '../context/UserContext';
import NoticeCard from '../components/NoticeCard';

const seedNotices = [
  {
    id: 'n1',
    title: 'Water Supply Maintenance',
    date: '2026-04-21',
    description: 'Water service will pause from 10:00 AM to 12:00 PM due to maintenance.'
  },
  {
    id: 'n2',
    title: 'Monthly Hall Meeting',
    date: '2026-04-19',
    description: 'All residents should attend the hall meeting at the common room by 7:00 PM.'
  }
];

export default function NoticeBoardScreen() {
  const { user } = useUser();
  const isAdmin = user?.role === 'Admin';
  const [notices, setNotices] = useState(seedNotices);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const sortedNotices = useMemo(
    () => [...notices].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [notices]
  );

  const postNotice = () => {
    if (!title.trim() || !description.trim()) return;
    const today = new Date().toISOString().split('T')[0];
    const nextNotice = {
      id: `n-${Date.now()}`,
      title: title.trim(),
      date: today,
      description: description.trim()
    };
    setNotices((prev) => [nextNotice, ...prev]);
    setTitle('');
    setDescription('');
  };

  return (
    <View style={styles.container}>
      {isAdmin && (
        <View style={styles.form}>
          <TextInput mode="outlined" label="Title" value={title} onChangeText={setTitle} style={styles.input} />
          <TextInput
            mode="outlined"
            label="Description"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            style={styles.input}
          />
          <Button mode="contained" onPress={postNotice}>
            Post Notice
          </Button>
        </View>
      )}

      <FlatList
        data={sortedNotices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NoticeCard item={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5',
    padding: 12
  },
  form: {
    marginBottom: 12,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10
  },
  input: {
    marginBottom: 8
  }
});