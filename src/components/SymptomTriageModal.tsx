import React, { useState } from 'react';
import { 
  X, 
  Sparkles, 
  Activity, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowRight, 
  Stethoscope, 
  HelpCircle, 
  Clock, 
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { SymptomCheckResult } from '../types';

interface SymptomTriageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onFindSpecialist: (specialtyName: string) => void;
}

const PRESET_SYMPTOMS = [
  { label: 'Chest Discomfort / Palpitations', specialty: 'Cardiology', urgency: 'urgent' },
  { label: 'Acne, Eczema or Skin Itching', specialty: 'Dermatology', urgency: 'low' },
  { label: 'Persistent Knee / Back Pain', specialty: 'Orthopedics', urgency: 'moderate' },
  { label: 'Chronic Migraine / Dizziness', specialty: 'Neurology', urgency: 'moderate' },
  { label: 'Child High Fever / Persistent Cough', specialty: 'Pediatrics', urgency: 'urgent' },
  { label: 'Workplace Burnout & Severe Anxiety', specialty: 'Psychiatry & Therapy', urgency: 'moderate' },
  { label: 'Seasonal Viral Fever & Body Aches', specialty: 'General Medicine', urgency: 'low' },
];

export const SymptomTriageModal: React.FC<SymptomTriageModalProps> = ({
  isOpen,
  onClose,
  onFindSpecialist,
}) => {
  const [symptomsInput, setSymptomsInput] = useState('');
  const [duration, setDuration] = useState('2-3 days');
  const [severity, setSeverity] = useState<'Mild' | 'Moderate' | 'Severe'>('Moderate');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [triageResult, setTriageResult] = useState<SymptomCheckResult | null>(null);

  if (!isOpen) return null;

  const handleRunTriage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symptomsInput.trim()) return;

    setIsAnalyzing(true);
    setTriageResult(null);

    setTimeout(() => {
      setIsAnalyzing(false);
      const query = symptomsInput.toLowerCase();

      if (query.includes('chest') || query.includes('heart') || query.includes('palpitation') || query.includes('breath')) {
        setTriageResult({
          triageLevel: 'urgent',
          primaryRecommendation: 'Immediate Comprehensive Cardiovascular Evaluation',
          suggestedSpecialty: 'Cardiology',
          specialtyId: 'cardiology',
          possibleCauses: [
            'Angina Pectoris / Coronary Artery Spasm',
            'Cardiac Arrhythmia or Sinus Tachycardia',
            'Costochondritis / Musculoskeletal Chest Wall Strain',
            'Gastroesophageal Reflux Disease (GERD mimicry)'
          ],
          selfCareAdvice: [
            'Rest immediately in an upright seated position and avoid physical exertion.',
            'Do not consume caffeine, energy drinks, or nicotine.',
            'If accompanied by radiating arm/jaw pain, cold sweat or nausea, call 112 emergency services immediately.'
          ],
          keyQuestionsToAskDoctor: [
            'Is a 12-lead ECG and 2D Echocardiogram advised today?',
            'Should we evaluate cardiac biomarkers (Troponin-I, CK-MB)?',
            'Do my resting blood pressure readings correlate with these symptoms?'
          ],
          redFlagWarnings: ['Radiating pressure to left shoulder', 'Shortness of breath at rest', 'Dizziness or fainting']
        });
      } else if (query.includes('skin') || query.includes('acne') || query.includes('rash') || query.includes('itch') || query.includes('hair')) {
        setTriageResult({
          triageLevel: 'low',
          primaryRecommendation: 'Dermatological Assessment & Topical Protocol',
          suggestedSpecialty: 'Dermatology',
          specialtyId: 'dermatology',
          possibleCauses: [
            'Allergic Contact Dermatitis or Urticaria',
            'Eczema / Atopic Dermatitis flare-up',
            'Hormonal Acne Vulgaris with comedones',
            'Fungal Cutaneous Infection (Tinea)'
          ],
          selfCareAdvice: [
            'Avoid harsh fragranced soaps; use mild non-comedogenic cleansers.',
            'Keep skin barrier hydrated with ceramide-based moisturizers.',
            'Refrain from scratching to prevent secondary bacterial impetiginization.'
          ],
          keyQuestionsToAskDoctor: [
            'Is a patch allergy test or skin scraping recommended?',
            'What active topical ingredients (retinoids, azelaic acid, corticosteroids) are safe for my skin barrier?',
            'Are dietary triggers contributing to these recurring flare-ups?'
          ]
        });
      } else if (query.includes('knee') || query.includes('back') || query.includes('joint') || query.includes('spine') || query.includes('bone') || query.includes('neck')) {
        setTriageResult({
          triageLevel: 'moderate',
          primaryRecommendation: 'Orthopedic & Musculoskeletal Examination',
          suggestedSpecialty: 'Orthopedics',
          specialtyId: 'orthopedics',
          possibleCauses: [
            'Lumbar / Cervical Disc Bulge or Radiculopathy',
            'Osteoarthritis / Cartilage wear & tear',
            'Ligamentous sprain or postural myofascial syndrome',
            'Inflammatory arthropathy / Early tendonitis'
          ],
          selfCareAdvice: [
            'Apply ice therapy for acute inflammation (20 mins, 3 times daily).',
            'Maintain ergonomic spinal posture and avoid heavy lifting or prolonged sitting.',
            'Gentle range-of-motion stretching within pain-free boundaries.'
          ],
          keyQuestionsToAskDoctor: [
            'Is an X-Ray or MRI scan warranted to evaluate structural integrity?',
            'What targeted physical therapy exercises will strengthen supporting stabilizing muscles?',
            'Are anti-inflammatory oral agents or joint supplements appropriate?'
          ]
        });
      } else if (query.includes('headache') || query.includes('migraine') || query.includes('dizz') || query.includes('numb') || query.includes('nerve')) {
        setTriageResult({
          triageLevel: 'moderate',
          primaryRecommendation: 'Neurological & Neuro-Vascular Evaluation',
          suggestedSpecialty: 'Neurology',
          specialtyId: 'neurology',
          possibleCauses: [
            'Migraine with or without sensory aura',
            'Tension-type Cephalea secondary to ocular / muscular fatigue',
            'Cervicogenic headache or occipital neuralgia',
            'Benign Paroxysmal Positional Vertigo (BPPV)'
          ],
          selfCareAdvice: [
            'Rest in a quiet, dark room with cool compresses on the forehead.',
            'Maintain optimal oral hydration and regular meal intervals.',
            'Maintain a headache trigger journal tracking sleep and screen time.'
          ],
          keyQuestionsToAskDoctor: [
            'What abortive and preventive migraine therapies suit my lifestyle?',
            'Should we conduct neuro-imaging (Brain MRI/MRA) to rule out secondary causes?',
            'Could cervical spine alignment or ergonomics be precipitating attacks?'
          ]
        });
      } else if (query.includes('child') || query.includes('baby') || query.includes('infant') || query.includes('toddler')) {
        setTriageResult({
          triageLevel: 'urgent',
          primaryRecommendation: 'Pediatric Clinical Evaluation & Vitals Check',
          suggestedSpecialty: 'Pediatrics',
          specialtyId: 'pediatrics',
          possibleCauses: [
            'Acute Viral Upper Respiratory Infection',
            'Pediatric Otitis Media (Ear infection)',
            'Viral Bronchiolitis or Childhood Croup',
            'Pediatric Gastroenteritis'
          ],
          selfCareAdvice: [
            'Keep child adequately hydrated with frequent small sips of ORS or fluids.',
            'Monitor body temperature every 4 hours using a calibrated digital thermometer.',
            'Administer weight-appropriate antipyretic strictly as prescribed by a pediatrician.'
          ],
          keyQuestionsToAskDoctor: [
            'What are specific warning signs (retractions, lethargy, dehydration) to watch for?',
            'Is an ear and throat examination needed today?',
            'Are vaccinations up to date according to national pediatric schedules?'
          ]
        });
      } else {
        setTriageResult({
          triageLevel: 'low',
          primaryRecommendation: 'Comprehensive Internal Medicine Consultation',
          suggestedSpecialty: 'General Medicine',
          specialtyId: 'general-medicine',
          possibleCauses: [
            'Seasonal viral infection or immune reaction',
            'Metabolic fatigue or nutritional insufficiency',
            'Functional somatic stress symptomology',
            'Mild upper respiratory inflammation'
          ],
          selfCareAdvice: [
            'Ensure 8-9 hours of restorative sleep and warm electrolyte hydration.',
            'Consume balanced, easily digestible whole foods.',
            'Monitor symptoms over 48 hours and note any progression.'
          ],
          keyQuestionsToAskDoctor: [
            'What routine baseline lab tests (CBC, Vitamin D, Thyroid) should we screen?',
            'Could my lifestyle or stress levels be contributing to these symptoms?',
            'When should I schedule a follow-up consultation?'
          ]
        });
      }
    }, 600);
  };

  const handleSelectPreset = (preset: typeof PRESET_SYMPTOMS[0]) => {
    setSymptomsInput(preset.label);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6">
      <div 
        className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden relative animate-in fade-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors shadow-xs"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-gradient-to-r from-teal-900 via-teal-800 to-teal-700 p-6 text-white relative">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 text-teal-300 flex items-center justify-center border border-white/20 shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">AI Clinical Symptom Checker & Triage</h2>
                <span className="text-[10px] font-bold uppercase bg-teal-500/20 text-teal-200 px-2 py-0.5 rounded border border-teal-400/30">
                  SMART TRIAGE
                </span>
              </div>
              <p className="text-xs text-teal-100/90 mt-0.5">
                Describe your symptoms to receive instant specialty triage and recommended questions for your doctor.
              </p>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Quick Presets */}
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">Common Patient Scenarios</span>
            <div className="flex flex-wrap gap-2">
              {PRESET_SYMPTOMS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className="px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-teal-400 bg-slate-50 hover:bg-teal-50 text-[11px] font-semibold text-slate-700 transition-colors text-left"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleRunTriage} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Describe What You Are Experiencing *
              </label>
              <textarea
                rows={3}
                value={symptomsInput}
                onChange={(e) => setSymptomsInput(e.target.value)}
                placeholder="e.g. Sharp pain in the lower left rib cage for 2 days, worsens when coughing or breathing deeply..."
                required
                className="w-full text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-2xl p-3 text-slate-900 focus:outline-hidden focus:border-teal-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Symptom Duration</label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden"
                >
                  <option value="Started today (< 24 hrs)">Started today (&lt; 24 hrs)</option>
                  <option value="2-3 days">2-3 days</option>
                  <option value="1-2 weeks">1-2 weeks</option>
                  <option value="Over 1 month (Chronic)">Over 1 month (Chronic)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Severity Sensation</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {(['Mild', 'Moderate', 'Severe'] as const).map((sev) => (
                    <button
                      key={sev}
                      type="button"
                      onClick={() => setSeverity(sev)}
                      className={`py-2 rounded-xl text-xs font-semibold border transition-all ${
                        severity === sev 
                          ? 'bg-teal-600 text-white border-teal-600 shadow-xs' 
                          : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={!symptomsInput.trim() || isAnalyzing}
              className="w-full py-3 rounded-2xl bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-teal-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
            >
              {isAnalyzing ? (
                <>
                  <span className="w-3.5 h-3.5 rounded-full border-2 border-white border-t-transparent animate-spin" />
                  <span>Analyzing Medical Triage Patterns...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-teal-200" />
                  <span>Run Clinical Triage & Specialist Match</span>
                </>
              )}
            </button>
          </form>

          {/* TRIAGE RESULT CARD */}
          {triageResult && (
            <div className="mt-6 p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4 animate-in fade-in duration-200">
              
              {/* Triage Urgency Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Recommended Specialty</span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <Stethoscope className="w-5 h-5 text-teal-600" />
                    <span className="text-base font-bold text-slate-900">{triageResult.suggestedSpecialty}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    triageResult.triageLevel === 'urgent'
                      ? 'bg-rose-100 text-rose-800 border border-rose-200'
                      : triageResult.triageLevel === 'moderate'
                      ? 'bg-amber-100 text-amber-800 border border-amber-200'
                      : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                  }`}>
                    {triageResult.triageLevel === 'urgent' && 'Prompt Clinical Care Advised'}
                    {triageResult.triageLevel === 'moderate' && 'Moderate Urgency Triage'}
                    {triageResult.triageLevel === 'low' && 'Routine Outpatient Care'}
                  </span>
                </div>
              </div>

              {/* Assessment */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Clinical Assessment:</h4>
                <p className="text-xs text-slate-700 leading-relaxed">{triageResult.primaryRecommendation}</p>
              </div>

              {/* Potential Differential Causes */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1.5">Common Differential Considerations:</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  {triageResult.possibleCauses.map((cause, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600 bg-white p-2 rounded-lg border border-slate-200/80">
                      <span className="w-1.5 h-1.5 rounded-full bg-teal-500 shrink-0" />
                      <span>{cause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Self-care advice */}
              <div className="p-3 rounded-xl bg-teal-50/60 border border-teal-100 text-xs text-teal-900 space-y-1">
                <strong className="block font-bold">Initial Supportive Measures:</strong>
                {triageResult.selfCareAdvice.map((advice, i) => (
                  <p key={i} className="text-teal-800 pl-2 border-l-2 border-teal-300">{advice}</p>
                ))}
              </div>

              {/* Key questions for doctor */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 mb-1">Key Questions to Ask During Your Visit:</h4>
                <ul className="space-y-1 text-xs text-slate-600 list-disc list-inside">
                  {triageResult.keyQuestionsToAskDoctor.map((q, i) => (
                    <li key={i}>{q}</li>
                  ))}
                </ul>
              </div>

              {/* Action Button: Book with this specialty */}
              <div className="pt-2 flex flex-col sm:flex-row gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onFindSpecialist(triageResult.suggestedSpecialty);
                  }}
                  className="flex-1 py-3 px-4 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                >
                  <Stethoscope className="w-4 h-4" />
                  <span>Book {triageResult.suggestedSpecialty} Specialist Now</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </div>
          )}

          {/* Medical disclaimer note */}
          <div className="p-3 rounded-xl bg-slate-100 text-[11px] text-slate-500 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
            <span>
              <strong>Medical Disclaimer:</strong> This tool provides informational preliminary triage and does not substitute professional medical diagnosis. In case of life-threatening distress, call 112 immediately.
            </span>
          </div>

        </div>

      </div>
    </div>
  );
};
