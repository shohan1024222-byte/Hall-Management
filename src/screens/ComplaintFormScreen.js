import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, View } from 'react-native';
import { useFormik } from 'formik';
import * as yup from 'yup';
import { Button, SegmentedButtons, Text, TextInput } from 'react-native-paper';
import { useUser } from '../context/UserContext';
import { complaintService } from '../services/complaintService';

const categories = ['Plumbing', 'Electrical', 'Food', 'Other'];

const schema = yup.object({
  category: yup.string().oneOf(categories).required('Please select a category'),
  issue: yup.string().min(10, 'Please provide more detail').required('Issue is required')
});

export default function ComplaintFormScreen() {
  const { user } = useUser();
  const [loading, setLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      category: 'Plumbing',
      issue: ''
    },
    validationSchema: schema,
    onSubmit: async (values, { resetForm }) => {
      if (!user) {
        Alert.alert('Error', 'User not authenticated');
        return;
      }

      setLoading(true);
      try {
        await complaintService.createComplaint({
          userId: user.uid,
          userName: user.name,
          email: user.email,
          category: values.category,
          issue: values.issue
        });
        Alert.alert('Success', 'Complaint submitted successfully!');
      } catch (error) {
        Alert.alert('Error', error.message || 'Failed to submit complaint');
      } finally {
        setLoading(false);
      }
      resetForm();
    }
  });

  const issueError = formik.touched.issue && formik.errors.issue ? formik.errors.issue : '';

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.card}>
        <Text variant="titleMedium" style={styles.heading}>
          Submit a Complaint
        </Text>

        <Text style={styles.label}>Category</Text>
        <SegmentedButtons
          value={formik.values.category}
          onValueChange={(value) => formik.setFieldValue('category', value)}
          buttons={categories.map((item) => ({ label: item, value: item }))}
          style={styles.segmented}
        />

        <TextInput
          mode="outlined"
          label="Describe your issue"
          value={formik.values.issue}
          onChangeText={formik.handleChange('issue')}
          onBlur={formik.handleBlur('issue')}
          multiline
          numberOfLines={5}
          error={Boolean(issueError)}
        />
        {issueError ? <Text style={styles.error}>{issueError}</Text> : null}

        <Button mode="contained" style={styles.button} onPress={formik.handleSubmit} loading={loading} disabled={loading}>
          Submit
        </Button>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#f4f7f5',
    padding: 14
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14
  },
  heading: {
    marginBottom: 10,
    color: '#123d36'
  },
  label: {
    marginBottom: 6,
    color: '#4b6f68'
  },
  segmented: {
    marginBottom: 10
  },
  button: {
    marginTop: 12
  },
  error: {
    color: '#b3261e',
    marginTop: 6
  }
});