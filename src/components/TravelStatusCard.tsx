import React from 'react';
import { AlertTriangle, CheckCircle2, Clock, GitFork, Train, XCircle } from 'lucide-react';
import { TrainStatusData, TrainStatusIndicator } from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface TravelStatusCardProps {
  trainStatus?: TrainStatusData;
  t: UITranslations;
}

function normalizeStatusBadge(rawStatus?: string): {
  indicator: TrainStatusIndicator | null;
  toneClass: string;
  Icon: React.ElementType;
} {
  if (!rawStatus) {
    return { indicator: null, toneClass: 'text-slate-300', Icon: Train };
  }
  const upper = rawStatus.toUpperCase();
  if (upper.includes('CANCEL')) {
    return {
      indicator: 'CANCELLED',
      toneClass: 'text-red-300 border-red-500/40 bg-red-950/30',
      Icon: XCircle,
    };
  }
  if (upper.includes('DIVERT')) {
    return {
      indicator: 'DIVERTED',
      toneClass: 'text-purple-300 border-purple-500/40 bg-purple-950/30',
      Icon: GitFork,
    };
  }
  if (upper.includes('DELAY') || upper.includes('LATE')) {
    return {
      indicator: 'DELAYED',
      toneClass: 'text-amber-300 border-amber-500/40 bg-amber-950/30',
      Icon: Clock,
    };
  }
  if (upper.includes('RUN') || upper.includes('ON TIME') || upper.includes('ONTIME')) {
    return {
      indicator: 'RUNNING',
      toneClass: 'text-emerald-300 border-emerald-500/40 bg-emerald-950/30',
      Icon: CheckCircle2,
    };
  }
  return {
    indicator: null,
    toneClass: 'text-cyan-300 border-cyan-500/40 bg-cyan-950/30',
    Icon: AlertTriangle,
  };
}

export const TravelStatusCard: React.FC<TravelStatusCardProps> = ({ trainStatus, t }) => {
  // Ordered list of all possible backend fields.
  // Only fields that actually exist in `trainStatus` are rendered.
  const fieldDefinitions: Array<{
    key: keyof TrainStatusData;
    label: string;
    isMono?: boolean;
  }> = [
    { key: 'trainNumber', label: t.travelStatus.fields.trainNumber, isMono: true },
    { key: 'trainName', label: t.travelStatus.fields.trainName },
    { key: 'currentStatus', label: t.travelStatus.fields.currentStatus },
    { key: 'delay', label: t.travelStatus.fields.delay, isMono: true },
    { key: 'journeyDate', label: t.travelStatus.fields.journeyDate, isMono: true },
    { key: 'source', label: t.travelStatus.fields.source },
    { key: 'destination', label: t.travelStatus.fields.destination },
    { key: 'route', label: t.travelStatus.fields.route },
    { key: 'currentStation', label: t.travelStatus.fields.currentStation },
    { key: 'previousStation', label: t.travelStatus.fields.previousStation },
    { key: 'nextStation', label: t.travelStatus.fields.nextStation },
    { key: 'scheduledArrival', label: t.travelStatus.fields.scheduledArrival, isMono: true },
    { key: 'expectedArrival', label: t.travelStatus.fields.expectedArrival, isMono: true },
    { key: 'travelTime', label: t.travelStatus.fields.travelTime, isMono: true },
    { key: 'platform', label: t.travelStatus.fields.platform, isMono: true },
  ];

  const populatedFields = trainStatus
    ? fieldDefinitions.filter((f) => {
        const val = trainStatus[f.key];
        return typeof val === 'string' && val.trim().length > 0;
      })
    : [];

  const statusMeta = normalizeStatusBadge(trainStatus?.currentStatus || trainStatus?.delay);
  const StatusIcon = statusMeta.Icon;

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6">
      {/* Header with explicit safety label */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Train className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
          <h3 className="text-base font-semibold text-white">
            {populatedFields.length > 0
              ? t.travelStatus.disruptionBannerTitle
              : t.travelStatus.cardTitle}
          </h3>
        </div>

        <span className="font-mono text-[11px] font-medium text-emerald-300 tracking-wide">
          {t.safetyBadges.confirmedLiveData}
        </span>
      </div>

      {populatedFields.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <p className="text-sm font-medium text-slate-300">{t.travelStatus.emptyTitle}</p>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {t.travelStatus.emptyDescription}
          </p>
          {/* Status Indicator Legend */}
          <div className="pt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono text-slate-400">
            <span className="text-emerald-400">RUNNING</span>
            <span aria-hidden="true">·</span>
            <span className="text-amber-400">DELAYED</span>
            <span aria-hidden="true">·</span>
            <span className="text-red-400">CANCELLED</span>
            <span aria-hidden="true">·</span>
            <span className="text-purple-400">DIVERTED</span>
          </div>
        </div>
      ) : (
        <div className="pt-4 space-y-4">
          {/* Status Indicator Banner if currentStatus or delay is returned */}
          {(statusMeta.indicator || trainStatus?.currentStatus) && (
            <div
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl border ${statusMeta.toneClass}`}
            >
              <div className="flex items-center gap-2">
                <StatusIcon className="w-4 h-4 shrink-0" aria-hidden="true" />
                <span className="font-mono text-xs font-semibold tracking-wider">
                  {statusMeta.indicator || trainStatus?.currentStatus}
                </span>
              </div>
              {trainStatus?.currentStatus &&
                statusMeta.indicator &&
                trainStatus.currentStatus.toUpperCase() !== statusMeta.indicator && (
                  <span className="text-xs opacity-90">{trainStatus.currentStatus}</span>
                )}
            </div>
          )}

          {/* Structured Key-Value Grid of ONLY returned fields */}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {populatedFields.map(({ key, label, isMono }) => (
              <div
                key={key}
                className="flex flex-col py-2 border-b border-slate-800/60 last:border-b-0"
              >
                <dt className="text-xs text-slate-400">{label}</dt>
                <dd
                  className={`text-sm font-semibold text-white mt-0.5 ${
                    isMono ? 'font-mono tabular-nums' : ''
                  }`}
                >
                  {trainStatus![key]}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};
