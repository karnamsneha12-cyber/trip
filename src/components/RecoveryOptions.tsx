import React from 'react';
import { CheckCircle2, Sparkles, XCircle } from 'lucide-react';
import { RecoveryOption } from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface RecoveryOptionsProps {
  alternatives: RecoveryOption[];
  noAlternativesFound?: boolean;
  selectedOption?: RecoveryOption;
  approvalStatus?: 'approved' | 'rejected' | 'pending';
  onSelectOption: (option: RecoveryOption) => void;
  onApproveRecovery: (option: RecoveryOption) => void;
  onRejectRecovery: () => void;
  t: UITranslations;
}

export const RecoveryOptions: React.FC<RecoveryOptionsProps> = ({
  alternatives,
  noAlternativesFound,
  selectedOption,
  approvalStatus,
  onSelectOption,
  onApproveRecovery,
  onRejectRecovery,
  t,
}) => {
  const displayedOptions = alternatives.slice(0, 3);
  const candidateForApproval =
    selectedOption ||
    displayedOptions.find((o) => o.isRecommended) ||
    displayedOptions[0];

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div>
          <h3 className="text-base font-semibold text-white">{t.recoveryOptions.sectionTitle}</h3>
          {displayedOptions.length > 0 && (
            <p className="text-xs text-cyan-300 mt-0.5 font-medium">
              {t.recoveryOptions.sectionSubtitle}
            </p>
          )}
        </div>

        <span className="font-mono text-[11px] font-medium text-cyan-300 tracking-wide">
          {t.safetyBadges.aiRecommendation}
        </span>
      </div>

      {displayedOptions.length === 0 ? (
        <div className="py-6 text-center space-y-2">
          <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto">
            {noAlternativesFound
              ? t.recoveryOptions.noDifferentAlternative
              : t.recoveryOptions.emptyOptions}
          </p>
        </div>
      ) : (
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4">
            {displayedOptions.map((option) => {
              const isSelected =
                selectedOption?.id === option.id ||
                selectedOption?.optionNumber === option.optionNumber;

              return (
                <div
                  key={option.id}
                  className={`rounded-xl p-4 sm:p-5 transition-all ${
                    isSelected
                      ? 'glass-card-active shadow-md'
                      : option.isRecommended
                      ? 'glass-card border-cyan-500/35'
                      : 'glass-card'
                  }`}
                >
                  {/* Option Header */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/70">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-mono text-xs font-bold tracking-wider text-cyan-300">
                        {t.recoveryOptions.optionPrefix} {option.optionNumber}
                      </span>
                      {(option.trainName || option.trainNumber) && (
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                      )}
                      {option.trainName && (
                        <span className="text-sm font-semibold text-white">
                          {option.trainName}
                        </span>
                      )}
                      {option.trainNumber && (
                        <span className="font-mono text-xs text-slate-300 tabular-nums">
                          #{option.trainNumber}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      {option.isRecommended && (
                        <span className="font-mono text-xs font-semibold text-amber-300">
                          {t.recoveryOptions.bestRecoveryBadge}
                        </span>
                      )}
                      {isSelected && (
                        <span className="inline-flex items-center gap-1.5 font-mono text-xs font-semibold text-emerald-300">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" aria-hidden="true" />
                          {t.recoveryOptions.selectedBadge}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Only display fields actually returned by the backend */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 py-3 text-xs">
                    {option.departure && (
                      <div>
                        <span className="text-slate-400 block">{t.recoveryOptions.departure}</span>
                        <span className="font-mono text-sm font-medium text-white tabular-nums mt-0.5 block">
                          {option.departure}
                        </span>
                      </div>
                    )}

                    {option.arrival && (
                      <div>
                        <span className="text-slate-400 block">{t.recoveryOptions.arrival}</span>
                        <span className="font-mono text-sm font-medium text-white tabular-nums mt-0.5 block">
                          {option.arrival}
                        </span>
                      </div>
                    )}

                    {option.delay && (
                      <div>
                        <span className="text-slate-400 block">{t.recoveryOptions.delay}</span>
                        <span className="font-mono text-sm font-medium text-amber-300 tabular-nums mt-0.5 block">
                          {option.delay}
                        </span>
                      </div>
                    )}

                    {option.route && (
                      <div className="sm:col-span-2">
                        <span className="text-slate-400 block">{t.recoveryOptions.route}</span>
                        <span className="text-sm font-medium text-slate-200 mt-0.5 block">
                          {option.route}
                        </span>
                      </div>
                    )}

                    {option.travelTime && (
                      <div>
                        <span className="text-slate-400 block">
                          {t.recoveryOptions.travelTime}
                        </span>
                        <span className="font-mono text-sm font-medium text-slate-200 tabular-nums mt-0.5 block">
                          {option.travelTime}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* AI Explanation */}
                  {(option.whyThisOption || option.isRecommended) && (
                    <div className="mt-2 pt-3 border-t border-slate-800/60">
                      <div className="flex items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                          {t.recoveryOptions.whyThisOption}
                        </span>
                        <span className="font-mono text-[10px] text-cyan-400">
                          {t.safetyBadges.aiRecommendation}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                        {option.whyThisOption || t.recoveryOptions.defaultBestExplanation}
                      </p>
                    </div>
                  )}

                  {/* Select Option Button */}
                  <div className="mt-4 pt-2 flex items-center justify-end">
                    <button
                      type="button"
                      onClick={() => onSelectOption(option)}
                      className={`px-4 py-2 rounded-lg font-mono text-xs font-semibold tracking-wide transition-all cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 ${
                        isSelected
                          ? 'bg-emerald-500/20 text-emerald-200 border border-emerald-500/50'
                          : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 shadow-sm'
                      }`}
                    >
                      {isSelected
                        ? t.recoveryOptions.selectedBadge
                        : `${t.recoveryOptions.selectOption} ${option.optionNumber}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* USER CONSENT / APPROVAL SECTION */}
          {candidateForApproval && (
            <div className="rounded-xl p-4 sm:p-5 bg-slate-950/80 border border-cyan-500/40 space-y-3.5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-sm font-semibold text-white">
                  {t.chat.readyToProceedPrompt}
                </p>
                <span className="font-mono text-xs text-cyan-300">
                  Option {candidateForApproval.optionNumber}
                  {candidateForApproval.trainNumber
                    ? ` (#${candidateForApproval.trainNumber})`
                    : ''}
                </span>
              </div>

              <p className="text-xs text-slate-400">
                Human approval is required before consequential actions. Never asks for OTP, ATM
                PIN, or banking password.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-1">
                <button
                  type="button"
                  onClick={() => onApproveRecovery(candidateForApproval)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all inline-flex items-center gap-2 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
                >
                  <CheckCircle2 className="w-4 h-4" aria-hidden="true" />
                  <span>{t.chat.approveRecoveryBtn}</span>
                </button>

                <button
                  type="button"
                  onClick={onRejectRecovery}
                  className="px-4 py-2.5 rounded-xl font-medium text-xs sm:text-sm text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-700/80 transition-all inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                >
                  <XCircle className="w-4 h-4 text-slate-400" aria-hidden="true" />
                  <span>{t.chat.rejectRecoveryBtn}</span>
                </button>

                {approvalStatus === 'approved' && (
                  <span className="font-mono text-xs text-emerald-300 font-semibold">
                    ✓ {t.actionStatus.statusCardTitle}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
