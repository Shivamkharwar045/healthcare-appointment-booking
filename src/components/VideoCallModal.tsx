import React, { useState, useEffect } from 'react';
import { 
  X, 
  Mic, 
  MicOff, 
  Video as VideoIcon, 
  VideoOff, 
  PhoneOff, 
  MessageSquare, 
  FileText, 
  ShieldCheck, 
  Send,
  User,
  Check
} from 'lucide-react';
import { Appointment } from '../types';
import { useApp } from '../context/AppContext';

interface VideoCallModalProps {
  appointment: Appointment | null;
  onClose: () => void;
}

export const VideoCallModal: React.FC<VideoCallModalProps> = ({ appointment, onClose }) => {
  const { completeAppointment, currentUser } = useApp();

  const [isMicOn, setIsMicOn] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [callDuration, setCallDuration] = useState(0);
  const [chatMessages, setChatMessages] = useState<{ sender: string; text: string; time: string }[]>([
    { sender: 'System', text: 'Encrypted Telehealth session established (256-bit AES). Waiting for participants.', time: 'Now' },
  ]);
  const [newChatText, setNewChatText] = useState('');
  const [rxNotes, setRxNotes] = useState(appointment?.prescription || '');
  const [isRxSaved, setIsRxSaved] = useState(false);

  // Call timer
  useEffect(() => {
    if (!appointment) return;
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [appointment]);

  if (!appointment) return null;

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newChatText.trim()) return;
    const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setChatMessages(prev => [...prev, { sender: currentUser.name, text: newChatText, time }]);
    setNewChatText('');
  };

  const handleSavePrescription = () => {
    completeAppointment(appointment.id, appointment.notes, rxNotes);
    setIsRxSaved(true);
    setTimeout(() => setIsRxSaved(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-slate-950 flex flex-col">
      
      {/* Top Header */}
      <div className="bg-slate-900 border-b border-slate-800 px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-teal-600/20 text-teal-400 flex items-center justify-center border border-teal-500/30">
            <VideoIcon className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">Telehealth Consultation: {appointment.doctorName}</h3>
              <span className="text-[10px] font-mono text-teal-400 bg-teal-950/80 px-2 py-0.5 rounded border border-teal-800">
                {appointment.appointmentId}
              </span>
            </div>
            <p className="text-xs text-slate-400">Patient: {appointment.patientName} • Reason: {appointment.reason}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-800 text-xs font-mono text-emerald-400 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{formatTimer(callDuration)}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Video & Workspace Layout */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        
        {/* Main Video Stage */}
        <div className="lg:col-span-8 p-4 flex flex-col justify-between relative bg-slate-900">
          
          {/* Primary Participant Video Stream (Doctor View) */}
          <div className="flex-1 rounded-2xl bg-slate-800/80 border border-slate-700/60 relative overflow-hidden flex items-center justify-center">
            {isVideoOn ? (
              <div className="relative w-full h-full">
                <img
                  src={appointment.doctorImage}
                  alt={appointment.doctorName}
                  className="w-full h-full object-cover opacity-85"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />
                <div className="absolute bottom-4 left-4 text-white">
                  <p className="text-sm font-bold">{appointment.doctorName}</p>
                  <p className="text-xs text-teal-300">{appointment.doctorSpecialization} (Consultant)</p>
                </div>
              </div>
            ) : (
              <div className="text-center text-slate-500">
                <VideoOff className="w-12 h-12 mx-auto mb-2 text-slate-600" />
                <p className="text-sm">Video Feed Paused</p>
              </div>
            )}

            {/* Self PIP View (Patient) */}
            <div className="absolute top-4 right-4 w-32 sm:w-44 h-24 sm:h-32 rounded-xl bg-slate-950 border-2 border-slate-700 overflow-hidden shadow-2xl">
              <div className="w-full h-full flex flex-col items-center justify-center bg-slate-900 text-slate-400 text-center p-2">
                <User className="w-8 h-8 text-slate-600 mb-1" />
                <span className="text-[11px] font-semibold text-white">{appointment.patientName} (You)</span>
                <span className="text-[9px] text-teal-400">Audio Encrypted</span>
              </div>
            </div>

            {/* Security Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-black/50 backdrop-blur-xs text-[11px] text-emerald-400 border border-emerald-500/20">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>HIPAA Compliant Session</span>
            </div>
          </div>

          {/* Call Controls Bar */}
          <div className="py-4 flex items-center justify-center gap-3">
            <button
              onClick={() => setIsMicOn(!isMicOn)}
              className={`p-3.5 rounded-2xl transition-all ${
                isMicOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isMicOn ? 'Mute Microphone' : 'Unmute Microphone'}
            >
              {isMicOn ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setIsVideoOn(!isVideoOn)}
              className={`p-3.5 rounded-2xl transition-all ${
                isVideoOn ? 'bg-slate-800 hover:bg-slate-700 text-white' : 'bg-rose-600 text-white'
              }`}
              title={isVideoOn ? 'Disable Camera' : 'Enable Camera'}
            >
              {isVideoOn ? <VideoIcon className="w-5 h-5" /> : <VideoOff className="w-5 h-5" />}
            </button>

            <button
              onClick={onClose}
              className="px-6 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30 transition-all cursor-pointer"
            >
              <PhoneOff className="w-4 h-4" />
              <span>End Consultation</span>
            </button>
          </div>

        </div>

        {/* Sidebar: Digital Prescription & Live Chat */}
        <div className="lg:col-span-4 bg-slate-900 border-l border-slate-800 flex flex-col justify-between">
          
          {/* Prescription Notes Area */}
          <div className="p-4 border-b border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2 text-teal-400 text-xs font-bold uppercase tracking-wider">
                <FileText className="w-4 h-4" />
                <span>Doctor's Prescription Pad</span>
              </div>
              <button
                onClick={handleSavePrescription}
                className="text-xs px-2.5 py-1 rounded bg-teal-600 hover:bg-teal-700 text-white font-semibold flex items-center gap-1"
              >
                {isRxSaved ? <Check className="w-3 h-3" /> : null}
                <span>{isRxSaved ? 'Saved to Portal' : 'Save Prescription'}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={rxNotes}
              onChange={(e) => setRxNotes(e.target.value)}
              placeholder="e.g. 1. Tab Paracetamol 650mg TDS x 3 days&#10;2. Vitamin C 500mg daily&#10;3. Follow up in 7 days with BP log..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-slate-200 placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500 font-mono"
            />
            <p className="text-[10px] text-slate-500 mt-1">
              Prescription is digitally signed and accessible in Patient Records immediately.
            </p>
          </div>

          {/* Live Chat Box */}
          <div className="flex-1 flex flex-col p-4 min-h-0">
            <div className="flex items-center gap-2 text-slate-400 text-xs font-bold uppercase tracking-wider mb-2">
              <MessageSquare className="w-4 h-4" />
              <span>Session In-Call Chat</span>
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 min-h-[120px]">
              {chatMessages.map((msg, idx) => (
                <div key={idx} className="p-2.5 rounded-lg bg-slate-800/70 border border-slate-700/60 text-xs">
                  <div className="flex justify-between items-center text-[10px] text-slate-400 mb-1">
                    <span className="font-bold text-teal-400">{msg.sender}</span>
                    <span>{msg.time}</span>
                  </div>
                  <p className="text-slate-200 leading-relaxed">{msg.text}</p>
                </div>
              ))}
            </div>

            <form onSubmit={handleSendChat} className="mt-3 flex gap-2">
              <input
                type="text"
                value={newChatText}
                onChange={(e) => setNewChatText(e.target.value)}
                placeholder="Type a clinical question or value..."
                className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-teal-500"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

      </div>

    </div>
  );
};
