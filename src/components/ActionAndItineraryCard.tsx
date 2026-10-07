import React from 'react';
import { ArrowDown, CheckCircle2, Clock, ShieldAlert } from 'lucide-react';
import { ActionStatusStage, UpdatedItineraryData } from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface ActionAndItineraryProps {
  updatedItinerary?: UpdatedItineraryData;
  t: UITranslations;
}

export const ActionAndItineraryCard: React.FC<ActionAndItineraryProps> = ({
  updatedItinerary,
  t,
}) => {
  const stages: { id: ActionStatusStage; label: string }[] = [
    { id: 'Recovery option selected', label: t.actionStatus.stages.selected },
    { id: 'Booking preparation', label: t.actionStatus.stages.preparation },
    { id: 'Pending secure confirmation', label: t.actionStatus.stages.pendingConfirmation },
    { id: 'Notification prepared', label: t.actionStatus.stages.notificationPrepared },
    { id: 'Itinerary updated', label: t.actionStatus.stages.itineraryUpdated },
  ];

  const afterApprovalChecklist = [
    t.actionStatus.afterApprovalChecklist.recoveryApproved,
    t.actionStatus.afterApprovalChecklist.bookingActionRequested,
    t.actionStatus.afterApprovalChecklist.notificationSent,
    t.actionStatus.afterApprovalChecklist.itineraryUpdated,
  ];

  const timelineSteps = [
    t.updatedItinerary.timeline.originalJourney,
    t.updatedItinerary.timeline.disruption,
    t.updatedItinerary.timeline.alternativeFound,
    t.updatedItinerary.timeline.userApproved,
    t.updatedItinerary.timeline.recoveryPlan,
  ];

  if (!updatedItinerary) {
    return null;
  }

  const { selectedOption, originalJourney, actionMessage, confirmedBooking } = updatedItinerary;

  const selectedPlanSummary = [
    `Option ${selectedOption.optionNumber}`,
    selectedOption.trainName,
    selectedOption.trainNumber ? `(#${selectedOption.trainNumber})` : undefined,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <div className="space-y-6">
      {/* 10. AFTER APPROVAL & ACTION STATUS COMPONENT */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <h3 className="text-base font-semibold text-white">{t.actionStatus.title}</h3>
          <span className="font-mono text-xs font-semibold text-emerald-300">
            {t.actionStatus.statusCardTitle}
          </span>
        </div>

        {/* Status Card: Recovery Plan Selected + After Approval Checklist */}
        <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/40 space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-mono text-xs sm:text-sm font-bold text-emerald-300">
              {t.actionStatus.statusCardTitle}
            </span>
            <span className="font-mono text-xs text-slate-400 tabular-nums">
              {updatedItinerary.updatedAt}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {afterApprovalChecklist.map((item) => (
              <div
                key={item}
                className="flex items-center gap-2 text-xs sm:text-sm font-medium text-emerald-100"
              >
                <span className="font-mono font-bold text-emerald-400">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Booking Confirmation Status Banner */}
        <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/40 flex items-start gap-3">
          <Clock className="w-5 h-5 text-cyan-300 shrink-0 mt-0.5" aria-hidden="true" />
          <div className="space-y-1">
            <p className="text-sm font-semibold text-white">
              {confirmedBooking
                ? actionMessage
                : t.actionStatus.bookingConfirmationRequired}
            </p>
            {!confirmedBooking && (
              <p className="text-xs text-slate-300">{t.actionStatus.defaultMvpStatus}</p>
            )}
            <p className="text-xs text-slate-400">{t.actionStatus.noTicketBookedDisclaimer}</p>
          </div>
        </div>

        {/* 5 Action Status Stages */}
        <div className="grid grid-cols-1 sm:grid-cols-5 gap-2 pt-1">
          {stages.map((stage, idx) => {
            const isCompleted = idx <= 3 || idx === 4;
            return (
              <div
                key={stage.id}
                className={`p-2.5 rounded-lg border text-xs flex items-center gap-2 ${
                  isCompleted
                    ? 'border-cyan-500/35 bg-cyan-950/20 text-cyan-200'
                    : 'border-slate-800 bg-slate-900/50 text-slate-400'
                }`}
              >
                <CheckCircle2
                  className={`w-3.5 h-3.5 shrink-0 ${
                    isCompleted ? 'text-cyan-400' : 'text-slate-600'
                  }`}
                  aria-hidden="true"
                />
                <span className="truncate" title={stage.label}>
                  {stage.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* 11. UPDATED ITINERARY CARD */}
      <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
          <h3 className="font-mono text-sm sm:text-base font-bold tracking-wider text-emerald-300">
            {t.updatedItinerary.title}
          </h3>
          <span className="font-mono text-xs text-slate-400 tabular-nums">
            {updatedItinerary.updatedAt}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Left: Structured Summary Fields */}
          <dl className="md:col-span-7 space-y-3">
            {originalJourney && (
              <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
                <dt className="text-xs text-slate-400">{t.updatedItinerary.originalJourney}</dt>
                <dd className="font-mono text-sm font-semibold text-white mt-1 tabular-nums">
                  {originalJourney}
                </dd>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-emerald-950/20 border border-emerald-500/35">
              <dt className="text-xs text-emerald-300">{t.updatedItinerary.recoveryPlan}</dt>
              <dd className="text-sm font-semibold text-white mt-1">{selectedPlanSummary}</dd>
              {(selectedOption.departure || selectedOption.arrival) && (
                <dd className="font-mono text-xs text-slate-300 mt-1 tabular-nums">
                  {selectedOption.departure ? `Dep: ${selectedOption.departure}` : ''}
                  {selectedOption.departure && selectedOption.arrival ? ' · ' : ''}
                  {selectedOption.arrival ? `Arr: ${selectedOption.arrival}` : ''}
                </dd>
              )}
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/70 border border-slate-800">
              <dt className="text-xs text-slate-400">{t.updatedItinerary.status}</dt>
              <dd className="text-sm font-semibold text-cyan-300 mt-1">
                {t.updatedItinerary.recoveryPlanSelected}
              </dd>
            </div>
          </dl>

          {/* Right: 5-Stage Recovery Timeline */}
          <div className="md:col-span-5 p-4 rounded-xl bg-slate-950/60 border border-slate-800/80">
            <div className="space-y-1.5">
              {timelineSteps.map((step, index) => (
                <React.Fragment key={step}>
                  <div className="flex items-center gap-2.5 px-3 py-2 rounded-lg bg-slate-900/90 border border-slate-800 text-xs font-medium text-slate-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 shrink-0" />
                    <span>{step}</span>
                  </div>
                  {index < timelineSteps.length - 1 && (
                    <div className="flex justify-center" aria-hidden="true">
                      <ArrowDown className="w-3.5 h-3.5 text-cyan-400/70" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400 pt-2 border-t border-slate-800/60">
          <ShieldAlert className="w-4 h-4 text-cyan-400 shrink-0" aria-hidden="true" />
          <span>{t.actionStatus.bookingConfirmationRequired}</span>
        </div>
      </div>
    </div>
  );
};
