import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  Doctor, 
  Appointment, 
  Review, 
  NotificationItem, 
  UserRole, 
  TimeSlot,
  ApiLog
} from '../types';
import { 
  INITIAL_USERS, 
  INITIAL_DOCTORS, 
  INITIAL_APPOINTMENTS, 
  INITIAL_REVIEWS, 
  INITIAL_NOTIFICATIONS,
  STANDARD_TIME_SLOTS 
} from '../data/mockData';

interface BookingPayload {
  doctorId: string;
  consultationType: 'in-person' | 'video';
  date: string;
  startTime: string;
  patientName: string;
  patientEmail: string;
  patientPhone: string;
  reason: string;
  symptoms?: string;
}

interface AppContextType {
  currentUser: User;
  currentRole: UserRole;
  users: User[];
  doctors: Doctor[];
  appointments: Appointment[];
  reviews: Review[];
  notifications: NotificationItem[];
  apiLogs: ApiLog[];
  unreadNotificationCount: number;
  
  // Role & Auth Actions
  switchUserRole: (role: UserRole) => void;
  updateCurrentUserProfile: (profileData: Partial<User>) => void;
  
  // Doctor Management
  getDoctorById: (id: string) => Doctor | undefined;
  approveDoctor: (doctorId: string) => void;
  rejectDoctor: (doctorId: string) => void;
  toggleDoctorSlot: (doctorId: string, dateTimeSlot: string) => void;
  updateDoctorProfile: (doctorId: string, updates: Partial<Doctor>) => void;
  
  // Availability Check
  getDoctorAvailableSlots: (doctorId: string, date: string) => TimeSlot[];
  
  // Appointment Actions
  bookAppointment: (payload: BookingPayload) => Promise<{ success: boolean; appointment?: Appointment; error?: string }>;
  cancelAppointment: (id: string, reason: string) => Promise<{ success: boolean; error?: string }>;
  rescheduleAppointment: (id: string, newDate: string, newTime: string) => Promise<{ success: boolean; error?: string }>;
  completeAppointment: (id: string, notes?: string, prescription?: string) => void;
  
  // Review Actions
  addDoctorReview: (doctorId: string, rating: number, comment: string) => void;
  
  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  
  // API Log simulation
  logApiCall: (method: ApiLog['method'], endpoint: string, status: number, reqPayload?: any, resPayload?: any) => void;
  clearApiLogs: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  USERS: 'medibook_users_v1',
  DOCTORS: 'medibook_doctors_v1',
  APPOINTMENTS: 'medibook_appointments_v1',
  REVIEWS: 'medibook_reviews_v1',
  NOTIFICATIONS: 'medibook_notifications_v1',
  CURRENT_USER_ID: 'medibook_current_user_id_v1',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Initial State from localStorage or fallback
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.USERS);
      return saved ? JSON.parse(saved) : INITIAL_USERS;
    } catch {
      return INITIAL_USERS;
    }
  });

  const [doctors, setDoctors] = useState<Doctor[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DOCTORS);
      return saved ? JSON.parse(saved) : INITIAL_DOCTORS;
    } catch {
      return INITIAL_DOCTORS;
    }
  });

  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.APPOINTMENTS);
      return saved ? JSON.parse(saved) : INITIAL_APPOINTMENTS;
    } catch {
      return INITIAL_APPOINTMENTS;
    }
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      return saved ? JSON.parse(saved) : INITIAL_REVIEWS;
    } catch {
      return INITIAL_REVIEWS;
    }
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
    } catch {
      return INITIAL_NOTIFICATIONS;
    }
  });

  const [currentUserId, setCurrentUserId] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER_ID);
      return saved || 'user-patient-1';
    } catch {
      return 'user-patient-1';
    }
  });

  const [apiLogs, setApiLogs] = useState<ApiLog[]>([
    {
      id: 'log-init-1',
      method: 'GET',
      endpoint: '/api/health',
      status: 200,
      durationMs: 14,
      timestamp: new Date().toLocaleTimeString(),
      responsePayload: { status: 'healthy', uptimeSeconds: 3840, version: '1.2.0-prod' },
    },
    {
      id: 'log-init-2',
      method: 'GET',
      endpoint: '/api/doctors?approved=true',
      status: 200,
      durationMs: 42,
      timestamp: new Date().toLocaleTimeString(),
      responsePayload: { count: 8, results: 'Indexed doctors retrieved with real-time slot state' },
    }
  ]);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
  }, [doctors]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.APPOINTMENTS, JSON.stringify(appointments));
  }, [appointments]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER_ID, currentUserId);
  }, [currentUserId]);

  const currentUser = users.find(u => u.id === currentUserId) || users[0];
  const currentRole = currentUser.role;

  const logApiCall = (method: ApiLog['method'], endpoint: string, status: number, reqPayload?: any, resPayload?: any) => {
    const newLog: ApiLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      method,
      endpoint,
      status,
      durationMs: Math.floor(Math.random() * 35) + 15,
      timestamp: new Date().toLocaleTimeString(),
      requestPayload: reqPayload,
      responsePayload: resPayload,
    };
    setApiLogs(prev => [newLog, ...prev.slice(0, 49)]);
  };

  const clearApiLogs = () => setApiLogs([]);

  // Role switching
  const switchUserRole = (role: UserRole) => {
    const targetUser = users.find(u => u.role === role);
    if (targetUser) {
      setCurrentUserId(targetUser.id);
      logApiCall('POST', '/api/auth/switch-context', 200, { requestedRole: role }, { activeUserId: targetUser.id, role });
    }
  };

  const updateCurrentUserProfile = (profileData: Partial<User>) => {
    setUsers(prev => prev.map(u => u.id === currentUser.id ? { ...u, ...profileData } : u));
    logApiCall('PATCH', `/api/users/profile/${currentUser.id}`, 200, profileData, { message: 'Profile updated successfully' });
  };

  // Doctors
  const getDoctorById = (id: string) => doctors.find(d => d.id === id);

  const approveDoctor = (doctorId: string) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, approvalStatus: 'approved' } : d));
    const doc = doctors.find(d => d.id === doctorId);
    if (doc) {
      // Add notification for doctor
      const newNotif: NotificationItem = {
        id: `notif-${Date.now()}`,
        userId: doc.userId,
        type: 'system',
        title: 'Credentials Verified & Profile Approved',
        message: 'Your medical credentials have been verified by the Chief Medical Officer. Your profile is now live for patient bookings.',
        read: false,
        createdAt: new Date().toISOString(),
      };
      setNotifications(prev => [newNotif, ...prev]);
    }
    logApiCall('PATCH', `/api/admin/doctors/${doctorId}/verify`, 200, { approvalStatus: 'approved' }, { success: true });
  };

  const rejectDoctor = (doctorId: string) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, approvalStatus: 'rejected' } : d));
    logApiCall('PATCH', `/api/admin/doctors/${doctorId}/verify`, 200, { approvalStatus: 'rejected' }, { success: true });
  };

  const toggleDoctorSlot = (doctorId: string, dateTimeSlot: string) => {
    setDoctors(prev => prev.map(d => {
      if (d.id !== doctorId) return d;
      const currentDisabled = d.disabledSlots || [];
      const exists = currentDisabled.includes(dateTimeSlot);
      const updatedDisabled = exists
        ? currentDisabled.filter(s => s !== dateTimeSlot)
        : [...currentDisabled, dateTimeSlot];
      return { ...d, disabledSlots: updatedDisabled };
    }));
    logApiCall('PUT', `/api/doctors/${doctorId}/availability-slots`, 200, { slot: dateTimeSlot }, { updated: true });
  };

  const updateDoctorProfile = (doctorId: string, updates: Partial<Doctor>) => {
    setDoctors(prev => prev.map(d => d.id === doctorId ? { ...d, ...updates } : d));
    logApiCall('PUT', `/api/doctors/${doctorId}`, 200, updates, { success: true });
  };

  // Real-time Availability calculation
  const getDoctorAvailableSlots = (doctorId: string, date: string): TimeSlot[] => {
    const doctor = getDoctorById(doctorId);
    if (!doctor) return [];

    const disabledList = doctor.disabledSlots || [];

    // Find all active (non-cancelled) appointments for this doctor on this date
    const bookedAppointments = appointments.filter(
      apt => apt.doctorId === doctorId && 
             apt.date === date && 
             apt.status !== 'cancelled'
    );
    const bookedTimes = new Set(bookedAppointments.map(a => a.startTime));

    return STANDARD_TIME_SLOTS.map((slot, index) => {
      const slotKey = `${date}-${slot.time}`;
      const isDoctorDisabled = disabledList.includes(slotKey);
      const isAlreadyBooked = bookedTimes.has(slot.time);

      return {
        id: `slot-${date}-${index}`,
        time: slot.time,
        period: slot.period,
        isAvailable: !isDoctorDisabled && !isAlreadyBooked,
        isBooked: isAlreadyBooked,
      };
    });
  };

  // Appointment Booking with Anti-Double-Booking Guarantee
  const bookAppointment = async (payload: BookingPayload) => {
    const doctor = getDoctorById(payload.doctorId);
    if (!doctor) {
      return { success: false, error: 'Doctor not found.' };
    }

    // Check conflict: has this slot been booked in the meantime?
    const conflict = appointments.find(
      apt => apt.doctorId === payload.doctorId &&
             apt.date === payload.date &&
             apt.startTime === payload.startTime &&
             apt.status !== 'cancelled'
    );

    if (conflict) {
      logApiCall('POST', '/api/appointments', 409, payload, { error: 'Time slot conflict. Already booked by another patient.' });
      return { 
        success: false, 
        error: 'This appointment slot was just booked by another patient. Please choose another convenient time.' 
      };
    }

    // Calculate end time (30 min increment)
    let endTime = payload.startTime;
    const match = payload.startTime.match(/(\d+):(\d+)\s*(AM|PM)/);
    if (match) {
      let hours = parseInt(match[1], 10);
      let mins = parseInt(match[2], 10) + 30;
      let ampm = match[3];
      if (mins >= 60) {
        mins -= 60;
        hours += 1;
        if (hours === 12 && ampm === 'AM') ampm = 'PM';
        else if (hours > 12) {
          hours -= 12;
        }
      }
      endTime = `${hours.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')} ${ampm}`;
    }

    const uniqueIdSuffix = Math.floor(1000 + Math.random() * 9000);
    const appointmentIdCode = `MDB-2026-${uniqueIdSuffix}`;

    const newAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      appointmentId: appointmentIdCode,
      patientId: currentUser.id,
      patientName: payload.patientName,
      patientEmail: payload.patientEmail,
      patientPhone: payload.patientPhone,
      doctorId: doctor.id,
      doctorName: doctor.name,
      doctorSpecialization: doctor.specialization,
      doctorImage: doctor.image,
      clinic: doctor.clinic,
      location: doctor.location,
      date: payload.date,
      startTime: payload.startTime,
      endTime,
      consultationType: payload.consultationType,
      status: 'confirmed',
      reason: payload.reason,
      symptoms: payload.symptoms,
      createdAt: new Date().toISOString(),
      meetLink: payload.consultationType === 'video' ? `https://medibook.health/telehealth/room/${appointmentIdCode}` : undefined,
    };

    setAppointments(prev => [newAppointment, ...prev]);

    // Create notifications for Patient and Doctor
    const patientNotif: NotificationItem = {
      id: `notif-${Date.now()}-p`,
      userId: currentUser.id,
      type: 'confirmed',
      title: 'Appointment Confirmed',
      message: `Your ${payload.consultationType === 'video' ? 'Video' : 'In-Person'} consultation with ${doctor.name} on ${payload.date} at ${payload.startTime} is confirmed. Booking ID: ${appointmentIdCode}`,
      read: false,
      createdAt: new Date().toISOString(),
      appointmentId: newAppointment.id,
    };

    const doctorNotif: NotificationItem = {
      id: `notif-${Date.now()}-d`,
      userId: doctor.userId,
      type: 'booked',
      title: 'New Patient Appointment Booked',
      message: `${payload.patientName} has booked a ${payload.consultationType} consultation on ${payload.date} at ${payload.startTime}. Reason: ${payload.reason}`,
      read: false,
      createdAt: new Date().toISOString(),
      appointmentId: newAppointment.id,
    };

    setNotifications(prev => [patientNotif, doctorNotif, ...prev]);

    logApiCall('POST', '/api/appointments', 201, payload, { 
      success: true, 
      appointmentId: appointmentIdCode, 
      status: 'confirmed',
      smsNotificationSent: true,
      emailConfirmationSent: true
    });

    return { success: true, appointment: newAppointment };
  };

  // Cancellation
  const cancelAppointment = async (id: string, reason: string) => {
    const target = appointments.find(a => a.id === id);
    if (!target) return { success: false, error: 'Appointment not found.' };

    setAppointments(prev => prev.map(a => a.id === id ? { 
      ...a, 
      status: 'cancelled', 
      cancellationReason: reason 
    } : a));

    const cancellationNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: target.patientId,
      type: 'cancelled',
      title: 'Appointment Cancelled',
      message: `Appointment ${target.appointmentId} with ${target.doctorName} on ${target.date} has been cancelled.`,
      read: false,
      createdAt: new Date().toISOString(),
      appointmentId: id,
    };

    setNotifications(prev => [cancellationNotif, ...prev]);
    logApiCall('POST', `/api/appointments/${id}/cancel`, 200, { reason }, { success: true, slotFreed: true });

    return { success: true };
  };

  // Rescheduling
  const rescheduleAppointment = async (id: string, newDate: string, newTime: string) => {
    const target = appointments.find(a => a.id === id);
    if (!target) return { success: false, error: 'Appointment not found.' };

    // Check conflict on new time
    const conflict = appointments.find(
      a => a.id !== id &&
           a.doctorId === target.doctorId &&
           a.date === newDate &&
           a.startTime === newTime &&
           a.status !== 'cancelled'
    );

    if (conflict) {
      logApiCall('POST', `/api/appointments/${id}/reschedule`, 409, { newDate, newTime }, { error: 'Slot already reserved' });
      return { success: false, error: 'The requested time slot has just been taken. Please choose another.' };
    }

    const previousTime = `${target.date} at ${target.startTime}`;

    setAppointments(prev => prev.map(a => a.id === id ? {
      ...a,
      date: newDate,
      startTime: newTime,
      status: 'rescheduled',
      rescheduledFrom: previousTime,
    } : a));

    const reschedNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      userId: target.patientId,
      type: 'rescheduled',
      title: 'Appointment Rescheduled',
      message: `Your appointment with ${target.doctorName} is now moved to ${newDate} at ${newTime}.`,
      read: false,
      createdAt: new Date().toISOString(),
      appointmentId: id,
    };

    setNotifications(prev => [reschedNotif, ...prev]);
    logApiCall('POST', `/api/appointments/${id}/reschedule`, 200, { newDate, newTime }, { success: true });

    return { success: true };
  };

  // Complete consultation by doctor
  const completeAppointment = (id: string, notes?: string, prescription?: string) => {
    setAppointments(prev => prev.map(a => a.id === id ? {
      ...a,
      status: 'completed',
      notes: notes || a.notes,
      prescription: prescription || a.prescription,
    } : a));

    logApiCall('PATCH', `/api/appointments/${id}/complete`, 200, { notes, prescription }, { success: true });
  };

  // Reviews
  const addDoctorReview = (doctorId: string, rating: number, comment: string) => {
    const newRev: Review = {
      id: `rev-${Date.now()}`,
      patientId: currentUser.id,
      patientName: currentUser.name,
      doctorId,
      rating,
      comment,
      date: new Date().toISOString().split('T')[0],
      verifiedBooking: true,
    };
    setReviews(prev => [newRev, ...prev]);

    // Recalculate doctor rating
    setDoctors(prev => prev.map(d => {
      if (d.id !== doctorId) return d;
      const allDoctorReviews = [...reviews.filter(r => r.doctorId === doctorId), newRev];
      const avg = allDoctorReviews.reduce((sum, r) => sum + r.rating, 0) / allDoctorReviews.length;
      return {
        ...d,
        rating: Math.round(avg * 10) / 10,
        reviewCount: allDoctorReviews.length,
      };
    }));

    logApiCall('POST', '/api/reviews', 201, { doctorId, rating, comment }, { success: true });
  };

  // Notifications
  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const unreadNotificationCount = notifications.filter(n => n.userId === currentUser.id && !n.read).length;

  return (
    <AppContext.Provider value={{
      currentUser,
      currentRole,
      users,
      doctors,
      appointments,
      reviews,
      notifications,
      apiLogs,
      unreadNotificationCount,
      switchUserRole,
      updateCurrentUserProfile,
      getDoctorById,
      approveDoctor,
      rejectDoctor,
      toggleDoctorSlot,
      updateDoctorProfile,
      getDoctorAvailableSlots,
      bookAppointment,
      cancelAppointment,
      rescheduleAppointment,
      completeAppointment,
      addDoctorReview,
      markNotificationAsRead,
      markAllNotificationsAsRead,
      logApiCall,
      clearApiLogs,
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
