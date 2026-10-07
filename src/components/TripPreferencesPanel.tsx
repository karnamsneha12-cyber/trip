import React, { useState } from 'react';
import { Plus, ShieldCheck, Sliders } from 'lucide-react';
import { LanguageCode, TripPreferences } from '../types/tripguard';
import { UITranslations } from '../i18n/translations';

interface TripPreferencesPanelProps {
  preferences: TripPreferences;
  onUpdatePreferences: (updated: TripPreferences) => void;
  t: UITranslations;
}

export const TripPreferencesPanel: React.FC<TripPreferencesPanelProps> = ({
  preferences,
  onUpdatePreferences,
  t,
}) => {
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (key: keyof TripPreferences, value: string) => {
    onUpdatePreferences({
      ...preferences,
      [key]: value.trim() === '' ? undefined : value,
    });
  };

  // Only display preferences actually provided by the user or returned by the backend
  const providedPreferenceEntries: Array<{ label: string; value?: string }> = [
    { label: t.preferences.preferredTransport, value: preferences.preferredTransport },
    { label: t.preferences.budget, value: preferences.budget },
    { label: t.preferences.preferredArrivalTime, value: preferences.preferredArrivalTime },
    { label: t.preferences.comfortPreferences, value: preferences.comfortPreferences },
    { label: t.preferences.maxDelay, value: preferences.maxAcceptableDelay },
    { label: t.preferences.travelStyle, value: preferences.travelStyle },
  ].filter((item) => Boolean(item.value && item.value.trim().length > 0));

  return (
    <div className="glass-panel rounded-2xl p-5 sm:p-6 space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 pb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          <Sliders className="w-5 h-5 text-cyan-400 shrink-0" aria-hidden="true" />
          <div>
            <h3 className="text-base font-semibold text-white">{t.preferences.title}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{t.preferences.subtitle}</p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => setIsEditing((prev) => !prev)}
          className="px-3 py-1.5 rounded-lg text-xs font-medium text-cyan-300 bg-slate-900 hover:bg-slate-800 border border-cyan-500/35 inline-flex items-center gap-1.5 transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{t.preferences.addPreferencesButton}</span>
        </button>
      </div>

      {/* Display ONLY preferences actually provided by the user or returned by the backend */}
      {providedPreferenceEntries.length === 0 ? (
        <div className="p-4 rounded-xl bg-slate-900/50 border border-slate-800/80 text-xs text-slate-400">
          {t.preferences.emptyPreferencesNote}
        </div>
      ) : (
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {providedPreferenceEntries.map((entry) => (
            <div
              key={entry.label}
              className="p-3 rounded-xl bg-slate-900/70 border border-slate-800"
            >
              <dt className="text-xs text-slate-400">{entry.label}</dt>
              <dd className="text-xs sm:text-sm font-semibold text-white mt-0.5">{entry.value}</dd>
            </div>
          ))}
        </dl>
      )}

      {/* Collapsible Preference Editor so the user can explicitly provide preferences */}
      {isEditing && (
        <div className="pt-3 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* 1. Preferred transport */}
          <div>
            <label
              htmlFor="pref-transport"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              {t.preferences.preferredTransport}
            </label>
            <select
              id="pref-transport"
              value={preferences.preferredTransport || ''}
              onChange={(e) => handleChange('preferredTransport', e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-900/90 text-white border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-400"
            >
              <option value="">Not specified</option>
              <option value="Direct Express / Superfast Train">
                Direct Express / Superfast Train
              </option>
              <option value="Vande Bharat / Rajdhani / Shatabdi">
                Vande Bharat / Rajdhani / Shatabdi
              </option>
              <option value="Connecting Rail + Alternate Hub">
                Connecting Rail + Alternate Hub
              </option>
            </select>
          </div>

          {/* 2. Budget */}
          <div>
            <label
              htmlFor="pref-budget"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              {t.preferences.budget}
            </label>
            <select
              id="pref-budget"
              value={preferences.budget || ''}
              onChange={(e) => handleChange('budget', e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-900/90 text-white border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-400"
            >
              <option value="">Not specified</option>
              <option value="Standard / Sleeper / 3AC">Standard / Sleeper / 3AC</option>
              <option value="Comfort / 2AC / Chair Car">Comfort / 2AC / Chair Car</option>
              <option value="Flexible / Any Class Available">
                Flexible / Any Class Available
              </option>
            </select>
          </div>

          {/* 3. Preferred arrival time */}
          <div>
            <label
              htmlFor="pref-arrival-time"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              {t.preferences.preferredArrivalTime}
            </label>
            <select
              id="pref-arrival-time"
              value={preferences.preferredArrivalTime || ''}
              onChange={(e) => handleChange('preferredArrivalTime', e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-900/90 text-white border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-400"
            >
              <option value="">Not specified</option>
              <option value="Earliest Possible Arrival">Earliest Possible Arrival</option>
              <option value="Morning Arrival (06:00 – 10:00)">
                Morning Arrival (06:00 – 10:00)
              </option>
              <option value="Same Day Before Midnight">Same Day Before Midnight</option>
            </select>
          </div>

          {/* 4. Comfort preferences */}
          <div>
            <label
              htmlFor="pref-comfort"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              {t.preferences.comfortPreferences}
            </label>
            <select
              id="pref-comfort"
              value={preferences.comfortPreferences || ''}
              onChange={(e) => handleChange('comfortPreferences', e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-900/90 text-white border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-400"
            >
              <option value="">Not specified</option>
              <option value="AC Berth / Reserved Seat">AC Berth / Reserved Seat</option>
              <option value="Zero Station Transfer">Zero Station Transfer</option>
              <option value="Overnight Sleeper Preferred">Overnight Sleeper Preferred</option>
            </select>
          </div>

          {/* 5. Maximum acceptable delay */}
          <div>
            <label
              htmlFor="pref-max-delay"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              {t.preferences.maxDelay}
            </label>
            <select
              id="pref-max-delay"
              value={preferences.maxAcceptableDelay || ''}
              onChange={(e) => handleChange('maxAcceptableDelay', e.target.value)}
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-900/90 text-white border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-400 font-mono tabular-nums"
            >
              <option value="">Not specified</option>
              <option value="Up to 1 hour">Up to 1 hour</option>
              <option value="Up to 2 hours">Up to 2 hours</option>
              <option value="Up to 3 hours">Up to 3 hours</option>
            </select>
          </div>

          {/* 6. Language */}
          <div>
            <label
              htmlFor="pref-language"
              className="block text-xs font-medium text-slate-300 mb-1.5"
            >
              {t.preferences.language}
            </label>
            <select
              id="pref-language"
              value={preferences.language}
              onChange={(e) =>
                onUpdatePreferences({
                  ...preferences,
                  language: e.target.value as LanguageCode,
                })
              }
              className="w-full px-3 py-2 text-xs sm:text-sm bg-slate-900/90 text-white border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-400"
            >
              <option value="en">English</option>
              <option value="hi">Hindi (हिन्दी)</option>
              <option value="te">Telugu (తెలుగు)</option>
            </select>
          </div>
        </div>
      )}

      {/* Security & Privacy Boundary Guarantee */}
      <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
        <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" aria-hidden="true" />
        <div className="space-y-0.5">
          <p className="text-xs font-semibold text-slate-200">{t.preferences.safetyNoticeTitle}</p>
          <p className="text-xs text-slate-400 leading-relaxed">{t.preferences.safetyNoticeBody}</p>
        </div>
      </div>
    </div>
  );
};
