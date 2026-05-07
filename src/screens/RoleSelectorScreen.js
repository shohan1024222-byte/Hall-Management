import React, { useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, SegmentedButtons, Text } from 'react-native-paper';

import { useUser } from '../context/UserContext';

const roles = ['Student', 'Admin', 'Accountant', 'Canteen', 'Hall Rep'];

const routeByRole = {
  Student: 'StudentDashboard',
  Admin: 'AdminManagement',
  Accountant: 'Accountant',
  Canteen: 'CanteenManagement',
  'Hall Rep': 'HallRep'
};

export default function RoleSelectorScreen({ navigation }) {
  const { user, switchRole, logout } = useUser();
  const [selectedRole, setSelectedRole] = useState(user?.role || 'Student');

  useEffect(() => {
    if (user?.role) {
      setSelectedRole(user.role);
      navigation.replace(routeByRole[user.role] || 'StudentDashboard');
    }
  }, [navigation, user?.role]);

  const goToRoleScreen = async () => {
    await switchRole(selectedRole);
    navigation.replace(routeByRole[selectedRole] || 'StudentDashboard');
  };

  return (
    <View style={styles.container}>
      <Text variant="headlineSmall" style={styles.heading}>
        Select Role
      </Text>
      <Text style={styles.caption}>Current user: {user?.name}</Text>

      <SegmentedButtons
        value={selectedRole}
        onValueChange={setSelectedRole}
        buttons={roles.map((role) => ({ value: role, label: role }))}
        style={styles.segmented}
      />

      <Button mode="contained" onPress={goToRoleScreen}>
        Continue
      </Button>
      <Button mode="text" onPress={logout}>
        Logout
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5',
    padding: 16,
    justifyContent: 'center'
  },
  heading: {
    textAlign: 'center',
    marginBottom: 6,
    color: '#123d36'
  },
  caption: {
    textAlign: 'center',
    color: '#4c6c66',
    marginBottom: 20
  },
  segmented: {
    marginBottom: 16
  }
});