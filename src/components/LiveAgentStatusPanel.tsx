import React from 'react';
import { Check, Loader2, ShieldCheck } from 'lucide-react';
import {
  AgentActivityState,
  LiveAgentStatuses,
  ProcessingStepStatus,
} from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface LiveAgentStatusPanelProps {
  agentStatuses: LiveAgentStatuses;
  processingSteps: ProcessingStepStatus;
  isProcessing: boolean;
  hasInteracted: boolean;
  t: UITranslations;
}

export const LiveAgentStatusPanel: React.FC<LiveAgentStatusPanelProps> = ({
  agentStatuses,
  processingSteps,
  isProcessing,
  hasInteracted,
  t,
}) => {
  const agentsList: Array<{
    key: keyof LiveAgentStatuses;
    label: string;
    state: AgentActivityState;
  }> = [
    {
      key: 'disruptionDetection',
      label: t.liveAgents.agents.disruptionDetection,
      state: agentStatuses.disruptionDetection,
    },
    {
      key: 'alternativeDiscovery',
      label: t.liveAgents.agents.alternativeDiscovery,
      state: agentStatuses.alternativeDiscovery,
    },
    {
      key: 'recoveryOptimization',
      label: t.liveAgents.agents.recoveryOptimization,
      state: agentStatuses.recoveryOptimization,
    },
    {
      key: 'safetyCheck',
      label: t.liveAgents.agents.safetyCheck,
      state: agentStatuses.safetyCheck,
    },
    {
      key: 'decisionAgent',
      label: t.liveAgents.agents.decisionAgent,
      state: agentStatuses.decisionAgent,
    },
    {
      key: 'notificationAgent',
      label: t.liveAgents.agents.notificationAgent,
      state: agentStatuses.notificationAgent,
    },
  ];

  const timelineItems = [
    {
      id: 'disruptionDetected',
      label: t.chat.processingTimeline.disruptionDetected,
      done: processingSteps.disruptionDetected,
    },
    {
      id: 'checkingLiveStatus',
      label: t.chat.processingTimeline.checkingLiveStatus,
      done: processingSteps.checkingLiveStatus,
    },
    {
      id: 'searchingAlternatives',
      label: t.chat.processingTimeline.searchingAlternatives,
      done: processingSteps.searchingAlternatives,
    },
    {
      id: 'comparingOptions',
      label: t.chat.processingTimeline.comparingOptions,
      done: processingSteps.comparingOptions,
    },
    {
      id: 'recommendationReady',
      label: t.chat.processingTimeline.recommendationReady,
      done: processingSteps.recommendationReady,
    },
  ];

  const getStateBadge = (state: AgentActivityState) => {
    switch (state) {
      case 'active':
        return {
          text: t.liveAgents.states.active,
          className: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30',
          dot: 'bg-cyan-400 animate-pulse',
        };
      case 'completed':
        return {
          text: t.liveAgents.states.completed,
          className: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/25',
          dot: 'bg-emerald-400',
        };
      case 'alert':
        return {
          text: t.liveAgents.states.alert,
          className: 'text-amber-300 border-amber-500/40 bg-amber-950/25',
          dot: 'bg-amber-400',
        };
      default:
        return {
          text: t.liveAgents.states.idle,
          className: 'text-slate-400 border-slate-800 bg-slate-900/60',
          dot: 'bg-slate-500',
        };
    }
  };

  return (
    <div className="space-y-6">
      {/* Agent Processing Timeline (shown during & after recovery analysis) */}
      {(isProcessing || hasInteracted) && (
        <div className="glass-panel rounded-2xl p-5 space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="font-mono text-xs sm:text-sm font-bold tracking-wider text-cyan-300">
              {t.chat.processingTimeline.title}
            </h3>
            {isProcessing ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-mono text-cyan-300">
                <Loader2 className="w-3.5 h-3.5 animate-spin" aria-hidden="true" />
                <span>Processing</span>
              </span>
            ) : (
              <span className="text-xs font-mono text-emerald-300">Pipeline Synced</span>
            )}
          </div>

          <ul className="space-y-2">
            {timelineItems.map((step) => (
              <li
                key={step.id}
                className={`flex items-center gap-2.5 text-xs sm:text-sm px-3 py-2 rounded-xl border transition-colors ${
                  step.done
                    ? 'border-emerald-500/30 bg-emerald-950/15 text-emerald-200'
                    : isProcessing
                    ? 'border-cyan-500/30 bg-cyan-950/15 text-cyan-200'
                    : 'border-slate-800/80 bg-slate-900/40 text-slate-400'
                }`}
              >
                {step.done ? (
                  <span className="font-mono font-bold text-emerald-400" aria-hidden="true">
                    ✓
                  </span>
                ) : isProcessing ? (
                  <Loader2 className="w-3.5 h-3.5 text-cyan-400 animate-spin shrink-0" />
                ) : (
                  <Check className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                )}
                <span>{step.label}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* LIVE AGENT STATUS PANEL: TRIPGUARD AGENTS */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="border-b border-slate-800/80 pb-3">
          <h3 className="font-mono text-sm font-bold tracking-wider text-white">
            {t.liveAgents.title}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">{t.liveAgents.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {agentsList.map((agent) => {
            const badge = getStateBadge(agent.state);
            return (
              <div
                key={agent.key}
                className={`p-3 rounded-xl border flex items-center justify-between gap-2 transition-all ${badge.className}`}
              >
                <span className="text-xs sm:text-sm font-medium text-white truncate">
                  {agent.label}
                </span>
                <span className="inline-flex items-center gap-1.5 font-mono text-[11px] shrink-0">
                  <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                  <span>{badge.text}</span>
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* SAFETY & TRUST SECTION */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3.5">
        <div className="flex items-center gap-2 border-b border-slate-800/80 pb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" aria-hidden="true" />
          <h3 className="text-sm font-semibold text-white">{t.trustSection.title}</h3>
        </div>
        <ul className="space-y-2">
          {t.trustSection.pillars.map((pillar) => (
            <li key={pillar} className="flex items-start gap-2.5 text-xs text-slate-300">
              <span className="font-mono text-emerald-400 font-bold mt-0.5">✓</span>
              <span>{pillar}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
