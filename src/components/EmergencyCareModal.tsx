import React, { useState } from 'react';
import { 
  X, 
  PhoneCall, 
  AlertTriangle, 
  Navigation, 
  ShieldAlert, 
  HeartHandshake, 
  MapPin, 
  Activity, 
  Clock, 
  CheckCircle2,
  Ambulance,
  Phone
} from 'lucide-react';
import { EMERGENCY_SERVICES } from '../data/mockData';

interface EmergencyCareModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const EmergencyCareModal: React.FC<EmergencyCareModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'hospitals' | 'ambulance' | 'firstaid'>('hospitals');
  const [isDispatching, setIsDispatching] = useState(false);
  const [dispatchedAmbulance, setDispatchedAmbulance] = useState<{
    id: string;
    etaMinutes: number;
    driverName: string;
    vehiclePlate: string;
    status: string;
  } | null>(null);

  if (!isOpen) return null;

  const handleDispatchAmbulance = (hospitalName: string) => {
    setIsDispatching(true);
    setTimeout(() => {
      setIsDispatching(false);
      setDispatchedAmbulance({
        id: `AMB-${Math.floor(100 + Math.random() * 900)}`,
        etaMinutes: 7,
        driverName: 'Vikram Singh (ALS Certified Paramedic)',
        vehiclePlate: 'DL-01-AX-4820',
        status: 'En-route with Advanced Cardiac Life Support (ACLS)',
      });
      setActiveTab('ambulance');
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-rose-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-center transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* SOS Emergency Header Banner */}
        <div className="bg-gradient-to-r from-rose-700 via-rose-600 to-rose-700 p-6 text-white">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/10 text-white flex items-center justify-center border border-white/20 animate-pulse">
              <ShieldAlert className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider bg-white text-rose-800">
                  SOS PRIORITY
                </span>
                <h2 className="text-xl font-black tracking-tight">24x7 Emergency Trauma & Ambulance</h2>
              </div>
              <p className="text-xs text-rose-100 mt-1">
                Real-time trauma hospital locator, ICU bed availability, and instant ambulance dispatch.
              </p>
            </div>
          </div>

          {/* Quick SOS Call Bar */}
          <div className="mt-4 pt-4 border-t border-rose-500/60 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs">
              <PhoneCall className="w-4 h-4 text-rose-200 animate-bounce" />
              <span>National All-Emergency Dispatch: <strong>112</strong></span>
            </div>
            <a
              href="tel:112"
              className="px-4 py-1.5 rounded-xl bg-white hover:bg-rose-50 text-rose-700 text-xs font-black shadow-md flex items-center gap-1.5 transition-colors"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Dial 112 Now</span>
            </a>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-slate-200 flex gap-4 text-xs font-bold">
          <button
            onClick={() => setActiveTab('hospitals')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'hospitals' ? 'border-rose-600 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span>Nearby Trauma Centers</span>
          </button>

          <button
            onClick={() => setActiveTab('ambulance')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'ambulance' ? 'border-rose-600 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Ambulance Dispatch Tracker</span>
          </button>

          <button
            onClick={() => setActiveTab('firstaid')}
            className={`pb-3 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'firstaid' ? 'border-rose-600 text-rose-700' : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5" />
            <span>Life Support Guidelines</span>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[60vh] overflow-y-auto">
          
          {/* TAB 1: NEARBY HOSPITALS */}
          {activeTab === 'hospitals' && (
            <div className="space-y-3">
              {EMERGENCY_SERVICES.map((er) => (
                <div
                  key={er.id}
                  className="p-4 rounded-2xl border border-slate-200 hover:border-rose-300 bg-slate-50/50 hover:bg-rose-50/10 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-sm font-bold text-slate-900">{er.hospitalName}</h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          24x7 Open
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">{er.address}</p>
                      <p className="text-[11px] text-teal-700 font-semibold mt-1">{er.traumaLevel}</p>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-bold text-rose-600 block">{er.distance} away</span>
                      <span className="text-[10px] text-slate-400">ETA ~ 8-12 min</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-200/80 text-xs">
                    <div className="flex items-center gap-3 text-[11px] text-slate-600">
                      <span>ICU Beds: <strong className="text-slate-900">{er.icuBedsAvailable} Available</strong></span>
                      <span>•</span>
                      <span>Oxygen: <strong className="text-emerald-700">Dedicated Supply</strong></span>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={`tel:${er.phone}`}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-slate-700 font-semibold flex items-center gap-1"
                      >
                        <Phone className="w-3 h-3 text-slate-500" />
                        <span>Call ER</span>
                      </a>
                      <button
                        onClick={() => handleDispatchAmbulance(er.hospitalName)}
                        className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-semibold flex items-center gap-1 shadow-xs cursor-pointer"
                      >
                        <Navigation className="w-3 h-3" />
                        <span>Dispatch Ambulance</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: AMBULANCE DISPATCH TRACKER */}
          {activeTab === 'ambulance' && (
            <div className="space-y-4">
              {dispatchedAmbulance ? (
                <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-bold uppercase text-emerald-800">
                        Ambulance Dispatched & In-Transit
                      </span>
                    </div>
                    <span className="font-mono text-xs font-bold text-emerald-700">{dispatchedAmbulance.id}</span>
                  </div>

                  <div className="p-4 bg-white rounded-xl border border-emerald-100 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-500">Estimated Arrival Time (ETA):</span>
                      <span className="text-xl font-black text-rose-600 font-mono">
                        {dispatchedAmbulance.etaMinutes} Minutes
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Paramedic In-Charge:</span>
                      <span className="font-bold text-slate-900">{dispatchedAmbulance.driverName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Vehicle Registration:</span>
                      <span className="font-mono font-bold text-slate-900">{dispatchedAmbulance.vehiclePlate}</span>
                    </div>
                    <div className="pt-2 border-t border-slate-100 text-[11px] text-teal-800 font-medium">
                      Status: {dispatchedAmbulance.status}
                    </div>
                  </div>

                  <p className="text-xs text-slate-600">
                    Keep patient calm in a well-ventilated space. Paramedics have been briefed with patient profile.
                  </p>
                </div>
              ) : (
                <div className="text-center p-8 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
                  <Ambulance className="w-10 h-10 text-slate-400 mx-auto" />
                  <h4 className="text-sm font-bold text-slate-900">No active ambulance dispatch</h4>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Select a nearby trauma center from the list to trigger immediate ACLS emergency dispatch.
                  </p>
                  <button
                    onClick={() => handleDispatchAmbulance('Apollo Central Trauma Center')}
                    disabled={isDispatching}
                    className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-md cursor-pointer transition-all"
                  >
                    {isDispatching ? 'Connecting Dispatcher...' : 'Request Nearest Ambulance (1-Click)'}
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FIRST AID & BASIC LIFE SUPPORT GUIDELINES */}
          {activeTab === 'firstaid' && (
            <div className="space-y-3 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold text-xs">1. Suspected Heart Attack / Acute Angina:</strong>
                <p className="text-slate-600 leading-relaxed">
                  Sit patient in a comfortable W-position (head supported, knees bent). Loosen tight clothing. Call 112 immediately. If conscious and non-allergic, an adult aspirin 300mg can be chewed.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold text-xs">2. Adult CPR (Cardiopulmonary Resuscitation):</strong>
                <p className="text-slate-600 leading-relaxed">
                  Place heel of hand on center of chest. Interlock fingers. Push hard and fast (100–120 compressions per minute to the beat of 'Stayin Alive') at 5–6 cm depth until paramedics arrive.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <strong className="text-slate-900 block font-bold text-xs">3. Severe Bleeding / Trauma:</strong>
                <p className="text-slate-600 leading-relaxed">
                  Apply firm direct pressure with clean cloth or gauze. Elevate wounded limb above heart level if no fracture is suspected. Never remove deep penetrating objects.
                </p>
              </div>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
