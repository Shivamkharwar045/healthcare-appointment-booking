import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  Activity, 
  Search, 
  Plus, 
  Check, 
  X,
  ShieldCheck,
  Calendar,
  Building2
} from 'lucide-react';
import { MOCK_LAB_REPORTS } from '../data/mockData';
import { LabReport } from '../types';

export const LabReportsVault: React.FC = () => {
  const [reports, setReports] = useState<LabReport[]>(MOCK_LAB_REPORTS);
  const [selectedReport, setSelectedReport] = useState<LabReport | null>(MOCK_LAB_REPORTS[0]);
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Upload modal state
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<LabReport['testCategory']>('Biochemistry');
  const [newLabName, setNewLabName] = useState('Thyrocare / Lal PathLabs');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const categories = ['All', 'Biochemistry', 'Hematology', 'Cardiology'];

  const filteredReports = reports.filter(r => {
    if (activeCategory !== 'All' && r.testCategory !== activeCategory) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return r.title.toLowerCase().includes(q) || r.labName.toLowerCase().includes(q) || r.doctorReferred.toLowerCase().includes(q);
    }
    return true;
  });

  const handleUploadSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      const newRep: LabReport = {
        id: `REP-2026-${Math.floor(1000 + Math.random() * 9000)}`,
        patientId: 'user-patient-1',
        title: newTitle,
        testCategory: newCategory,
        date: new Date().toISOString().split('T')[0],
        labName: newLabName,
        doctorReferred: 'Self-Uploaded Record',
        status: 'Normal',
        summary: 'Document uploaded successfully and scanned into encrypted patient cloud vault.',
        metrics: [
          { parameter: 'Reference Index', value: 'Optimal', unit: 'Index', referenceRange: 'Normal', flag: 'normal' }
        ]
      };

      setReports([newRep, ...reports]);
      setSelectedReport(newRep);
      setUploadSuccess(true);
      setTimeout(() => {
        setUploadSuccess(false);
        setIsUploadOpen(false);
        setNewTitle('');
      }, 1500);
    }, 700);
  };

  const handleDownloadReport = (rep: LabReport) => {
    const textContent = `MEDIBOOK HEALTH VAULT - DIAGNOSTIC REPORT
Report ID: ${rep.id}
Test Name: ${rep.title}
Category: ${rep.testCategory}
Date: ${rep.date}
Diagnostic Center: ${rep.labName}
Referring Doctor: ${rep.doctorReferred}
Overall Status: ${rep.status}

SUMMARY:
${rep.summary}

PARAMETERS & BIOLOGICAL REFERENCE INTERVALS:
${rep.metrics.map(m => `- ${m.parameter}: ${m.value} ${m.unit} (Reference Range: ${m.referenceRange}) [${m.flag.toUpperCase()}]`).join('\n')}

Digitally signed & verified by MediBook Vault HIPAA Security Standard.`;

    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.setAttribute('download', `${rep.id}-${rep.testCategory}.txt`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs p-6 sm:p-8 space-y-6">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-teal-600" />
            <h2 className="text-lg font-bold text-slate-900">Encrypted Diagnostic & Lab Records Vault</h2>
            <span className="text-[10px] font-bold uppercase bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
              HIPAA SECURE
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Store, view, and share verified blood tests, pathology panels, and ECG waveforms with your consulting specialists.
          </p>
        </div>

        <button
          onClick={() => setIsUploadOpen(true)}
          className="px-4 py-2 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs cursor-pointer transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Upload New Report / PDF</span>
        </button>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-1.5">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeCategory === cat
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-64 px-3 py-1.5 rounded-xl bg-slate-50 border border-slate-200 text-xs">
          <Search className="w-3.5 h-3.5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search report name or lab..."
            className="w-full bg-transparent text-slate-900 focus:outline-hidden"
          />
        </div>
      </div>

      {/* Two Column Layout: Left = Reports List, Right = Detailed Report Viewer */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Reports List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[500px] overflow-y-auto pr-1">
          {filteredReports.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border border-dashed border-slate-200 rounded-2xl">
              No matching diagnostic reports found.
            </div>
          ) : (
            filteredReports.map((rep) => (
              <div
                key={rep.id}
                onClick={() => setSelectedReport(rep)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer text-left ${
                  selectedReport?.id === rep.id
                    ? 'border-teal-500 bg-teal-50/40 shadow-xs'
                    : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono font-bold text-teal-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                    {rep.id}
                  </span>
                  <span className="text-[10px] font-bold uppercase text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                    {rep.status}
                  </span>
                </div>

                <h3 className="text-xs font-bold text-slate-900 mt-2">{rep.title}</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">{rep.labName}</p>
                <p className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                  <Calendar className="w-3 h-3 text-slate-400" /> {rep.date}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Detailed Report View */}
        <div className="lg:col-span-7">
          {selectedReport ? (
            <div className="p-5 sm:p-6 rounded-2xl border border-slate-200 bg-slate-50/30 space-y-4">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div>
                  <span className="text-[10px] font-mono text-slate-400 block">{selectedReport.id}</span>
                  <h3 className="text-base font-bold text-slate-900">{selectedReport.title}</h3>
                  <p className="text-xs text-teal-700">{selectedReport.labName}</p>
                </div>

                <button
                  onClick={() => handleDownloadReport(selectedReport)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 hover:bg-white text-xs font-semibold text-slate-700 flex items-center gap-1.5 shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Download Text / Summary</span>
                </button>
              </div>

              {/* Summary */}
              <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 leading-relaxed">
                <strong className="block text-[11px] uppercase text-slate-400 font-bold mb-0.5">Clinical Interpretation</strong>
                {selectedReport.summary}
              </div>

              {/* Metrics Table */}
              <div>
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block mb-2">Test Parameters & Findings</span>
                <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-400 text-[10px] uppercase font-bold">
                      <tr>
                        <th className="p-2.5">Parameter</th>
                        <th className="p-2.5">Observed Value</th>
                        <th className="p-2.5">Biological Reference</th>
                        <th className="p-2.5 text-right">Interpretation</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {selectedReport.metrics.map((m, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="p-2.5 font-medium text-slate-900">{m.parameter}</td>
                          <td className="p-2.5 font-bold font-mono text-slate-800">
                            {m.value} <span className="text-[10px] font-normal text-slate-400">{m.unit}</span>
                          </td>
                          <td className="p-2.5 text-slate-500">{m.referenceRange}</td>
                          <td className="p-2.5 text-right">
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                              m.flag === 'normal' 
                                ? 'bg-emerald-50 text-emerald-700' 
                                : 'bg-rose-50 text-rose-700'
                            }`}>
                              {m.flag}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-10 text-center text-xs text-slate-400 border border-slate-200 rounded-2xl">
              Select a diagnostic report from the list to view clinical findings.
            </div>
          )}
        </div>

      </div>

      {/* UPLOAD REPORT MODAL */}
      {isUploadOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-slate-900">Upload Health Record</h3>
              <button onClick={() => setIsUploadOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleUploadSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Test Title / Document Name *</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Thyroid Profile (T3, T4, TSH) or Chest X-Ray"
                  required
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as any)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-800 focus:outline-hidden"
                >
                  <option value="Biochemistry">Biochemistry</option>
                  <option value="Hematology">Hematology</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Radiology">Radiology</option>
                  <option value="Pathology">Pathology</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Diagnostic Center / Lab Name</label>
                <input
                  type="text"
                  value={newLabName}
                  onChange={(e) => setNewLabName(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-slate-900 focus:outline-hidden focus:border-teal-500"
                />
              </div>

              {/* Drag drop mockup */}
              <div className="border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center text-xs text-slate-500 bg-slate-50 hover:border-teal-400 transition-colors cursor-pointer">
                <Upload className="w-8 h-8 text-teal-600 mx-auto mb-2" />
                <p className="font-semibold text-slate-700">Drop PDF scan or click to browse</p>
                <p className="text-[10px] text-slate-400 mt-1">Supports PDF, JPG, PNG up to 15MB</p>
              </div>

              {uploadSuccess ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-1.5 font-semibold">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>Report encrypted and saved to your health vault!</span>
                </div>
              ) : (
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsUploadOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUploading}
                    className="flex-1 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5"
                  >
                    {isUploading ? (
                      <span>Encrypting & Saving...</span>
                    ) : (
                      <>
                        <Upload className="w-3.5 h-3.5" />
                        <span>Save to Vault</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
