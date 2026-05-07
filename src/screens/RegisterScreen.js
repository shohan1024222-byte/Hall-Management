import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput, HelperText } from 'react-native-paper';

import { useUser } from '../context/UserContext';

export default function RegisterScreen({ navigation }) {
  const { register } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [uid, setUid] = useState('');
  const [department, setDepartment] = useState('');
  const [batch, setBatch] = useState('');
  const [phone, setPhone] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onRegister = async () => {
    setError('');

    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }

    if (!department.trim()) {
      setError('Please enter your department');
      return;
    }

    if (!uid.trim()) {
      setError('Please enter your UID');
      return;
    }

    if (!batch.trim()) {
      setError('Please enter your batch');
      return;
    }

    if (!phone.trim()) {
      setError('Please enter your phone number');
      return;
    }

    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!password) {
      setError('Please enter a password');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      await register({
        email: email.trim(),
        password,
        name: name.trim(),
        uid: uid.trim(),
        department: department.trim(),
        batch: batch.trim(),
        phone: phone.trim()
      });
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.box}>
          <Text variant="headlineSmall" style={styles.title}>
            Create Account
          </Text>
          <Text style={styles.subtitle}>Student Registration</Text>

          {error ? (
            <HelperText type="error" style={styles.errorText}>
              {error}
            </HelperText>
          ) : null}

          <TextInput
            mode="outlined"
            label="Full Name"
            value={name}
            onChangeText={setName}
            editable={!loading}
            style={styles.input}
            placeholder="e.g., Asha Karim"
          />

          <TextInput
            mode="outlined"
            label="UID"
            value={uid}
            onChangeText={setUid}
            editable={!loading}
            style={styles.input}
            placeholder="e.g., 2021-01-001"
          />

          <TextInput
            mode="outlined"
            label="Department"
            value={department}
            onChangeText={setDepartment}
            editable={!loading}
            style={styles.input}
            placeholder="e.g., CSE"
          />

          <TextInput
            mode="outlined"
            label="Batch"
            value={batch}
            onChangeText={setBatch}
            editable={!loading}
            style={styles.input}
            placeholder="e.g., 2021-22"
          />

          <TextInput
            mode="outlined"
            label="Phone Number"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            editable={!loading}
            style={styles.input}
            placeholder="e.g., 01XXXXXXXXX"
          />

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

          <TextInput
            mode="outlined"
            label="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            editable={!loading}
            style={styles.input}
          />

          <Button
            mode="contained"
            onPress={onRegister}
            loading={loading}
            disabled={loading}
            style={styles.registerButton}
          >
            Create Account
          </Button>

          <Button
            mode="text"
            onPress={() => navigation.goBack()}
            disabled={loading}
            style={styles.backButton}
          >
            Back to Login
          </Button>
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
    padding: 18,
    paddingBottom: 32
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
  registerButton: {
    marginTop: 8
  },
  backButton: {
    marginTop: 4
  }
});
