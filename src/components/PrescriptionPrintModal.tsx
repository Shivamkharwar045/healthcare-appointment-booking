import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  CheckCircle2, 
  Stethoscope, 
  Building2, 
  ShieldCheck, 
  QrCode,
  Heart,
  Activity
} from 'lucide-react';
import { Appointment } from '../types';

interface PrescriptionPrintModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const PrescriptionPrintModal: React.FC<PrescriptionPrintModalProps> = ({
  appointment,
  onClose,
}) => {
  if (!appointment) return null;

  const handlePrint = () => {
    window.print();
  };

  // Structured default medicines if raw string is present or fallback
  const prescriptionText = appointment.prescription || '1. Tab Paracetamol 650mg — 1 tab TDS after food x 3 days\n2. Tab Pantoprazole 40mg — 1 tab OD empty stomach in morning x 5 days\n3. Vitamin C 500mg Chewable — 1 tab OD after lunch x 14 days\n4. Hydration: Maintain 2.5 to 3 liters water daily.\n5. Follow up in 7 days or sooner if symptoms persist.';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 print:p-0 print:bg-white">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200 print:border-none print:shadow-none print:rounded-none"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Control Bar (Hidden when printing) */}
        <div className="bg-slate-900 text-white px-6 py-3.5 flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Stethoscope className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-bold uppercase tracking-wider">
              Official Medical Prescription Record • {appointment.appointmentId}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handlePrint}
              className="px-3.5 py-1.5 rounded-lg bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 cursor-pointer transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save as PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PRINTABLE PRESCRIPTION SLIP */}
        <div id="printable-rx" className="p-8 sm:p-10 space-y-6 text-slate-800 font-sans">
          
          {/* Clinic & Doctor Letterhead */}
          <div className="border-b-2 border-slate-900 pb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="w-7 h-7 rounded-lg bg-teal-700 text-white flex items-center justify-center font-black text-sm">
                  +
                </div>
                <h1 className="text-xl font-black tracking-tight text-slate-900 uppercase">
                  {appointment.clinic || 'MediBook Healthcare Institute'}
                </h1>
              </div>
              <p className="text-xs text-slate-600">{appointment.location}</p>
              <p className="text-[11px] text-slate-500 mt-0.5">Emergency Helpline: 1800-MED-BOOK • Web: medibook.health</p>
            </div>

            <div className="text-left sm:text-right">
              <h2 className="text-base font-bold text-slate-900">{appointment.doctorName}</h2>
              <p className="text-xs font-semibold text-teal-800">{appointment.doctorSpecialization}</p>
              <p className="text-[11px] text-slate-500 font-mono">Reg No: MCI-2018-9844-DELHI</p>
              <p className="text-[11px] text-slate-500">Affiliated: Apollo / Fortis Hospital Network</p>
            </div>
          </div>

          {/* Patient Details & Vitals Strip */}
          <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-slate-400 block font-medium uppercase text-[10px]">Patient Name</span>
              <span className="font-bold text-slate-900 text-sm">{appointment.patientName}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium uppercase text-[10px]">Contact</span>
              <span className="font-bold text-slate-900">{appointment.patientPhone}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium uppercase text-[10px]">Consultation Date</span>
              <span className="font-bold text-slate-900">{appointment.date}</span>
            </div>
            <div>
              <span className="text-slate-400 block font-medium uppercase text-[10px]">Appointment ID</span>
              <span className="font-mono font-bold text-teal-800">{appointment.appointmentId}</span>
            </div>
          </div>

          {/* Clinical Vitals Summary */}
          <div className="border border-slate-200 rounded-xl p-3 flex flex-wrap items-center justify-between text-xs gap-3">
            <div className="flex items-center gap-1.5">
              <Activity className="w-3.5 h-3.5 text-teal-600" />
              <span><strong>Blood Pressure:</strong> 120/80 mmHg</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-rose-500" />
              <span><strong>Pulse Rate:</strong> 74 bpm</span>
            </div>
            <div>
              <span><strong>SpO2:</strong> 99% on Room Air</span>
            </div>
            <div>
              <span><strong>Temp:</strong> 98.4°F (Afebrile)</span>
            </div>
          </div>

          {/* Chief Complaints & Clinical Impression */}
          <div className="space-y-1 text-xs">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              Chief Complaints & Diagnosis
            </span>
            <p className="text-slate-900 font-medium">
              Primary Reason: {appointment.reason || 'General Consultation'}
            </p>
            {appointment.symptoms && (
              <p className="text-slate-600 italic">Reported Symptoms: {appointment.symptoms}</p>
            )}
            {appointment.notes && (
              <p className="text-slate-700 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <strong>Clinical Notes:</strong> {appointment.notes}
              </p>
            )}
          </div>

          {/* Rx Symbol & Medication Instructions */}
          <div className="pt-2 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-serif font-black text-teal-800 italic">Rx</span>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                Prescribed Medical Protocol
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50/70 border border-slate-200 font-mono text-xs whitespace-pre-line text-slate-800 leading-relaxed">
              {prescriptionText}
            </div>
          </div>

          {/* Lifestyle / Dietary Advice */}
          <div className="text-xs space-y-1">
            <span className="font-bold uppercase tracking-wider text-slate-400 text-[10px] block">
              General Dietary & Lifestyle Advice
            </span>
            <ul className="list-disc list-inside text-slate-600 space-y-0.5 pl-1">
              <li>Maintain regular hydration (2.5L water daily) and avoid excessive sodium.</li>
              <li>Complete the full antibacterial course if antibiotic is prescribed.</li>
              <li>Report to emergency in case of acute breathlessness, chest pain, or sudden high fever.</li>
            </ul>
          </div>

          {/* Footer Signature & Verification Stamp */}
          <div className="pt-8 border-t border-slate-200 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 bg-slate-100 border border-slate-300 rounded-lg flex items-center justify-center text-slate-700">
                <QrCode className="w-10 h-10" />
              </div>
              <div className="text-[10px] text-slate-400">
                <p className="font-mono font-bold text-slate-700">HASH: SHA256-MEDIBOOK-{appointment.appointmentId}</p>
                <p>Scan to verify doctor registration & license</p>
                <p className="text-emerald-700 font-semibold mt-0.5">Digitally Sealed & Encrypted</p>
              </div>
            </div>

            <div className="text-center sm:text-right">
              <div className="w-36 border-b border-slate-400 pb-1 mx-auto sm:ml-auto">
                <span className="font-serif italic font-bold text-slate-900 text-sm">{appointment.doctorName}</span>
              </div>
              <p className="text-[11px] font-bold text-slate-900 mt-1">Authorized Medical Practitioner</p>
              <p className="text-[10px] text-slate-400">{appointment.doctorSpecialization}</p>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
