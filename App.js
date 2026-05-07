import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as PaperProvider, MD3LightTheme } from 'react-native-paper';

import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: '#005b4f',
    secondary: '#41644a',
    background: '#f4f7f5',
    surface: '#ffffff'
  }
};

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <UserProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </UserProvider>
    </PaperProvider>
  );
}