import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { DoctorDiscoveryPage } from './components/DoctorDiscoveryPage';
import { PatientDashboard } from './components/PatientDashboard';
import { DoctorDashboard } from './components/DoctorDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { ApiAndResumeShowcase } from './components/ApiAndResumeShowcase';
import { BookingModal } from './components/BookingModal';
import { DoctorProfileModal } from './components/DoctorProfileModal';
import { VideoCallModal } from './components/VideoCallModal';
import { SymptomTriageModal } from './components/SymptomTriageModal';
import { EmergencyCareModal } from './components/EmergencyCareModal';
import { Footer } from './components/Footer';
import { Doctor, Appointment } from './types';

function MainLayout() {
  const { currentRole, doctors } = useApp();

  const [currentPage, setCurrentPage] = useState<
    'landing' | 'doctors' | 'patient-dashboard' | 'doctor-dashboard' | 'admin-dashboard' | 'api-specs'
  >('landing');

  // Selected specialty for doctor discovery (e.g. from landing page clicks)
  const [initialSpecialty, setInitialSpecialty] = useState<string>('all');

  // Modals state
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [bookingDoctor, setBookingDoctor] = useState<Doctor | null>(null);

  const [profileModalDoctor, setProfileModalDoctor] = useState<Doctor | null>(null);
  const [videoCallAppointment, setVideoCallAppointment] = useState<Appointment | null>(null);
  const [isSymptomCheckerOpen, setIsSymptomCheckerOpen] = useState(false);
  const [isEmergencyCareOpen, setIsEmergencyCareOpen] = useState(false);

  const handleOpenBooking = (doctor?: Doctor) => {
    setBookingDoctor(doctor || doctors[0] || null);
    setIsBookingOpen(true);
  };

  const handleSelectSpecialtyFromLanding = (spec: string) => {
    setInitialSpecialty(spec);
    setCurrentPage('doctors');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigate = (page: 'landing' | 'doctors' | 'patient-dashboard' | 'doctor-dashboard' | 'admin-dashboard' | 'api-specs') => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 font-sans text-slate-800 selection:bg-teal-100 selection:text-teal-900">
      
      {/* Top Navbar with live role switcher, notifications, AI Triage and SOS buttons */}
      <Navbar
        currentPage={currentPage}
        onNavigate={handleNavigate}
        onOpenBooking={() => handleOpenBooking()}
        onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
        onOpenEmergencyCare={() => setIsEmergencyCareOpen(true)}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentPage === 'landing' && (
          <LandingPage
            onFindDoctor={(spec) => {
              if (spec) setInitialSpecialty(spec);
              setCurrentPage('doctors');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectDoctor={(doc) => setProfileModalDoctor(doc)}
            onBookDirect={(doc) => handleOpenBooking(doc)}
            onExploreDoctors={() => handleNavigate('doctors')}
            onSelectSpecialty={handleSelectSpecialtyFromLanding}
            onOpenBooking={() => handleOpenBooking()}
            onOpenApiSpecs={() => handleNavigate('api-specs')}
            onOpenSymptomChecker={() => setIsSymptomCheckerOpen(true)}
            onOpenEmergencyCare={() => setIsEmergencyCareOpen(true)}
          />
        )}

        {currentPage === 'doctors' && (
          <DoctorDiscoveryPage
            initialSpecialty={initialSpecialty}
            onSelectDoctor={(doc) => setProfileModalDoctor(doc)}
            onBookDoctor={(doc) => handleOpenBooking(doc)}
          />
        )}

        {currentPage === 'patient-dashboard' && (
          <PatientDashboard
            onOpenBooking={() => handleOpenBooking()}
            onJoinVideoCall={(apt) => setVideoCallAppointment(apt)}
            onSelectDoctor={(doc) => setProfileModalDoctor(doc)}
          />
        )}

        {currentPage === 'doctor-dashboard' && (
          <DoctorDashboard
            onJoinVideoCall={(apt) => setVideoCallAppointment(apt)}
          />
        )}

        {currentPage === 'admin-dashboard' && (
          <AdminDashboard />
        )}

        {currentPage === 'api-specs' && (
          <ApiAndResumeShowcase />
        )}
      </main>

      {/* Footer */}
      <Footer onNavigate={handleNavigate} />

      {/* Global 7-Step Appointment Booking Stepper Modal */}
      <BookingModal
        isOpen={isBookingOpen}
        initialDoctor={bookingDoctor}
        onClose={() => {
          setIsBookingOpen(false);
          setBookingDoctor(null);
        }}
        onViewInDashboard={() => {
          setIsBookingOpen(false);
          setCurrentPage('patient-dashboard');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Doctor Detailed Profile & Reviews Modal */}
      <DoctorProfileModal
        doctor={profileModalDoctor}
        onClose={() => setProfileModalDoctor(null)}
        onBookAppointment={(doc) => handleOpenBooking(doc)}
      />

      {/* Real-time Telehealth Video Consultation Room */}
      <VideoCallModal
        appointment={videoCallAppointment}
        onClose={() => setVideoCallAppointment(null)}
      />

      {/* AI Clinical Symptom Checker & Specialist Triage Modal */}
      <SymptomTriageModal
        isOpen={isSymptomCheckerOpen}
        onClose={() => setIsSymptomCheckerOpen(false)}
        onFindSpecialist={(specialty) => {
          setIsSymptomCheckerOpen(false);
          setInitialSpecialty(specialty);
          setCurrentPage('doctors');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 24x7 Emergency Services & Ambulance Tracking Modal */}
      <EmergencyCareModal
        isOpen={isEmergencyCareOpen}
        onClose={() => setIsEmergencyCareOpen(false)}
      />

    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainLayout />
    </AppProvider>
  );
}
