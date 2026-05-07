import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ActivityIndicator, Alert, View } from 'react-native';
import { Button } from 'react-native-paper';

import { useUser } from '../context/UserContext';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import RoleSelectorScreen from '../screens/RoleSelectorScreen';
import StudentDashboardScreen from '../screens/StudentDashboardScreen';
import AdminManagementScreen from '../screens/AdminManagementScreen';
import AccountantScreen from '../screens/AccountantScreen';
import CanteenManagementScreen from '../screens/CanteenManagementScreen';
import NoticeBoardScreen from '../screens/NoticeBoardScreen';
import ComplaintFormScreen from '../screens/ComplaintFormScreen';
import HallRepScreen from '../screens/HallRepScreen';
import PaymentStatusScreen from '../screens/PaymentStatusScreen';
import ProfileScreen from '../screens/ProfileScreen';
import CanteenMenuScreen from '../screens/CanteenMenuScreen';

const Stack = createNativeStackNavigator();

const HomeScreenByRole = {
  Student: 'StudentDashboard',
  Admin: 'AdminManagement',
  Accountant: 'Accountant',
  Canteen: 'CanteenManagement',
  'Hall Rep': 'HallRep'
};

export default function AppNavigator() {
  const { user, loading, logout } = useUser();

  const confirmLogout = () => {
    Alert.alert('Logout', 'Do you want to sign out from the admin panel?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Logout', style: 'destructive', onPress: logout }
    ]);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack.Navigator>
      {!user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{
              title: 'Create Account',
              headerBackTitleVisible: true
            }}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="RoleSelector"
            component={RoleSelectorScreen}
            initialParams={{ targetRoute: HomeScreenByRole[user.role] || 'StudentDashboard' }}
            options={{ title: 'Select Role' }}
          />
          <Stack.Screen name="StudentDashboard" component={StudentDashboardScreen} options={{ title: 'Student Dashboard' }} />
          <Stack.Screen name="PaymentStatus" component={PaymentStatusScreen} options={{ title: 'Payment Status' }} />
          <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Profile' }} />
          <Stack.Screen name="CanteenMenu" component={CanteenMenuScreen} options={{ title: 'Canteen Menu' }} />
          <Stack.Screen
            name="AdminManagement"
            component={AdminManagementScreen}
            options={{
              title: 'Admin Management',
              headerRight: () => (
                <Button mode="text" compact textColor="#b3261e" onPress={confirmLogout}>
                  Logout
                </Button>
              )
            }}
          />
          <Stack.Screen name="Accountant" component={AccountantScreen} options={{ title: 'Accountant Module' }} />
          <Stack.Screen name="CanteenManagement" component={CanteenManagementScreen} options={{ title: 'Canteen Management' }} />
          <Stack.Screen name="NoticeBoard" component={NoticeBoardScreen} options={{ title: 'Notice Board' }} />
          <Stack.Screen name="ComplaintForm" component={ComplaintFormScreen} options={{ title: 'Complaint Box' }} />
          <Stack.Screen name="HallRep" component={HallRepScreen} options={{ title: 'Hall Rep Dashboard' }} />
        </>
      )}
    </Stack.Navigator>
  );
}