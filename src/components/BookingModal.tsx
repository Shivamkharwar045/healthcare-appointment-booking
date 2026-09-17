import React, { useState, useEffect } from 'react';
import { 
  X, 
  Calendar as CalendarIcon, 
  Clock, 
  Video, 
  Stethoscope, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  MapPin, 
  FileText, 
  Download, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { Doctor, Appointment } from '../types';
import { useApp } from '../context/AppContext';

interface BookingModalProps {
  initialDoctor?: Doctor | null;
  isOpen: boolean;
  onClose: () => void;
  onViewInDashboard: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  initialDoctor,
  isOpen,
  onClose,
  onViewInDashboard,
}) => {
  const { doctors, currentUser, getDoctorAvailableSlots, bookAppointment } = useApp();

  // Booking Flow Steps: 1 to 7
  const [step, setStep] = useState<number>(1);
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(initialDoctor?.id || doctors[0]?.id || '');
  const [consultationType, setConsultationType] = useState<'in-person' | 'video'>('video');
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');
  
  // Patient Details form
  const [patientName, setPatientName] = useState(currentUser.name);
  const [patientEmail, setPatientEmail] = useState(currentUser.email);
  const [patientPhone, setPatientPhone] = useState(currentUser.phone || '+91 98765 43210');
  const [reason, setReason] = useState('');
  const [symptoms, setSymptoms] = useState('');

  // Submitting / Result state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [confirmedAppointment, setConfirmedAppointment] = useState<Appointment | null>(null);

  // Set default initial date (e.g. tomorrow or today)
  useEffect(() => {
    const today = new Date();
    const formatted = today.toISOString().split('T')[0];
    setSelectedDate(formatted);
  }, []);

  // Update selected doctor when prop changes
  useEffect(() => {
    if (initialDoctor) {
      setSelectedDoctorId(initialDoctor.id);
      if (!initialDoctor.consultationTypes.includes('video')) {
        setConsultationType('in-person');
      }
      setStep(2); // If doctor is already picked, start at Step 2
    } else {
      setStep(1);
    }
  }, [initialDoctor]);

  if (!isOpen) return null;

  const currentDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  // Available slots for selected doctor and date
  const availableSlots = selectedDate ? getDoctorAvailableSlots(currentDoctor.id, selectedDate) : [];
  const morningSlots = availableSlots.filter(s => s.period === 'morning');
  const afternoonSlots = availableSlots.filter(s => s.period === 'afternoon');
  const eveningSlots = availableSlots.filter(s => s.period === 'evening');

  // Next 7 days generator
  const getNext7Days = () => {
    const days = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const month = d.toLocaleDateString('en-US', { month: 'short' });
      days.push({ iso, weekday, dayNum, month, isToday: i === 0 });
    }
    return days;
  };
  const calendarDays = getNext7Days();

  const handleConfirmBooking = async () => {
    setIsSubmitting(true);
    setErrorMessage(null);

    const res = await bookAppointment({
      doctorId: currentDoctor.id,
      consultationType,
      date: selectedDate,
      startTime: selectedTime,
      patientName,
      patientEmail,
      patientPhone,
      reason: reason || 'General Medical Consultation',
      symptoms,
    });

    setIsSubmitting(false);

    if (res.success && res.appointment) {
      setConfirmedAppointment(res.appointment);
      setStep(7); // Jump to Confirmation screen
    } else {
      setErrorMessage(res.error || 'Failed to complete reservation. Please select a different slot.');
    }
  };

  // Generate downloadable .ics calendar file
  const handleDownloadCalendarInvite = () => {
    if (!confirmedAppointment) return;
    const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//MediBook Health Systems//Appointment Booking//EN
BEGIN:VEVENT
UID:${confirmedAppointment.appointmentId}@medibook.health
DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z
SUMMARY:Doctor Consultation: ${confirmedAppointment.doctorName} (${confirmedAppointment.doctorSpecialization})
DESCRIPTION:Appointment ID: ${confirmedAppointment.appointmentId}\\nType: ${confirmedAppointment.consultationType}\\nClinic: ${confirmedAppointment.clinic}\\nReason: ${confirmedAppointment.reason}
LOCATION:${confirmedAppointment.location}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${confirmedAppointment.appointmentId}-Appointment.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Header with Stepper Progress */}
        <div className="bg-slate-50 border-b border-slate-200/80 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-teal-700">
                7-Step Booking Flow • Step {step} of 7
              </span>
              <h2 className="text-lg font-bold text-slate-900">
                {step === 1 && 'Step 1: Select Healthcare Specialist'}
                {step === 2 && 'Step 2: Choose Consultation Mode'}
                {step === 3 && 'Step 3: Pick Appointment Date'}
                {step === 4 && 'Step 4: Select Real-Time Time Slot'}
                {step === 5 && 'Step 5: Patient Details & Reason'}
                {step === 6 && 'Step 6: Review Booking & Pricing'}
                {step === 7 && 'Step 7: Appointment Confirmed!'}
              </h2>
            </div>

            {/* Progress Pills */}
            <div className="hidden sm:flex items-center gap-1">
              {[1, 2, 3, 4, 5, 6, 7].map((s) => (
                <span
                  key={s}
                  className={`w-2.5 h-2.5 rounded-full transition-all ${
                    s === step ? 'w-6 bg-teal-600' : s < step ? 'bg-teal-300' : 'bg-slate-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stepper Content */}
        <div className="p-6 sm:p-8 max-h-[70vh] overflow-y-auto">
          
          {/* STEP 1: SELECT DOCTOR */}
          {step === 1 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Choose from board-certified doctors available for consultation:</p>
              <div className="space-y-3 max-h-80 overflow-y-auto">
                {doctors.filter(d => d.approvalStatus === 'approved').map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => {
                      setSelectedDoctorId(doc.id);
                      if (!doc.consultationTypes.includes('video')) setConsultationType('in-person');
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                      selectedDoctorId === doc.id
                        ? 'border-teal-500 bg-teal-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <img src={doc.image} alt={doc.name} className="w-12 h-12 rounded-xl object-cover" />
                      <div>
                        <h4 className="text-sm font-bold text-slate-900">{doc.name}</h4>
                        <p className="text-xs text-teal-700 font-medium">{doc.specialization} • {doc.experienceYears} yrs exp</p>
                        <p className="text-[11px] text-slate-400">{doc.clinic}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold text-slate-900">₹{doc.consultationFee}</p>
                      <span className="text-[10px] text-teal-600 font-medium">
                        {doc.availableToday ? 'Slots Today' : 'Slots Tomorrow'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* STEP 2: CONSULTATION TYPE */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="p-3 bg-teal-50/60 rounded-xl border border-teal-100 flex items-center gap-3">
                <img src={currentDoctor.image} alt={currentDoctor.name} className="w-10 h-10 rounded-lg object-cover" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{currentDoctor.name}</p>
                  <p className="text-[11px] text-teal-700">{currentDoctor.specialization} • ₹{currentDoctor.consultationFee}</p>
                </div>
              </div>

              <p className="text-xs text-slate-500">How would you like to consult with {currentDoctor.name}?</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Video Consultation Option */}
                <div
                  onClick={() => {
                    if (currentDoctor.consultationTypes.includes('video')) {
                      setConsultationType('video');
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    !currentDoctor.consultationTypes.includes('video')
                      ? 'opacity-40 cursor-not-allowed border-slate-200'
                      : consultationType === 'video'
                      ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">Encrypted Video Call</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Consult from your laptop or phone in an encrypted HD telemedicine room. Includes instant digital prescription.
                  </p>
                  <span className="inline-block mt-3 text-[11px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded">
                    Popular & Convenient
                  </span>
                </div>

                {/* In-Person Clinic Visit Option */}
                <div
                  onClick={() => {
                    if (currentDoctor.consultationTypes.includes('in-person')) {
                      setConsultationType('in-person');
                    }
                  }}
                  className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                    !currentDoctor.consultationTypes.includes('in-person')
                      ? 'opacity-40 cursor-not-allowed border-slate-200'
                      : consultationType === 'in-person'
                      ? 'border-teal-500 bg-teal-50/50 shadow-md ring-2 ring-teal-500/20'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                    <Stethoscope className="w-5 h-5" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900">In-Person Clinic Visit</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    Physical checkup at {currentDoctor.clinic}. Address: {currentDoctor.location}.
                  </p>
                  <span className="inline-block mt-3 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    Direct Physical Exam
                  </span>
                </div>

              </div>
            </div>
          )}

          {/* STEP 3: SELECT DATE */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">
                Select your preferred consultation date for {currentDoctor.name}:
              </p>

              {/* 7-Day interactive date picker */}
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
                {calendarDays.map((day) => (
                  <button
                    key={day.iso}
                    type="button"
                    onClick={() => {
                      setSelectedDate(day.iso);
                      setSelectedTime(''); // Reset time on date change
                    }}
                    className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                      selectedDate === day.iso
                        ? 'border-teal-600 bg-teal-600 text-white shadow-md shadow-teal-600/20'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-800'
                    }`}
                  >
                    <span className={`text-[10px] font-bold uppercase block ${selectedDate === day.iso ? 'text-teal-100' : 'text-slate-400'}`}>
                      {day.weekday}
                    </span>
                    <span className="text-lg font-black block mt-0.5">
                      {day.dayNum}
                    </span>
                    <span className={`text-[10px] block ${selectedDate === day.iso ? 'text-teal-100' : 'text-slate-400'}`}>
                      {day.month}
                    </span>
                    {day.isToday && (
                      <span className={`text-[9px] font-bold block mt-1 ${selectedDate === day.iso ? 'text-teal-200' : 'text-teal-600'}`}>
                        Today
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Selected Date: <strong className="text-slate-900">{selectedDate}</strong></span>
                <span className="text-teal-700 font-semibold">Real-Time Sync Active</span>
              </div>
            </div>
          )}

          {/* STEP 4: TIME SLOTS */}
          {step === 4 && (
            <div className="space-y-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-900">Available Slots for {selectedDate}</p>
                  <p className="text-[11px] text-slate-500">Live check against {currentDoctor.name}'s calendar</p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="flex items-center gap-1 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full border border-teal-500 bg-white" /> Available
                  </span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" /> Booked
                  </span>
                </div>
              </div>

              {/* Morning Slots */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Morning Slots</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {morningSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        !slot.isAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white hover:border-teal-400 text-slate-800 border-slate-200 cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Afternoon Slots */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Afternoon Slots</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {afternoonSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        !slot.isAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white hover:border-teal-400 text-slate-800 border-slate-200 cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>

              {/* Evening Slots */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Evening Slots</h4>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                  {eveningSlots.map(slot => (
                    <button
                      key={slot.id}
                      type="button"
                      disabled={!slot.isAvailable}
                      onClick={() => setSelectedTime(slot.time)}
                      className={`py-2 px-2.5 rounded-xl text-xs font-semibold border transition-all ${
                        !slot.isAvailable
                          ? 'bg-slate-100 text-slate-400 border-slate-200 cursor-not-allowed line-through'
                          : selectedTime === slot.time
                          ? 'bg-teal-600 text-white border-teal-600 shadow-sm'
                          : 'bg-white hover:border-teal-400 text-slate-800 border-slate-200 cursor-pointer'
                      }`}
                    >
                      {slot.time}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 5: PATIENT DETAILS */}
          {step === 5 && (
            <div className="space-y-4">
              <p className="text-xs text-slate-500">Provide medical details to prepare the doctor for your consultation:</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Patient Full Name</label>
                  <input
                    type="text"
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Phone Number (For SMS Alerts)</label>
                  <input
                    type="text"
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    required
                    className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Email Address (For Calendar & Rx)</label>
                <input
                  type="email"
                  value={patientEmail}
                  onChange={(e) => setPatientEmail(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Primary Reason for Visit *</label>
                <input
                  type="text"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="e.g. Chest discomfort, skin breakout, routine checkup..."
                  required
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Specific Symptoms & Duration (Optional)</label>
                <textarea
                  rows={2}
                  value={symptoms}
                  onChange={(e) => setSymptoms(e.target.value)}
                  placeholder="Describe how long you've had symptoms, severity, or current medications..."
                  className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:border-teal-500 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 6: REVIEW BOOKING & TRANSPARENT PRICING */}
          {step === 6 && (
            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                
                <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
                  <div className="flex items-center gap-3">
                    <img src={currentDoctor.image} alt={currentDoctor.name} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">{currentDoctor.name}</h4>
                      <p className="text-xs text-teal-700 font-medium">{currentDoctor.specialization}</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-teal-100 text-teal-800">
                    {consultationType === 'video' ? 'Video Consult' : 'Clinic Visit'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div>
                    <span className="text-slate-400 block font-medium">Date & Time</span>
                    <span className="font-bold text-slate-900">{selectedDate} at {selectedTime}</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block font-medium">Patient</span>
                    <span className="font-bold text-slate-900">{patientName}</span>
                  </div>
                  <div className="col-span-2">
                    <span className="text-slate-400 block font-medium">Location</span>
                    <span className="font-medium text-slate-800">
                      {consultationType === 'video' 
                        ? 'Encrypted Telehealth Room (Link provided upon confirmation)' 
                        : `${currentDoctor.clinic}, ${currentDoctor.address}`}
                    </span>
                  </div>
                </div>

              </div>

              {/* Pricing Breakdown */}
              <div className="p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Doctor Consultation Fee</span>
                  <span className="font-semibold text-slate-900">₹{currentDoctor.consultationFee}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Platform Booking & SMS Fee</span>
                  <span className="font-semibold text-emerald-600">FREE (₹0)</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-sm text-slate-900">
                  <span>Total Payable</span>
                  <span className="text-teal-700 text-base">₹{currentDoctor.consultationFee}</span>
                </div>
              </div>

              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-700 flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="p-3 rounded-xl bg-teal-50 border border-teal-100 text-xs text-teal-800 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 shrink-0 text-teal-600" />
                <span>Zero Double-Booking Guarantee: Time slot locked exclusively for your session.</span>
              </div>
            </div>
          )}

          {/* STEP 7: APPOINTMENT CONFIRMED! */}
          {step === 7 && confirmedAppointment && (
            <div className="text-center py-4 space-y-5 animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md">
                <CheckCircle2 className="w-10 h-10" />
              </div>

              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 mb-2">
                  Appointment Confirmed
                </span>
                <h3 className="text-2xl font-black text-slate-900 tracking-tight">Booking Successful!</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Confirmation code has been dispatched to {confirmedAppointment.patientPhone}
                </p>
              </div>

              {/* Confirmed Details Card */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-left max-w-md mx-auto space-y-3">
                <div className="flex justify-between items-center pb-2 border-b border-slate-200">
                  <span className="text-xs font-semibold text-slate-400">Appointment ID</span>
                  <span className="text-sm font-mono font-black text-teal-700">{confirmedAppointment.appointmentId}</span>
                </div>

                <div className="text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Doctor:</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.doctorName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Date & Slot:</span>
                    <span className="font-bold text-slate-900">{confirmedAppointment.date} at {confirmedAppointment.startTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Consultation Mode:</span>
                    <span className="font-bold text-slate-900 capitalize">{confirmedAppointment.consultationType}</span>
                  </div>
                </div>

                {confirmedAppointment.consultationType === 'video' && confirmedAppointment.meetLink && (
                  <div className="mt-3 p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900">
                    <p className="font-bold mb-1 flex items-center gap-1.5">
                      <Video className="w-3.5 h-3.5 text-blue-600" />
                      Telehealth Video Room Ready
                    </p>
                    <p className="text-[11px] text-blue-700 font-mono truncate">{confirmedAppointment.meetLink}</p>
                  </div>
                )}
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2 justify-center max-w-md mx-auto">
                <button
                  onClick={handleDownloadCalendarInvite}
                  className="py-2.5 px-4 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-semibold text-slate-700 flex items-center justify-center gap-1.5"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download .ICS Calendar</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onViewInDashboard();
                  }}
                  className="py-2.5 px-6 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View in Patient Dashboard</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Modal Navigation Footer (Steps 1 - 6) */}
        {step < 7 && (
          <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200/80 flex items-center justify-between">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-500 hover:text-slate-800"
              >
                Cancel
              </button>

              {step === 1 && (
                <button
                  type="button"
                  disabled={!selectedDoctorId}
                  onClick={() => setStep(2)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 2 && (
                <button
                  type="button"
                  onClick={() => setStep(3)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select Date</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 3 && (
                <button
                  type="button"
                  disabled={!selectedDate}
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Select Time Slot</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 4 && (
                <button
                  type="button"
                  disabled={!selectedTime}
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Patient Info</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 5 && (
                <button
                  type="button"
                  disabled={!patientName || !patientPhone || !patientEmail}
                  onClick={() => setStep(6)}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <span>Review Booking</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}

              {step === 6 && (
                <button
                  type="button"
                  disabled={isSubmitting}
                  onClick={handleConfirmBooking}
                  className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold shadow-md shadow-teal-600/20 flex items-center gap-2 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Reserving Slot...</span>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Confirm & Lock Appointment</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};
