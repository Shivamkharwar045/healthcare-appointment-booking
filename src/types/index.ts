export type UserRole = 'patient' | 'doctor' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  phone: string;
  profileImage?: string;
  createdAt: string;
  specialty?: string;
  medicalLicenseNumber?: string;
}

export interface Doctor {
  id: string;
  userId: string;
  name: string;
  email: string;
  specialization: string;
  qualification: string;
  experienceYears: number;
  bio: string;
  languages: string[];
  consultationFee: number;
  clinic: string;
  location: string;
  address: string;
  consultationTypes: ('in-person' | 'video')[];
  workingHours: {
    start: string;
    end: string;
    days: string[];
  };
  approvalStatus: 'approved' | 'pending' | 'rejected';
  rating: number;
  reviewCount: number;
  image: string;
  availableToday: boolean;
  availableTomorrow: boolean;
  hospitalAffiliation: string;
  availableDays: string[];
  disabledSlots?: string[]; // Date-Time strings like "2026-09-18-10:00 AM"
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'rescheduled' | 'cancelled' | 'completed';

export interface Appointment {
  id: string;
  appointmentId: string; // e.g. MDB-2026-4821
  patientId: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  doctorId: string;
  doctorName: string;
  doctorSpecialization: string;
  doctorImage: string;
  clinic: string;
  location: string;
  date: string; // YYYY-MM-DD
  startTime: string; // e.g. "10:30 AM"
  endTime: string; // e.g. "11:00 AM"
  consultationType: 'in-person' | 'video';
  status: AppointmentStatus;
  reason: string;
  symptoms?: string;
  notes?: string;
  prescription?: string;
  createdAt: string;
  meetLink?: string;
  cancellationReason?: string;
  rescheduledFrom?: string;
}

export interface NotificationItem {
  id: string;
  userId: string;
  type: 'booked' | 'confirmed' | 'cancelled' | 'rescheduled' | 'reminder' | 'system';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  appointmentId?: string;
}

export interface Review {
  id: string;
  patientId: string;
  patientName: string;
  doctorId: string;
  rating: number;
  comment: string;
  date: string;
  verifiedBooking: boolean;
}

export interface SpecializationInfo {
  id: string;
  name: string;
  iconName: string;
  doctorCount: number;
  description: string;
  commonSymptoms: string[];
}

export interface TimeSlot {
  id: string;
  time: string;
  period: 'morning' | 'afternoon' | 'evening';
  isAvailable: boolean;
  isBooked: boolean;
}

export interface LabReport {
  id: string;
  patientId: string;
  title: string;
  testCategory: 'Biochemistry' | 'Hematology' | 'Radiology' | 'Cardiology' | 'Pathology';
  date: string;
  labName: string;
  doctorReferred: string;
  status: 'Normal' | 'Borderline' | 'Requires Attention';
  summary: string;
  metrics: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    flag: 'normal' | 'high' | 'low';
  }[];
}

export interface SymptomCheckResult {
  triageLevel: 'low' | 'moderate' | 'urgent';
  primaryRecommendation: string;
  suggestedSpecialty: string;
  specialtyId: string;
  possibleCauses: string[];
  selfCareAdvice: string[];
  keyQuestionsToAskDoctor: string[];
  redFlagWarnings?: string[];
}

export interface StructuredPrescription {
  prescriptionNumber: string;
  appointmentId: string;
  date: string;
  doctorName: string;
  doctorSpecialization: string;
  medicalLicense: string;
  clinicName: string;
  clinicAddress: string;
  patientName: string;
  patientAge: number;
  patientGender: string;
  patientPhone: string;
  vitals: {
    bloodPressure: string;
    heartRate: string;
    temperature: string;
    spo2: string;
    weight: string;
  };
  diagnosis: string;
  medications: {
    name: string;
    dosage: string;
    frequency: string; // e.g. "1-0-1 (After Food)"
    duration: string; // e.g. "5 Days"
    notes: string;
  }[];
  lifestyleAdvice: string[];
  followUpDate: string;
  verificationHash: string;
}

export interface ApiLog {
  id: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  endpoint: string;
  status: number;
  durationMs: number;
  timestamp: string;
  requestPayload?: any;
  responsePayload?: any;
}
