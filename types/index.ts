export type Gender = "MALE" | "FEMALE" | "OTHER";
export type Status = "ACTIVE" | "INACTIVE" | "SUSPENDED";
export type FeeStatus = "PAID" | "UNPAID" | "PARTIAL" | "WAIVED";
export type SalaryStatus = "PAID" | "UNPAID" | "PARTIAL";
export type StaffRole = "PEON" | "SWEEPER" | "GARDENER" | "ELECTRICIAN" | "LIBRARIAN" | "SECURITY" | "OTHER";
export type AttendanceStatus = "PRESENT" | "ABSENT" | "LATE" | "HALF_DAY" | "HOLIDAY";

export interface StudentType {
  id: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: Gender;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  class: string;
  section: string;
  admissionDate: string;
  admissionNo: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export interface CreateStudentInput {
  rollNo: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: string;
  gender: Gender;
  phone?: string;
  email?: string;
  address?: string;
  class: string;
  section: string;
  admissionNo: string;
}

export interface FeeWithStudent {
  id: string;
  receiptNo: string;
  studentId: string;
  month: number;
  year: number;
  amount: number;
  discount: number;
  lateFine: number;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  status: FeeStatus;
  paidAt: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNo: string;
    admissionNo: string;
    class: string;
    section: string;
  };
}

export interface CreateFeeInput {
  studentId: string;
  month: string;
  year: string;
  amount: string;
  discount?: string;
  lateFine?: string;
  paidAmount?: string;
  remarks?: string;
}

export const MONTHS = [
  { value: "1", label: "January" },
  { value: "2", label: "February" },
  { value: "3", label: "March" },
  { value: "4", label: "April" },
  { value: "5", label: "May" },
  { value: "6", label: "June" },
  { value: "7", label: "July" },
  { value: "8", label: "August" },
  { value: "9", label: "September" },
  { value: "10", label: "October" },
  { value: "11", label: "November" },
  { value: "12", label: "December" },
];

export interface SalaryWithPerson {
  id: string;
  month: number;
  year: number;
  basicSalary: number;
  deductions: number;
  advance: number;
  bonus: number;
  netSalary: number;
  status: SalaryStatus;
  paidAt: string | null;
  remarks: string | null;
  createdAt: string;
  updatedAt: string;
  teacherId: string | null;
  staffId: string | null;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    salary: number;
  } | null;
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    salary: number;
  } | null;
}

export interface CreateSalaryInput {
  personType: "teacher" | "staff";
  personId: string;
  month: string;
  year: string;
  basicSalary: string;
  deductions?: string;
  advance?: string;
  bonus?: string;
  remarks?: string;
}

export type AttendanceType = "student" | "teacher" | "staff";

export interface AttendanceRecord {
  id: string;
  date: string;
  status: AttendanceStatus;
  remarks: string | null;
}

export interface StudentAttendanceWithStudent extends AttendanceRecord {
  studentId: string;
  student: {
    id: string;
    firstName: string;
    lastName: string;
    rollNo: string;
    class: string;
    section: string;
  };
}

export interface TeacherAttendanceWithTeacher extends AttendanceRecord {
  teacherId: string;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
  };
}

export interface StaffAttendanceWithStaff extends AttendanceRecord {
  staffId: string;
  staff: {
    id: string;
    firstName: string;
    lastName: string;
    employeeId: string;
    role: string;
  };
}

export interface StudentMember {
  id: string;
  rollNo: string;
  firstName: string;
  lastName: string;
  fatherName: string;
  motherName: string;
  dateOfBirth: Date | string;
  gender: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  class: string;
  section: string;
  admissionDate: Date | string;
  admissionNo: string;
  status: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface TeacherMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string | null;
  gender: string;
  dateOfBirth: Date | string;
  joiningDate: Date | string;
  qualification?: string | null;
  salary: number;
  status: string;
  subjects: { subject: { id: string; name: string } }[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface StaffMember {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
  salary: number;
  status: string;
  email?: string | null;
  address?: string | null;
  gender: string;
  joiningDate: Date | string;
  createdAt: Date | string;
  updatedAt: Date | string;
}