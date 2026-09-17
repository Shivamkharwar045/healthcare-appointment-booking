import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  Video, 
  Stethoscope, 
  MapPin, 
  AlertCircle, 
  CheckCircle2, 
  X, 
  Download, 
  FileText, 
  Star, 
  User, 
  ArrowRight,
  Phone,
  Mail,
  RefreshCw,
  Trash2,
  Printer,
  Sparkles,
  Activity,
  FolderHeart
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment, Doctor } from '../types';
import { LabReportsVault } from './LabReportsVault';
import { PrescriptionPrintModal } from './PrescriptionPrintModal';

interface PatientDashboardProps {
  onOpenBooking: () => void;
  onJoinVideoCall: (appointment: Appointment) => void;
  onSelectDoctor: (doctor: Doctor) => void;
  onOpenSymptomChecker?: () => void;
}

export const PatientDashboard: React.FC<PatientDashboardProps> = ({
  onOpenBooking,
  onJoinVideoCall,
  onSelectDoctor,
  onOpenSymptomChecker,
}) => {
  const { 
    currentUser, 
    appointments, 
    cancelAppointment, 
    rescheduleAppointment, 
    updateCurrentUserProfile,
    getDoctorAvailableSlots,
    doctors
  } = useApp();

  const [activeTab, setActiveTab] = useState<'upcoming' | 'past' | 'cancelled' | 'records'>('upcoming');
  const [printingPrescriptionAppointment, setPrintingPrescriptionAppointment] = useState<Appointment | null>(null);

  // Cancel Modal State
  const [cancelTarget, setCancelTarget] = useState<Appointment | null>(null);
  const [cancelReason, setCancelReason] = useState('Personal schedule conflict');
  const [isCancelling, setIsCancelling] = useState(false);

  // Reschedule Modal State
  const [rescheduleTarget, setRescheduleTarget] = useState<Appointment | null>(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');
  const [isRescheduling, setIsRescheduling] = useState(false);
  const [rescheduleError, setRescheduleError] = useState<string | null>(null);

  // Profile Editor state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [name, setName] = useState(currentUser.name);
  const [phone, setPhone] = useState(currentUser.phone);

  // Filter patient appointments
  const myAppointments = appointments.filter(a => a.patientId === currentUser.id);

  const upcomingAppointments = myAppointments.filter(
    a => a.status === 'confirmed' || a.status === 'rescheduled' || a.status === 'pending'
  );

  const pastAppointments = myAppointments.filter(a => a.status === 'completed');
  const cancelledAppointments = myAppointments.filter(a => a.status === 'cancelled');

  const handleConfirmCancel = async () => {
    if (!cancelTarget) return;
    setIsCancelling(true);
    await cancelAppointment(cancelTarget.id, cancelReason);
    setIsCancelling(false);
    setCancelTarget(null);
  };

  const handleConfirmReschedule = async () => {
    if (!rescheduleTarget || !newDate || !newTime) return;
    setIsRescheduling(true);
    setRescheduleError(null);
    const res = await rescheduleAppointment(rescheduleTarget.id, newDate, newTime);
    setIsRescheduling(false);
    if (res.success) {
      setRescheduleTarget(null);
    } else {
      setRescheduleError(res.error || 'Failed to reschedule.');
    }
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateCurrentUserProfile({ name, phone });
    setIsEditingProfile(false);
  };

  // Available slots for reschedule target
  const rescheduleSlots = rescheduleTarget && newDate 
    ? getDoctorAvailableSlots(rescheduleTarget.doctorId, newDate).filter(s => s.isAvailable) 
    : [];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Patient Profile Header Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={currentUser.profileImage || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'}
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{currentUser.name}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  PATIENT PORTAL
                </span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-slate-400" /> {currentUser.email}</span>
                <span>•</span>
                <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-slate-400" /> {currentUser.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
            {onOpenSymptomChecker && (
              <button
                onClick={onOpenSymptomChecker}
                className="px-3.5 py-2 rounded-xl border border-teal-200 bg-teal-50/60 hover:bg-teal-100/60 text-xs font-semibold text-teal-800 flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Symptom Checker</span>
              </button>
            )}
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 transition-colors"
            >
              Edit Profile Info
            </button>
            <button
              onClick={onOpenBooking}
              className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Appointment</span>
            </button>
          </div>
        </div>

        {/* Profile Inline Editor */}
        {isEditingProfile && (
          <form onSubmit={handleSaveProfile} className="p-5 bg-teal-50/50 rounded-2xl border border-teal-200 flex flex-wrap gap-4 items-end animate-in fade-in duration-150">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number</label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="bg-white border border-slate-200 rounded-lg px-3 py-1.5 text-xs text-slate-900 focus:outline-hidden"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="px-4 py-1.5 bg-teal-600 text-white rounded-lg text-xs font-semibold"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={() => setIsEditingProfile(false)}
                className="px-3 py-1.5 bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Quick KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Upcoming Visits</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{upcomingAppointments.length}</p>
            <p className="text-[11px] text-teal-600 mt-0.5">Ready for consultation</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Completed Sessions</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{pastAppointments.length}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Records archived</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Prescriptions on File</span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              {pastAppointments.filter(a => !!a.prescription).length}
            </p>
            <p className="text-[11px] text-slate-400 mt-0.5">Digitally accessible</p>
          </div>
        </div>

        {/* Appointment Tabs Navigation */}
        <div className="border-b border-slate-200 flex items-center gap-4">
          <button
            onClick={() => setActiveTab('upcoming')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'upcoming' 
                ? 'border-teal-600 text-teal-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Calendar className="w-4 h-4" />
            <span>Upcoming Appointments ({upcomingAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('past')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'past' 
                ? 'border-teal-600 text-teal-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Past History ({pastAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('cancelled')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'cancelled' 
                ? 'border-teal-600 text-teal-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <X className="w-4 h-4" />
            <span>Cancelled ({cancelledAppointments.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('records')}
            className={`pb-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 ${
              activeTab === 'records' 
                ? 'border-teal-600 text-teal-700' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FolderHeart className="w-4 h-4" />
            <span>Lab & Medical Records Vault</span>
          </button>
        </div>

        {/* TAB 1: UPCOMING APPOINTMENTS */}
        {activeTab === 'upcoming' && (
          <div className="space-y-4">
            {upcomingAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center">
                <Calendar className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-base font-bold text-slate-900">No upcoming appointments scheduled</h3>
                <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                  Book a consultation with a certified doctor to receive timely medical advice.
                </p>
                <button
                  onClick={onOpenBooking}
                  className="mt-4 px-5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs"
                >
                  Book Appointment Now
                </button>
              </div>
            ) : (
              upcomingAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs hover:border-teal-200 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                >
                  <div className="flex items-start gap-4">
                    <img
                      src={apt.doctorImage}
                      alt={apt.doctorName}
                      className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shrink-0"
                    />
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[11px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {apt.appointmentId}
                        </span>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          apt.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {apt.status}
                        </span>
                        {apt.rescheduledFrom && (
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded">
                            Rescheduled from {apt.rescheduledFrom}
                          </span>
                        )}
                      </div>

                      <h3 className="text-base font-bold text-slate-900 mt-1.5">{apt.doctorName}</h3>
                      <p className="text-xs text-teal-700 font-medium">{apt.doctorSpecialization}</p>

                      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-600 mt-2">
                        <span className="flex items-center gap-1 font-semibold text-slate-900">
                          <Clock className="w-3.5 h-3.5 text-teal-600" />
                          {apt.date} • {apt.startTime} – {apt.endTime}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          {apt.consultationType === 'video' ? (
                            <>
                              <Video className="w-3.5 h-3.5 text-blue-600" />
                              <span className="text-blue-700 font-medium">Telehealth Video Call</span>
                            </>
                          ) : (
                            <>
                              <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                              <span>{apt.clinic} ({apt.location})</span>
                            </>
                          )}
                        </span>
                      </div>

                      <p className="text-xs text-slate-500 mt-1.5 italic">
                        Reason: {apt.reason}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap items-center gap-2 w-full md:w-auto justify-end">
                    {apt.consultationType === 'video' && (
                      <button
                        onClick={() => onJoinVideoCall(apt)}
                        className="py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Video className="w-3.5 h-3.5" />
                        <span>Join Video Room</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setRescheduleTarget(apt);
                        setNewDate(apt.date);
                        setNewTime('');
                      }}
                      className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3 text-slate-500" />
                      <span>Reschedule</span>
                    </button>

                    <button
                      onClick={() => setCancelTarget(apt)}
                      className="py-2 px-3 rounded-xl border border-rose-200 hover:bg-rose-50 text-xs font-semibold text-rose-700 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3 text-rose-500" />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 2: PAST APPOINTMENTS */}
        {activeTab === 'past' && (
          <div className="space-y-4">
            {pastAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
                No past consultations yet.
              </div>
            ) : (
              pastAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <img
                        src={apt.doctorImage}
                        alt={apt.doctorName}
                        className="w-14 h-14 rounded-2xl object-cover border border-slate-200"
                      />
                      <div>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          Completed on {apt.date}
                        </span>
                        <h3 className="text-base font-bold text-slate-900 mt-1">{apt.doctorName}</h3>
                        <p className="text-xs text-teal-700 font-medium">{apt.doctorSpecialization} • {apt.clinic}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="font-mono text-xs text-slate-400 block">{apt.appointmentId}</span>
                      <span className="text-xs font-semibold text-emerald-700">Consultation Complete</span>
                    </div>
                  </div>

                  {/* Prescription / Doctor Advice */}
                  {apt.prescription && (
                    <div className="p-4 rounded-2xl bg-teal-50/50 border border-teal-100 text-xs space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5 font-bold text-teal-900">
                          <FileText className="w-3.5 h-3.5 text-teal-600" />
                          <span>Doctor's Prescription & Clinical Recommendations</span>
                        </div>
                        <button
                          onClick={() => setPrintingPrescriptionAppointment(apt)}
                          className="px-3 py-1.5 rounded-lg bg-teal-700 hover:bg-teal-800 text-white text-[11px] font-semibold flex items-center gap-1 shadow-2xs cursor-pointer transition-colors"
                        >
                          <Printer className="w-3 h-3" />
                          <span>Print Official Slip (PDF)</span>
                        </button>
                      </div>
                      <p className="text-slate-700 font-mono whitespace-pre-line pl-5">{apt.prescription}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: CANCELLED APPOINTMENTS */}
        {activeTab === 'cancelled' && (
          <div className="space-y-4">
            {cancelledAppointments.length === 0 ? (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center text-slate-500 text-xs">
                No cancelled appointments.
              </div>
            ) : (
              cancelledAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 opacity-80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-slate-400">{apt.appointmentId}</span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-rose-100 text-rose-800">
                        Cancelled
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-slate-800 mt-1">{apt.doctorName} ({apt.doctorSpecialization})</h4>
                    <p className="text-xs text-slate-500">Scheduled was: {apt.date} at {apt.startTime}</p>
                    {apt.cancellationReason && (
                      <p className="text-xs text-rose-600 mt-1">Reason: {apt.cancellationReason}</p>
                    )}
                  </div>

                  <button
                    onClick={onOpenBooking}
                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-xs font-semibold text-slate-700"
                  >
                    Rebook Slot
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 4: MEDICAL LAB RECORDS VAULT */}
        {activeTab === 'records' && (
          <LabReportsVault />
        )}

      </div>

      {/* CANCEL MODAL DIALOG */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Cancel Appointment</h3>
              <button onClick={() => setCancelTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-slate-600">
              Are you sure you want to cancel your appointment with <strong>{cancelTarget.doctorName}</strong> on {cancelTarget.date} at {cancelTarget.startTime}?
            </p>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Reason for Cancellation</label>
              <select
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden"
              >
                <option value="Personal schedule conflict">Personal schedule conflict</option>
                <option value="Condition improved / No longer needed">Condition improved / No longer needed</option>
                <option value="Wish to book another doctor">Wish to book another doctor</option>
                <option value="Emergency travel">Emergency travel</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setCancelTarget(null)}
                className="flex-1 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Keep Booking
              </button>
              <button
                type="button"
                disabled={isCancelling}
                onClick={handleConfirmCancel}
                className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold"
              >
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RESCHEDULE MODAL DIALOG */}
      {rescheduleTarget && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Reschedule Appointment</h3>
                <p className="text-xs text-slate-500">{rescheduleTarget.doctorName} • {rescheduleTarget.appointmentId}</p>
              </div>
              <button onClick={() => setRescheduleTarget(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            {rescheduleError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700">
                {rescheduleError}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select New Date</label>
              <input
                type="date"
                value={newDate}
                onChange={(e) => {
                  setNewDate(e.target.value);
                  setNewTime('');
                }}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Select Available Time Slot</label>
              {rescheduleSlots.length === 0 ? (
                <p className="text-xs text-slate-400 p-3 bg-slate-50 rounded-xl border border-slate-200">
                  No slots available on this date. Try selecting another date.
                </p>
              ) : (
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-40 overflow-y-auto">
                  {rescheduleSlots.map((slot) => (
                    <button
                      key={slot.id}
                      type="button"
                      onClick={() => setNewTime(slot.time)}
                      className={`py-2 px-2 rounded-lg text-xs font-semibold border ${
                        newTime === slot.time
                          ? 'bg-teal-600 text-white border-teal-600'
                          : 'bg-white text-slate-700 border-slate-200 hover:border-teal-400'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-3">
              <button
                type="button"
                onClick={() => setRescheduleTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!newDate || !newTime || isRescheduling}
                onClick={handleConfirmReschedule}
                className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold"
              >
                {isRescheduling ? 'Updating...' : 'Confirm Reschedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PRINTABLE PRESCRIPTION MODAL */}
      <PrescriptionPrintModal
        appointment={printingPrescriptionAppointment}
        onClose={() => setPrintingPrescriptionAppointment(null)}
      />

    </div>
  );
};
