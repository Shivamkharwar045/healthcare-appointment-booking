import React from 'react';
import { Stethoscope, Heart, Shield, Phone, Mail, Award, Clock } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'landing' | 'doctors' | 'patient-dashboard' | 'doctor-dashboard' | 'admin-dashboard' | 'api-specs') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-white">
              <div className="w-8 h-8 rounded-xl bg-teal-600 flex items-center justify-center text-white shadow-md">
                <Stethoscope className="w-4 h-4" />
              </div>
              <span className="text-base font-black tracking-tight text-white">
                Medi<span className="text-teal-400">Book</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Enterprise-grade digital healthcare appointment booking platform. Connecting patients with verified medical specialists through real-time availability and encrypted telehealth.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-teal-400 pt-1">
              <Shield className="w-3.5 h-3.5" />
              <span>HIPAA-Ready & ISO 27001 Certified Architecture</span>
            </div>
          </div>

          {/* Patient Quick Links */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Patient Services</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-teal-400 transition-colors">
                  Find a Doctor & Book Slot
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('patient-dashboard')} className="hover:text-teal-400 transition-colors">
                  Patient Health Records & Rx
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('doctors')} className="hover:text-teal-400 transition-colors">
                  Telehealth Video Consultations
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('patient-dashboard')} className="hover:text-teal-400 transition-colors">
                  Reschedule or Cancel Visit
                </button>
              </li>
            </ul>
          </div>

          {/* Portals & Technical Specs */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Provider & Engineering</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('doctor-dashboard')} className="hover:text-teal-400 transition-colors">
                  Doctor Practice Console
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-teal-400 transition-colors">
                  Chief Medical Admin Portal
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('api-specs')} className="hover:text-teal-400 transition-colors flex items-center gap-1 text-teal-400 font-semibold">
                  <span>REST API & Resume Specs</span>
                </button>
              </li>
              <li>
                <span className="text-slate-500">Node.js • Express • MongoDB • JWT</span>
              </li>
            </ul>
          </div>

          {/* Medical Notice & Support */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-200">Emergency & Careline</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              If you are facing a medical emergency, please call <strong>112</strong> or proceed to the nearest emergency room immediately.
            </p>
            <div className="pt-2 text-[11px] space-y-1">
              <p className="flex items-center gap-1.5 text-slate-300">
                <Phone className="w-3.5 h-3.5 text-teal-400" />
                <span>24/7 Patient Helpline: 1800-MED-BOOK</span>
              </p>
              <p className="flex items-center gap-1.5 text-slate-300">
                <Mail className="w-3.5 h-3.5 text-teal-400" />
                <span>support@medibook.health</span>
              </p>
            </div>
          </div>

        </div>

        {/* Bottom copyright line */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[11px] text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} MediBook Health Technologies. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('api-specs')} className="hover:text-teal-400">
              API Documentation
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('landing')} className="hover:text-teal-400">
              Privacy Policy
            </button>
            <span>•</span>
            <button onClick={() => onNavigate('landing')} className="hover:text-teal-400">
              Terms of Medical Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
