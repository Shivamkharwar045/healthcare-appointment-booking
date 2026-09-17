import React, { useState } from 'react';
import { 
  X, 
  Star, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  Video, 
  Stethoscope, 
  Award, 
  Building2, 
  Globe2, 
  MessageSquare, 
  Clock,
  Send
} from 'lucide-react';
import { Doctor } from '../types';
import { useApp } from '../context/AppContext';

interface DoctorProfileModalProps {
  doctor: Doctor | null;
  onClose: () => void;
  onBookAppointment: (doctor: Doctor) => void;
}

export const DoctorProfileModal: React.FC<DoctorProfileModalProps> = ({
  doctor,
  onClose,
  onBookAppointment,
}) => {
  const { reviews, addDoctorReview, currentUser } = useApp();
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewSubmitted, setReviewSubmitted] = useState(false);

  if (!doctor) return null;

  const doctorReviews = reviews.filter(r => r.doctorId === doctor.id);

  const handleReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    addDoctorReview(doctor.id, newRating, newComment);
    setNewComment('');
    setReviewSubmitted(true);
    setTimeout(() => setReviewSubmitted(false), 4000);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Modal Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 border border-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Doctor Header Banner */}
        <div className="bg-gradient-to-r from-teal-800 to-teal-600 p-6 sm:p-8 text-white relative">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5">
            <img
              src={doctor.image}
              alt={doctor.name}
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border-2 border-white/80 shadow-md"
            />
            <div className="text-center sm:text-left">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-xs">
                  {doctor.specialization}
                </span>
                <span className="inline-flex items-center text-xs font-bold text-teal-100 bg-teal-900/50 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="w-3.5 h-3.5 mr-1 text-teal-300" /> Board Certified
                </span>
              </div>

              <h2 className="text-2xl font-black mt-2 tracking-tight">{doctor.name}</h2>
              <p className="text-xs sm:text-sm text-teal-100 mt-1 leading-snug">{doctor.qualification}</p>

              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 mt-3 text-xs text-teal-100">
                <span className="flex items-center gap-1 font-bold text-white bg-black/20 px-2 py-0.5 rounded-md">
                  <Star className="w-3.5 h-3.5 fill-amber-300 text-amber-300" />
                  {doctor.rating} ({doctor.reviewCount} reviews)
                </span>
                <span>•</span>
                <span>{doctor.experienceYears} Years Experience</span>
                <span>•</span>
                <span>Fee: ₹{doctor.consultationFee}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Body Content */}
        <div className="p-6 sm:p-8 space-y-6 max-h-[68vh] overflow-y-auto">
          
          {/* About Bio */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Professional Summary</h3>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">{doctor.bio}</p>
          </div>

          {/* Clinical Affiliations & Clinic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
                <Building2 className="w-4 h-4 text-teal-600" />
                <span>Clinic & Hospital Affiliation</span>
              </div>
              <p className="text-xs font-medium text-slate-800">{doctor.clinic}</p>
              <p className="text-[11px] text-slate-500 mt-1 flex items-start gap-1">
                <MapPin className="w-3 h-3 text-slate-400 shrink-0 mt-0.5" />
                <span>{doctor.address}</span>
              </p>
              <p className="text-[11px] text-teal-700 font-medium mt-2">
                Affiliated: {doctor.hospitalAffiliation}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200/80">
              <div className="flex items-center gap-2 text-xs font-bold text-slate-900 mb-1.5">
                <Clock className="w-4 h-4 text-teal-600" />
                <span>Working Hours & Modes</span>
              </div>
              <p className="text-xs text-slate-700">
                {doctor.workingHours.start} – {doctor.workingHours.end}
              </p>
              <p className="text-[11px] text-slate-500 mt-1">
                Days: {doctor.workingHours.days.join(', ')}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Globe2 className="w-3 h-3 text-slate-400" />
                <span className="text-[11px] text-slate-600">Languages: {doctor.languages.join(', ')}</span>
              </div>
            </div>
          </div>

          {/* Patient Reviews Section */}
          <div className="pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-teal-600" />
                <h3 className="text-sm font-bold text-slate-900">Verified Patient Reviews</h3>
              </div>
              <span className="text-xs font-semibold text-slate-500">{doctorReviews.length} Reviews</span>
            </div>

            <div className="space-y-3">
              {doctorReviews.length === 0 ? (
                <p className="text-xs text-slate-400 italic">No reviews yet for this doctor.</p>
              ) : (
                doctorReviews.map(r => (
                  <div key={r.id} className="p-3.5 rounded-xl bg-slate-50/70 border border-slate-200/70">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">{r.patientName}</span>
                        {r.verifiedBooking && (
                          <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                            Verified Consultation
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-amber-400">
                        {[...Array(r.rating)].map((_, i) => (
                          <Star key={i} className="w-3 h-3 fill-amber-400" />
                        ))}
                      </div>
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">{r.comment}</p>
                    <span className="text-[10px] text-slate-400 mt-1 block">{r.date}</span>
                  </div>
                ))
              )}
            </div>

            {/* Leave a review form */}
            <form onSubmit={handleReviewSubmit} className="mt-4 p-4 rounded-xl border border-dashed border-slate-200 bg-slate-50/40">
              <p className="text-xs font-bold text-slate-700 mb-2">Leave a Consultation Review (Posting as {currentUser.name})</p>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-slate-500">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="p-0.5 text-amber-400 focus:outline-hidden"
                  >
                    <Star className={`w-4 h-4 ${newRating >= star ? 'fill-amber-400' : 'text-slate-300'}`} />
                  </button>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share feedback on diagnosis, wait time, explanation..."
                  className="flex-1 text-xs bg-white border border-slate-200 rounded-lg px-3 py-2 text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
                <button
                  type="submit"
                  disabled={!newComment.trim()}
                  className="px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-semibold flex items-center gap-1"
                >
                  <Send className="w-3 h-3" /> Post
                </button>
              </div>
              {reviewSubmitted && (
                <p className="text-xs text-emerald-600 font-semibold mt-2">
                  Thank you! Your verified review has been published.
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-slate-400 uppercase font-semibold">Standard Consultation Fee</p>
            <p className="text-xl font-black text-slate-900">₹{doctor.consultationFee}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onBookAppointment(doctor);
              }}
              className="px-6 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-md shadow-teal-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Calendar className="w-4 h-4" />
              Book Appointment Now
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
