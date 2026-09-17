import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Star, 
  MapPin, 
  Calendar, 
  Video, 
  Stethoscope, 
  Clock, 
  X, 
  ChevronRight, 
  CheckCircle2, 
  SlidersHorizontal,
  ArrowUpDown
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { INITIAL_SPECIALIZATIONS } from '../data/mockData';
import { Doctor } from '../types';

interface DoctorDiscoveryPageProps {
  initialSpecialty?: string;
  initialQuery?: string;
  onSelectDoctor: (doctor: Doctor) => void;
  onBookDoctor: (doctor: Doctor) => void;
}

export const DoctorDiscoveryPage: React.FC<DoctorDiscoveryPageProps> = ({
  initialSpecialty,
  initialQuery,
  onSelectDoctor,
  onBookDoctor,
}) => {
  const { doctors } = useApp();

  // Filter States
  const [searchQuery, setSearchQuery] = useState(initialQuery || '');
  const [selectedSpecialty, setSelectedSpecialty] = useState(initialSpecialty || '');
  const [consultationType, setConsultationType] = useState<'all' | 'video' | 'in-person'>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<'all' | 'today' | 'tomorrow'>('all');
  const [minRating, setMinRating] = useState<number>(0);
  const [maxFee, setMaxFee] = useState<number>(2000);
  const [sortBy, setSortBy] = useState<'recommended' | 'rating' | 'experience' | 'fee-asc'>('recommended');
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Filtered and Sorted Doctors
  const filteredDoctors = useMemo(() => {
    return doctors.filter(doctor => {
      // Only show approved doctors
      if (doctor.approvalStatus !== 'approved') return false;

      // Text search in name, clinic, location, specialization, bio
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesName = doctor.name.toLowerCase().includes(query);
        const matchesSpec = doctor.specialization.toLowerCase().includes(query);
        const matchesClinic = doctor.clinic.toLowerCase().includes(query);
        const matchesLocation = doctor.location.toLowerCase().includes(query);
        const matchesBio = doctor.bio.toLowerCase().includes(query);
        if (!matchesName && !matchesSpec && !matchesClinic && !matchesLocation && !matchesBio) {
          return false;
        }
      }

      // Specialization
      if (selectedSpecialty && doctor.specialization !== selectedSpecialty) {
        return false;
      }

      // Consultation Type
      if (consultationType !== 'all') {
        if (!doctor.consultationTypes.includes(consultationType)) return false;
      }

      // Availability
      if (availabilityFilter === 'today' && !doctor.availableToday) return false;
      if (availabilityFilter === 'tomorrow' && !doctor.availableTomorrow) return false;

      // Rating
      if (minRating > 0 && doctor.rating < minRating) return false;

      // Max Fee
      if (doctor.consultationFee > maxFee) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'fee-asc') return a.consultationFee - b.consultationFee;
      return 0; // default recommended
    });
  }, [doctors, searchQuery, selectedSpecialty, consultationType, availabilityFilter, minRating, maxFee, sortBy]);

  const activeFilterCount = (selectedSpecialty ? 1 : 0) + 
    (consultationType !== 'all' ? 1 : 0) + 
    (availabilityFilter !== 'all' ? 1 : 0) + 
    (minRating > 0 ? 1 : 0) + 
    (maxFee < 2000 ? 1 : 0);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedSpecialty('');
    setConsultationType('all');
    setAvailabilityFilter('all');
    setMinRating(0);
    setMaxFee(2000);
    setSortBy('recommended');
  };

  return (
    <div className="bg-slate-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Breadcrumb & Title */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-teal-700 uppercase tracking-wider">Directory</p>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-1">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Find Healthcare Specialists
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1">
                Showing {filteredDoctors.length} verified doctors ready for booking
              </p>
            </div>

            {/* Mobile Filter Toggle Button */}
            <button
              onClick={() => setIsMobileFiltersOpen(!isMobileFiltersOpen)}
              className="lg:hidden inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-teal-600" />
              <span>Filters {activeFilterCount > 0 && `(${activeFilterCount})`}</span>
            </button>
          </div>
        </div>

        {/* Top Search & Sort Bar */}
        <div className="bg-white p-3 rounded-2xl border border-slate-200/80 shadow-xs mb-6 flex flex-col md:flex-row gap-3 items-center justify-between">
          <div className="relative w-full md:w-96 flex items-center px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/80 focus-within:border-teal-500 focus-within:bg-white transition-all">
            <Search className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor, clinic, symptom..."
              className="w-full text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 bg-transparent focus:outline-hidden"
              id="search-doctors-input"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery('')} className="p-1 text-slate-400 hover:text-slate-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
              <span className="hidden sm:inline font-medium">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-slate-50 border border-slate-200/80 rounded-lg px-2.5 py-1.5 text-xs text-slate-800 font-semibold focus:outline-hidden cursor-pointer"
                id="doctor-sort-select"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Highest Rating</option>
                <option value="experience">Years of Experience</option>
                <option value="fee-asc">Consultation Fee: Low to High</option>
              </select>
            </div>
          </div>
        </div>

        {/* Main Grid: Filters Sidebar + Doctor Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* SIDEBAR FILTERS (Desktop & Responsive Mobile) */}
          <aside className={`lg:col-span-4 ${isMobileFiltersOpen ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-6 sticky top-24">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2 font-bold text-sm text-slate-900">
                  <Filter className="w-4 h-4 text-teal-600" />
                  <span>Refine Results</span>
                </div>
                {activeFilterCount > 0 && (
                  <button
                    onClick={handleResetFilters}
                    className="text-xs text-teal-600 hover:text-teal-700 font-semibold"
                  >
                    Reset all ({activeFilterCount})
                  </button>
                )}
              </div>

              {/* Specialization Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Specialization
                </label>
                <select
                  value={selectedSpecialty}
                  onChange={(e) => setSelectedSpecialty(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs sm:text-sm text-slate-900 focus:border-teal-500 focus:outline-hidden"
                  id="filter-specialty-select"
                >
                  <option value="">All Specialties</option>
                  {INITIAL_SPECIALIZATIONS.map(s => (
                    <option key={s.id} value={s.name}>{s.name} ({s.doctorCount})</option>
                  ))}
                </select>
              </div>

              {/* Consultation Type */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Consultation Mode
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl">
                  <button
                    type="button"
                    onClick={() => setConsultationType('all')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium transition-colors ${
                      consultationType === 'all' ? 'bg-white text-slate-900 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    All Modes
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('video')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                      consultationType === 'video' ? 'bg-white text-blue-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Video className="w-3 h-3" />
                    Video
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('in-person')}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors ${
                      consultationType === 'in-person' ? 'bg-white text-emerald-700 shadow-2xs font-semibold' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Stethoscope className="w-3 h-3" />
                    In-Clinic
                  </button>
                </div>
              </div>

              {/* Availability Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Availability
                </label>
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg">
                    <input
                      type="radio"
                      name="availability"
                      checked={availabilityFilter === 'all'}
                      onChange={() => setAvailabilityFilter('all')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Any Day</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg">
                    <input
                      type="radio"
                      name="availability"
                      checked={availabilityFilter === 'today'}
                      onChange={() => setAvailabilityFilter('today')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Available Today</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer p-1.5 hover:bg-slate-50 rounded-lg">
                    <input
                      type="radio"
                      name="availability"
                      checked={availabilityFilter === 'tomorrow'}
                      onChange={() => setAvailabilityFilter('tomorrow')}
                      className="text-teal-600 focus:ring-teal-500"
                    />
                    <span>Available Tomorrow</span>
                  </label>
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Minimum Rating
                </label>
                <div className="flex gap-2">
                  {[0, 4.5, 4.8].map((ratingVal) => (
                    <button
                      key={ratingVal}
                      type="button"
                      onClick={() => setMinRating(ratingVal)}
                      className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-medium border transition-colors flex items-center justify-center gap-1 ${
                        minRating === ratingVal 
                          ? 'border-amber-400 bg-amber-50 text-amber-900 font-semibold' 
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {ratingVal === 0 ? (
                        'All'
                      ) : (
                        <>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{ratingVal}+</span>
                        </>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Max Consultation Fee Slider */}
              <div>
                <div className="flex justify-between text-xs mb-1.5">
                  <label className="font-bold text-slate-700 uppercase tracking-wider">
                    Max Consultation Fee
                  </label>
                  <span className="font-bold text-slate-900">₹{maxFee}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="2000"
                  step="100"
                  value={maxFee}
                  onChange={(e) => setMaxFee(Number(e.target.value))}
                  className="w-full accent-teal-600"
                  id="fee-slider"
                />
                <div className="flex justify-between text-[10px] text-slate-400 mt-1">
                  <span>₹500</span>
                  <span>₹1,200</span>
                  <span>₹2,000</span>
                </div>
              </div>

            </div>
          </aside>

          {/* DOCTOR RESULTS LIST */}
          <main className="lg:col-span-8 space-y-4">
            
            {/* Active Filters Bar */}
            {activeFilterCount > 0 && (
              <div className="flex flex-wrap items-center gap-1.5 text-xs">
                <span className="text-slate-500 font-medium">Active filters:</span>
                {selectedSpecialty && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {selectedSpecialty}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setSelectedSpecialty('')} />
                  </span>
                )}
                {consultationType !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {consultationType === 'video' ? 'Video Consult' : 'In-Clinic'}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setConsultationType('all')} />
                  </span>
                )}
                {availabilityFilter !== 'all' && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    {availabilityFilter === 'today' ? 'Available Today' : 'Available Tomorrow'}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setAvailabilityFilter('all')} />
                  </span>
                )}
                {minRating > 0 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                    Rating {minRating}+
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setMinRating(0)} />
                  </span>
                )}
                {maxFee < 2000 && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-teal-50 text-teal-800 border border-teal-200">
                    Up to ₹{maxFee}
                    <X className="w-3 h-3 cursor-pointer" onClick={() => setMaxFee(2000)} />
                  </span>
                )}
                <button
                  onClick={handleResetFilters}
                  className="text-teal-700 hover:underline font-semibold ml-2"
                >
                  Clear all
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredDoctors.length === 0 ? (
              <div className="bg-white p-12 rounded-2xl border border-slate-200 text-center">
                <Stethoscope className="w-12 h-12 text-slate-300 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-slate-900">No matching healthcare specialists found</h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
                  Try widening your search terms, changing the specialization filter, or adjusting your price ceiling.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-5 px-4 py-2 rounded-xl bg-teal-600 text-white text-xs font-semibold hover:bg-teal-700 transition-colors"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredDoctors.map((doctor) => (
                <div
                  key={doctor.id}
                  className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-md hover:border-teal-200 transition-all"
                  id={`doctor-listing-card-${doctor.id}`}
                >
                  <div className="flex flex-col sm:flex-row gap-5 items-start">
                    
                    {/* Doctor Avatar */}
                    <div className="relative shrink-0">
                      <img
                        src={doctor.image}
                        alt={doctor.name}
                        className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover border border-slate-200 shadow-xs"
                      />
                      {doctor.availableToday && (
                        <span className="absolute -bottom-2 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                          Today
                        </span>
                      )}
                    </div>

                    {/* Doctor Info */}
                    <div className="flex-1 min-w-0">
                      
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-100">
                          {doctor.specialization}
                        </span>
                        <span className="inline-flex items-center text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Verified Specialist
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs font-medium text-slate-500">{doctor.experienceYears} Years Experience</span>
                      </div>

                      <h2 
                        onClick={() => onSelectDoctor(doctor)}
                        className="text-lg font-bold text-slate-900 hover:text-teal-600 transition-colors cursor-pointer"
                      >
                        {doctor.name}
                      </h2>

                      <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                        {doctor.qualification}
                      </p>

                      <div className="flex items-center gap-2 mt-2">
                        <div className="flex items-center gap-1 text-xs font-bold text-slate-900">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          <span>{doctor.rating}</span>
                        </div>
                        <span className="text-xs text-slate-400">({doctor.reviewCount} verified reviews)</span>
                        <span className="text-xs text-slate-300">•</span>
                        <span className="text-xs text-slate-600">{doctor.hospitalAffiliation}</span>
                      </div>

                      <div className="mt-3 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                        <div className="flex items-center gap-1.5 text-xs text-slate-500">
                          <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate">{doctor.clinic}, {doctor.location}</span>
                        </div>

                        <div className="flex items-center gap-1.5">
                          {doctor.consultationTypes.includes('video') && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-blue-50 text-blue-700">
                              <Video className="w-3 h-3" /> Video
                            </span>
                          )}
                          {doctor.consultationTypes.includes('in-person') && (
                            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-emerald-50 text-emerald-700">
                              <Stethoscope className="w-3 h-3" /> In-Clinic
                            </span>
                          )}
                        </div>
                      </div>

                    </div>

                    {/* Pricing & Booking CTA */}
                    <div className="w-full sm:w-44 pt-4 sm:pt-0 sm:border-l border-slate-100 sm:pl-5 flex flex-col justify-between self-stretch shrink-0">
                      <div>
                        <p className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">Consultation Fee</p>
                        <p className="text-xl font-black text-slate-900 mt-0.5">₹{doctor.consultationFee}</p>
                        <div className="mt-2 text-[11px] text-teal-700 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{doctor.availableToday ? 'Next: Today 3:30 PM' : 'Next: Tomorrow 10:00 AM'}</span>
                        </div>
                      </div>

                      <div className="space-y-2 mt-4">
                        <button
                          onClick={() => onBookDoctor(doctor)}
                          className="w-full py-2.5 px-3 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                        >
                          <Calendar className="w-3.5 h-3.5" />
                          <span>Book Slot</span>
                        </button>
                        <button
                          onClick={() => onSelectDoctor(doctor)}
                          className="w-full py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-xs font-medium text-slate-700 transition-colors cursor-pointer"
                        >
                          View Full Profile
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              ))
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
