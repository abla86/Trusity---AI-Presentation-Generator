import React, { useState } from 'react';
import {
  X,
  Sparkles,
  Zap,
  Sliders,
  Eye,
  Radio,
  Volume2,
  VolumeX,
  Layers,
  Check,
  RotateCw,
  Compass,
  Flame,
} from 'lucide-react';
import { SlideTransition, ContentBuildEffect, SlideEffectsConfig, Slide } from '../types';

interface SlideEffectsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentEffects?: Partial<SlideEffectsConfig>;
  slide: Slide;
  totalSlides: number;
  slideIndex: number;
  onApplyEffects: (effects: SlideEffectsConfig, applyToAll: boolean) => void;
}

const TRANSITION_OPTIONS: Array<{
  id: SlideTransition;
  name: string;
  desc: string;
  icon: string;
  badge: string;
}> = [
  {
    id: 'fade',
    name: 'Smooth Dissolve',
    desc: 'Soft opacity crossfade with gentle optical smoothing.',
    icon: '✨',
    badge: 'Popular',
  },
  {
    id: 'slide',
    name: 'Horizontal Push',
    desc: 'Classic keynote horizontal slide from right to left.',
    icon: '➡️',
    badge: 'Standard',
  },
  {
    id: 'slide-up',
    name: 'Vertical Elevate',
    desc: 'Upward rising reveal emphasizing progression.',
    icon: '⬆️',
    badge: 'Dynamic',
  },
  {
    id: 'zoom',
    name: 'Cinematic Zoom',
    desc: 'Deep depth-of-field camera push into the slide canvas.',
    icon: '🔍',
    badge: 'High Impact',
  },
  {
    id: 'flip',
    name: '3D Perspective Flip',
    desc: '3D rotational card flip around the vertical axis.',
    icon: '🔄',
    badge: '3D FX',
  },
  {
    id: 'cube',
    name: '3D Cube Rotate',
    desc: 'Slides rotate along the faces of an extruded 3D cube.',
    icon: '🎲',
    badge: '3D Keynote',
  },
  {
    id: 'dissolve',
    name: 'Soft Blur Dissolve',
    desc: 'Artistic focal blur dissolving into razor-sharp focus.',
    icon: '🌫️',
    badge: 'Artistic',
  },
  {
    id: 'wipe',
    name: 'Linear Curtain Wipe',
    desc: 'Clean angular wipe revealing content progressively.',
    icon: '🪄',
    badge: 'Clean',
  },
  {
    id: 'bounce',
    name: 'Kinetic Spring',
    desc: 'Playful bouncy entry with damped spring physics.',
    icon: '⚡',
    badge: 'Energetic',
  },
];

const BUILD_OPTIONS: Array<{
  id: ContentBuildEffect;
  name: string;
  desc: string;
  icon: string;
}> = [
  {
    id: 'none',
    name: 'Instant (All At Once)',
    desc: 'All cards and bullet points appear simultaneously on entry.',
    icon: '⏹️',
  },
  {
    id: 'stagger-slide',
    name: 'Staggered Card Slide',
    desc: 'Cards and list items glide in sequentially one after another.',
    icon: '🪜',
  },
  {
    id: 'fade-in',
    name: 'Progressive Fade-In',
    desc: 'Items gently fade in sequence with subtle upward motion.',
    icon: '🌅',
  },
  {
    id: 'card-pop',
    name: 'Pop & Scale Build',
    desc: 'Cards bounce subtly into view with spring pop animation.',
    icon: '🎈',
  },
  {
    id: 'glow-reveal',
    name: 'Luminous Glow Reveal',
    desc: 'Highlights the current key metric with an animated neon border.',
    icon: '🌟',
  },
];

export const SlideEffectsModal: React.FC<SlideEffectsModalProps> = ({
  isOpen,
  onClose,
  currentEffects,
  slide,
  totalSlides,
  slideIndex,
  onApplyEffects,
}) => {
  const [transition, setTransition] = useState<SlideTransition>(
    currentEffects?.transition || 'fade'
  );
  const [duration, setDuration] = useState<number>(
    currentEffects?.transitionDuration || 0.6
  );
  const [buildEffect, setBuildEffect] = useState<ContentBuildEffect>(
    currentEffects?.buildEffect || 'stagger-slide'
  );
  const [staggerDelay, setStaggerDelay] = useState<number>(
    currentEffects?.staggerDelay || 150
  );
  const [enableSpotlight, setEnableSpotlight] = useState<boolean>(
    currentEffects?.enableSpotlight ?? false
  );
  const [enableParticles, setEnableParticles] = useState<boolean>(
    currentEffects?.enableAmbientParticles ?? true
  );
  const [enableSound, setEnableSound] = useState<boolean>(
    currentEffects?.enableSoundFX ?? true
  );
  const [previewKey, setPreviewKey] = useState<number>(0);

  if (!isOpen) return null;

  const handleApply = (applyToAll: boolean) => {
    const config: SlideEffectsConfig = {
      transition,
      transitionDuration: duration,
      buildEffect,
      staggerDelay,
      enableSpotlight,
      enableAmbientParticles: enableParticles,
      enableSoundFX: enableSound,
    };
    onApplyEffects(config, applyToAll);
    onClose();
  };

  return (
    <div
      id="slide-effects-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200"
    >
      <div className="bg-[#111622] border border-slate-700/80 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                Presentation & Slide Effects
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  Slide {slideIndex + 1} of {totalSlides}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Configure keynote transitions, build animations, and stage atmosphere.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-slate-200 text-sm">
          {/* Section 1: Slide Transitions */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Slide Transition Effect
              </label>
              <button
                onClick={() => setPreviewKey((k) => k + 1)}
                className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
              >
                <RotateCw className="w-3 h-3" />
                <span>Test Preview</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {TRANSITION_OPTIONS.map((opt) => {
                const isSelected = transition === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      setTransition(opt.id);
                      setPreviewKey((k) => k + 1);
                    }}
                    className={`p-3 rounded-xl border text-left flex flex-col justify-between transition-all ${
                      isSelected
                        ? 'bg-indigo-950/70 border-indigo-500 shadow-md ring-1 ring-indigo-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="text-base">{opt.icon}</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400 font-medium">
                        {opt.badge}
                      </span>
                    </div>
                    <div>
                      <span className="font-bold text-xs block">{opt.name}</span>
                      <span className="text-[10px] text-slate-400 line-clamp-1">
                        {opt.desc}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Transition Duration Slider */}
          <div className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-3.5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-400" />
              <div>
                <span className="text-xs font-bold text-slate-200">Transition Speed</span>
                <p className="text-[11px] text-slate-400">Duration of slide entry animation</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="0.3"
                max="1.5"
                step="0.1"
                value={duration}
                onChange={(e) => setDuration(parseFloat(e.target.value))}
                className="w-28 accent-indigo-500 cursor-pointer"
              />
              <span className="font-mono text-xs font-bold text-indigo-300 w-12 text-right">
                {duration.toFixed(1)}s
              </span>
            </div>
          </div>

          {/* Section 2: Content Build / Element Entrance Animations */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
              <Layers className="w-3.5 h-3.5 text-purple-400" />
              Element Build Animation (Inside Slide)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {BUILD_OPTIONS.map((b) => {
                const isSelected = buildEffect === b.id;
                return (
                  <button
                    key={b.id}
                    onClick={() => setBuildEffect(b.id)}
                    className={`p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      isSelected
                        ? 'bg-purple-950/60 border-purple-500 ring-1 ring-purple-500/40 text-white'
                        : 'bg-slate-900/60 border-slate-800 hover:border-slate-700 hover:bg-slate-800/50 text-slate-300'
                    }`}
                  >
                    <span className="text-xl mt-0.5">{b.icon}</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs">{b.name}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-purple-400" />}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">{b.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Section 3: Stage Atmosphere & Presenter Tools */}
          <div>
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-300 flex items-center gap-1.5 mb-3">
              <Flame className="w-3.5 h-3.5 text-pink-400" />
              Presentation Stage Atmosphere & FX
            </label>
            <div className="space-y-2">
              {/* Particles */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-indigo-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200">Ambient Particle Field</span>
                    <p className="text-[11px] text-slate-400">Subtle floating ambient stars matching theme</p>
                  </div>
                </div>
                <button
                  onClick={() => setEnableParticles(!enableParticles)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    enableParticles ? 'bg-indigo-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      enableParticles ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Sound effects */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  {enableSound ? (
                    <Volume2 className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <VolumeX className="w-4 h-4 text-slate-500" />
                  )}
                  <div>
                    <span className="text-xs font-bold text-slate-200">Audio Cues & Swoosh FX</span>
                    <p className="text-[11px] text-slate-400">
                      Subtle high-tech synthesized sound effects on slide transitions
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEnableSound(!enableSound)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    enableSound ? 'bg-emerald-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      enableSound ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>

              {/* Spotlight Mode */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900/50 border border-slate-800">
                <div className="flex items-center gap-2.5">
                  <Eye className="w-4 h-4 text-cyan-400" />
                  <div>
                    <span className="text-xs font-bold text-slate-200">Presenter Spotlight Mode</span>
                    <p className="text-[11px] text-slate-400">
                      Focus beam follows cursor to highlight specific bullet points (Hotkey: S)
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setEnableSpotlight(!enableSpotlight)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    enableSpotlight ? 'bg-cyan-600' : 'bg-slate-700'
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform absolute top-1 ${
                      enableSpotlight ? 'right-1' : 'left-1'
                    }`}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-900/70 flex items-center justify-between gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white rounded-xl hover:bg-slate-800 transition-all"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleApply(false)}
              className="px-4 py-2 text-xs font-semibold text-indigo-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-xl transition-all"
            >
              Apply to This Slide
            </button>
            <button
              onClick={() => handleApply(true)}
              className="px-5 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 rounded-xl shadow-md shadow-indigo-600/30 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Entire Deck</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
