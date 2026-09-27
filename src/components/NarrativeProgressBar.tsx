import React from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Compass,
  Play,
} from 'lucide-react';
import { Slide, SlideType, ThemeName } from '../types';
import { THEMES } from '../data/themes';

interface NarrativeProgressBarProps {
  slides: Slide[];
  activeIndex: number;
  themeName: ThemeName;
  onSelectSlide: (index: number) => void;
  onStartPresenting?: () => void;
  deckTitle?: string;
}

// Map slide types to human-friendly narrative story arc phases
const getNarrativePhase = (type: SlideType, index: number, total: number): { label: string; icon: string; color: string } => {
  switch (type) {
    case 'title':
      return { label: 'Hook & Vision', icon: '🌟', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    case 'problem':
      return { label: 'The Conflict & Pain', icon: '⚡', color: 'text-red-400 bg-red-500/10 border-red-500/30' };
    case 'solution':
      return { label: 'The Breakthrough', icon: '💡', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    case 'market_opportunity':
      return { label: 'Market Opportunity', icon: '📈', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' };
    case 'business_model':
      return { label: 'Monetization Engine', icon: '💎', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' };
    case 'comparison':
      return { label: 'Defensible Moat', icon: '🛡️', color: 'text-blue-400 bg-blue-500/10 border-blue-500/30' };
    case 'timeline':
      return { label: 'Milestone Horizon', icon: '⏳', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/30' };
    case 'process_flow':
      return { label: 'Execution Engine', icon: '⚙️', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' };
    case 'statistics':
      return { label: 'Proof & Metrics', icon: '🎯', color: 'text-purple-400 bg-purple-500/10 border-purple-500/30' };
    case 'swot':
      return { label: 'Strategic Matrix', icon: '🧭', color: 'text-teal-400 bg-teal-500/10 border-teal-500/30' };
    case 'roadmap':
      return { label: 'Future Vision', icon: '🚀', color: 'text-violet-400 bg-violet-500/10 border-violet-500/30' };
    case 'call_to_action':
      return { label: 'The Catalyst / Ask', icon: '🏆', color: 'text-orange-400 bg-orange-500/10 border-orange-500/30' };
    case 'team':
      return { label: 'The Architects', icon: '👥', color: 'text-pink-400 bg-pink-500/10 border-pink-500/30' };
    case 'pricing':
      return { label: 'Unit Economics', icon: '📊', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30' };
    default:
      if (index === 0) return { label: 'Introduction', icon: '✨', color: 'text-slate-300 bg-slate-800 border-slate-700' };
      if (index === total - 1) return { label: 'Closing Climax', icon: '🏁', color: 'text-orange-300 bg-orange-500/10 border-orange-500/30' };
      return { label: `Chapter 0${index + 1}`, icon: '📌', color: 'text-slate-300 bg-slate-800 border-slate-700' };
  }
};

export const NarrativeProgressBar: React.FC<NarrativeProgressBarProps> = ({
  slides,
  activeIndex,
  themeName,
  onSelectSlide,
  onStartPresenting,
  deckTitle,
}) => {
  const totalSlides = slides.length;
  if (totalSlides === 0) return null;

  const activeSlide = slides[activeIndex] || slides[0];
  const progressPercent = Math.round(((activeIndex + 1) / totalSlides) * 100);
  const narrative = getNarrativePhase(activeSlide.slideType, activeIndex, totalSlides);
  const theme = THEMES[themeName] || THEMES.startup;

  const canGoPrev = activeIndex > 0;
  const canGoNext = activeIndex < totalSlides - 1;

  return (
    <div
      id="workspace-narrative-progress-bar"
      className="sticky top-[57px] z-30 bg-[#0d1117]/90 backdrop-blur-md border-b border-slate-800/80 shadow-md transition-all select-none"
    >
      {/* Dynamic Continuous Top Micro-Track */}
      <div className="relative w-full h-[3px] bg-slate-800/80 overflow-hidden">
        <div
          className="h-full transition-all duration-300 ease-out"
          style={{
            width: `${progressPercent}%`,
            background: `linear-gradient(to right, ${theme.primary}, ${theme.accent})`,
            boxShadow: `0 0 10px ${theme.accent}80`,
          }}
        />
      </div>

      {/* Main Bar Contents */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between gap-3 text-xs">
        {/* Left: Narrative Arc Anchor */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5 text-slate-400 font-semibold tracking-wide uppercase text-[10px] shrink-0">
            <Compass className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden md:inline">Narrative Flow</span>
          </div>

          <span className="text-slate-700 hidden md:inline">•</span>

          {/* Active Story Stage Chip */}
          <div
            className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[11px] font-bold tracking-tight truncate shadow-sm transition-all ${narrative.color}`}
            title={`Slide ${activeIndex + 1} represents the "${narrative.label}" phase in your pitch narrative`}
          >
            <span>{narrative.icon}</span>
            <span className="truncate">{narrative.label}</span>
          </div>

          <span className="text-slate-700 hidden lg:inline">•</span>

          {/* Slide Headline Preview */}
          <span
            className="text-slate-400 font-medium text-xs truncate max-w-[200px] xl:max-w-[320px] hidden lg:inline"
            title={activeSlide.content.headline}
          >
            "{activeSlide.content.headline}"
          </span>
        </div>

        {/* Center: Interactive Slide Segment Nodes */}
        <div className="flex-1 max-w-md hidden sm:flex items-center gap-1 mx-2">
          {slides.map((s, idx) => {
            const isCurrent = idx === activeIndex;
            const isPast = idx < activeIndex;
            const itemPhase = getNarrativePhase(s.slideType, idx, totalSlides);

            return (
              <button
                key={s.id || idx}
                onClick={() => onSelectSlide(idx)}
                className={`group relative flex-1 h-2 rounded-full transition-all duration-200 ${
                  isCurrent
                    ? 'ring-2 ring-indigo-400 ring-offset-1 ring-offset-[#0d1117] h-2.5 z-10'
                    : 'hover:h-2.5 hover:opacity-100 opacity-60'
                }`}
                style={{
                  backgroundColor: isCurrent
                    ? theme.primary
                    : isPast
                    ? `${theme.primary}90`
                    : '#334155',
                }}
                title={`Slide ${idx + 1}: ${s.content.headline} (${itemPhase.label})`}
              >
                {/* Floating Tooltip on Hover */}
                <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center pointer-events-none z-50 whitespace-nowrap">
                  <div className="bg-slate-900 border border-slate-700 text-slate-200 px-2.5 py-1.5 rounded-lg shadow-xl text-[11px] flex flex-col gap-0.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <span className="text-indigo-400">0{idx + 1}.</span>
                      <span>{itemPhase.label}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 max-w-[180px] truncate font-normal">
                      {s.content.headline}
                    </span>
                  </div>
                  <div className="w-1.5 h-1.5 bg-slate-900 border-r border-b border-slate-700 rotate-45 -mt-1" />
                </div>
              </button>
            );
          })}
        </div>

        {/* Right: Counter & Navigation Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 font-mono text-[11px] text-slate-300 bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg">
            <span className="font-bold text-white">{activeIndex + 1}</span>
            <span className="text-slate-500">/</span>
            <span className="text-slate-400">{totalSlides}</span>
            <span className="text-[10px] text-indigo-400 ml-1 font-semibold">({progressPercent}%)</span>
          </div>

          {/* Quick Prev / Next Buttons */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => canGoPrev && onSelectSlide(activeIndex - 1)}
              disabled={!canGoPrev}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-all"
              title="Previous slide (Left Arrow)"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => canGoNext && onSelectSlide(activeIndex + 1)}
              disabled={!canGoNext}
              className="p-1 rounded-lg bg-slate-900 hover:bg-slate-800 disabled:opacity-30 disabled:hover:bg-slate-900 text-slate-300 hover:text-white border border-slate-800 transition-all"
              title="Next slide (Right Arrow)"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Present Button */}
          {onStartPresenting && (
            <button
              onClick={onStartPresenting}
              className="hidden md:flex items-center gap-1 px-2.5 py-1 text-[11px] font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition-all"
              title="Launch Fullscreen Presentation Mode"
            >
              <Play className="w-3 h-3 fill-current" />
              <span>Present</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
