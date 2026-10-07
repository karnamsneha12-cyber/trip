import React, { useState, useEffect } from 'react';
import {
  ChatMessage,
  LanguageCode,
  LiveAgentStatuses,
  NavSection,
  ProcessingStepStatus,
  RecoveryOption,
  TrainStatusData,
  TripPreferences,
  UpdatedItineraryData,
  WhatIfAnalysis,
} from './types/tripguard';
import { translations } from './i18n/translations';
import {
  resetSessionId,
  sendMessage,
  TripGuardApiError,
} from './services/tripguardApi';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { JourneyDashboardBar } from './components/JourneyDashboardBar';
import { TravelStatusCard } from './components/TravelStatusCard';
import { RecoveryOptions } from './components/RecoveryOptions';
import { ActionAndItineraryCard } from './components/ActionAndItineraryCard';
import { ChatPanel } from './components/ChatPanel';
import { WhatIfSimulator } from './components/WhatIfSimulator';
import { TripPreferencesPanel } from './components/TripPreferencesPanel';
import { HowItWorksSection } from './components/HowItWorksSection';
import { LiveAgentStatusPanel } from './components/LiveAgentStatusPanel';

function formatTimeNow(): string {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export default function App() {
  const [language, setLanguage] = useState<LanguageCode>('en');
  const [activeSection, setActiveSection] = useState<NavSection>('home');

  const t = translations[language];

  // User Trip Preferences (Trip Memory - initialized with no pre-invented values)
  const [preferences, setPreferences] = useState<TripPreferences>({
    language: 'en',
  });

  const handleLanguageChange = (newLang: LanguageCode) => {
    setLanguage(newLang);
    setPreferences((prev) => ({ ...prev, language: newLang }));
  };

  const handleUpdatePreferences = (updated: TripPreferences) => {
    setPreferences(updated);
    if (updated.language !== language) {
      setLanguage(updated.language);
    }
  };

  // Live data states populated exclusively from the n8n backend
  const [trainStatus, setTrainStatus] = useState<TrainStatusData | undefined>(undefined);
  const [alternatives, setAlternatives] = useState<RecoveryOption[]>([]);
  const [noAlternativesFound, setNoAlternativesFound] = useState(false);
  const [selectedOption, setSelectedOption] = useState<RecoveryOption | undefined>(undefined);
  const [approvalStatus, setApprovalStatus] = useState<'approved' | 'rejected' | 'pending'>(
    'pending'
  );
  const [updatedItinerary, setUpdatedItinerary] = useState<UpdatedItineraryData | undefined>(
    undefined
  );
  const [lastUserReport, setLastUserReport] = useState<string | undefined>(undefined);
  const [hasInteracted, setHasInteracted] = useState(false);

  // Live Agent Statuses & Processing Timeline
  const [agentStatuses, setAgentStatuses] = useState<LiveAgentStatuses>({
    disruptionDetection: 'idle',
    alternativeDiscovery: 'idle',
    recoveryOptimization: 'idle',
    safetyCheck: 'idle',
    decisionAgent: 'idle',
    notificationAgent: 'idle',
  });

  const [processingSteps, setProcessingSteps] = useState<ProcessingStepStatus>({
    disruptionDetected: false,
    checkingLiveStatus: false,
    searchingAlternatives: false,
    comparingOptions: false,
    recommendationReady: false,
  });

  // What-If Simulator states
  const [whatIfResult, setWhatIfResult] = useState<WhatIfAnalysis | undefined>(undefined);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationError, setSimulationError] = useState<string | undefined>(undefined);

  // Chat Conversation State
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'initial-greeting',
      sender: 'agent',
      text: translations.en.chat.initialGreeting,
      timestamp: formatTimeNow(),
    },
  ]);
  const [isChatLoading, setIsChatLoading] = useState(false);

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length === 1 && prev[0].id === 'initial-greeting') {
        return [
          {
            ...prev[0],
            text: translations[language].chat.initialGreeting,
          },
        ];
      }
      return prev;
    });
  }, [language]);

  /**
   * Handles selecting/approving a recovery option.
   * Never claims a railway ticket has been booked unless confirmed by the backend.
   */
  const handleSelectOption = (option: RecoveryOption, triggeredFromChat = false) => {
    setSelectedOption(option);
    setApprovalStatus('approved');

    setAgentStatuses((prev) => ({
      ...prev,
      safetyCheck: 'completed',
      decisionAgent: 'completed',
      notificationAgent: 'completed',
    }));

    const originalJourneyLabel =
      trainStatus?.trainNumber && trainStatus?.trainName
        ? `${trainStatus.trainNumber} (${trainStatus.trainName})`
        : trainStatus?.trainNumber
        ? trainStatus.trainNumber
        : lastUserReport;

    const nextItinerary: UpdatedItineraryData = {
      originalJourney: originalJourneyLabel,
      disruptionNote: trainStatus?.currentStatus || trainStatus?.delay,
      selectedOption: option,
      statusText: 'Recovery Plan Selected',
      actionStage: 'Pending secure confirmation',
      actionMessage: 'Recovery action prepared — booking confirmation is still required.',
      confirmedBooking: false,
      approvalStatus: 'approved',
      notificationSent: true,
      updatedAt: formatTimeNow(),
    };

    setUpdatedItinerary(nextItinerary);

    if (!triggeredFromChat) {
      const approvalMsg: ChatMessage = {
        id: `approval-${Date.now()}`,
        sender: 'agent',
        text: `✓ Recovery approved: Option ${option.optionNumber}${
          option.trainName ? ` — ${option.trainName}` : ''
        }${
          option.trainNumber ? ` (#${option.trainNumber})` : ''
        }\n✓ Booking action requested\n✓ Notification sent\n✓ Itinerary updated\n\nRecovery action prepared — booking confirmation is still required.`,
        timestamp: formatTimeNow(),
      };
      setMessages((prev) => [...prev, approvalMsg]);
    }
  };

  /**
   * Handles rejecting the current proposed recovery option.
   */
  const handleRejectRecovery = () => {
    setSelectedOption(undefined);
    setUpdatedItinerary(undefined);
    setApprovalStatus('rejected');

    setAgentStatuses((prev) => ({
      ...prev,
      decisionAgent: 'alert',
      notificationAgent: 'idle',
    }));

    const rejectMsg: ChatMessage = {
      id: `reject-${Date.now()}`,
      sender: 'agent',
      text: 'Recovery option rejected. Tell me if you would like to evaluate another option or adjust your journey constraints.',
      timestamp: formatTimeNow(),
    };
    setMessages((prev) => [...prev, rejectMsg]);
  };

  /**
   * Checks if the user's message matches an option selection ("Option 1", "Option 2", "Option 3", or train number).
   */
  const matchTypedOptionSelection = (userText: string): RecoveryOption | undefined => {
    if (alternatives.length === 0) return undefined;
    const normalized = userText.trim().toLowerCase();

    const optionMatch = normalized.match(/^option\s*([123])\b/i);
    if (optionMatch) {
      const num = Number(optionMatch[1]) as 1 | 2 | 3;
      return alternatives.find((alt) => alt.optionNumber === num);
    }

    return alternatives.find(
      (alt) => alt.trainNumber && normalized === alt.trainNumber.trim().toLowerCase()
    );
  };

  /**
   * Sends a user message to the n8n Chat Trigger backend via sendMessage(message).
   */
  const handleSendChatMessage = async (messageText: string) => {
    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: messageText,
      timestamp: formatTimeNow(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setLastUserReport(messageText);
    setHasInteracted(true);

    const matchedOption = matchTypedOptionSelection(messageText);
    if (matchedOption) {
      handleSelectOption(matchedOption, true);
    }

    setIsChatLoading(true);

    // Update live agent activity states during query processing
    setAgentStatuses({
      disruptionDetection: 'active',
      alternativeDiscovery: 'active',
      recoveryOptimization: 'active',
      safetyCheck: 'active',
      decisionAgent: 'idle',
      notificationAgent: 'idle',
    });

    setProcessingSteps({
      disruptionDetected: true,
      checkingLiveStatus: true,
      searchingAlternatives: false,
      comparingOptions: false,
      recommendationReady: false,
    });

    try {
      const response = await sendMessage(messageText, {
        preferences,
        language,
        mode: matchedOption ? 'approval' : 'recovery',
      });

      if (response.trainStatus) {
        setTrainStatus((prev) => ({ ...prev, ...response.trainStatus }));
      }

      if (response.alternatives && response.alternatives.length > 0) {
        setAlternatives(response.alternatives.slice(0, 3));
        setNoAlternativesFound(false);
      } else if (response.noAlternativesFound) {
        setNoAlternativesFound(true);
      }

      if (response.whatIf) {
        setWhatIfResult(response.whatIf);
      }

      if (response.backendPreferences) {
        setPreferences((prev) => ({ ...prev, ...response.backendPreferences }));
      }

      if (response.confirmedBooking && updatedItinerary) {
        setUpdatedItinerary((prev) =>
          prev
            ? {
                ...prev,
                confirmedBooking: true,
                actionStage: 'Itinerary updated',
                actionMessage: response.bookingReference
                  ? `Confirmed booking reference: ${response.bookingReference}`
                  : 'Booking confirmed by backend recovery service.',
              }
            : prev
        );
      }

      const hasAlts = Boolean(response.alternatives && response.alternatives.length > 0);
      setProcessingSteps({
        disruptionDetected: true,
        checkingLiveStatus: true,
        searchingAlternatives: hasAlts || Boolean(response.noAlternativesFound),
        comparingOptions: hasAlts,
        recommendationReady: hasAlts || Boolean(response.trainStatus),
      });

      setAgentStatuses({
        disruptionDetection: 'completed',
        alternativeDiscovery: hasAlts ? 'completed' : 'idle',
        recoveryOptimization: hasAlts ? 'completed' : 'idle',
        safetyCheck: 'completed',
        decisionAgent: hasAlts ? 'completed' : 'idle',
        notificationAgent: selectedOption ? 'completed' : 'idle',
      });

      const agentMessage: ChatMessage = {
        id: `agent-${Date.now()}`,
        sender: 'agent',
        text: response.replyText,
        timestamp: formatTimeNow(),
        trainStatus: response.trainStatus,
        alternatives: response.alternatives,
        noAlternativesFound: response.noAlternativesFound,
        whatIf: response.whatIf,
        askForApproval: hasAlts,
      };

      setMessages((prev) => [...prev, agentMessage]);
    } catch (err) {
      const apiErr = err instanceof TripGuardApiError ? err : null;
      const errorText =
        apiErr?.code === 'EMPTY_RESPONSE'
          ? t.chat.emptyResponseError
          : apiErr?.code === 'INVALID_RESPONSE'
          ? t.chat.invalidResponseError
          : t.chat.connectionError;

      setAgentStatuses({
        disruptionDetection: 'alert',
        alternativeDiscovery: 'idle',
        recoveryOptimization: 'idle',
        safetyCheck: 'completed',
        decisionAgent: 'idle',
        notificationAgent: 'idle',
      });

      const errorMessage: ChatMessage = {
        id: `error-${Date.now()}`,
        sender: 'agent',
        text: errorText,
        timestamp: formatTimeNow(),
        isError: true,
        errorType: apiErr?.code || 'BACKEND_UNAVAILABLE',
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsChatLoading(false);
    }
  };

  /**
   * Clears the conversation and resets session state.
   */
  const handleClearConversation = () => {
    resetSessionId();
    setMessages([
      {
        id: 'initial-greeting',
        sender: 'agent',
        text: t.chat.initialGreeting,
        timestamp: formatTimeNow(),
      },
    ]);
    setTrainStatus(undefined);
    setAlternatives([]);
    setNoAlternativesFound(false);
    setSelectedOption(undefined);
    setApprovalStatus('pending');
    setUpdatedItinerary(undefined);
    setLastUserReport(undefined);
    setHasInteracted(false);
    setAgentStatuses({
      disruptionDetection: 'idle',
      alternativeDiscovery: 'idle',
      recoveryOptimization: 'idle',
      safetyCheck: 'idle',
      decisionAgent: 'idle',
      notificationAgent: 'idle',
    });
    setProcessingSteps({
      disruptionDetected: false,
      checkingLiveStatus: false,
      searchingAlternatives: false,
      comparingOptions: false,
      recommendationReady: false,
    });
  };

  /**
   * Sends a What-If scenario query to the n8n backend.
   */
  const handleRunWhatIfSimulation = async (scenarioPrompt: string) => {
    setIsSimulating(true);
    setSimulationError(undefined);

    try {
      const result = await sendMessage(scenarioPrompt, {
        preferences,
        language,
        mode: 'whatif',
      });

      if (result.trainStatus) {
        setTrainStatus((prev) => ({ ...prev, ...result.trainStatus }));
      }
      if (result.alternatives && result.alternatives.length > 0) {
        setAlternatives(result.alternatives.slice(0, 3));
      }

      if (result.whatIf) {
        setWhatIfResult(result.whatIf);
      } else {
        setWhatIfResult({
          scenarioQuery: scenarioPrompt,
          recommendation: result.replyText,
          rawText: result.replyText,
          timestamp: formatTimeNow(),
        });
      }
    } catch {
      setSimulationError(t.chat.connectionError);
    } finally {
      setIsSimulating(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#050914] text-slate-100">
      {/* 17. NAVIGATION */}
      <Navbar
        activeSection={activeSection}
        onNavigate={setActiveSection}
        language={language}
        onLanguageChange={handleLanguageChange}
        t={t}
      />

      {/* MAIN CONTENT VIEWPORT */}
      <main className="flex-1">
        {/* HOME VIEW: Hero + Dashboard + Recovery Workspace + What-If + How It Works */}
        {activeSection === 'home' && (
          <>
            <HeroSection onNavigate={setActiveSection} t={t} />

            <JourneyDashboardBar
              trainStatus={trainStatus}
              alternatives={alternatives}
              selectedOption={selectedOption}
              updatedItinerary={updatedItinerary}
              lastUserReport={lastUserReport}
              t={t}
            />

            {/* Main Split Recovery Interface on Home for immediate access */}
            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Trip Overview / Disruption Card / Recovery Options / Live Agents / Preferences */}
                <div className="lg:col-span-5 space-y-6">
                  <TravelStatusCard trainStatus={trainStatus} t={t} />
                  <RecoveryOptions
                    alternatives={alternatives}
                    noAlternativesFound={noAlternativesFound}
                    selectedOption={selectedOption}
                    approvalStatus={approvalStatus}
                    onSelectOption={(opt) => handleSelectOption(opt, false)}
                    onApproveRecovery={(opt) => handleSelectOption(opt, false)}
                    onRejectRecovery={handleRejectRecovery}
                    t={t}
                  />
                  <ActionAndItineraryCard updatedItinerary={updatedItinerary} t={t} />
                  <LiveAgentStatusPanel
                    agentStatuses={agentStatuses}
                    processingSteps={processingSteps}
                    isProcessing={isChatLoading}
                    hasInteracted={hasInteracted}
                    t={t}
                  />
                  <TripPreferencesPanel
                    preferences={preferences}
                    onUpdatePreferences={handleUpdatePreferences}
                    t={t}
                  />
                </div>

                {/* Right Side: AI Conversation Panel */}
                <div className="lg:col-span-7">
                  <ChatPanel
                    messages={messages}
                    isLoading={isChatLoading}
                    onSendMessage={handleSendChatMessage}
                    onClearConversation={handleClearConversation}
                    alternatives={alternatives}
                    selectedOption={selectedOption}
                    onSelectOption={(opt) => handleSelectOption(opt, false)}
                    t={t}
                  />
                </div>
              </div>
            </section>

            {/* What-If Simulator & How It Works */}
            <WhatIfSimulator
              whatIfResult={whatIfResult}
              trainStatus={trainStatus}
              alternatives={alternatives}
              selectedOption={selectedOption}
              isSimulating={isSimulating}
              simulationError={simulationError}
              onRunSimulation={handleRunWhatIfSimulation}
              t={t}
            />

            <HowItWorksSection onNavigate={setActiveSection} t={t} />
          </>
        )}

        {/* MY TRIP (MY JOURNEY) VIEW */}
        {activeSection === 'journey' && (
          <div className="space-y-8 pb-16">
            <JourneyDashboardBar
              trainStatus={trainStatus}
              alternatives={alternatives}
              selectedOption={selectedOption}
              updatedItinerary={updatedItinerary}
              lastUserReport={lastUserReport}
              t={t}
            />

            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-7 space-y-6">
                  <TravelStatusCard trainStatus={trainStatus} t={t} />
                  <ActionAndItineraryCard updatedItinerary={updatedItinerary} t={t} />
                  <RecoveryOptions
                    alternatives={alternatives}
                    noAlternativesFound={noAlternativesFound}
                    selectedOption={selectedOption}
                    approvalStatus={approvalStatus}
                    onSelectOption={(opt) => handleSelectOption(opt, false)}
                    onApproveRecovery={(opt) => handleSelectOption(opt, false)}
                    onRejectRecovery={handleRejectRecovery}
                    t={t}
                  />
                </div>

                <div className="lg:col-span-5 space-y-6">
                  <LiveAgentStatusPanel
                    agentStatuses={agentStatuses}
                    processingSteps={processingSteps}
                    isProcessing={isChatLoading}
                    hasInteracted={hasInteracted}
                    t={t}
                  />
                  <TripPreferencesPanel
                    preferences={preferences}
                    onUpdatePreferences={handleUpdatePreferences}
                    t={t}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* RECOVERY VIEW: Dedicated Split-Screen Main AI Chat / Recovery Workspace */}
        {activeSection === 'recovery' && (
          <div className="space-y-6 pb-16">
            <JourneyDashboardBar
              trainStatus={trainStatus}
              alternatives={alternatives}
              selectedOption={selectedOption}
              updatedItinerary={updatedItinerary}
              lastUserReport={lastUserReport}
              t={t}
            />

            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 pt-2">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                {/* Left Side: Trip overview / journey status */}
                <div className="lg:col-span-5 space-y-6">
                  <TravelStatusCard trainStatus={trainStatus} t={t} />
                  <RecoveryOptions
                    alternatives={alternatives}
                    noAlternativesFound={noAlternativesFound}
                    selectedOption={selectedOption}
                    approvalStatus={approvalStatus}
                    onSelectOption={(opt) => handleSelectOption(opt, false)}
                    onApproveRecovery={(opt) => handleSelectOption(opt, false)}
                    onRejectRecovery={handleRejectRecovery}
                    t={t}
                  />
                  <ActionAndItineraryCard updatedItinerary={updatedItinerary} t={t} />
                  <LiveAgentStatusPanel
                    agentStatuses={agentStatuses}
                    processingSteps={processingSteps}
                    isProcessing={isChatLoading}
                    hasInteracted={hasInteracted}
                    t={t}
                  />
                  <TripPreferencesPanel
                    preferences={preferences}
                    onUpdatePreferences={handleUpdatePreferences}
                    t={t}
                  />
                </div>

                {/* Right Side: AI conversation panel */}
                <div className="lg:col-span-7">
                  <ChatPanel
                    messages={messages}
                    isLoading={isChatLoading}
                    onSendMessage={handleSendChatMessage}
                    onClearConversation={handleClearConversation}
                    alternatives={alternatives}
                    selectedOption={selectedOption}
                    onSelectOption={(opt) => handleSelectOption(opt, false)}
                    t={t}
                  />
                </div>
              </div>
            </section>
          </div>
        )}

        {/* WHAT-IF VIEW: Dedicated Disruption & Comparison Simulator */}
        {activeSection === 'whatif' && (
          <div className="pb-16">
            <JourneyDashboardBar
              trainStatus={trainStatus}
              alternatives={alternatives}
              selectedOption={selectedOption}
              updatedItinerary={updatedItinerary}
              lastUserReport={lastUserReport}
              t={t}
            />
            <WhatIfSimulator
              whatIfResult={whatIfResult}
              trainStatus={trainStatus}
              alternatives={alternatives}
              selectedOption={selectedOption}
              isSimulating={isSimulating}
              simulationError={simulationError}
              onRunSimulation={handleRunWhatIfSimulation}
              t={t}
            />
          </div>
        )}

        {/* HOW IT WORKS VIEW: 5-Step Process, Trust Pillars & Agentic AI Visualization */}
        {activeSection === 'howitworks' && (
          <div className="pb-16">
            <HowItWorksSection onNavigate={setActiveSection} t={t} />
          </div>
        )}

        {/* DASHBOARD VIEW: Telemetry, Live Agents, Status, Options & Itinerary */}
        {activeSection === 'dashboard' && (
          <div className="space-y-8 pb-16">
            <JourneyDashboardBar
              trainStatus={trainStatus}
              alternatives={alternatives}
              selectedOption={selectedOption}
              updatedItinerary={updatedItinerary}
              lastUserReport={lastUserReport}
              t={t}
            />

            <section className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
                <div className="lg:col-span-6 space-y-6">
                  <TravelStatusCard trainStatus={trainStatus} t={t} />
                  <RecoveryOptions
                    alternatives={alternatives}
                    noAlternativesFound={noAlternativesFound}
                    selectedOption={selectedOption}
                    approvalStatus={approvalStatus}
                    onSelectOption={(opt) => handleSelectOption(opt, false)}
                    onApproveRecovery={(opt) => handleSelectOption(opt, false)}
                    onRejectRecovery={handleRejectRecovery}
                    t={t}
                  />
                </div>
                <div className="lg:col-span-6 space-y-6">
                  <LiveAgentStatusPanel
                    agentStatuses={agentStatuses}
                    processingSteps={processingSteps}
                    isProcessing={isChatLoading}
                    hasInteracted={hasInteracted}
                    t={t}
                  />
                  <ActionAndItineraryCard updatedItinerary={updatedItinerary} t={t} />
                  <TripPreferencesPanel
                    preferences={preferences}
                    onUpdatePreferences={handleUpdatePreferences}
                    t={t}
                  />
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 bg-[#040710] py-8">
        <div className="max-w-[1360px] mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-white">TRIPGUARD AI</span>
            <span aria-hidden="true">·</span>
            <span>Agentic Travel Recovery System</span>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span>CONFIRMED BY LIVE DATA</span>
            <span aria-hidden="true">·</span>
            <span>AI RECOMMENDATION</span>
            <span aria-hidden="true">·</span>
            <span>Powered by n8n AI Workflow</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
