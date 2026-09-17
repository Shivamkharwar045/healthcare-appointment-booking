import React, { useState, useRef, useEffect } from 'react';
import { 
  HeartHandshake, 
  Search, 
  Calendar, 
  User as UserIcon, 
  Bell, 
  CheckCircle, 
  Clock, 
  X, 
  Code, 
  Stethoscope, 
  ShieldCheck, 
  Activity,
  Menu,
  ChevronDown,
  Sparkles,
  PhoneCall
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { UserRole } from '../types';

interface NavbarProps {
  currentPage?: string;
  currentTab?: string;
  onNavigate?: (page: 'landing' | 'doctors' | 'patient-dashboard' | 'doctor-dashboard' | 'admin-dashboard' | 'api-specs') => void;
  setCurrentTab?: (tab: string) => void;
  onOpenBooking: () => void;
  onOpenSymptomChecker?: () => void;
  onOpenEmergencyCare?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  currentPage,
  currentTab, 
  onNavigate,
  setCurrentTab, 
  onOpenBooking,
  onOpenSymptomChecker,
  onOpenEmergencyCare,
}) => {
  const activeTab = currentPage || currentTab || 'landing';
  const handleNavClick = (tab: string) => {
    const target = tab === 'resume-showcase' ? 'api-specs' : (tab as any);
    if (onNavigate) onNavigate(target);
    if (setCurrentTab) setCurrentTab(target);
  };
  const { 
    currentUser, 
    currentRole, 
    switchUserRole, 
    notifications, 
    unreadNotificationCount, 
    markNotificationAsRead,
    markAllNotificationsAsRead
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleMenuOpen, setIsRoleMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setIsNotifOpen(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setIsRoleMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const userNotifications = notifications.filter(n => n.userId === currentUser.id);

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <div 
            onClick={() => { handleNavClick('landing'); setIsMobileMenuOpen(false); }}
            className="flex items-center gap-3 cursor-pointer group"
            id="brand-logo-btn"
          >
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center shadow-md shadow-teal-600/20 group-hover:scale-105 transition-transform duration-200">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-slate-900 font-display">MediBook</span>
                <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  HEALTHCARE
                </span>
              </div>
              <p className="text-[11px] text-slate-700 hidden sm:block">Verified Doctor Consultations</p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-600">
            <button
              onClick={() => handleNavClick('landing')}
              id="nav-home-btn"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                activeTab === 'landing' ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick('doctors')}
              id="nav-find-doctors-btn"
              className={`px-3.5 py-2 rounded-lg transition-colors ${
                activeTab === 'doctors' ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Find Doctors
            </button>
            
            {/* Role-Specific Portal Button */}
            {currentRole === 'patient' && (
              <button
                onClick={() => handleNavClick('patient-dashboard')}
                id="nav-patient-portal-btn"
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'patient-dashboard' ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Calendar className="w-4 h-4" />
                My Appointments
              </button>
            )}

            {currentRole === 'doctor' && (
              <button
                onClick={() => handleNavClick('doctor-dashboard')}
                id="nav-doctor-portal-btn"
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'doctor-dashboard' ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Stethoscope className="w-4 h-4 text-teal-600" />
                Doctor Console
              </button>
            )}

            {currentRole === 'admin' && (
              <button
                onClick={() => handleNavClick('admin-dashboard')}
                id="nav-admin-portal-btn"
                className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                  activeTab === 'admin-dashboard' ? 'text-teal-700 bg-teal-50 font-semibold' : 'hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-purple-600" />
                Admin Operations
              </button>
            )}

            {/* Architecture / Resume Showcase Tab */}
            <button
              onClick={() => handleNavClick('api-specs')}
              id="nav-showcase-btn"
              className={`px-3.5 py-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                activeTab === 'api-specs' 
                  ? 'text-indigo-700 bg-indigo-50 font-semibold border border-indigo-200' 
                  : 'text-indigo-600 hover:bg-indigo-50/70'
              }`}
            >
              <Code className="w-4 h-4" />
              REST API & Resume Specs
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="flex items-center gap-2.5">

            {/* 1-Click Role Switcher */}
            <div className="relative" ref={roleRef}>
              <button
                onClick={() => setIsRoleMenuOpen(!isRoleMenuOpen)}
                id="role-switcher-dropdown-btn"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 bg-slate-50/80 text-xs font-medium text-slate-700 transition-all shadow-2xs"
                title="Switch demo role to preview Patient, Doctor, or Admin experience"
              >
                <span className={`w-2 h-2 rounded-full ${
                  currentRole === 'patient' ? 'bg-teal-500' :
                  currentRole === 'doctor' ? 'bg-blue-500' : 'bg-purple-500'
                }`} />
                <span className="capitalize hidden sm:inline text-slate-500">Demo Role:</span>
                <span className="font-semibold text-slate-900 capitalize">{currentRole}</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {isRoleMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-slate-200/90 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3.5 py-1.5 border-b border-slate-100">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">Switch Demo Perspective</p>
                    <p className="text-xs text-slate-500 mt-0.5">Test full capabilities across all 3 personas:</p>
                  </div>
                  
                  <div className="p-1 space-y-0.5">
                    <button
                      onClick={() => { switchUserRole('patient'); handleNavClick('patient-dashboard'); setIsRoleMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs ${
                        currentRole === 'patient' ? 'bg-teal-50 text-teal-800 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                      id="role-select-patient"
                    >
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4 text-teal-600" />
                        <div>
                          <p className="font-medium">Patient View</p>
                          <p className="text-[10px] text-slate-500">Rahul Sharma (Bookings & Video)</p>
                        </div>
                      </div>
                      {currentRole === 'patient' && <CheckCircle className="w-3.5 h-3.5 text-teal-600" />}
                    </button>

                    <button
                      onClick={() => { switchUserRole('doctor'); handleNavClick('doctor-dashboard'); setIsRoleMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs ${
                        currentRole === 'doctor' ? 'bg-blue-50 text-blue-800 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                      id="role-select-doctor"
                    >
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4 text-blue-600" />
                        <div>
                          <p className="font-medium">Doctor Console</p>
                          <p className="text-[10px] text-slate-500">Dr. Priya Patel (Schedule & Rx)</p>
                        </div>
                      </div>
                      {currentRole === 'doctor' && <CheckCircle className="w-3.5 h-3.5 text-blue-600" />}
                    </button>

                    <button
                      onClick={() => { switchUserRole('admin'); handleNavClick('admin-dashboard'); setIsRoleMenuOpen(false); }}
                      className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-left text-xs ${
                        currentRole === 'admin' ? 'bg-purple-50 text-purple-800 font-semibold' : 'hover:bg-slate-50 text-slate-700'
                      }`}
                      id="role-select-admin"
                    >
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-purple-600" />
                        <div>
                          <p className="font-medium">Admin Operations</p>
                          <p className="text-[10px] text-slate-500">Dr. Alok Nath (Verify Doctors & KPIs)</p>
                        </div>
                      </div>
                      {currentRole === 'admin' && <CheckCircle className="w-3.5 h-3.5 text-purple-600" />}
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications Bell */}
            <div className="relative" ref={notifRef}>
              <button
                onClick={() => setIsNotifOpen(!isNotifOpen)}
                id="notifications-btn"
                className="relative p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                aria-label="View notifications"
              >
                <Bell className="w-5 h-5" />
                {unreadNotificationCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                    {unreadNotificationCount}
                  </span>
                )}
              </button>

              {isNotifOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200/90 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h4 className="text-sm font-semibold text-slate-900">Notifications</h4>
                      <p className="text-xs text-slate-500">Real-time alerts for {currentUser.name}</p>
                    </div>
                    {unreadNotificationCount > 0 && (
                      <button
                        onClick={markAllNotificationsAsRead}
                        className="text-xs font-medium text-teal-600 hover:text-teal-700"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-80 overflow-y-auto divide-y divide-slate-100">
                    {userNotifications.length === 0 ? (
                      <div className="p-6 text-center text-sm text-slate-500">
                        <Clock className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        No notifications yet.
                      </div>
                    ) : (
                      userNotifications.map(n => (
                        <div 
                          key={n.id} 
                          onClick={() => markNotificationAsRead(n.id)}
                          className={`p-3.5 hover:bg-slate-50 transition-colors cursor-pointer text-left ${
                            !n.read ? 'bg-teal-50/40' : ''
                          }`}
                        >
                          <div className="flex items-start gap-2.5">
                            <span className={`w-2 h-2 mt-1.5 rounded-full shrink-0 ${!n.read ? 'bg-teal-600' : 'bg-transparent'}`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-xs font-semibold text-slate-900">{n.title}</p>
                              <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{n.message}</p>
                              <span className="text-[10px] text-slate-400 mt-1 block">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* AI Clinical Symptom Triage Quick Trigger */}
            {onOpenSymptomChecker && (
              <button
                onClick={onOpenSymptomChecker}
                id="top-symptom-checker-btn"
                className="hidden xl:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-teal-200 bg-teal-50/70 hover:bg-teal-100 text-teal-800 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                title="AI Clinical Symptom Checker & Specialty Match"
              >
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                <span>AI Triage</span>
              </button>
            )}

            {/* 24x7 SOS Emergency Services */}
            {onOpenEmergencyCare && (
              <button
                onClick={onOpenEmergencyCare}
                id="top-sos-btn"
                className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-bold transition-all shadow-2xs cursor-pointer"
                title="24x7 Emergency Trauma & Ambulance Locator"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span className="hidden sm:inline">24x7 SOS</span>
                <span className="sm:hidden font-black">SOS</span>
              </button>
            )}

            {/* Quick Book Appointment CTA */}
            <button
              onClick={onOpenBooking}
              id="top-book-appointment-btn"
              className="hidden lg:flex items-center gap-1.5 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-sm hover:shadow transition-all"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Appointment
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              id="mobile-menu-toggle"
              className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-2">
          <button
            onClick={() => { handleNavClick('landing'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'landing' ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
            }`}
          >
            Home
          </button>
          <button
            onClick={() => { handleNavClick('doctors'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'doctors' ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
            }`}
          >
            Find Doctors
          </button>
          <button
            onClick={() => { handleNavClick('patient-dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'patient-dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
            }`}
          >
            Patient Dashboard
          </button>
          <button
            onClick={() => { handleNavClick('doctor-dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'doctor-dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
            }`}
          >
            Doctor Console
          </button>
          <button
            onClick={() => { handleNavClick('admin-dashboard'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'admin-dashboard' ? 'bg-teal-50 text-teal-700' : 'text-slate-700'
            }`}
          >
            Admin Operations
          </button>
          <button
            onClick={() => { handleNavClick('api-specs'); setIsMobileMenuOpen(false); }}
            className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium ${
              activeTab === 'api-specs' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-indigo-600'
            }`}
          >
            REST API & Resume Specs
          </button>
          
          <div className="pt-2 space-y-2">
            {onOpenSymptomChecker && (
              <button
                onClick={() => { onOpenSymptomChecker(); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 rounded-lg bg-teal-50 border border-teal-200 text-teal-800 text-center font-semibold text-sm flex items-center justify-center gap-2"
              >
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>AI Clinical Symptom Checker</span>
              </button>
            )}

            {onOpenEmergencyCare && (
              <button
                onClick={() => { onOpenEmergencyCare(); setIsMobileMenuOpen(false); }}
                className="w-full py-2.5 px-4 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-center font-bold text-sm flex items-center justify-center gap-2"
              >
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                <span>24x7 Emergency Trauma & Ambulance</span>
              </button>
            )}

            <button
              onClick={() => { onOpenBooking(); setIsMobileMenuOpen(false); }}
              className="w-full py-2.5 px-4 rounded-lg bg-teal-600 text-white text-center font-semibold text-sm shadow-xs"
            >
              Book New Appointment
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
