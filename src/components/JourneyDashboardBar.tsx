import React from 'react';
import {
  RecoveryOption,
  TrainStatusData,
  UpdatedItineraryData,
} from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface JourneyDashboardBarProps {
  trainStatus?: TrainStatusData;
  alternatives: RecoveryOption[];
  selectedOption?: RecoveryOption;
  updatedItinerary?: UpdatedItineraryData;
  lastUserReport?: string;
  t: UITranslations;
}

export const JourneyDashboardBar: React.FC<JourneyDashboardBarProps> = ({
  trainStatus,
  alternatives,
  selectedOption,
  updatedItinerary,
  lastUserReport,
  t,
}) => {
  // Derive Current Journey strictly from returned live data or user report (never invent fake cities)
  const journeyDisplay = (() => {
    if (trainStatus?.source && trainStatus?.destination) {
      return `${trainStatus.source} → ${trainStatus.destination}`;
    }
    if (trainStatus?.trainNumber && trainStatus?.trainName) {
      return `${trainStatus.trainNumber} · ${trainStatus.trainName}`;
    }
    if (trainStatus?.trainNumber) {
      return `Train ${trainStatus.trainNumber}`;
    }
    if (updatedItinerary?.originalJourney) {
      return updatedItinerary.originalJourney;
    }
    return t.dashboard.noActiveJourney;
  })();

  // Derive Journey Status strictly from returned live status
  const statusDisplay = (() => {
    if (trainStatus?.currentStatus) {
      return trainStatus.currentStatus;
    }
    if (trainStatus?.delay) {
      return `Delayed (${trainStatus.delay})`;
    }
    if (lastUserReport) {
      return 'Reported in Chat';
    }
    return t.dashboard.awaitingData;
  })();

  // Derive Recovery Status strictly from alternatives found by n8n
  const recoveryDisplay = (() => {
    if (selectedOption) {
      return `${t.recoveryOptions.optionPrefix} ${selectedOption.optionNumber}${
        selectedOption.trainNumber ? ` (${selectedOption.trainNumber})` : ''
      }`;
    }
    if (alternatives.length > 0) {
      return t.dashboard.alternativesFoundCount(alternatives.length);
    }
    return t.dashboard.noDisruptionLogged;
  })();

  // Derive Action Status
  const actionDisplay = (() => {
    if (updatedItinerary) {
      return updatedItinerary.actionMessage;
    }
    if (selectedOption) {
      return t.dashboard.planSelected;
    }
    if (alternatives.length > 0) {
      return t.dashboard.awaitingUserSelection;
    }
    return t.dashboard.awaitingUserInput;
  })();

  const isStatusAlert =
    statusDisplay.toUpperCase().includes('DELAY') ||
    statusDisplay.toUpperCase().includes('CANCEL') ||
    statusDisplay.toUpperCase().includes('DIVERT');

  return (
    <section
      aria-label={t.dashboard.sectionTitle}
      className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-6"
    >
      <div className="glass-panel rounded-2xl p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 divide-y sm:divide-y-0 sm:divide-x divide-slate-800/80">
          {/* 1. Current Journey */}
          <div className="pt-2 sm:pt-0 sm:px-3 first:pl-0">
            <p className="font-mono text-xs text-slate-400 tracking-wider">
              {t.dashboard.journeyLabel}
            </p>
            <p className="text-sm sm:text-base font-semibold text-white mt-1 truncate tabular-nums">
              {journeyDisplay}
            </p>
          </div>

          {/* 2. Journey Status */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="font-mono text-xs text-slate-400 tracking-wider">
              {t.dashboard.statusLabel}
            </p>
            <p
              className={`text-sm sm:text-base font-semibold mt-1 truncate tabular-nums ${
                isStatusAlert
                  ? 'text-amber-300'
                  : trainStatus?.currentStatus
                  ? 'text-emerald-300'
                  : 'text-slate-300'
              }`}
            >
              {statusDisplay}
            </p>
          </div>

          {/* 3. Disruption / Recovery Status */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="font-mono text-xs text-slate-400 tracking-wider">
              {t.dashboard.recoveryLabel}
            </p>
            <p
              className={`text-sm sm:text-base font-semibold mt-1 truncate tabular-nums ${
                alternatives.length > 0 ? 'text-cyan-300' : 'text-slate-300'
              }`}
            >
              {recoveryDisplay}
            </p>
          </div>

          {/* 4. Action Status */}
          <div className="pt-3 sm:pt-0 sm:px-4">
            <p className="font-mono text-xs text-slate-400 tracking-wider">
              {t.dashboard.actionLabel}
            </p>
            <p
              className={`text-sm sm:text-base font-semibold mt-1 truncate ${
                selectedOption ? 'text-emerald-300' : 'text-slate-300'
              }`}
              title={actionDisplay}
            >
              {actionDisplay}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
