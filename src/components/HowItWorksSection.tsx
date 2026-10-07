import React from 'react';
import { ArrowDown, ArrowRight, Cpu, ShieldCheck } from 'lucide-react';
import { NavSection } from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface HowItWorksSectionProps {
  onNavigate: (section: NavSection) => void;
  t: UITranslations;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({ onNavigate, t }) => {
  const architectureChain = [
    'Frontend',
    'n8n Chat Trigger',
    'TRIPGUARD AI Agent',
    'RailRadar tools',
    'recovery reasoning',
    'approval',
    'action workflow',
    'notification',
    'updated itinerary',
  ];

  const agenticNodes = [
    { id: 'user', label: 'USER', sub: 'Reports delay, cancellation, or connection risk' },
    { id: 'tripguard', label: 'TRIPGUARD AI', sub: 'Frontend interface & context manager' },
    {
      id: 'detection',
      label: 'DISRUPTION DETECTION',
      sub: 'n8n workflow parses train number & live status',
    },
    {
      id: 'discovery',
      label: 'ALTERNATIVE DISCOVERY',
      sub: 'Queries real-time rail routes & schedules via RailRadar tools',
    },
    {
      id: 'optimization',
      label: 'OPTIMIZATION',
      sub: 'Evaluates delay margin, arrival time & preferences',
    },
    {
      id: 'decision',
      label: 'DECISION',
      sub: 'Selects top 3 safest recovery options with explanations',
    },
    {
      id: 'approval',
      label: 'USER APPROVAL',
      sub: 'Traveler explicitly approves recovery plan',
    },
    {
      id: 'recovery',
      label: 'RECOVERY',
      sub: 'Triggers action workflow, sends notification & updates itinerary',
    },
  ];

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* VISUAL 5-STEP HOW IT WORKS SECTION */}
      <div className="space-y-6">
        <div className="max-w-2xl space-y-2">
          <p className="font-mono text-xs text-cyan-400 tracking-wider">
            5-STEP AUTONOMOUS RECOVERY
          </p>
          <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
            {t.howItWorks.title}
          </h2>
          <p className="text-sm sm:text-base text-slate-300">{t.howItWorks.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {t.howItWorks.fiveSteps.map((step) => (
            <div
              key={step.number}
              className="glass-panel rounded-2xl p-5 flex flex-col justify-between space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-cyan-400 tabular-nums">
                  {step.number}. {step.title}
                </span>
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">{step.title}</h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-1.5 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SAFETY & TRUST SECTION */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-5">
        <div className="flex items-center gap-2.5 border-b border-slate-800/80 pb-4">
          <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="font-display text-lg sm:text-xl font-bold text-white">
              {t.trustSection.title}
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">{t.trustSection.subtitle}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {t.trustSection.pillars.map((pillar) => (
            <div
              key={pillar}
              className="p-4 rounded-xl bg-slate-900/75 border border-slate-800 flex items-start gap-3"
            >
              <span className="font-mono font-bold text-emerald-400 mt-0.5">✓</span>
              <p className="text-xs sm:text-sm font-medium text-slate-200 leading-relaxed">
                {pillar}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* BACKEND INTEGRATION & AGENTIC AI VISUALIZATION */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Cpu className="w-4 h-4" aria-hidden="true" />
              <span>BACKEND INTEGRATION ARCHITECTURE</span>
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
              {t.howItWorks.agentArchitectureTitle}
            </h3>
          </div>
          <span className="font-mono text-xs text-cyan-300">VITE_N8N_CHAT_URL</span>
        </div>

        {/* Horizontal Architecture Pipeline */}
        <div className="flex flex-wrap items-center gap-2 p-4 rounded-xl bg-slate-950/70 border border-slate-800/80 text-xs font-mono">
          {architectureChain.map((item, idx) => (
            <React.Fragment key={item}>
              <span className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700/80 text-slate-200">
                {item}
              </span>
              {idx < architectureChain.length - 1 && (
                <ArrowRight className="w-3.5 h-3.5 text-cyan-400 shrink-0" aria-hidden="true" />
              )}
            </React.Fragment>
          ))}
        </div>

        {/* Vertical & Responsive Flow of Animated Agent Nodes */}
        <div className="max-w-xl mx-auto space-y-2 py-2">
          {agenticNodes.map((node, idx) => (
            <React.Fragment key={node.id}>
              <div className="glass-card rounded-xl px-4 py-3.5 flex items-center justify-between gap-4 border border-slate-800 hover:border-cyan-500/40 transition-colors">
                <div className="flex items-center gap-3 min-w-0">
                  <span
                    className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse-node shrink-0"
                    style={{ animationDelay: `${idx * 220}ms` }}
                  />
                  <div className="min-w-0">
                    <p className="font-mono text-xs sm:text-sm font-bold text-white tracking-wider">
                      {node.label}
                    </p>
                    <p className="text-xs text-slate-400 truncate mt-0.5">{node.sub}</p>
                  </div>
                </div>
                <span className="font-mono text-xs text-cyan-400/80 tabular-nums shrink-0">
                  STAGE 0{idx + 1}
                </span>
              </div>

              {idx < agenticNodes.length - 1 && (
                <div className="flex justify-center py-0.5" aria-hidden="true">
                  <ArrowDown className="w-4 h-4 text-cyan-400/75" />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
};
