import React, { useState } from 'react';
import { 
  Search, 
  Calendar, 
  ShieldCheck, 
  Video, 
  MapPin, 
  Star, 
  Clock, 
  ArrowRight, 
  HeartPulse, 
  CheckCircle2, 
  Users, 
  Award,
  ChevronDown,
  Sparkles,
  Bone,
  Baby,
  Brain,
  Stethoscope,
  Smile,
  Eye,
  FileText,
  PhoneCall,
  Ambulance,
  Activity,
  AlertCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_SPECIALIZATIONS, TESTIMONIALS, FAQS } from '../data/mockData';
import { Doctor } from '../types';

interface LandingPageProps {
  onFindDoctor?: (specialty?: string, searchQuery?: string) => void;
  onSelectDoctor?: (doctor: Doctor) => void;
  onBookDirect?: (doctor?: Doctor) => void;
  onExploreDoctors?: () => void;
  onSelectSpecialty?: (specialty: string) => void;
  onOpenBooking?: (doctor?: Doctor) => void;
  onOpenApiSpecs?: () => void;
  onOpenSymptomChecker?: () => void;
  onOpenEmergencyCare?: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ 
  onFindDoctor, 
  onSelectDoctor, 
  onBookDirect,
  onExploreDoctors,
  onSelectSpecialty,
  onOpenBooking,
  onOpenApiSpecs,
  onOpenSymptomChecker,
  onOpenEmergencyCare,
}) => {
  const { doctors } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  const approvedDoctors = doctors.filter(d => d.approvalStatus === 'approved');
  const featuredDoctors = approvedDoctors.slice(0, 3);

  const triggerFindDoctor = (specialty?: string, search?: string) => {
    if (onFindDoctor) {
      onFindDoctor(specialty, search);
    } else if (specialty && onSelectSpecialty) {
      onSelectSpecialty(specialty);
    } else if (onExploreDoctors) {
      onExploreDoctors();
    }
  };

  const triggerBookDirect = (doctor?: Doctor) => {
    if (onBookDirect) {
      onBookDirect(doctor);
    } else if (onOpenBooking) {
      onOpenBooking(doctor);
    }
  };

  const triggerSelectDoctor = (doctor: Doctor) => {
    if (onSelectDoctor) {
      onSelectDoctor(doctor);
    } else if (onBookDirect) {
      onBookDirect(doctor);
    } else if (onOpenBooking) {
      onOpenBooking(doctor);
    }
  };

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    triggerFindDoctor(selectedSpecialty || undefined, searchQuery || undefined);
  };

  const getSpecialtyIcon = (iconName: string) => {
    switch (iconName) {
      case 'HeartPulse': return <HeartPulse className="w-6 h-6 text-rose-500" />;
      case 'Sparkles': return <Sparkles className="w-6 h-6 text-amber-500" />;
      case 'Bone': return <Bone className="w-6 h-6 text-sky-500" />;
      case 'Baby': return <Baby className="w-6 h-6 text-teal-500" />;
      case 'Brain': return <Brain className="w-6 h-6 text-indigo-500" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6 text-emerald-500" />;
      case 'Smile': return <Smile className="w-6 h-6 text-purple-500" />;
      case 'Eye': return <Eye className="w-6 h-6 text-blue-500" />;
      default: return <Stethoscope className="w-6 h-6 text-teal-500" />;
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800">
      
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-b from-teal-50/70 via-white to-slate-50 pt-12 pb-20 sm:pt-16 sm:pb-24 border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-100/70 border border-teal-200 text-teal-800 text-xs font-semibold mb-6">
              <ShieldCheck className="w-3.5 h-3.5 text-teal-700" />
              <span>100% Board-Certified & Credential-Verified Healthcare Specialists</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15]">
              Seamless Doctor Appointments, <br className="hidden sm:inline" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-700 via-teal-600 to-emerald-600">
                Guaranteed Real-Time Slots
              </span>
            </h1>

            <p className="mt-5 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
              Discover top healthcare specialists, check live calendar availability, 
              and book in-person clinic visits or encrypted HD video consultations in under 60 seconds.
            </p>

            {/* Interactive Search Card */}
            <form 
              onSubmit={handleHeroSearch}
              className="mt-8 sm:mt-10 p-2 sm:p-3 bg-white rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200/80 max-w-4xl mx-auto text-left"
              id="hero-doctor-search-form"
            >
              <div className="grid grid-cols-1 md:grid-cols-12 gap-2 sm:gap-3 items-center">
                
                {/* Search Text */}
                <div className="md:col-span-5 relative flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-teal-500 focus-within:bg-white transition-all">
                  <Search className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Doctor name, clinic, or symptom..."
                    className="w-full text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
                    id="hero-search-input"
                  />
                </div>

                {/* Specialty Select */}
                <div className="md:col-span-4 relative flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-teal-500 focus-within:bg-white transition-all">
                  <Stethoscope className="w-5 h-5 text-slate-400 shrink-0 mr-2" />
                  <select
                    value={selectedSpecialty}
                    onChange={(e) => setSelectedSpecialty(e.target.value)}
                    className="w-full text-sm text-slate-900 bg-transparent focus:outline-hidden cursor-pointer"
                    id="hero-specialty-select"
                  >
                    <option value="">All Specializations</option>
                    {INITIAL_SPECIALIZATIONS.map(s => (
                      <option key={s.id} value={s.name}>{s.name} ({s.doctorCount})</option>
                    ))}
                  </select>
                </div>

                {/* Submit Action */}
                <div className="md:col-span-3 flex gap-2">
                  <button
                    type="submit"
                    id="hero-search-submit-btn"
                    className="w-full py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    <Search className="w-4 h-4" />
                    <span>Find Doctors</span>
                  </button>
                </div>
              </div>

              {/* Quick Tags */}
              <div className="mt-3 px-2 pt-2 border-t border-slate-100 flex flex-wrap items-center gap-1.5 text-xs text-slate-500">
                <span className="font-medium text-slate-600">Popular Searches:</span>
                {['Cardiologist', 'Dermatologist', 'Orthopedic', 'Pediatrician', 'Video Consult'].map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      if (tag === 'Video Consult') {
                        triggerFindDoctor(undefined, 'video');
                      } else {
                        triggerFindDoctor(tag);
                      }
                    }}
                    className="px-2 py-0.5 rounded-md bg-slate-100 hover:bg-teal-50 hover:text-teal-700 text-slate-600 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </form>

            {/* Micro proof points */}
            <div className="mt-8 flex flex-wrap justify-center items-center gap-6 sm:gap-10 text-xs font-medium text-slate-500">
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Zero Double-Booking Guarantee</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Instant SMS & Calendar Sync</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-teal-600" />
                <span>Encrypted Telehealth Video</span>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 2. PLATFORM STATISTICS */}
      <section className="bg-white py-12 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center divide-y sm:divide-y-0 sm:divide-x divide-slate-100">
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">15,400+</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Completed Consultations</p>
              <p className="text-[11px] text-teal-600 mt-0.5">Verified real patient outcomes</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">450+</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Verified Medical Specialists</p>
              <p className="text-[11px] text-teal-600 mt-0.5">Licensed & hospital affiliated</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">98.4%</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Patient Satisfaction Rate</p>
              <p className="text-[11px] text-teal-600 mt-0.5">Based on post-consult reviews</p>
            </div>
            <div className="p-4">
              <p className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">&lt; 15 min</p>
              <p className="text-xs sm:text-sm font-semibold text-slate-500 mt-1">Average Wait Time</p>
              <p className="text-[11px] text-teal-600 mt-0.5">With priority appointment slots</p>
            </div>
          </div>
        </div>
      </section>

      {/* 2.5 SMART AI TRIAGE & EMERGENCY 24x7 SOS HUB */}
      <section className="py-12 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* AI Clinical Symptom Checker Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-teal-50/80 via-white to-teal-50/30 border border-teal-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-2 rounded-xl bg-teal-600 text-white shadow-xs">
                    <Sparkles className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-bold text-teal-800 uppercase tracking-wider bg-teal-100/70 px-2.5 py-0.5 rounded-full">
                    AI Clinical Triage
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Not Sure Which Doctor to Consult?
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Enter symptoms like fever, chest pressure, skin rashes, or fatigue. Our clinical symptom analyzer identifies probable conditions, triage urgency, and matches you with verified specialists instantly.
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {['Chest Discomfort', 'Persistent Migraine', 'Skin Itching', 'Knee Pain'].map((chip) => (
                    <span key={chip} className="text-xs bg-white text-slate-700 px-2.5 py-1 rounded-lg border border-slate-200/80 font-medium">
                      {chip}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-teal-100 flex items-center justify-between">
                <div className="text-xs text-teal-900 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-teal-600" />
                  <span>Confidential & Free Clinical Check</span>
                </div>
                {onOpenSymptomChecker && (
                  <button
                    onClick={onOpenSymptomChecker}
                    id="landing-hero-symptom-btn"
                    className="px-4 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>Check Symptoms</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* 24x7 Emergency Services & Ambulance Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-linear-to-br from-rose-50/80 via-white to-rose-50/30 border border-rose-200/80 shadow-xs relative overflow-hidden flex flex-col justify-between group hover:shadow-md transition-all">
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-3">
                  <span className="p-2 rounded-xl bg-rose-600 text-white shadow-xs">
                    <Ambulance className="w-5 h-5" />
                  </span>
                  <span className="text-[11px] font-bold text-rose-800 uppercase tracking-wider bg-rose-100/70 px-2.5 py-0.5 rounded-full">
                    24x7 Emergency Care
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                  Trauma Wards & Emergency Hotline
                </h3>
                <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                  Real-time network of NABH-accredited emergency hospitals with verified ICU bed availability, on-call trauma teams, and 1-tap ALS ambulance dispatch with live telemetry.
                </p>

                <div className="mt-4 flex items-center gap-4 text-xs font-medium text-slate-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span>32 ICU Beds Ready</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-rose-600" />
                    <span>Avg Ambulance ETA: ~7 Mins</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-rose-100 flex items-center justify-between">
                <a
                  href="tel:108"
                  className="text-xs text-rose-700 font-bold flex items-center gap-1.5 hover:underline"
                >
                  <PhoneCall className="w-4 h-4 text-rose-600" />
                  <span>National SOS: Dial 108 / 112</span>
                </a>
                {onOpenEmergencyCare && (
                  <button
                    onClick={onOpenEmergencyCare}
                    id="landing-hero-sos-btn"
                    className="px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2 cursor-pointer transition-all"
                  >
                    <span>View Emergency Network</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 3. POPULAR SPECIALIZATIONS */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Clinical Expertise</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                Browse by Top Specializations
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Select your required department for focused diagnosis and experienced care.
              </p>
            </div>

            <button
              onClick={() => triggerFindDoctor()}
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              <span>View all doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {INITIAL_SPECIALIZATIONS.map((specialty) => (
              <div
                key={specialty.id}
                onClick={() => triggerFindDoctor(specialty.name)}
                className="p-5 rounded-2xl bg-white border border-slate-200/80 hover:border-teal-300 hover:shadow-lg hover:shadow-teal-900/5 transition-all cursor-pointer group text-left"
                id={`specialty-card-${specialty.id}`}
              >
                <div className="flex items-center justify-between">
                  <div className="p-3 rounded-xl bg-slate-50 group-hover:bg-teal-50 transition-colors">
                    {getSpecialtyIcon(specialty.iconName)}
                  </div>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 group-hover:bg-teal-100 group-hover:text-teal-800 transition-colors">
                    {specialty.doctorCount} Doctors
                  </span>
                </div>

                <h3 className="text-base font-bold text-slate-900 mt-4 group-hover:text-teal-700 transition-colors">
                  {specialty.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                  {specialty.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-medium text-slate-400 group-hover:text-teal-600">
                  <span>Explore specialists</span>
                  <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 4. HOW IT WORKS */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="max-w-2xl mx-auto mb-14">
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Patient Experience</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              How MediBook Works in 3 Simple Steps
            </h2>
            <p className="text-sm text-slate-500 mt-2">
              Engineered with automated availability synchronization to eliminate wait times and missed appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            
            {/* Step 1 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left relative">
              <span className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-teal-600/20 mb-4">
                01
              </span>
              <h3 className="text-lg font-bold text-slate-900">Find the Right Specialist</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Filter by medical specialty, patient ratings, consultation fee, clinic location, or preferred consultation mode (video vs. in-person).
              </p>
              <div className="mt-4 text-xs font-semibold text-teal-700 flex items-center gap-1">
                <Search className="w-3.5 h-3.5" />
                <span>Verified credentials & reviews</span>
              </div>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left relative">
              <span className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-teal-600/20 mb-4">
                02
              </span>
              <h3 className="text-lg font-bold text-slate-900">Pick a Real-Time Slot</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                View live calendar availability. Our system checks for booking collisions in real-time, locking your chosen 30-minute window instantly.
              </p>
              <div className="mt-4 text-xs font-semibold text-teal-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>Instant reservation lock</span>
              </div>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-left relative">
              <span className="w-10 h-10 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center text-sm shadow-md shadow-teal-600/20 mb-4">
                03
              </span>
              <h3 className="text-lg font-bold text-slate-900">Consult & Access Records</h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                Attend your clinic appointment or enter the encrypted Telehealth room. Receive digital prescriptions and health notes directly in your portal.
              </p>
              <div className="mt-4 text-xs font-semibold text-teal-700 flex items-center gap-1">
                <FileText className="w-3.5 h-3.5" />
                <span>Digital summary & Rx access</span>
              </div>
            </div>

          </div>

          <div className="mt-10">
            <button
              onClick={() => triggerBookDirect()}
              id="how-it-works-book-btn"
              className="px-6 py-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-sm font-semibold shadow-md shadow-teal-600/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              <span>Book Your First Consultation</span>
            </button>
          </div>

        </div>
      </section>

      {/* 5. FEATURED HEALTHCARE PROFESSIONALS */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10">
            <div>
              <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Top Rated Professionals</p>
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
                Featured Healthcare Specialists
              </h2>
              <p className="text-sm text-slate-500 mt-1.5">
                Experienced practitioners ready for in-clinic visits and virtual video appointments.
              </p>
            </div>

            <button
              onClick={() => triggerFindDoctor()}
              className="mt-4 sm:mt-0 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-700 hover:text-teal-800"
            >
              <span>Explore all {approvedDoctors.length} doctors</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="bg-white rounded-2xl border border-slate-200/80 hover:shadow-xl hover:shadow-slate-200/60 transition-all overflow-hidden flex flex-col justify-between"
                id={`featured-doctor-${doctor.id}`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <img
                      src={doctor.image}
                      alt={doctor.name}
                      className="w-18 h-18 rounded-xl object-cover border border-slate-200 shrink-0"
                    />
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-teal-700 bg-teal-50 px-2 py-0.5 rounded-md">
                          {doctor.specialization}
                        </span>
                        <span className="inline-flex items-center text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 mr-0.5" /> Verified
                        </span>
                      </div>

                      <h3 
                        onClick={() => triggerSelectDoctor(doctor)}
                        className="text-base font-bold text-slate-900 mt-1.5 hover:text-teal-600 transition-colors cursor-pointer truncate"
                      >
                        {doctor.name}
                      </h3>
                      
                      <p className="text-xs text-slate-500 truncate mt-0.5">{doctor.qualification}</p>

                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-500">
                        <span className="flex items-center gap-1 font-semibold text-amber-600">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {doctor.rating} ({doctor.reviewCount})
                        </span>
                        <span>•</span>
                        <span>{doctor.experienceYears} yrs exp</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600 space-y-1.5">
                    <div className="flex items-center gap-1.5 text-slate-500 truncate">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{doctor.clinic} ({doctor.location})</span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div className="flex items-center gap-1.5">
                        {doctor.consultationTypes.includes('video') && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
                            <Video className="w-3 h-3" /> Video
                          </span>
                        )}
                        {doctor.consultationTypes.includes('in-person') && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                            <Stethoscope className="w-3 h-3" /> In-Clinic
                          </span>
                        )}
                      </div>

                      <span className="font-bold text-slate-900 text-sm">
                        ₹{doctor.consultationFee}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card footer CTA */}
                <div className="p-3 bg-slate-50 border-t border-slate-100 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => triggerSelectDoctor(doctor)}
                    className="py-2 px-3 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => triggerBookDirect(doctor)}
                    className="py-2 px-3 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs transition-colors flex items-center justify-center gap-1"
                  >
                    <Calendar className="w-3.5 h-3.5" />
                    Book Slot
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 6. PATIENT TESTIMONIALS */}
      <section className="py-16 sm:py-20 bg-white border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Trusted Patient Stories</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              Real Care Experiences
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              See what verified patients say about their consultations and smooth booking experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map((t, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-400 mb-3">
                    {[...Array(t.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400" />
                    ))}
                    <span className="ml-2 text-xs font-semibold text-slate-500 px-2 py-0.5 rounded bg-white border border-slate-200">
                      {t.tag}
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                    "{t.quote}"
                  </p>
                </div>

                <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-200/60">
                  <img
                    src={t.avatar}
                    alt={t.name}
                    className="w-10 h-10 rounded-full object-cover border border-slate-200"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{t.name}</h4>
                    <p className="text-[11px] text-slate-500">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 7. FREQUENTLY ASKED QUESTIONS */}
      <section className="py-16 sm:py-20 bg-slate-50 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Got Questions?</p>
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1 tracking-tight">
              Frequently Asked Questions
            </h2>
            <p className="text-sm text-slate-500 mt-1.5">
              Everything you need to know about booking, rescheduling, security, and telemedicine.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, index) => (
              <div
                key={index}
                className="bg-white rounded-xl border border-slate-200/80 overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaqIndex(openFaqIndex === index ? null : index)}
                  className="w-full px-5 py-4 text-left flex items-center justify-between font-semibold text-slate-900 hover:text-teal-700 text-sm sm:text-base cursor-pointer"
                >
                  <span>{faq.question}</span>
                  <ChevronDown 
                    className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                      openFaqIndex === index ? 'rotate-180 text-teal-600' : ''
                    }`}
                  />
                </button>
                {openFaqIndex === index && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 8. FOOTER */}
      <footer className="bg-slate-900 text-slate-400 py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
            <div>
              <div className="flex items-center gap-2 text-white font-bold text-lg">
                <HeartPulse className="w-5 h-5 text-teal-400" />
                <span>MediBook Health</span>
              </div>
              <p className="text-xs text-slate-400 mt-3 leading-relaxed">
                Full-stack healthcare appointment booking platform with real-time slot synchronization, 
                verified doctor credentials, and HIPAA-ready telemedicine architecture.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-teal-400 border border-slate-700">
                  MERN Architecture
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-slate-800 text-teal-400 border border-slate-700">
                  React 19 + Node.js
                </span>
              </div>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Departments</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => triggerFindDoctor('Cardiology')} className="hover:text-white transition-colors cursor-pointer">Cardiology</button></li>
                <li><button onClick={() => triggerFindDoctor('Dermatology')} className="hover:text-white transition-colors cursor-pointer">Dermatology</button></li>
                <li><button onClick={() => triggerFindDoctor('Orthopedics')} className="hover:text-white transition-colors cursor-pointer">Orthopedics</button></li>
                <li><button onClick={() => triggerFindDoctor('Pediatrics')} className="hover:text-white transition-colors cursor-pointer">Pediatrics</button></li>
                <li><button onClick={() => triggerFindDoctor('Neurology')} className="hover:text-white transition-colors cursor-pointer">Neurology</button></li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Portal Perspectives</h4>
              <ul className="space-y-2 text-xs">
                <li><span className="text-teal-400 font-medium">Patient Dashboard:</span> Booking & Video Rooms</li>
                <li><span className="text-blue-400 font-medium">Doctor Console:</span> Schedule & Digital Rx</li>
                <li><span className="text-purple-400 font-medium">Admin Ops:</span> Credential Review & Analytics</li>
                <li><span className="text-indigo-400 font-medium">API Explorer:</span> Live REST endpoint tests</li>
              </ul>
            </div>

            <div>
              <h4 className="text-xs font-semibold text-white uppercase tracking-wider mb-3">Medical Disclaimer</h4>
              <p className="text-[11px] text-slate-500 leading-relaxed">
                MediBook is a technology booking platform. In case of acute medical emergencies, immediately contact local emergency services (112 or 911) or visit the nearest hospital emergency ward.
              </p>
              <div className="mt-3 flex items-center justify-between">
                <span className="text-[11px] text-slate-400 font-semibold">Toll-Free: 1800-MED-BOOK</span>
                {onOpenEmergencyCare && (
                  <button
                    onClick={onOpenEmergencyCare}
                    className="text-[11px] font-bold text-rose-400 hover:text-rose-300 underline cursor-pointer"
                  >
                    Open 24x7 SOS
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
            <p>© {new Date().getFullYear()} MediBook Systems Inc. Placement & Portfolio Edition.</p>
            <div className="flex items-center gap-4">
              <span>JWT Authentication</span>
              <span>•</span>
              <span>MongoDB / Mongoose Schema</span>
              <span>•</span>
              <span>Real-Time Slot Engine</span>
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
