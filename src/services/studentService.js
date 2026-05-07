const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

let studentsDb = [
  { id: 's-100', name: 'Asha Karim', room: 'B-204', block: 'B', status: 'Active' },
  { id: 's-101', name: 'Tariq Hasan', room: 'A-102', block: 'A', status: 'Active' },
  { id: 's-102', name: 'Mili Saha', room: 'C-001', block: 'C', status: 'Inactive' },
  { id: 's-103', name: 'Farhan Ali', room: 'A-211', block: 'A', status: 'Active' },
  { id: 's-104', name: 'Ritu Das', room: 'D-010', block: 'D', status: 'Active' },
  { id: 's-105', name: 'Nadia Noor', room: 'B-009', block: 'B', status: 'Inactive' },
  { id: 's-106', name: 'Jubair Khan', room: 'C-121', block: 'C', status: 'Active' }
];

const shouldFail = () => Math.random() < 0.12;

const clone = (data) => JSON.parse(JSON.stringify(data));

const maybeThrow = (message) => {
  if (shouldFail()) {
    throw new Error(message);
  }
};

export const studentService = {
  async getStudents() {
    await wait(450);
    return clone(studentsDb);
  },

  async createStudent(student) {
    await wait(400);
    maybeThrow('Failed to create student. Please retry.');
    studentsDb = [student, ...studentsDb];
    return clone(student);
  },

  async updateStudent(id, updates) {
    await wait(400);
    maybeThrow('Failed to update student. Please retry.');
    studentsDb = studentsDb.map((student) =>
      student.id === id ? { ...student, ...updates } : student
    );
    const updated = studentsDb.find((student) => student.id === id);
    return clone(updated);
  },

  async deleteStudent(id) {
    await wait(350);
    maybeThrow('Failed to delete student. Please retry.');
    studentsDb = studentsDb.filter((student) => student.id !== id);
    return { id };
  }
};
