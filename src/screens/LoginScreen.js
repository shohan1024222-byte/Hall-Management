import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';

import { useUser } from '../context/UserContext';

export default function LoginScreen({ navigation }) {
  const { login } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onLogin = async () => {
    setError('');
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }
    
    if (!password) {
      setError('Please enter your password');
      return;
    }

    setLoading(true);
    try {
      await login({ email: email.trim(), password });
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.box}>
          <Text variant="headlineSmall" style={styles.title}>
            Hall Management System
          </Text>
          <Text style={styles.subtitle}>Student Login</Text>

          {error ? (
            <HelperText type="error" style={styles.errorText}>
              {error}
            </HelperText>
          ) : null}

          <TextInput
            mode="outlined"
            label="Email Address"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            editable={!loading}
            style={styles.input}
            placeholder="student@example.com"
          />

          <TextInput
            mode="outlined"
            label="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            editable={!loading}
            style={styles.input}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
          />

          <Button
            mode="contained"
            onPress={onLogin}
            loading={loading}
            disabled={loading}
            style={styles.loginButton}
          >
            Login
          </Button>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <Button
            mode="outlined"
            onPress={onRegister}
            disabled={loading}
            style={styles.registerButton}
          >
            Create New Account
          </Button>

          <Text style={styles.hint}>
            Sign in with Firebase email/password. Admin and Canteen users must have role set in Firestore.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5'
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 18
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: 18,
    gap: 12
  },
  title: {
    textAlign: 'center',
    color: '#0f2f2a',
    marginBottom: 4
  },
  subtitle: {
    textAlign: 'center',
    color: '#50736c',
    marginBottom: 8
  },
  errorText: {
    marginHorizontal: 0,
    marginBottom: 4,
    color: '#d32f2f'
  },
  input: {
    marginTop: 2
  },
  loginButton: {
    marginTop: 8
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
    gap: 8
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#e0e0e0'
  },
  dividerText: {
    color: '#999',
    fontSize: 12
  },
  registerButton: {
    borderColor: '#005b4f'
  },
  hint: {
    fontSize: 12,
    color: '#999',
    textAlign: 'center',
    marginTop: 8,
    fontStyle: 'italic'
  }
});