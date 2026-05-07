import React, { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Share, StyleSheet, View } from 'react-native';
import {
  ActivityIndicator,
  Button,
  Card,
  Chip,
  FAB,
  Searchbar,
  SegmentedButtons,
  Snackbar,
  Text,
  TextInput
} from 'react-native-paper';

import { useUser } from '../context/UserContext';
import { studentService } from '../services/studentService';
import { canteenService } from '../services/canteenService';
import { complaintService } from '../services/complaintService';

const TABS = { STUDENTS: 'students', CANTEEN: 'canteen', COMPLAINTS: 'complaints' };

export default function AdminManagementScreen() {
  const [activeTab, setActiveTab] = useState(TABS.STUDENTS);

  // Students state
  const [students, setStudents] = useState([]);
  const [query, setQuery] = useState('');
  const [blockFilter, setBlockFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [showFormModal, setShowFormModal] = useState(false);
  const [formMode, setFormMode] = useState('add');
  const [editingId, setEditingId] = useState(null);
  const [name, setName] = useState('');
  const [room, setRoom] = useState('');
  const [uidValue, setUidValue] = useState('');
  const [block, setBlock] = useState('A');
  const [status, setStatus] = useState('Active');

  // Canteen state
  const [menu, setMenu] = useState([]);
  const [showMenuModal, setShowMenuModal] = useState(false);
  const [formModeMenu, setFormModeMenu] = useState('add');
  const [editingMenuId, setEditingMenuId] = useState(null);
  const [dishName, setDishName] = useState('');
  const [price, setPrice] = useState('');
  const [available, setAvailable] = useState(true);
  const [description, setDescription] = useState('');

  // Complaints state
  const [complaints, setComplaints] = useState([]);
  const [showResponseModal, setShowResponseModal] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [response, setResponse] = useState('');

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [snack, setSnack] = useState({ visible: false, message: '' });

  const pageSize = 5;

  const showMessage = (message) => {
    setSnack({ visible: true, message });
  };

  // === STUDENTS TAB ===
  useEffect(() => {
    if (activeTab === TABS.STUDENTS) {
      loadStudents();
    } else if (activeTab === TABS.CANTEEN) {
      loadMenu();
    } else if (activeTab === TABS.COMPLAINTS) {
      loadComplaints();
    }
  }, [activeTab]);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getStudents();
      setStudents(data);
    } catch (error) {
      showMessage(error.message || 'Failed to load students.');
    } finally {
      setLoading(false);
    }
  };

  const blockOptions = useMemo(() => {
    const allBlocks = [...new Set(students.map((student) => student.block))].sort();
    return ['All', ...allBlocks];
  }, [students]);

  const filteredStudents = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return students.filter((student) => {
      const matchesSearch =
        !normalized ||
        student.name.toLowerCase().includes(normalized) ||
        student.room.toLowerCase().includes(normalized);
      const matchesBlock = blockFilter === 'All' || student.block === blockFilter;
      const matchesStatus = statusFilter === 'All' || student.status === statusFilter;
      return matchesSearch && matchesBlock && matchesStatus;
    });
  }, [students, query, blockFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredStudents.length / pageSize));
  const pagedStudents = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredStudents.slice(start, start + pageSize);
  }, [filteredStudents, page]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  useEffect(() => {
    setPage(1);
  }, [query, blockFilter, statusFilter]);

  const deleteStudent = async (id) => {
    const snapshot = students;
    setStudents((prev) => prev.filter((student) => student.id !== id));

    try {
      await studentService.deleteStudent(id);
      showMessage('Student deleted successfully.');
    } catch (error) {
      setStudents(snapshot);
      showMessage(error.message);
    }
  };

  const confirmDelete = (student) => {
    Alert.alert('Delete Student', `Are you sure you want to delete ${student.name}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteStudent(student.id) }
    ]);
  };

  const resetStudentForm = () => {
    setName('');
    setRoom('');
    setBlock('A');
    setStatus('Active');
    setEditingId(null);
    setUidValue('');
  };

  const openAddStudent = () => {
    setFormMode('add');
    resetStudentForm();
    setShowFormModal(true);
  };

  const openEditStudent = (student) => {
    setFormMode('edit');
    setEditingId(student.id);
    setName(student.name);
    setRoom(student.room);
    setBlock(student.block);
    setStatus(student.status);
    setUidValue(student.uid || '');
    setShowFormModal(true);
  };

  const submitStudentForm = async () => {
    if (!name.trim() || !room.trim() || !block.trim()) {
      Alert.alert('Validation', 'Name, room, and block are required.');
      return;
    }

    setSaving(true);
    const studentPayload = {
      name: name.trim(),
      room: room.trim().toUpperCase(),
      block: block.trim().toUpperCase(),
      status,
      uid: uidValue && uidValue.trim() ? uidValue.trim() : undefined
    };

    const snapshot = students;

    try {
      if (formMode === 'add') {
        const next = { id: `s-${Date.now()}`, ...studentPayload };
        setStudents((prev) => [next, ...prev]);
        await studentService.createStudent(next);
        showMessage('Student added successfully.');
      } else {
        setStudents((prev) =>
          prev.map((student) =>
            student.id === editingId ? { ...student, ...studentPayload } : student
          )
        );
        await studentService.updateStudent(editingId, studentPayload);
        showMessage('Student updated successfully.');
      }
      setShowFormModal(false);
      resetStudentForm();
    } catch (error) {
      setStudents(snapshot);
      showMessage(error.message);
    } finally {
      setSaving(false);
    }
  };

  const exportCsv = async () => {
    if (!filteredStudents.length) {
      Alert.alert('Export', 'No students found for current filter.');
      return;
    }

    const header = 'ID,Name,Room,Block,Status';
    const rows = filteredStudents.map(
      (student) =>
        `${student.id},"${student.name.replace(/"/g, '""')}",${student.room},${student.block},${student.status}`
    );
    const csv = [header, ...rows].join('\n');

    await Share.share({ title: 'Students Export', message: csv });
  };

  // === CANTEEN TAB ===
  const loadMenu = async () => {
    try {
      setLoading(true);
      const items = await canteenService.getMenuItems();
      setMenu(items);
    } catch (error) {
      showMessage(error.message || 'Failed to load canteen menu.');
    } finally {
      setLoading(false);
    }
  };

  const openAddMenu = () => {
    setFormModeMenu('add');
    setEditingMenuId(null);
    setDishName('');
    setPrice('');
    setAvailable(true);
    setDescription('');
    setShowMenuModal(true);
  };

  const openEditMenu = (item) => {
    setFormModeMenu('edit');
    setEditingMenuId(item.id);
    setDishName(item.dishName || '');
    setPrice(String(item.price ?? ''));
    setAvailable(item.available !== false);
    setDescription(item.description || '');
    setShowMenuModal(true);
  };

  const saveMenuItem = async () => {
    if (!dishName.trim() || !price.trim()) {
      Alert.alert('Validation', 'Dish name and price are required.');
      return;
    }

    try {
      setSaving(true);
      if (formModeMenu === 'add') {
        await canteenService.createMenuItem({
          dishName: dishName.trim(),
          price: Number(price),
          available,
          description: description.trim()
        });
      } else {
        await canteenService.updateMenuItem(editingMenuId, {
          dishName: dishName.trim(),
          price: Number(price),
          available,
          description: description.trim()
        });
      }
      setShowMenuModal(false);
      setDishName('');
      setPrice('');
      setDescription('');
      await loadMenu();
    } catch (error) {
      Alert.alert('Canteen Menu', error.message || 'Failed to save item.');
    } finally {
      setSaving(false);
    }
  };

  const deleteMenu = async (item) => {
    Alert.alert('Delete Menu Item', `Delete ${item.dishName}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await canteenService.deleteMenuItem(item.id);
            await loadMenu();
          } catch (error) {
            Alert.alert('Canteen Menu', error.message || 'Failed to delete item.');
          }
        }
      }
    ]);
  };

  // === COMPLAINTS TAB ===
  const loadComplaints = async () => {
    try {
      setLoading(true);
      const items = await complaintService.getComplaints();
      setComplaints(items);
    } catch (error) {
      showMessage(error.message || 'Failed to load complaints.');
    } finally {
      setLoading(false);
    }
  };

  const openRespond = (complaint) => {
    setSelectedComplaint(complaint);
    setResponse(complaint.response || '');
    setShowResponseModal(true);
  };

  const submitResponse = async () => {
    if (!response.trim()) {
      Alert.alert('Validation', 'Please enter a response.');
      return;
    }

    try {
      setSaving(true);
      await complaintService.updateComplaintStatus(selectedComplaint.id, 'responded', response.trim());
      setShowResponseModal(false);
      setResponse('');
      setSelectedComplaint(null);
      await loadComplaints();
      showMessage('Response submitted successfully.');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to submit response.');
    } finally {
      setSaving(false);
    }
  };

  const resolveComplaint = async (complaint) => {
    try {
      await complaintService.updateComplaintStatus(complaint.id, 'resolved');
      await loadComplaints();
      showMessage('Complaint marked as resolved.');
    } catch (error) {
      Alert.alert('Error', error.message || 'Failed to resolve complaint.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingWrap}>
        <ActivityIndicator size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.headerTextWrap}>
          <Text variant="headlineSmall" style={styles.headerTitle}>
            Admin Management
          </Text>
          <Text style={styles.headerSubtitle}>Manage students, canteen menu, and complaints</Text>
        </View>
      </View>

      <SegmentedButtons
        value={activeTab}
        onValueChange={setActiveTab}
        buttons={[
          { value: TABS.STUDENTS, label: 'Students' },
          { value: TABS.CANTEEN, label: 'Canteen' },
          { value: TABS.COMPLAINTS, label: 'Complaints' }
        ]}
        style={styles.tabs}
      />

      {activeTab === TABS.STUDENTS && (
        <>
          <Searchbar placeholder="Search by name or room" value={query} onChangeText={setQuery} style={styles.search} />

          <View style={styles.filterRow}>
            {blockOptions.map((item) => (
              <Chip
                key={`block-${item}`}
                mode={blockFilter === item ? 'flat' : 'outlined'}
                selected={blockFilter === item}
                onPress={() => setBlockFilter(item)}
                style={styles.chip}
              >
                {item}
              </Chip>
            ))}
          </View>

          <View style={styles.filterRow}>
            {['All', 'Active', 'Inactive'].map((item) => (
              <Chip
                key={`status-${item}`}
                mode={statusFilter === item ? 'flat' : 'outlined'}
                selected={statusFilter === item}
                onPress={() => setStatusFilter(item)}
                style={styles.chip}
              >
                {item}
              </Chip>
            ))}
          </View>

          <FlatList
            data={pagedStudents}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Title
                  title={item.name}
                  subtitle={`Room ${item.room} | Block ${item.block} | ${item.status}${item.uid ? ' | UID: ' + item.uid : ''}`}
                />
                <Card.Actions>
                  <Button onPress={() => openEditStudent(item)}>Edit</Button>
                  <Button textColor="#b3261e" onPress={() => confirmDelete(item)}>
                    Delete
                  </Button>
                </Card.Actions>
              </Card>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No students found.</Text>}
          />

          <View style={styles.footerRow}>
            <Button mode="outlined" onPress={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
              Prev
            </Button>
            <Text style={styles.pageText}>
              Page {page} / {totalPages}
            </Text>
            <Button
              mode="outlined"
              onPress={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </View>

          <Button mode="contained-tonal" onPress={exportCsv} style={styles.exportButton}>
            Export CSV
          </Button>

          <Modal visible={showFormModal} transparent animationType="slide" onRequestClose={() => setShowFormModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text variant="titleMedium" style={styles.modalTitle}>
                  {formMode === 'add' ? 'Add Student' : 'Edit Student'}
                </Text>

                <TextInput mode="outlined" label="Name" value={name} onChangeText={setName} style={styles.input} />
                <TextInput mode="outlined" label="Room" value={room} onChangeText={setRoom} style={styles.input} />
                <TextInput mode="outlined" label="Auth UID (optional)" value={uidValue} onChangeText={setUidValue} style={styles.input} />
                <TextInput mode="outlined" label="Block" value={block} onChangeText={setBlock} style={styles.input} />

                <View style={styles.filterRow}>
                  {['Active', 'Inactive'].map((item) => (
                    <Chip
                      key={`form-status-${item}`}
                      mode={status === item ? 'flat' : 'outlined'}
                      selected={status === item}
                      onPress={() => setStatus(item)}
                      style={styles.chip}
                    >
                      {item}
                    </Chip>
                  ))}
                </View>

                <View style={styles.modalActions}>
                  <Button mode="contained" onPress={submitStudentForm} loading={saving} disabled={saving}>
                    Save
                  </Button>
                  <Button mode="text" disabled={saving} onPress={() => setShowFormModal(false)}>
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

          <FAB style={styles.fab} icon="plus" label="Add Student" onPress={openAddStudent} />
        </>
      )}

      {activeTab === TABS.CANTEEN && (
        <>
          <FlatList
            data={menu}
            keyExtractor={(item) => item.id}
            onRefresh={loadMenu}
            refreshing={false}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.title}>
                    {item.dishName}
                  </Text>
                  {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
                  <Text style={styles.price}>Tk {item.price}</Text>
                  <Text style={styles.statusText}>{item.available ? '✓ Available' : '✗ Out of Stock'}</Text>
                </Card.Content>
                <Card.Actions>
                  <Button onPress={() => openEditMenu(item)}>Edit</Button>
                  <Button textColor="#b3261e" onPress={() => deleteMenu(item)}>
                    Delete
                  </Button>
                </Card.Actions>
              </Card>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No menu items yet.</Text>}
          />

          <Modal visible={showMenuModal} transparent animationType="slide" onRequestClose={() => setShowMenuModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text variant="titleMedium" style={styles.modalTitle}>
                  {formModeMenu === 'add' ? 'Add Menu Item' : 'Edit Menu Item'}
                </Text>

                <TextInput mode="outlined" label="Dish Name" value={dishName} onChangeText={setDishName} style={styles.input} />
                <TextInput mode="outlined" label="Price" value={price} keyboardType="numeric" onChangeText={setPrice} style={styles.input} />
                <TextInput mode="outlined" label="Description" value={description} onChangeText={setDescription} style={styles.input} />

                <View style={styles.modalActions}>
                  <Button mode="contained" onPress={saveMenuItem} loading={saving} disabled={saving}>
                    Save
                  </Button>
                  <Button mode="text" disabled={saving} onPress={() => setShowMenuModal(false)}>
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </Modal>

          <FAB style={styles.fab} icon="plus" label="Add Item" onPress={openAddMenu} />
        </>
      )}

      {activeTab === TABS.COMPLAINTS && (
        <>
          <FlatList
            data={complaints}
            keyExtractor={(item) => item.id}
            onRefresh={loadComplaints}
            refreshing={false}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <Text variant="titleMedium" style={styles.title}>
                    {item.category}
                  </Text>
                  <Text style={styles.subtitle}>By: {item.userName}</Text>
                  <Text style={styles.issueText}>{item.issue}</Text>
                  <Text
                    style={[
                      styles.statusBadge,
                      item.status === 'open' && styles.statusOpen,
                      item.status === 'responded' && styles.statusResponded,
                      item.status === 'resolved' && styles.statusResolved
                    ]}
                  >
                    Status: {item.status.toUpperCase()}
                  </Text>
                  {item.response ? <Text style={styles.responseText}>Response: {item.response}</Text> : null}
                </Card.Content>
                <Card.Actions>
                  {item.status !== 'resolved' && (
                    <>
                      <Button onPress={() => openRespond(item)}>Respond</Button>
                      <Button onPress={() => resolveComplaint(item)}>Resolve</Button>
                    </>
                  )}
                </Card.Actions>
              </Card>
            )}
            ListEmptyComponent={<Text style={styles.emptyText}>No complaints yet.</Text>}
          />

          <Modal visible={showResponseModal} transparent animationType="slide" onRequestClose={() => setShowResponseModal(false)}>
            <View style={styles.modalOverlay}>
              <View style={styles.modalCard}>
                <Text variant="titleMedium" style={styles.modalTitle}>
                  Respond to Complaint
                </Text>
                <Text style={styles.complaintInfo}>Category: {selectedComplaint?.category}</Text>
                <Text style={styles.complaintInfo}>Issue: {selectedComplaint?.issue}</Text>

                <TextInput
                  mode="outlined"
                  label="Your Response"
                  value={response}
                  onChangeText={setResponse}
                  multiline
                  numberOfLines={4}
                  style={styles.input}
                />

                <View style={styles.modalActions}>
                  <Button mode="contained" onPress={submitResponse} loading={saving} disabled={saving}>
                    Submit
                  </Button>
                  <Button mode="text" disabled={saving} onPress={() => setShowResponseModal(false)}>
                    Cancel
                  </Button>
                </View>
              </View>
            </View>
          </Modal>
        </>
      )}

      <Snackbar
        visible={snack.visible}
        duration={2800}
        onDismiss={() => setSnack((prev) => ({ ...prev, visible: false }))}
      >
        {snack.message}
      </Snackbar>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f4f7f5',
    padding: 12
  },
  tabs: {
    marginBottom: 12
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 12,
    gap: 8
  },
  headerTextWrap: {
    flex: 1,
    paddingRight: 8
  },
  headerTitle: {
    color: '#123d36'
  },
  headerSubtitle: {
    marginTop: 4,
    color: '#4c6c66',
    fontSize: 12
  },
  loadingWrap: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f7f5'
  },
  loadingText: {
    marginTop: 8,
    color: '#3b625b'
  },
  search: {
    marginBottom: 8,
    borderRadius: 14
  },
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 8,
    gap: 6
  },
  chip: {
    marginBottom: 4
  },
  card: {
    marginBottom: 10,
    borderRadius: 12
  },
  title: {
    color: '#153f37'
  },
  subtitle: {
    marginTop: 4,
    color: '#5f7771',
    fontSize: 12
  },
  description: {
    marginTop: 4,
    color: '#5f7771'
  },
  issueText: {
    marginTop: 4,
    color: '#3b625b'
  },
  price: {
    marginTop: 6,
    fontWeight: '700',
    color: '#005b4f'
  },
  statusText: {
    marginTop: 4,
    fontSize: 12,
    color: '#6d8b84'
  },
  statusBadge: {
    marginTop: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    fontSize: 12,
    fontWeight: '600',
    overflow: 'hidden'
  },
  statusOpen: {
    backgroundColor: '#fff3cd',
    color: '#856404'
  },
  statusResponded: {
    backgroundColor: '#d1ecf1',
    color: '#0c5460'
  },
  statusResolved: {
    backgroundColor: '#d4edda',
    color: '#155724'
  },
  responseText: {
    marginTop: 6,
    color: '#005b4f',
    fontStyle: 'italic'
  },
  complaintInfo: {
    marginVertical: 4,
    color: '#3b625b'
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#5f7771'
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 8
  },
  pageText: {
    color: '#3b625b'
  },
  exportButton: {
    marginTop: 8,
    marginBottom: 20
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#005b4f'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    padding: 16
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16
  },
  modalTitle: {
    marginBottom: 12,
    color: '#153f37'
  },
  input: {
    marginBottom: 10
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 8
  }
});
