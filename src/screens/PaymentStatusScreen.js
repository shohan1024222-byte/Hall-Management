import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View, RefreshControl } from 'react-native';
import { ActivityIndicator, Button, Card, Text } from 'react-native-paper';
import { CreditCard, CheckCircle, Clock, AlertCircle } from 'lucide-react-native';

import { useUser } from '../context/UserContext';
import { paymentService } from '../services/paymentService';

export default function PaymentStatusScreen() {
  const { user } = useUser();
  const [paymentData, setPaymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPaymentStatus();
  }, [user?.id]);

  const fetchPaymentStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      if (user?.id) {
        const summary = await paymentService.getPaymentSummary(user.id);
        setPaymentData(summary);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPaymentStatus();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator animating={true} size="large" color="#005b4f" />
        <Text style={styles.loadingText}>Loading payment status...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <ScrollView
        contentContainerStyle={styles.centerContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <AlertCircle size={48} color="#d32f2f" style={styles.errorIcon} />
        <Text style={styles.errorText}>{error}</Text>
        <Button mode="contained" onPress={fetchPaymentStatus} style={styles.retryButton}>
          Retry
        </Button>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Summary Cards */}
      <View style={styles.summarySection}>
        <Card style={[styles.summaryCard, styles.dueCard]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <AlertCircle size={24} color="#f57c00" />
              <Text style={styles.cardLabel}>Total Due</Text>
            </View>
            <Text style={styles.amountText}>৳ {paymentData?.totalDue || 0}</Text>
            <Text style={styles.cardDescription}>
              {paymentData?.pendingPayments?.length || 0} pending
            </Text>
          </Card.Content>
        </Card>

        <Card style={[styles.summaryCard, styles.paidCard]}>
          <Card.Content style={styles.cardContent}>
            <View style={styles.cardHeader}>
              <CheckCircle size={24} color="#4caf50" />
              <Text style={styles.cardLabel}>Total Paid</Text>
            </View>
            <Text style={styles.amountText}>৳ {paymentData?.totalPaid || 0}</Text>
            <Text style={styles.cardDescription}>
              {paymentData?.completedPayments?.length || 0} completed
            </Text>
          </Card.Content>
        </Card>
      </View>

      {/* Pending Payments */}
      {paymentData?.pendingPayments && paymentData.pendingPayments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pending Payments</Text>
          {paymentData.pendingPayments.map((payment) => (
            <Card key={payment.id} style={styles.paymentCard}>
              <Card.Content style={styles.paymentCardContent}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>{payment.description || 'Payment'}</Text>
                    <Text style={styles.paymentMeta}>
                      Due: {payment.dueDate ? new Date(payment.dueDate).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                  <View style={styles.statusBadge}>
                    <Clock size={16} color="#f57c00" />
                    <Text style={styles.statusText}>Pending</Text>
                  </View>
                </View>
                <Text style={styles.paymentAmount}>৳ {payment.amount || 0}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      {/* Completed Payments */}
      {paymentData?.completedPayments && paymentData.completedPayments.length > 0 && (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment History</Text>
          {paymentData.completedPayments.map((payment) => (
            <Card key={payment.id} style={styles.paymentCardCompleted}>
              <Card.Content style={styles.paymentCardContent}>
                <View style={styles.paymentHeader}>
                  <View style={styles.paymentInfo}>
                    <Text style={styles.paymentTitle}>{payment.description || 'Payment'}</Text>
                    <Text style={styles.paymentMeta}>
                      Paid: {payment.paidDate ? new Date(payment.paidDate).toLocaleDateString() : 'N/A'}
                    </Text>
                  </View>
                  <View style={[styles.statusBadge, styles.completedBadge]}>
                    <CheckCircle size={16} color="#4caf50" />
                    <Text style={styles.statusTextCompleted}>Paid</Text>
                  </View>
                </View>
                <Text style={styles.paymentAmount}>৳ {payment.amount || 0}</Text>
              </Card.Content>
            </Card>
          ))}
        </View>
      )}

      {/* No Payments */}
      {(!paymentData?.allPayments || paymentData.allPayments.length === 0) && (
        <View style={styles.emptyContainer}>
          <CreditCard size={48} color="#bdbdbd" />
          <Text style={styles.emptyText}>No payments found</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#f4f7f5',
    paddingBottom: 24
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7f5',
    paddingHorizontal: 16,
    paddingVertical: 32
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14
  },
  errorIcon: {
    marginBottom: 12
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 16
  },
  retryButton: {
    marginTop: 8
  },
  summarySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 20
  },
  summaryCard: {
    flex: 1,
    borderRadius: 12
  },
  dueCard: {
    backgroundColor: '#fff3e0'
  },
  paidCard: {
    backgroundColor: '#e8f5e9'
  },
  cardContent: {
    paddingVertical: 12
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8
  },
  cardLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: '600'
  },
  amountText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#153f37',
    marginBottom: 4
  },
  cardDescription: {
    fontSize: 12,
    color: '#999'
  },
  section: {
    marginBottom: 20
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#153f37',
    marginBottom: 12
  },
  paymentCard: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#fff'
  },
  paymentCardCompleted: {
    marginBottom: 10,
    borderRadius: 10,
    backgroundColor: '#f1f8f6'
  },
  paymentCardContent: {
    paddingVertical: 12
  },
  paymentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8
  },
  paymentInfo: {
    flex: 1
  },
  paymentTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#153f37',
    marginBottom: 2
  },
  paymentMeta: {
    fontSize: 12,
    color: '#999'
  },
  paymentAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#005b4f'
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    backgroundColor: '#fff3e0',
    borderRadius: 6
  },
  completedBadge: {
    backgroundColor: '#e8f5e9'
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#f57c00'
  },
  statusTextCompleted: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4caf50'
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48
  },
  emptyText: {
    marginTop: 12,
    color: '#bdbdbd',
    fontSize: 14
  }
});
