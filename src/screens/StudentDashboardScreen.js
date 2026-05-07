import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Bell, CreditCard, MessageSquareWarning, Soup, UserRound } from 'lucide-react-native';
import { Button } from 'react-native-paper';

import DashboardCard from '../components/DashboardCard';
import { useUser } from '../context/UserContext';

  const cards = [
  { title: 'Profile', icon: UserRound, route: 'Profile' },
  { title: 'Payment Status', icon: CreditCard, route: 'PaymentStatus' },
  { title: 'Notices', icon: Bell, route: 'NoticeBoard' },
  { title: 'Canteen Menu', icon: Soup },
  { title: 'Complaint Box', icon: MessageSquareWarning, route: 'ComplaintForm' }
];

export default function StudentDashboardScreen({ navigation }) {
  const { user, logout } = useUser();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Welcome, {user?.name}</Text>
      <View style={styles.profileCard}>
        <Text style={styles.profileLabel}>UID</Text>
        <Text style={styles.profileValue}>{user?.studentId || user?.uid || user?.id || 'N/A'}</Text>

        <Text style={styles.profileLabel}>Department</Text>
        <Text style={styles.profileValue}>{user?.department || 'N/A'}</Text>

        <Text style={styles.profileLabel}>Batch</Text>
        <Text style={styles.profileValue}>{user?.batch || 'N/A'}</Text>

        <Text style={styles.profileLabel}>Phone</Text>
        <Text style={styles.profileValue}>{user?.phone || 'N/A'}</Text>
      </View>

      <View style={styles.grid}>
        {cards.map((card) => (
          <DashboardCard
            key={card.title}
            title={card.title}
            icon={card.icon}
            onPress={() => {
              if (card.title === 'Profile') {
                navigation.navigate('Profile');
                return;
              }

              if (card.title === 'Canteen Menu') {
                navigation.navigate('CanteenMenu');
                return;
              }

              if (card.route) {
                navigation.navigate(card.route);
              }
            }}
          />
        ))}
      </View>

      <Button mode="contained-tonal" onPress={() => navigation.navigate('RoleSelector')}>
        Switch Role
      </Button>
      <Button style={styles.logout} mode="text" onPress={logout}>
        Logout
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f7f5'
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: '#153f37'
  },
  profileCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginTop: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e3ece8'
  },
  profileLabel: {
    fontSize: 12,
    color: '#6d8b84',
    marginTop: 8,
    textTransform: 'uppercase',
    letterSpacing: 0.5
  },
  profileValue: {
    fontSize: 15,
    fontWeight: '600',
    color: '#153f37',
    marginTop: 2
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 18
  },
  logout: {
    marginTop: 8
  }
});