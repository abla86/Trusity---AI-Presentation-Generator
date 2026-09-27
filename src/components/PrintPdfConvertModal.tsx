import React, { useState } from 'react';
import {
  X,
  FileText,
  Printer,
  Presentation,
  Download,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Settings2,
  FileDown,
  Layers,
  BookOpen,
} from 'lucide-react';
import { PresentationPlan, PdfExportOptions, PdfExportProgress } from '../types';
import { exportToPDF, printPresentation } from '../lib/pdfExporter';
import { exportToPPTX } from '../lib/exportUtils';

interface PrintPdfConvertModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PresentationPlan;
  onToast: (msg: string) => void;
}

export const PrintPdfConvertModal: React.FC<PrintPdfConvertModalProps> = ({
  isOpen,
  onClose,
  plan,
  onToast,
}) => {
  const [activeTab, setActiveTab] = useState<'pdf_convert' | 'print' | 'pptx'>('pdf_convert');
  const [pdfFormat, setPdfFormat] = useState<'presentation_16_9' | 'handout_with_notes'>(
    'presentation_16_9'
  );
  const [resolutionScale, setResolutionScale] = useState<number>(2);
  const [includeNotes, setIncludeNotes] = useState<boolean>(true);
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [progress, setProgress] = useState<PdfExportProgress | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const totalSlides = plan.slides.length;

  const handleConvertPDF = async () => {
    setIsExporting(true);
    setErrorMsg(null);
    setProgress({
      currentSlide: 0,
      totalSlides,
      status: 'Initializing PDF document converter...',
      percentage: 0,
    });

    try {
      const slideIds = plan.slides.map((s) => `clean-slide-view-${s.id}`);
      const options: Partial<PdfExportOptions> = {
        format: pdfFormat,
        resolutionScale,
        includeSpeakerNotes: includeNotes,
        includeBackdropVisuals: true,
      };

      await exportToPDF(plan, slideIds, options, (p) => {
        setProgress(p);
      });

      onToast('PDF presentation exported and downloaded successfully!');
      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err: any) {
      console.error('PDF conversion failed:', err);
      setErrorMsg(err.message || 'Failed to generate PDF document.');
      onToast('PDF export error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  const handleTriggerPrint = () => {
    onToast('Preparing clean landscape print format...');
    printPresentation();
  };

  const handleExportPPTX = async () => {
    setIsExporting(true);
    setErrorMsg(null);
    try {
      await exportToPPTX(plan);
      onToast('PowerPoint (.pptx) downloaded successfully!');
      setTimeout(() => {
        onClose();
      }, 500);
    } catch (err: any) {
      console.error('PPTX export error:', err);
      setErrorMsg(err.message || 'Failed to export PowerPoint presentation.');
      onToast('PPTX export error: ' + (err.message || 'Unknown error'));
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div
      id="print-pdf-convert-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-[#111622] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center text-red-400">
              <FileDown className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Print & Presentation Converter
              </h3>
              <p className="text-xs text-slate-400">
                Convert to multi-page PDF, print as landscape deck, or export to PowerPoint.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isExporting}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="px-6 pt-4 pb-1 border-b border-slate-800/80 bg-slate-900/30 flex items-center gap-2">
          <button
            onClick={() => !isExporting && setActiveTab('pdf_convert')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'pdf_convert'
                ? 'bg-red-950/60 text-red-300 border-red-500/60 shadow-sm'
                : 'bg-slate-900/40 text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4 text-red-400" />
            <span>Convert to PDF (.pdf)</span>
          </button>

          <button
            onClick={() => !isExporting && setActiveTab('print')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'print'
                ? 'bg-blue-950/60 text-blue-300 border-blue-500/60 shadow-sm'
                : 'bg-slate-900/40 text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Printer className="w-4 h-4 text-blue-400" />
            <span>Print Deck (or Save to PDF)</span>
          </button>

          <button
            onClick={() => !isExporting && setActiveTab('pptx')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all ${
              activeTab === 'pptx'
                ? 'bg-orange-950/60 text-orange-300 border-orange-500/60 shadow-sm'
                : 'bg-slate-900/40 text-slate-400 border-transparent hover:text-slate-200'
            }`}
          >
            <Presentation className="w-4 h-4 text-orange-400" />
            <span>PowerPoint (.pptx)</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-sm">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* TAB 1: CONVERT TO PDF */}
          {activeTab === 'pdf_convert' && (
            <div className="space-y-5">
              {/* Document Format Selection */}
              <div>
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 block mb-2.5">
                  PDF Page Layout
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPdfFormat('presentation_16_9')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      pdfFormat === 'presentation_16_9'
                        ? 'bg-red-950/50 border-red-500 ring-1 ring-red-500/50 text-white'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <Layers className="w-5 h-5 text-red-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs block">Full-Bleed 16:9 Presentation</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        High-resolution 16:9 landscape slides ready for investor review, email, and stage projectors.
                      </p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPdfFormat('handout_with_notes')}
                    className={`p-3.5 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      pdfFormat === 'handout_with_notes'
                        ? 'bg-red-950/50 border-red-500 ring-1 ring-red-500/50 text-white'
                        : 'bg-slate-900/50 border-slate-800 hover:border-slate-700 text-slate-300'
                    }`}
                  >
                    <BookOpen className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <span className="font-bold text-xs block">Speaker Handout with Notes</span>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        Slide snapshot on top with full speaker transcript, pitch script, and annotations underneath.
                      </p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Quality & Settings */}
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-4 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-slate-200">Rendering Sharpness (DPI)</span>
                    <p className="text-[11px] text-slate-400">Higher resolution produces sharper vector fonts</p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-800 rounded-lg p-1">
                    <button
                      onClick={() => setResolutionScale(1.5)}
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        resolutionScale === 1.5 ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Standard (1.5x)
                    </button>
                    <button
                      onClick={() => setResolutionScale(2)}
                      className={`px-2 py-0.5 rounded text-xs font-semibold ${
                        resolutionScale === 2 ? 'bg-red-600 text-white' : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Retina 2x (Ultra HD)
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-800/60 pt-3">
                  <div>
                    <span className="text-xs font-bold text-slate-200">Include Speaker Notes</span>
                    <p className="text-[11px] text-slate-400">Embed pitch talking points into PDF handouts</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={includeNotes}
                    onChange={(e) => setIncludeNotes(e.target.checked)}
                    className="w-4 h-4 accent-red-500 rounded cursor-pointer"
                  />
                </div>
              </div>

              {/* Progress Indicator */}
              {isExporting && progress && (
                <div className="p-4 rounded-xl bg-slate-900/90 border border-red-500/40 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-red-300">{progress.status}</span>
                    <span className="font-mono font-bold text-white">{progress.percentage}%</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-red-500 to-pink-500 transition-all duration-300"
                      style={{ width: `${progress.percentage}%` }}
                    />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PRINT PRESENTATION */}
          {activeTab === 'print' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-950/30 border border-blue-800/60 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-blue-300 flex items-center gap-1.5">
                  <Printer className="w-4 h-4" />
                  Direct Browser Print Architecture
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Clicking <strong>"Launch Print Dialog"</strong> formats every slide in your deck into an exact 16:9 landscape printable page without toolbars, sidebars, or menus.
                </p>
                <div className="text-[11px] text-slate-400 space-y-1 mt-2">
                  <p>• <strong>To save as PDF:</strong> Select <em>"Save as PDF"</em> or <em>"Microsoft Print to PDF"</em> in your printer destination dropdown.</p>
                  <p>• <strong>Layout setting:</strong> Ensure <em>Landscape</em> orientation is selected.</p>
                  <p>• <strong>Background graphics:</strong> Check <em>"Background graphics"</em> in print options to preserve theme gradients and photos.</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">Total slides to be printed:</span>
                <span className="font-bold text-white font-mono">{totalSlides} Slides</span>
              </div>
            </div>
          )}

          {/* TAB 3: POWERPOINT PPTX */}
          {activeTab === 'pptx' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-orange-950/30 border border-orange-800/60 space-y-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wide text-orange-300 flex items-center gap-1.5">
                  <Presentation className="w-4 h-4" />
                  Native Microsoft PowerPoint (.pptx)
                </h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Generates an editable <strong>.pptx</strong> file with real native text frames, metric cards, speaker notes, and company themes compatible with Microsoft PowerPoint, Google Slides, and Apple Keynote.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-900/50 border border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-300">PowerPoint Deck Layout:</span>
                <span className="font-bold text-white font-mono">16:9 Widescreen ({totalSlides} slides)</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            disabled={isExporting}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all disabled:opacity-50"
          >
            Cancel
          </button>

          {activeTab === 'pdf_convert' && (
            <button
              onClick={handleConvertPDF}
              disabled={isExporting}
              className="px-5 py-2 text-xs font-bold text-white bg-red-600 hover:bg-red-500 disabled:opacity-50 rounded-xl shadow-md shadow-red-600/30 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Converting PDF...' : 'Convert & Download PDF'}</span>
            </button>
          )}

          {activeTab === 'print' && (
            <button
              onClick={handleTriggerPrint}
              disabled={isExporting}
              className="px-5 py-2 text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 rounded-xl shadow-md shadow-blue-600/30 transition-all flex items-center gap-2"
            >
              <Printer className="w-4 h-4" />
              <span>Launch Print Dialog</span>
            </button>
          )}

          {activeTab === 'pptx' && (
            <button
              onClick={handleExportPPTX}
              disabled={isExporting}
              className="px-5 py-2 text-xs font-bold text-white bg-orange-600 hover:bg-orange-500 disabled:opacity-50 rounded-xl shadow-md shadow-orange-600/30 transition-all flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>{isExporting ? 'Generating PPTX...' : 'Download PowerPoint (.pptx)'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
