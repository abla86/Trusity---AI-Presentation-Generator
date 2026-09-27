import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { PresentationPlan, PdfExportOptions, PdfExportProgress } from '../types';
import { THEMES } from '../data/themes';

/**
 * High-fidelity PDF Document Generator.
 * Converts presentation slides into high-resolution 16:9 landscape PDF pages
 * or structured speaker notes handouts with full fidelity.
 */
export async function exportToPDF(
  plan: PresentationPlan,
  slideElementIds: string[],
  options?: Partial<PdfExportOptions>,
  onProgress?: (progress: PdfExportProgress) => void
): Promise<void> {
  const opts: PdfExportOptions = {
    format: 'presentation_16_9',
    resolutionScale: 2,
    includeSpeakerNotes: true,
    includeAnnotations: true,
    includeBackdropVisuals: true,
    ...options,
  };

  const totalSlides = plan.slides.length;
  if (totalSlides === 0) {
    throw new Error('No slides available to convert to PDF.');
  }

  // 16:9 Landscape Dimensions in mm (A4 width 297mm x 167.06mm)
  const pageWidthMm = 297;
  const pageHeightMm = 167.06;

  // Initialize jsPDF
  const doc = new jsPDF({
    orientation: 'landscape',
    unit: 'mm',
    format: [pageWidthMm, pageHeightMm],
    compress: true,
  });

  // Set document metadata
  doc.setProperties({
    title: plan.title || 'Pitch Deck Presentation',
    subject: plan.subtitle || 'Generated via Trusity AI',
    author: plan.presenter || 'Trusity AI',
    creator: 'Trusity AI Presentation Platform',
  });

  const theme = THEMES[plan.theme] || THEMES.startup;

  for (let i = 0; i < totalSlides; i++) {
    const slide = plan.slides[i];
    const elementId = slideElementIds[i] || `clean-slide-view-${slide.id}`;

    onProgress?.({
      currentSlide: i + 1,
      totalSlides,
      status: `Rendering slide ${i + 1} of ${totalSlides}: "${slide.content.headline}"...`,
      percentage: Math.round(((i + 0.5) / totalSlides) * 100),
    });

    const element = document.getElementById(elementId);
    if (!element) {
      console.warn(`Slide element with ID ${elementId} not found, skipping canvas snapshot.`);
      continue;
    }

    // Capture using html2canvas at high resolution
    const canvas = await html2canvas(element, {
      scale: opts.resolutionScale || 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: theme.bg || '#0F0F1A',
      logging: false,
    });

    const imgData = canvas.toDataURL('image/jpeg', 0.95);

    if (i > 0) {
      doc.addPage([pageWidthMm, pageHeightMm], 'landscape');
    }

    if (opts.format === 'presentation_16_9') {
      // Full bleed 16:9 slide page
      doc.addImage(imgData, 'JPEG', 0, 0, pageWidthMm, pageHeightMm, undefined, 'FAST');
    } else {
      // Handout Mode: Slide in top 60%, speaker notes in bottom 40%
      const slideHeight = pageHeightMm * 0.62;
      const slideWidth = slideHeight * (16 / 9);
      const slideX = (pageWidthMm - slideWidth) / 2;

      // Dark background fill
      doc.setFillColor(15, 17, 26);
      doc.rect(0, 0, pageWidthMm, pageHeightMm, 'F');

      // Slide preview
      doc.addImage(imgData, 'JPEG', slideX, 8, slideWidth, slideHeight, undefined, 'FAST');

      // Notes Container Divider
      doc.setDrawColor(60, 65, 85);
      doc.line(15, slideHeight + 12, pageWidthMm - 15, slideHeight + 12);

      // Speaker Notes Header
      doc.setFontSize(10);
      doc.setTextColor(165, 180, 252);
      doc.text(`SPEAKER NOTES & TRANSCRIPT (Slide ${i + 1} of ${totalSlides})`, 15, slideHeight + 18);

      // Speaker Notes Text
      doc.setFontSize(9);
      doc.setTextColor(240, 240, 255);
      const notes = slide.content.speakerNotes || 'No speaker notes recorded for this slide.';
      const splitNotes = doc.splitTextToSize(notes, pageWidthMm - 30);
      doc.text(splitNotes, 15, slideHeight + 24);
    }

    onProgress?.({
      currentSlide: i + 1,
      totalSlides,
      status: `Compiled slide ${i + 1} of ${totalSlides} into PDF`,
      percentage: Math.round(((i + 1) / totalSlides) * 100),
    });
  }

  onProgress?.({
    currentSlide: totalSlides,
    totalSlides,
    status: 'Finalizing PDF file download...',
    percentage: 100,
  });

  const cleanTitle = plan.title.replace(/[^a-zA-Z0-9_-]/g, '_') || 'Pitch_Deck';
  const filename = `${cleanTitle}_Presentation.pdf`;
  doc.save(filename);
}

/**
 * Triggers optimized browser print dialog with @media print CSS rules
 * ensuring high-fidelity landscape pages and no browser/editor clutter.
 */
export function printPresentation(): void {
  // Inject dedicated print styles if not already present
  const printStyleId = 'presentation-print-dedicated-styles';
  let styleEl = document.getElementById(printStyleId);

  if (!styleEl) {
    styleEl = document.createElement('style');
    styleEl.id = printStyleId;
    styleEl.innerHTML = `
      @media print {
        @page {
          size: landscape;
          margin: 0 !important;
        }
        body {
          margin: 0 !important;
          padding: 0 !important;
          background: #000 !important;
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
        /* Hide everything by default */
        body * {
          visibility: hidden !important;
        }
        /* Reveal print container and slides only */
        #print-deck-presentation-target,
        #print-deck-presentation-target * {
          visibility: visible !important;
        }
        #print-deck-presentation-target {
          position: absolute !important;
          top: 0 !important;
          left: 0 !important;
          width: 100vw !important;
          display: block !important;
          z-index: 999999 !important;
        }
        .print-single-slide-page {
          width: 100vw !important;
          height: 100vh !important;
          page-break-after: always !important;
          break-after: page !important;
          display: flex !important;
          align-items: center !important;
          justify-content: center !important;
          margin: 0 !important;
          padding: 0 !important;
          box-sizing: border-box !important;
        }
      }
    `;
    document.head.appendChild(styleEl);
  }

  // Trigger native print dialog
  window.print();
}
