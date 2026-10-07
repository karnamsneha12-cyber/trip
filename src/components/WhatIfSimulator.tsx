import React, { useState } from 'react';
import { AlertCircle, Compass, Send, Sparkles } from 'lucide-react';
import {
  PlanComparisonMetrics,
  RecoveryOption,
  TrainStatusData,
  WhatIfAnalysis,
} from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface WhatIfSimulatorProps {
  whatIfResult?: WhatIfAnalysis;
  trainStatus?: TrainStatusData;
  alternatives?: RecoveryOption[];
  selectedOption?: RecoveryOption;
  isSimulating: boolean;
  simulationError?: string;
  onRunSimulation: (scenarioPrompt: string) => void;
  t: UITranslations;
}

export const WhatIfSimulator: React.FC<WhatIfSimulatorProps> = ({
  whatIfResult,
  trainStatus,
  alternatives = [],
  selectedOption,
  isSimulating,
  simulationError,
  onRunSimulation,
  t,
}) => {
  const [scenarioInput, setScenarioInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = scenarioInput.trim();
    if (!trimmed || isSimulating) return;
    onRunSimulation(trimmed);
  };

  const handlePresetClick = (preset: string) => {
    setScenarioInput(preset);
    if (!isSimulating) {
      onRunSimulation(preset);
    }
  };

  // Derive CURRENT PLAN vs ALTERNATIVE comparison strictly from real backend data (never invented)
  const currentMetrics: PlanComparisonMetrics | undefined =
    whatIfResult?.currentMetrics ||
    (trainStatus
      ? {
          label: [trainStatus.trainName, trainStatus.trainNumber].filter(Boolean).join(' #'),
          departure: trainStatus.scheduledDeparture,
          arrival: trainStatus.expectedArrival || trainStatus.scheduledArrival,
          delay: trainStatus.delay,
          travelTime: trainStatus.travelTime,
          route:
            trainStatus.route ||
            (trainStatus.source && trainStatus.destination
              ? `${trainStatus.source} → ${trainStatus.destination}`
              : undefined),
          risk: trainStatus.risk || trainStatus.currentStatus,
        }
      : undefined);

  const chosenAlternative =
    selectedOption ||
    alternatives.find((a) => a.isRecommended) ||
    alternatives[0];

  const alternativeMetrics: PlanComparisonMetrics | undefined =
    whatIfResult?.alternativeMetrics ||
    (chosenAlternative
      ? {
          label: [chosenAlternative.trainName, chosenAlternative.trainNumber]
            .filter(Boolean)
            .join(' #'),
          departure: chosenAlternative.departure,
          arrival: chosenAlternative.arrival,
          delay: chosenAlternative.delay,
          travelTime: chosenAlternative.travelTime,
          route: chosenAlternative.route,
          risk: chosenAlternative.risk,
        }
      : undefined);

  const metricRows: Array<{
    key: keyof Omit<PlanComparisonMetrics, 'label'>;
    label: string;
  }> = [
    { key: 'departure', label: t.whatIf.metrics.departure },
    { key: 'arrival', label: t.whatIf.metrics.arrival },
    { key: 'delay', label: t.whatIf.metrics.delay },
    { key: 'travelTime', label: t.whatIf.metrics.travelTime },
    { key: 'route', label: t.whatIf.metrics.route },
    { key: 'risk', label: t.whatIf.metrics.risk },
  ];

  const availableMetricRows = metricRows.filter(
    (row) =>
      Boolean(currentMetrics?.[row.key]) || Boolean(alternativeMetrics?.[row.key])
  );

  return (
    <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header & Input Card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8 space-y-6">
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800/80 pb-5">
          <div className="space-y-1.5 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
              <Compass className="w-4 h-4" aria-hidden="true" />
              <span>WHAT-IF SCENARIO & COMPARISON ENGINE</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl font-bold text-white">
              {t.whatIf.title}
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed">{t.whatIf.subtitle}</p>
          </div>

          <div className="flex flex-col items-end gap-1 text-xs font-mono">
            <span className="text-emerald-300">{t.safetyBadges.confirmedLiveData}</span>
            <span className="text-cyan-300">{t.safetyBadges.aiReasoningEstimation}</span>
          </div>
        </div>

        {/* Preset Scenario Prompts */}
        <div className="space-y-2">
          <p className="text-xs font-medium text-slate-400">
            Select a What-If scenario or enter your own question:
          </p>
          <div className="flex flex-wrap gap-2.5">
            {t.whatIf.presetPrompts.map((preset) => (
              <button
                key={preset}
                type="button"
                disabled={isSimulating}
                onClick={() => handlePresetClick(preset)}
                className="px-3.5 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-xs sm:text-sm text-slate-200 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 transition-all cursor-pointer disabled:opacity-50"
              >
                “{preset}”
              </button>
            ))}
          </div>
        </div>

        {/* Custom Scenario Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <label htmlFor="what-if-scenario-input" className="sr-only">
            {t.whatIf.inputPlaceholder}
          </label>
          <input
            id="what-if-scenario-input"
            type="text"
            value={scenarioInput}
            onChange={(e) => setScenarioInput(e.target.value)}
            placeholder={t.whatIf.inputPlaceholder}
            disabled={isSimulating}
            className="flex-1 px-4 py-3 text-sm bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-400"
          />
          <button
            type="submit"
            disabled={isSimulating || !scenarioInput.trim()}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-40 transition-all inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
          >
            <span>{isSimulating ? 'Querying n8n Agent...' : t.whatIf.analyzeButton}</span>
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </form>

        {/* Error Display when n8n Backend Cannot Be Reached */}
        {simulationError && (
          <div
            role="alert"
            className="p-4 rounded-xl bg-red-950/35 border border-red-500/40 flex items-start gap-3 text-red-100"
          >
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <p className="text-sm font-semibold">{simulationError}</p>
              <p className="text-xs text-red-200/80">
                TRIPGUARD AI never fabricates comparison or simulation data when the recovery
                service is unreachable.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* CURRENT PLAN vs ALTERNATIVE Comparison Card (only displays actual returned fields) */}
      <div className="glass-panel rounded-2xl p-6 sm:p-7 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800/80 pb-4">
          <div className="flex items-center gap-3">
            <span className="font-mono text-sm font-bold text-white">
              {t.whatIf.currentPlanHeader}
            </span>
            <span className="font-mono text-xs text-cyan-400">{t.whatIf.vsLabel}</span>
            <span className="font-mono text-sm font-bold text-cyan-300">
              {t.whatIf.alternativeHeader}
            </span>
          </div>
          <span className="font-mono text-xs text-amber-300 font-semibold">
            {t.whatIf.recommendationBadge}
          </span>
        </div>

        {availableMetricRows.length === 0 ? (
          <p className="text-xs sm:text-sm text-slate-400 py-3">
            Comparison metrics (Departure, Arrival, Delay, Travel time, Route, Risk) populate
            automatically from live train status and alternative options returned by the n8n
            backend. Never invented.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* CURRENT PLAN COLUMN */}
            <div className="glass-card rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="font-mono text-xs font-bold tracking-wider text-slate-200">
                  {t.whatIf.currentPlanHeader}
                </h3>
                {currentMetrics?.label && (
                  <span className="font-mono text-xs text-amber-300 tabular-nums">
                    {currentMetrics.label}
                  </span>
                )}
              </div>
              <dl className="space-y-2 text-xs">
                {availableMetricRows.map(
                  (row) =>
                    currentMetrics?.[row.key] && (
                      <div
                        key={row.key}
                        className="flex items-start justify-between gap-4 py-1 border-b border-slate-800/50 last:border-0"
                      >
                        <dt className="text-slate-400 shrink-0">{row.label}</dt>
                        <dd className="font-mono text-slate-100 text-right tabular-nums">
                          {currentMetrics[row.key]}
                        </dd>
                      </div>
                    )
                )}
              </dl>
            </div>

            {/* ALTERNATIVE PLAN COLUMN */}
            <div className="glass-card-active rounded-xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
                <h3 className="font-mono text-xs font-bold tracking-wider text-cyan-300">
                  {t.whatIf.alternativeHeader}
                </h3>
                {alternativeMetrics?.label && (
                  <span className="font-mono text-xs text-emerald-300 tabular-nums">
                    {alternativeMetrics.label}
                  </span>
                )}
              </div>
              <dl className="space-y-2 text-xs">
                {availableMetricRows.map(
                  (row) =>
                    alternativeMetrics?.[row.key] && (
                      <div
                        key={row.key}
                        className="flex items-start justify-between gap-4 py-1 border-b border-slate-800/50 last:border-0"
                      >
                        <dt className="text-slate-300 shrink-0">{row.label}</dt>
                        <dd className="font-mono text-white font-medium text-right tabular-nums">
                          {alternativeMetrics[row.key]}
                        </dd>
                      </div>
                    )
                )}
              </dl>
            </div>
          </div>
        )}
      </div>

      {/* 4-Panel Structured Output: CURRENT PLAN, POSSIBLE IMPACT, ALTERNATIVE PLAN, RECOMMENDATION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* 1. CURRENT PLAN */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="font-mono text-sm font-bold tracking-wider text-white">
              {t.whatIf.cards.currentPlan}
            </h3>
            <span className="font-mono text-[11px] text-emerald-300">
              {t.safetyBadges.confirmedLiveData}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {whatIfResult?.currentPlan || t.whatIf.emptyPrompt}
          </p>
        </div>

        {/* 2. POSSIBLE IMPACT */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="font-mono text-sm font-bold tracking-wider text-amber-300">
              {t.whatIf.cards.possibleImpact}
            </h3>
            <span className="font-mono text-[11px] text-amber-300">
              {t.safetyBadges.aiReasoningEstimation}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {whatIfResult?.possibleImpact || t.whatIf.emptyPrompt}
          </p>
        </div>

        {/* 3. ALTERNATIVE PLAN */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="font-mono text-sm font-bold tracking-wider text-cyan-300">
              {t.whatIf.cards.alternativePlan}
            </h3>
            <span className="font-mono text-[11px] text-cyan-300">
              {t.safetyBadges.aiRecommendation}
            </span>
          </div>
          <p className="text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
            {whatIfResult?.alternativePlan || t.whatIf.emptyPrompt}
          </p>
        </div>

        {/* 4. ⭐ TRIPGUARD RECOMMENDATION */}
        <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-3 border-cyan-500/35">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
            <h3 className="font-mono text-sm font-bold tracking-wider text-amber-300 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" aria-hidden="true" />
              <span>{t.whatIf.recommendationBadge}</span>
            </h3>
            <span className="font-mono text-[11px] text-cyan-300">
              {t.safetyBadges.aiRecommendation}
            </span>
          </div>
          <p className="text-sm text-slate-200 leading-relaxed whitespace-pre-wrap">
            {whatIfResult?.recommendation ||
              chosenAlternative?.whyThisOption ||
              t.whatIf.emptyPrompt}
          </p>
        </div>
      </div>
    </section>
  );
};
