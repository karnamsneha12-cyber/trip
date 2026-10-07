import React from 'react';
import {
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  Train,
  Sparkles,
  Compass,
  CheckCircle2,
} from 'lucide-react';
import { NavSection } from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface HeroSectionProps {
  onNavigate: (section: NavSection) => void;
  t: UITranslations;
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate, t }) => {
  const timelineNodes = [
    {
      id: 'journey',
      label: t.hero.timelineSteps.yourJourney,
      detail: 'Active rail schedule & route telemetry',
      icon: Train,
      tone: 'border-slate-700/80 bg-slate-900/80 text-slate-200',
      dot: 'bg-sky-400',
    },
    {
      id: 'disruption',
      label: t.hero.timelineSteps.disruptionDetected,
      detail: 'Delay, cancellation, or connection risk identified',
      icon: Compass,
      tone: 'border-amber-500/35 bg-amber-950/20 text-amber-200',
      dot: 'bg-amber-400',
    },
    {
      id: 'analysis',
      label: t.hero.timelineSteps.aiAnalysis,
      detail: 'n8n Autonomous Agent evaluates constraints & feasibility',
      icon: Sparkles,
      tone: 'border-cyan-500/40 bg-cyan-950/25 text-cyan-200',
      dot: 'bg-cyan-400',
    },
    {
      id: 'alternatives',
      label: t.hero.timelineSteps.alternativesFound,
      detail: 'Up to 3 verified recovery options ranked by arrival time',
      icon: ShieldCheck,
      tone: 'border-sky-500/35 bg-sky-950/25 text-sky-200',
      dot: 'bg-sky-400',
    },
    {
      id: 'recovered',
      label: t.hero.timelineSteps.recoveredJourney,
      detail: 'Traveler approves option & itinerary is updated',
      icon: CheckCircle2,
      tone: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-200',
      dot: 'bg-emerald-400',
    },
  ];

  return (
    <section className="relative overflow-hidden py-12 sm:py-16 lg:py-20 border-b border-slate-800/80">
      {/* Subtle architectural gradient backdrop */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/4 w-[480px] h-[480px] rounded-full bg-cyan-500/8 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-10 w-[380px] h-[380px] rounded-full bg-blue-600/8 blur-[110px]"
      />

      <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Value Proposition & Primary Actions */}
          <div className="lg:col-span-7 space-y-6">
            <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-cyan-300 tracking-wide">
              <span>{t.hero.badge}</span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-slate-400">{t.hero.title}</span>
              <span aria-hidden="true" className="text-slate-600">
                ·
              </span>
              <span className="text-slate-300">{t.hero.subtitle}</span>
            </div>

            <div className="space-y-3">
              <p className="text-xs sm:text-sm font-mono tracking-wider text-cyan-400">
                {t.hero.title} — {t.hero.subtitle}
              </p>
              <h1 className="font-display text-3xl sm:text-5xl lg:text-[52px] font-bold tracking-tight text-white leading-[1.12] max-w-2xl">
                <span className="block text-slate-100">{t.hero.headlineLine1}</span>
                <span className="block bg-gradient-to-r from-cyan-300 via-sky-400 to-blue-400 bg-clip-text text-transparent mt-1">
                  {t.hero.headlineLine2}
                </span>
              </h1>
            </div>

            <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-xl">
              {t.hero.description}
            </p>

            {/* Primary & Secondary Action Buttons */}
            <div className="flex flex-wrap items-center gap-3.5 pt-2">
              <button
                type="button"
                onClick={() => onNavigate('recovery')}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm sm:text-base font-semibold text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
              >
                <span>{t.hero.startRecoveryBtn}</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={() => onNavigate('whatif')}
                className="inline-flex items-center gap-2 px-6 py-3.5 text-sm sm:text-base font-medium text-white bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 hover:border-cyan-400 rounded-xl transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>{t.hero.tryWhatIfBtn}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigate('howitworks')}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-slate-300 hover:text-white bg-slate-950/60 hover:bg-slate-900 border border-slate-800 rounded-xl transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                <span>{t.hero.seeHowItWorksBtn}</span>
              </button>
            </div>

            {/* Data Integrity & Safety Commitments */}
            <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-slate-400">
              <span>Live n8n Chat Trigger Integration</span>
              <span aria-hidden="true">·</span>
              <span>RailRadar Real-Time Tools</span>
              <span aria-hidden="true">·</span>
              <span>Human Approval Before Action</span>
            </div>
          </div>

          {/* Right Column: Visual Journey Timeline */}
          <div className="lg:col-span-5">
            <div className="glass-panel rounded-2xl p-6 sm:p-7 shadow-xl">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-800/80">
                <div>
                  <h2 className="text-sm font-semibold text-white tracking-wide">
                    {t.hero.timelineTitle}
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time disruption to recovery state machine
                  </p>
                </div>
                <span className="text-xs font-mono text-cyan-400">n8n AGENT</span>
              </div>

              <div className="space-y-2">
                {timelineNodes.map((node, index) => {
                  const IconComponent = node.icon;
                  return (
                    <React.Fragment key={node.id}>
                      <div
                        className={`flex items-center gap-3.5 p-3.5 rounded-xl border transition-all ${node.tone}`}
                      >
                        <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-slate-950/70 border border-slate-800 shrink-0">
                          <IconComponent className="w-4 h-4" aria-hidden="true" />
                          <span
                            className={`absolute -top-1 -right-1 w-2 h-2 rounded-full ${node.dot} animate-pulse-node`}
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-2">
                            <p className="font-mono text-xs sm:text-sm font-semibold tracking-wide truncate">
                              {node.label}
                            </p>
                            <span className="font-mono text-[11px] text-slate-400 tabular-nums">
                              0{index + 1}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 truncate mt-0.5">{node.detail}</p>
                        </div>
                      </div>

                      {index < timelineNodes.length - 1 && (
                        <div className="flex justify-center py-0.5" aria-hidden="true">
                          <ArrowDown className="w-4 h-4 text-cyan-400/70" />
                        </div>
                      )}
                    </React.Fragment>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
