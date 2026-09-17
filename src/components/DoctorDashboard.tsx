import React, { useState } from 'react';
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Video, 
  CheckCircle2, 
  FileText, 
  Sliders, 
  Building2, 
  Save, 
  Check, 
  AlertCircle,
  ToggleLeft,
  ToggleRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Appointment } from '../types';
import { STANDARD_TIME_SLOTS } from '../data/mockData';
import { PrescriptionPrintModal } from './PrescriptionPrintModal';

interface DoctorDashboardProps {
  onJoinVideoCall: (appointment: Appointment) => void;
}

export const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ onJoinVideoCall }) => {
  const { 
    currentUser, 
    doctors, 
    appointments, 
    completeAppointment, 
    toggleDoctorSlot,
    updateDoctorProfile 
  } = useApp();

  const [previewPrescriptionAppointment, setPreviewPrescriptionAppointment] = useState<Appointment | null>(null);

  // Find doctor corresponding to currentUser
  const myDoctor = doctors.find(d => d.userId === currentUser.id) || doctors[0];

  // Active appointment filter
  const myDoctorAppointments = appointments.filter(a => a.doctorId === myDoctor.id);
  const pendingOrConfirmed = myDoctorAppointments.filter(a => a.status === 'confirmed' || a.status === 'rescheduled');
  const completedAppointments = myDoctorAppointments.filter(a => a.status === 'completed');

  // Selected date for slot manager
  const [managerDate, setManagerDate] = useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });

  // Clinical notes editor state for a selected appointment
  const [activeAppointmentForNotes, setActiveAppointmentForNotes] = useState<Appointment | null>(null);
  const [prescriptionText, setPrescriptionText] = useState('');
  const [doctorClinicalNotes, setDoctorClinicalNotes] = useState('');

  // Fee and clinic settings
  const [consultationFee, setConsultationFee] = useState(myDoctor.consultationFee);
  const [clinicName, setClinicName] = useState(myDoctor.clinic);
  const [isSavedFee, setIsSavedFee] = useState(false);

  const handleOpenRxModal = (apt: Appointment) => {
    setActiveAppointmentForNotes(apt);
    setPrescriptionText(apt.prescription || '');
    setDoctorClinicalNotes(apt.notes || '');
  };

  const handleSaveRx = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeAppointmentForNotes) return;
    completeAppointment(activeAppointmentForNotes.id, doctorClinicalNotes, prescriptionText);
    setActiveAppointmentForNotes(null);
  };

  const handleSaveProfileSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateDoctorProfile(myDoctor.id, {
      consultationFee: Number(consultationFee),
      clinic: clinicName,
    });
    setIsSavedFee(true);
    setTimeout(() => setIsSavedFee(false), 3000);
  };

  // Disabled slots list
  const disabledSlots = myDoctor.disabledSlots || [];

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Doctor Header Profile */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <img
              src={myDoctor.image}
              alt={myDoctor.name}
              className="w-16 h-16 rounded-2xl object-cover border border-slate-200"
            />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black text-slate-900">{myDoctor.name}</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  DOCTOR CONSOLE
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  VERIFIED SPECIALIST
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-1">
                {myDoctor.specialization} • {myDoctor.qualification}
              </p>
              <p className="text-[11px] text-slate-400 mt-0.5">
                {myDoctor.clinic} ({myDoctor.location})
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[11px] text-slate-400 font-semibold block uppercase">Rating</span>
              <span className="text-base font-bold text-slate-900">★ {myDoctor.rating} ({myDoctor.reviewCount})</span>
            </div>
          </div>
        </div>

        {/* Doctor KPIs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Scheduled Today</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{pendingOrConfirmed.length}</p>
            <p className="text-[11px] text-teal-600 mt-0.5">Confirmed patient slots</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Completed Sessions</span>
            <p className="text-3xl font-black text-slate-900 mt-1">{completedAppointments.length}</p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Rx generated & signed</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Consultation Fee</span>
            <p className="text-3xl font-black text-slate-900 mt-1">₹{myDoctor.consultationFee}</p>
            <p className="text-[11px] text-slate-400 mt-0.5">Per 30 min session</p>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Estimated Earnings</span>
            <p className="text-3xl font-black text-slate-900 mt-1">
              ₹{completedAppointments.length * myDoctor.consultationFee}
            </p>
            <p className="text-[11px] text-emerald-600 mt-0.5">Settled consultations</p>
          </div>
        </div>

        {/* Grid: Left = Today's Appointment Queue, Right = Real-Time Schedule / Slot Manager */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* APPOINTMENTS QUEUE */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-900">Upcoming Patient Consultations</h2>
                <p className="text-xs text-slate-500">Live roster with one-click Telehealth launch and Rx generator</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-teal-50 text-teal-700">
                {pendingOrConfirmed.length} Active
              </span>
            </div>

            {pendingOrConfirmed.length === 0 ? (
              <div className="bg-white p-10 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs">
                No upcoming consultations scheduled right now.
              </div>
            ) : (
              pendingOrConfirmed.map((apt) => (
                <div
                  key={apt.id}
                  className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs hover:border-blue-200 transition-all space-y-3"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-bold text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">
                          {apt.appointmentId}
                        </span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          {apt.status}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 mt-1.5">{apt.patientName}</h3>
                      <p className="text-xs text-slate-500">Contact: {apt.patientPhone} • {apt.patientEmail}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-slate-900 block">{apt.date}</span>
                      <span className="text-xs text-teal-700 font-semibold">{apt.startTime} – {apt.endTime}</span>
                    </div>
                  </div>

                  <div className="p-3 bg-slate-50 rounded-xl text-xs space-y-1">
                    <p className="text-slate-800">
                      <strong>Reason:</strong> {apt.reason}
                    </p>
                    {apt.symptoms && (
                      <p className="text-slate-600">
                        <strong>Symptoms:</strong> {apt.symptoms}
                      </p>
                    )}
                  </div>

                  {/* Doctor actions */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-1.5">
                      {apt.consultationType === 'video' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                          <Video className="w-3.5 h-3.5" /> Video Telehealth Room
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <Stethoscope className="w-3.5 h-3.5" /> In-Clinic Visit
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {apt.consultationType === 'video' && (
                        <button
                          onClick={() => onJoinVideoCall(apt)}
                          className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Video className="w-3.5 h-3.5" />
                          <span>Launch Video Room</span>
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenRxModal(apt)}
                        className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1 cursor-pointer"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Prescription & Complete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* RIGHT: REAL-TIME SLOT AVAILABILITY MANAGER & SETTINGS */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Slot Manager Card */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Clock className="w-5 h-5 text-teal-600" />
                  <h3 className="text-sm font-bold text-slate-900">Manage Real-Time Availability</h3>
                </div>
                <span className="text-[10px] font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded">
                  Live Sync
                </span>
              </div>

              <p className="text-xs text-slate-500">
                Click any slot below to toggle it on or off for patient bookings.
              </p>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Select Date to Manage</label>
                <input
                  type="date"
                  value={managerDate}
                  onChange={(e) => setManagerDate(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2 text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Slot grid */}
              <div className="space-y-2 pt-2">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Time Slots</span>
                <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
                  {STANDARD_TIME_SLOTS.map((slot) => {
                    const slotKey = `${managerDate}-${slot.time}`;
                    const isTurnedOff = disabledSlots.includes(slotKey);
                    return (
                      <button
                        key={slot.time}
                        type="button"
                        onClick={() => toggleDoctorSlot(myDoctor.id, slotKey)}
                        className={`p-2 rounded-xl text-xs font-semibold border flex items-center justify-between transition-all cursor-pointer ${
                          isTurnedOff
                            ? 'bg-rose-50 text-rose-700 border-rose-200'
                            : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        }`}
                      >
                        <span>{slot.time}</span>
                        <span className="text-[10px] uppercase font-bold">
                          {isTurnedOff ? 'Closed' : 'Open'}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <p className="text-[11px] text-slate-400">
                Turned-off slots immediately become unbookable in the patient discovery UI.
              </p>
            </div>

            {/* Profile & Clinic Quick Settings */}
            <form onSubmit={handleSaveProfileSettings} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Clinic & Consultation Fee</h3>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Consultation Fee (₹)</label>
                <input
                  type="number"
                  value={consultationFee}
                  onChange={(e) => setConsultationFee(Number(e.target.value))}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinic Name</label>
                <input
                  type="text"
                  value={clinicName}
                  onChange={(e) => setClinicName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
              >
                {isSavedFee ? <Check className="w-4 h-4 text-emerald-400" /> : <Save className="w-4 h-4" />}
                <span>{isSavedFee ? 'Saved Successfully!' : 'Save Practice Details'}</span>
              </button>
            </form>

          </div>

        </div>

      </div>

      {/* PRESCRIPTION & CLINICAL NOTE MODAL */}
      {activeAppointmentForNotes && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900">Digital Prescription & Notes</h3>
                <p className="text-xs text-slate-500">Patient: {activeAppointmentForNotes.patientName} • {activeAppointmentForNotes.appointmentId}</p>
              </div>
              <button onClick={() => setActiveAppointmentForNotes(null)} className="text-slate-400 hover:text-slate-600">
                X
              </button>
            </div>

            <form onSubmit={handleSaveRx} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Clinical Assessment / Notes</label>
                <textarea
                  rows={2}
                  value={doctorClinicalNotes}
                  onChange={(e) => setDoctorClinicalNotes(e.target.value)}
                  placeholder="e.g. Mild hypertension diagnosed, advised salt reduction..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-bold text-slate-700">Digital Rx (Medications & Dosage) *</label>
                  <span className="text-[10px] text-teal-700 font-semibold">1-Click Presets Below</span>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-2">
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorClinicalNotes('Acute seasonal viral URI with pyrexia and myalgia. Hydration advised.');
                      setPrescriptionText('1. Tab Paracetamol 650mg — 1 tab TDS after food x 3 days\n2. Tab Pantoprazole 40mg — 1 tab OD empty stomach x 5 days\n3. ORS Electrolyte Drink — 1 sachet in 1L water daily\n4. Review after 3 days if fever persists.');
                    }}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-700 border border-slate-200"
                  >
                    + Viral Fever Protocol
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorClinicalNotes('Essential Hypertension Stage 1. Commenced on low-dose ARB.');
                      setPrescriptionText('1. Tab Telmisartan 40mg — 1 tab OD morning after food x 30 days\n2. Low-sodium DASH diet (salt < 5g/day)\n3. Home BP monitoring alternate days (morning & evening)\n4. Repeat serum creatinine in 4 weeks.');
                    }}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-700 border border-slate-200"
                  >
                    + Hypertension Protocol
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setDoctorClinicalNotes('Functional dyspepsia / GERD with epigastric burning.');
                      setPrescriptionText('1. Tab Pantoprazole 40mg + Domperidone 30mg — 1 cap OD before breakfast x 10 days\n2. Antacid Suspension — 10ml TDS 1 hr after meals\n3. Avoid late-night spicy meals and caffeinated drinks.');
                    }}
                    className="px-2 py-0.5 rounded text-[10px] bg-slate-100 hover:bg-teal-50 text-slate-700 border border-slate-200"
                  >
                    + Gastritis / GERD
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={prescriptionText}
                  onChange={(e) => setPrescriptionText(e.target.value)}
                  placeholder="1. Tab Telmisartan 40mg (1 tab OD morning x 30 days)&#10;2. Tab Multivitamin (1 tab OD after lunch)&#10;3. Follow up after 4 weeks."
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-3 text-slate-900 focus:outline-hidden font-mono"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setActiveAppointmentForNotes(null)}
                  className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Sign & Mark Completed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE PRESCRIPTION SLIP PREVIEW FOR DOCTOR */}
      <PrescriptionPrintModal
        appointment={previewPrescriptionAppointment}
        onClose={() => setPreviewPrescriptionAppointment(null)}
      />

    </div>
  );
};
