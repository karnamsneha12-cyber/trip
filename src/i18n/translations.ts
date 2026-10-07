import { LanguageCode } from '../types/tripguard';

export interface UITranslations {
  nav: {
    brand: string;
    home: string;
    myJourney: string;
    recovery: string;
    whatIf: string;
    howItWorks: string;
    dashboard: string;
    startRecovery: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    headlineLine1: string;
    headlineLine2: string;
    description: string;
    startRecoveryBtn: string;
    tryWhatIfBtn: string;
    seeHowItWorksBtn: string;
    timelineTitle: string;
    timelineSteps: {
      yourJourney: string;
      disruptionDetected: string;
      aiAnalysis: string;
      alternativesFound: string;
      recoveredJourney: string;
    };
  };
  dashboard: {
    sectionTitle: string;
    journeyLabel: string;
    statusLabel: string;
    disruptionLabel: string;
    recoveryLabel: string;
    actionLabel: string;
    awaitingData: string;
    noActiveJourney: string;
    noDisruptionLogged: string;
    awaitingUserInput: string;
    awaitingUserSelection: string;
    alternativesFoundCount: (count: number) => string;
    planSelected: string;
  };
  chat: {
    panelTitle: string;
    panelSubtitle: string;
    initialGreeting: string;
    inputPlaceholder: string;
    sendButton: string;
    clearButton: string;
    waitingForAgent: string;
    connectionError: string;
    emptyResponseError: string;
    invalidResponseError: string;
    noAlternativesReturned: string;
    approvalPrompt: string;
    readyToProceedPrompt: string;
    approveRecoveryBtn: string;
    rejectRecoveryBtn: string;
    quickPromptsTitle: string;
    quickPrompts: string[];
    enterHint: string;
    processingTimeline: {
      title: string;
      disruptionDetected: string;
      checkingLiveStatus: string;
      searchingAlternatives: string;
      comparingOptions: string;
      recommendationReady: string;
    };
  };
  travelStatus: {
    cardTitle: string;
    disruptionBannerTitle: string;
    emptyTitle: string;
    emptyDescription: string;
    fields: {
      trainNumber: string;
      trainName: string;
      journeyDate: string;
      source: string;
      destination: string;
      route: string;
      currentStatus: string;
      currentStation: string;
      previousStation: string;
      nextStation: string;
      delay: string;
      scheduledDeparture: string;
      scheduledArrival: string;
      expectedArrival: string;
      travelTime: string;
      risk: string;
      platform: string;
    };
  };
  recoveryOptions: {
    sectionTitle: string;
    sectionSubtitle: string;
    optionPrefix: string;
    bestRecoveryBadge: string;
    defaultBestExplanation: string;
    departure: string;
    arrival: string;
    delay: string;
    route: string;
    travelTime: string;
    whyThisOption: string;
    selectOption: string;
    selectedBadge: string;
    emptyOptions: string;
    noDifferentAlternative: string;
  };
  actionStatus: {
    title: string;
    defaultMvpStatus: string;
    bookingConfirmationRequired: string;
    statusCardTitle: string;
    afterApprovalChecklist: {
      recoveryApproved: string;
      bookingActionRequested: string;
      notificationSent: string;
      itineraryUpdated: string;
    };
    stages: {
      selected: string;
      preparation: string;
      pendingConfirmation: string;
      notificationPrepared: string;
      itineraryUpdated: string;
    };
    noTicketBookedDisclaimer: string;
  };
  updatedItinerary: {
    title: string;
    originalJourney: string;
    recoveryPlan: string;
    status: string;
    recoveryPlanSelected: string;
    timeline: {
      originalJourney: string;
      disruption: string;
      alternativeFound: string;
      userApproved: string;
      recoveryPlan: string;
    };
  };
  whatIf: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    analyzeButton: string;
    presetPrompts: string[];
    comparisonTitle: string;
    currentPlanHeader: string;
    alternativeHeader: string;
    vsLabel: string;
    recommendationBadge: string;
    metrics: {
      departure: string;
      arrival: string;
      delay: string;
      travelTime: string;
      route: string;
      risk: string;
    };
    cards: {
      currentPlan: string;
      possibleImpact: string;
      alternativePlan: string;
      recommendation: string;
    };
    emptyPrompt: string;
  };
  preferences: {
    title: string;
    subtitle: string;
    emptyPreferencesNote: string;
    addPreferencesButton: string;
    budget: string;
    maxDelay: string;
    preferredTransport: string;
    preferredArrivalTime: string;
    comfortPreferences: string;
    travelStyle: string;
    language: string;
    safetyNoticeTitle: string;
    safetyNoticeBody: string;
  };
  liveAgents: {
    title: string;
    subtitle: string;
    agents: {
      disruptionDetection: string;
      alternativeDiscovery: string;
      recoveryOptimization: string;
      safetyCheck: string;
      decisionAgent: string;
      notificationAgent: string;
    };
    states: {
      idle: string;
      active: string;
      completed: string;
      alert: string;
    };
  };
  safetyBadges: {
    confirmedLiveData: string;
    aiRecommendation: string;
    aiReasoningEstimation: string;
  };
  trustSection: {
    title: string;
    subtitle: string;
    pillars: string[];
  };
  howItWorks: {
    title: string;
    subtitle: string;
    fiveSteps: {
      number: string;
      title: string;
      description: string;
    }[];
    steps: {
      number: string;
      title: string;
      description: string;
    }[];
    agentArchitectureTitle: string;
    agentArchitectureSubtitle: string;
  };
}

export const translations: Record<LanguageCode, UITranslations> = {
  en: {
    nav: {
      brand: 'TRIPGUARD AI',
      home: 'Home',
      myJourney: 'My Trip',
      recovery: 'Recovery',
      whatIf: 'What-If',
      howItWorks: 'How It Works',
      dashboard: 'Dashboard',
      startRecovery: 'Start Recovery',
    },
    hero: {
      badge: 'AI-Powered Travel Recovery',
      title: 'TRIPGUARD AI',
      subtitle: 'Autonomous Travel Recovery Agent',
      headlineLine1: 'Travel plans break.',
      headlineLine2: 'TRIPGUARD rebuilds them.',
      description:
        'An autonomous travel recovery agent that detects disruptions, reasons about alternatives, and helps you recover your journey.',
      startRecoveryBtn: 'Start Recovery',
      tryWhatIfBtn: 'Try What-If',
      seeHowItWorksBtn: 'See How It Works',
      timelineTitle: 'Autonomous Recovery Pipeline',
      timelineSteps: {
        yourJourney: 'YOUR JOURNEY',
        disruptionDetected: 'DISRUPTION DETECTED',
        aiAnalysis: 'AI ANALYSIS',
        alternativesFound: 'ALTERNATIVES FOUND',
        recoveredJourney: 'RECOVERED JOURNEY',
      },
    },
    dashboard: {
      sectionTitle: 'Live Recovery Telemetry',
      journeyLabel: 'JOURNEY',
      statusLabel: 'STATUS',
      disruptionLabel: 'DISRUPTION',
      recoveryLabel: 'RECOVERY',
      actionLabel: 'ACTION',
      awaitingData: 'Awaiting live data',
      noActiveJourney: 'Report train in chat',
      noDisruptionLogged: 'No disruption reported yet',
      awaitingUserInput: 'Awaiting journey input',
      awaitingUserSelection: 'Awaiting user approval',
      alternativesFoundCount: (count: number) =>
        `${count} ${count === 1 ? 'alternative' : 'alternatives'} found`,
      planSelected: 'Recovery Plan Selected',
    },
    chat: {
      panelTitle: 'TRIPGUARD AI Recovery Console',
      panelSubtitle: 'Connected to n8n Autonomous Travel Recovery Agent',
      initialGreeting:
        'Hi, I’m TripGuard AI.\nTell me what happened to your journey, and I’ll help you find the safest recovery option.',
      inputPlaceholder:
        'Describe your train delay, cancellation, or connection risk... (e.g. "My train 12951 is delayed. Find me an alternative.")',
      sendButton: 'Send',
      clearButton: 'Clear conversation',
      waitingForAgent: 'TRIPGUARD AI is querying RailRadar tools and evaluating recovery paths...',
      connectionError:
        'TRIPGUARD AI is temporarily unable to reach the recovery service. (TripGuard could not connect to the recovery service. Please try again.)',
      emptyResponseError:
        'The recovery service returned an empty response. Please verify your n8n workflow output.',
      invalidResponseError:
        'TRIPGUARD AI is temporarily unable to reach the recovery service. Please try again.',
      noAlternativesReturned:
        'No different alternative was returned by the available train data.',
      approvalPrompt: 'Which option would you like to choose?',
      readyToProceedPrompt: 'TRIPGUARD AI is ready to proceed with this recovery.',
      approveRecoveryBtn: 'Approve Recovery',
      rejectRecoveryBtn: 'Reject',
      quickPromptsTitle: 'Report a disruption or test a prompt:',
      quickPrompts: [
        'My train 12951 is delayed. Find me an alternative.',
        'My train 12919 is delayed by 3 hours. I need to reach Delhi today.',
        'My train is cancelled. Find another train.',
        'I may miss my connection.',
        'Find the best alternative.',
      ],
      enterHint: 'Press Enter to send · Shift + Enter for a new line',
      processingTimeline: {
        title: 'Agent Processing Timeline',
        disruptionDetected: 'Disruption detected',
        checkingLiveStatus: 'Checking live train status',
        searchingAlternatives: 'Searching alternative trains',
        comparingOptions: 'Comparing recovery options',
        recommendationReady: 'Recommendation ready',
      },
    },
    travelStatus: {
      cardTitle: 'Live Train Status',
      disruptionBannerTitle: '🚨 TRIP DISRUPTION',
      emptyTitle: 'No Live Train Data Loaded',
      emptyDescription:
        'Send your train number or disruption details in the AI chat. Only verified fields returned by the n8n backend will be displayed here.',
      fields: {
        trainNumber: 'Train',
        trainName: 'Train Name',
        journeyDate: 'Journey Date',
        source: 'Source',
        destination: 'Destination',
        route: 'Route',
        currentStatus: 'Status',
        currentStation: 'Current Station',
        previousStation: 'Previous Station',
        nextStation: 'Next Station',
        delay: 'Delay',
        scheduledDeparture: 'Scheduled Departure',
        scheduledArrival: 'Scheduled Arrival',
        expectedArrival: 'Expected Arrival',
        travelTime: 'Travel Time',
        risk: 'Risk',
        platform: 'Platform',
      },
    },
    recoveryOptions: {
      sectionTitle: 'Verified Recovery Options',
      sectionSubtitle: 'Which option would you like to choose?',
      optionPrefix: 'OPTION',
      bestRecoveryBadge: '⭐ BEST RECOVERY',
      defaultBestExplanation:
        'Recommended because it provides the best available balance of arrival time and delay.',
      departure: 'Departure:',
      arrival: 'Arrival:',
      delay: 'Delay:',
      route: 'Route:',
      travelTime: 'Travel time:',
      whyThisOption: 'Why this option:',
      selectOption: 'SELECT OPTION',
      selectedBadge: 'Recovery Plan Selected',
      emptyOptions:
        'No alternative trains loaded yet. Ask TRIPGUARD AI to search for recovery alternatives.',
      noDifferentAlternative:
        'No different alternative was returned by the available train data.',
    },
    actionStatus: {
      title: 'Recovery Consent & Action Status',
      defaultMvpStatus: 'Booking action prepared — awaiting secure confirmation.',
      bookingConfirmationRequired:
        'Recovery action prepared — booking confirmation is still required.',
      statusCardTitle: 'Recovery Plan Selected',
      afterApprovalChecklist: {
        recoveryApproved: 'Recovery approved',
        bookingActionRequested: 'Booking action requested',
        notificationSent: 'Notification sent',
        itineraryUpdated: 'Itinerary updated',
      },
      stages: {
        selected: 'Recovery option selected',
        preparation: 'Booking preparation',
        pendingConfirmation: 'Pending secure confirmation',
        notificationPrepared: 'Notification prepared',
        itineraryUpdated: 'Itinerary updated',
      },
      noTicketBookedDisclaimer:
        'Booking is only considered complete when the booking provider confirms it. Never asks for OTP, ATM PIN, or banking password.',
    },
    updatedItinerary: {
      title: 'UPDATED JOURNEY',
      originalJourney: 'Original Journey',
      recoveryPlan: 'Recovery Plan',
      status: 'Status',
      recoveryPlanSelected: 'Recovery Plan Selected',
      timeline: {
        originalJourney: 'Original Journey',
        disruption: 'Disruption',
        alternativeFound: 'Alternative Found',
        userApproved: 'User Approved',
        recoveryPlan: 'Recovery Plan',
      },
    },
    whatIf: {
      title: 'WHAT-IF Disruption & Comparison Simulator',
      subtitle:
        'Compare your Current Plan vs Alternative options or simulate cascading delays via the n8n AI backend.',
      inputPlaceholder: 'Ask a What-If question (e.g., What if I take the alternative train?)',
      analyzeButton: 'Simulate Scenario',
      presetPrompts: [
        'What if I take the alternative train?',
        'What if my train is delayed by another 2 hours?',
        'What if I miss this connection?',
        'What if the alternative is also delayed?',
      ],
      comparisonTitle: 'CURRENT PLAN vs ALTERNATIVE',
      currentPlanHeader: 'CURRENT PLAN',
      alternativeHeader: 'ALTERNATIVE',
      vsLabel: 'vs',
      recommendationBadge: '⭐ TRIPGUARD RECOMMENDATION',
      metrics: {
        departure: 'Departure',
        arrival: 'Arrival',
        delay: 'Delay',
        travelTime: 'Travel time',
        route: 'Route',
        risk: 'Risk',
      },
      cards: {
        currentPlan: 'CURRENT PLAN',
        possibleImpact: 'POSSIBLE IMPACT',
        alternativePlan: 'ALTERNATIVE PLAN',
        recommendation: 'RECOMMENDATION',
      },
      emptyPrompt:
        'Select or enter a scenario above to send a simulation query to the n8n AI backend.',
    },
    preferences: {
      title: 'Trip Preferences (Trip Memory)',
      subtitle:
        'Only preferences explicitly provided by you or returned by the backend are displayed here.',
      emptyPreferencesNote:
        'No custom trip preferences provided yet. Add your preferences below to share context with TRIPGUARD AI.',
      addPreferencesButton: 'Set / Edit Preferences',
      budget: 'Budget',
      maxDelay: 'Maximum acceptable delay',
      preferredTransport: 'Preferred transport',
      preferredArrivalTime: 'Preferred arrival time',
      comfortPreferences: 'Comfort preferences',
      travelStyle: 'Travel style',
      language: 'Language',
      safetyNoticeTitle: 'Zero-Credential Privacy Guarantee',
      safetyNoticeBody:
        'No OTP, ATM PIN, Card PIN, or banking password is ever requested or stored.',
    },
    liveAgents: {
      title: 'TRIPGUARD AGENTS',
      subtitle: 'Multi-agent orchestration state during active journey recovery',
      agents: {
        disruptionDetection: '🛰 Disruption Detection',
        alternativeDiscovery: '🔎 Alternative Discovery',
        recoveryOptimization: '🧠 Recovery Optimization',
        safetyCheck: '🛡 Safety Check',
        decisionAgent: '📋 Decision Agent',
        notificationAgent: '📩 Notification Agent',
      },
      states: {
        idle: 'Standby',
        active: 'Running',
        completed: 'Verified',
        alert: 'Attention',
      },
    },
    safetyBadges: {
      confirmedLiveData: 'CONFIRMED BY LIVE DATA',
      aiRecommendation: 'AI RECOMMENDATION',
      aiReasoningEstimation: 'AI REASONING / ESTIMATION',
    },
    trustSection: {
      title: 'Safety, Consent & Real-Time Data Integrity',
      subtitle: 'Built on strict operational guardrails for autonomous travel assistance',
      pillars: [
        'Human approval before consequential actions',
        'Real-time information comes from connected tools',
        'No OTP, PIN, or banking password is requested',
        'Booking is only considered complete when the booking provider confirms it',
      ],
    },
    howItWorks: {
      title: 'How TRIPGUARD AI Works',
      subtitle:
        'Autonomous travel recovery from live disruption detection to verified itinerary updates.',
      fiveSteps: [
        {
          number: '1',
          title: 'Detect',
          description: 'Identifies train delays, cancellations, or diversions as soon as reported.',
        },
        {
          number: '2',
          title: 'Understand',
          description: 'Analyzes your route constraints, boarding station, and connection margins.',
        },
        {
          number: '3',
          title: 'Discover',
          description: 'Searches real-time schedules via connected RailRadar tools for alternatives.',
        },
        {
          number: '4',
          title: 'Decide',
          description: 'Compares arrival times and delays to recommend the best recovery option.',
        },
        {
          number: '5',
          title: 'Recover',
          description: 'Executes your approved recovery plan, sends notifications, and updates your itinerary.',
        },
      ],
      steps: [
        {
          number: '01',
          title: 'Detect',
          description: 'TripGuard receives the travel disruption.',
        },
        {
          number: '02',
          title: 'Understand',
          description: 'AI analyzes the journey and constraints.',
        },
        {
          number: '03',
          title: 'Search',
          description: 'Real-time travel tools find alternatives.',
        },
        {
          number: '04',
          title: 'Optimize',
          description: 'TripGuard compares time, delay and practicality.',
        },
        {
          number: '05',
          title: 'Recommend',
          description: 'The AI presents the best recovery options.',
        },
        {
          number: '06',
          title: 'Approve',
          description: 'The traveler chooses the recovery plan.',
        },
        {
          number: '07',
          title: 'Recover',
          description: 'The selected recovery plan becomes the updated itinerary.',
        },
      ],
      agentArchitectureTitle: 'Agentic AI & Backend Architecture',
      agentArchitectureSubtitle:
        'Frontend → n8n Chat Trigger → TRIPGUARD AI Agent → RailRadar tools → recovery reasoning → approval → action workflow → notification → updated itinerary',
    },
  },
  hi: {
    nav: {
      brand: 'TRIPGUARD AI',
      home: 'होम',
      myJourney: 'मेरी यात्रा (My Trip)',
      recovery: 'रिकवरी',
      whatIf: 'क्या हो अगर (What-If)',
      howItWorks: 'यह कैसे काम करता है',
      dashboard: 'डैशबोर्ड',
      startRecovery: 'रिकवरी शुरू करें',
    },
    hero: {
      badge: 'AI-संचालित यात्रा रिकवरी',
      title: 'TRIPGUARD AI',
      subtitle: 'स्वायत्त यात्रा रिकवरी एजेंट',
      headlineLine1: 'Travel plans break.',
      headlineLine2: 'TRIPGUARD rebuilds them.',
      description:
        'एक स्वायत्त यात्रा रिकवरी एजेंट जो बाधाओं का पता लगाता है, विकल्पों की तुलना करता है, और आपकी यात्रा को सुरक्षित रूप से पूरा करने में मदद करता है।',
      startRecoveryBtn: 'Start Recovery',
      tryWhatIfBtn: 'Try What-If',
      seeHowItWorksBtn: 'कार्यप्रणाली देखें',
      timelineTitle: 'स्वायत्त रिकवरी टाइमलाइन',
      timelineSteps: {
        yourJourney: 'YOUR JOURNEY',
        disruptionDetected: 'DISRUPTION DETECTED',
        aiAnalysis: 'AI ANALYSIS',
        alternativesFound: 'ALTERNATIVES FOUND',
        recoveredJourney: 'RECOVERED JOURNEY',
      },
    },
    dashboard: {
      sectionTitle: 'लाइव यात्रा स्थिति डैशबोर्ड',
      journeyLabel: 'JOURNEY',
      statusLabel: 'STATUS',
      disruptionLabel: 'DISRUPTION',
      recoveryLabel: 'RECOVERY',
      actionLabel: 'ACTION',
      awaitingData: 'लाइव डेटा की प्रतीक्षा है',
      noActiveJourney: 'चैट में ट्रेन दर्ज करें',
      noDisruptionLogged: 'कोई बाधा दर्ज नहीं',
      awaitingUserInput: 'यात्रा विवरण की प्रतीक्षा',
      awaitingUserSelection: 'उपयोगकर्ता स्वीकृति की प्रतीक्षा',
      alternativesFoundCount: (count: number) => `${count} विकल्प मिले`,
      planSelected: 'Recovery Plan Selected',
    },
    chat: {
      panelTitle: 'TRIPGUARD AI रिकवरी कंसोल',
      panelSubtitle: 'n8n स्वायत्त ट्रैवल रिकवरी एजेंट से जुड़ा हुआ',
      initialGreeting:
        'नमस्ते, मैं TripGuard AI हूँ।\nमुझे बताएं कि आपकी यात्रा में क्या समस्या आई है, और मैं सबसे सुरक्षित विकल्प खोजने में आपकी मदद करूँगा।',
      inputPlaceholder:
        'अपनी ट्रेन की देरी या रद्दीकरण लिखें... (जैसे: "My train 12951 is delayed. Find me an alternative.")',
      sendButton: 'भेजें',
      clearButton: 'बातचीत साफ़ करें',
      waitingForAgent: 'TRIPGUARD AI लाइव रेल डेटा और विकल्पों का विश्लेषण कर रहा है...',
      connectionError:
        'TRIPGUARD AI is temporarily unable to reach the recovery service. (TripGuard could not connect to the recovery service. Please try again.)',
      emptyResponseError: 'रिकवरी सेवा से खाली प्रतिक्रिया मिली। कृपया पुनः प्रयास करें।',
      invalidResponseError:
        'TRIPGUARD AI is temporarily unable to reach the recovery service. Please try again.',
      noAlternativesReturned:
        'No different alternative was returned by the available train data.',
      approvalPrompt: 'Which option would you like to choose?',
      readyToProceedPrompt: 'TRIPGUARD AI is ready to proceed with this recovery.',
      approveRecoveryBtn: 'Approve Recovery',
      rejectRecoveryBtn: 'Reject',
      quickPromptsTitle: 'उदाहरण संदेश चुनें:',
      quickPrompts: [
        'My train 12951 is delayed. Find me an alternative.',
        'My train 12919 is delayed by 3 hours. I need to reach Delhi today.',
        'My train is cancelled. Find another train.',
        'I may miss my connection.',
        'Find the best alternative.',
      ],
      enterHint: 'भेजने के लिए Enter दबाएं · नई लाइन के लिए Shift + Enter',
      processingTimeline: {
        title: 'एजेंट प्रोसेसिंग टाइमलाइन',
        disruptionDetected: 'Disruption detected',
        checkingLiveStatus: 'Checking live train status',
        searchingAlternatives: 'Searching alternative trains',
        comparingOptions: 'Comparing recovery options',
        recommendationReady: 'Recommendation ready',
      },
    },
    travelStatus: {
      cardTitle: 'लाइव ट्रेन स्थिति (Travel Status)',
      disruptionBannerTitle: '🚨 TRIP DISRUPTION',
      emptyTitle: 'कोई लाइव ट्रेन डेटा उपलब्ध नहीं है',
      emptyDescription:
        'चैट में अपनी ट्रेन संख्या या समस्या भेजें। केवल n8n बैकएंड द्वारा प्राप्त वास्तविक जानकारी यहाँ दिखाई जाएगी।',
      fields: {
        trainNumber: 'Train',
        trainName: 'Train Name',
        journeyDate: 'Journey Date',
        source: 'Source',
        destination: 'Destination',
        route: 'Route',
        currentStatus: 'Status',
        currentStation: 'Current Station',
        previousStation: 'Previous Station',
        nextStation: 'Next Station',
        delay: 'Delay',
        scheduledDeparture: 'Scheduled Departure',
        scheduledArrival: 'Scheduled Arrival',
        expectedArrival: 'Expected Arrival',
        travelTime: 'Travel Time',
        risk: 'Risk',
        platform: 'Platform',
      },
    },
    recoveryOptions: {
      sectionTitle: 'रिकवरी विकल्प (Recovery Options)',
      sectionSubtitle: 'Which option would you like to choose?',
      optionPrefix: 'OPTION',
      bestRecoveryBadge: '⭐ BEST RECOVERY',
      defaultBestExplanation:
        'Recommended because it provides the best available balance of arrival time and delay.',
      departure: 'Departure:',
      arrival: 'Arrival:',
      delay: 'Delay:',
      route: 'Route:',
      travelTime: 'Travel time:',
      whyThisOption: 'Why this option:',
      selectOption: 'SELECT OPTION',
      selectedBadge: 'Recovery Plan Selected',
      emptyOptions: 'अभी कोई विकल्प लोड नहीं हुआ है। विकल्प खोजने के लिए चैट का उपयोग करें।',
      noDifferentAlternative:
        'No different alternative was returned by the available train data.',
    },
    actionStatus: {
      title: 'Recovery Consent & Action Status',
      defaultMvpStatus: 'Booking action prepared — awaiting secure confirmation.',
      bookingConfirmationRequired:
        'Recovery action prepared — booking confirmation is still required.',
      statusCardTitle: 'Recovery Plan Selected',
      afterApprovalChecklist: {
        recoveryApproved: 'Recovery approved',
        bookingActionRequested: 'Booking action requested',
        notificationSent: 'Notification sent',
        itineraryUpdated: 'Itinerary updated',
      },
      stages: {
        selected: 'Recovery option selected',
        preparation: 'Booking preparation',
        pendingConfirmation: 'Pending secure confirmation',
        notificationPrepared: 'Notification prepared',
        itineraryUpdated: 'Itinerary updated',
      },
      noTicketBookedDisclaimer:
        'जब तक बैकएंड से वास्तविक बुकिंग पुष्टि नहीं मिलती, टिकट बुक होने का दावा नहीं किया जाता।',
    },
    updatedItinerary: {
      title: 'UPDATED JOURNEY',
      originalJourney: 'Original Journey',
      recoveryPlan: 'Recovery Plan',
      status: 'Status',
      recoveryPlanSelected: 'Recovery Plan Selected',
      timeline: {
        originalJourney: 'Original Journey',
        disruption: 'Disruption',
        alternativeFound: 'Alternative Found',
        userApproved: 'User Approved',
        recoveryPlan: 'Recovery Plan',
      },
    },
    whatIf: {
      title: 'WHAT-IF सिम्युलेटर',
      subtitle: 'CURRENT PLAN बनाम ALTERNATIVE की तुलना करें।',
      inputPlaceholder: 'अपना प्रश्न लिखें (जैसे: What if I take the alternative train?)',
      analyzeButton: 'विश्लेषण करें',
      presetPrompts: [
        'What if I take the alternative train?',
        'What if my train is delayed by another 2 hours?',
        'What if I miss this connection?',
        'What if the alternative is also delayed?',
      ],
      comparisonTitle: 'CURRENT PLAN vs ALTERNATIVE',
      currentPlanHeader: 'CURRENT PLAN',
      alternativeHeader: 'ALTERNATIVE',
      vsLabel: 'vs',
      recommendationBadge: '⭐ TRIPGUARD RECOMMENDATION',
      metrics: {
        departure: 'Departure',
        arrival: 'Arrival',
        delay: 'Delay',
        travelTime: 'Travel time',
        route: 'Route',
        risk: 'Risk',
      },
      cards: {
        currentPlan: 'CURRENT PLAN',
        possibleImpact: 'POSSIBLE IMPACT',
        alternativePlan: 'ALTERNATIVE PLAN',
        recommendation: 'RECOMMENDATION',
      },
      emptyPrompt: 'n8n AI बैकएंड से परिणाम देखने के लिए ऊपर कोई परिदृश्य चुनें।',
    },
    preferences: {
      title: 'Trip Preferences (Trip Memory)',
      subtitle: 'केवल आपके द्वारा दर्ज की गई या बैकएंड द्वारा प्राप्त प्राथमिकताएं यहाँ दिखाई जाती हैं।',
      emptyPreferencesNote: 'अभी तक कोई यात्रा प्राथमिकता दर्ज नहीं की गई है।',
      addPreferencesButton: 'प्राथमिकताएं जोड़ें / बदलें',
      budget: 'Budget',
      maxDelay: 'Maximum acceptable delay',
      preferredTransport: 'Preferred transport',
      preferredArrivalTime: 'Preferred arrival time',
      comfortPreferences: 'Comfort preferences',
      travelStyle: 'Travel style',
      language: 'Language',
      safetyNoticeTitle: 'सुरक्षा और गोपनीयता गारंटी',
      safetyNoticeBody:
        'No OTP, PIN, or banking password is requested.',
    },
    liveAgents: {
      title: 'TRIPGUARD AGENTS',
      subtitle: 'रिकवरी के दौरान लाइव एजेंट गतिविधि',
      agents: {
        disruptionDetection: '🛰 Disruption Detection',
        alternativeDiscovery: '🔎 Alternative Discovery',
        recoveryOptimization: '🧠 Recovery Optimization',
        safetyCheck: '🛡 Safety Check',
        decisionAgent: '📋 Decision Agent',
        notificationAgent: '📩 Notification Agent',
      },
      states: {
        idle: 'Standby',
        active: 'Running',
        completed: 'Verified',
        alert: 'Attention',
      },
    },
    safetyBadges: {
      confirmedLiveData: 'CONFIRMED BY LIVE DATA',
      aiRecommendation: 'AI RECOMMENDATION',
      aiReasoningEstimation: 'AI REASONING / ESTIMATION',
    },
    trustSection: {
      title: 'Safety, Consent & Real-Time Data Integrity',
      subtitle: 'सुरक्षित और पारदर्शी AI यात्रा रिकवरी',
      pillars: [
        'Human approval before consequential actions',
        'Real-time information comes from connected tools',
        'No OTP, PIN, or banking password is requested',
        'Booking is only considered complete when the booking provider confirms it',
      ],
    },
    howItWorks: {
      title: 'TRIPGUARD AI कैसे काम करता है',
      subtitle: '5 मुख्य चरणों में स्वायत्त यात्रा रिकवरी।',
      fiveSteps: [
        { number: '1', title: 'Detect', description: 'Identifies train delays, cancellations, or diversions as soon as reported.' },
        { number: '2', title: 'Understand', description: 'Analyzes your route constraints, boarding station, and connection margins.' },
        { number: '3', title: 'Discover', description: 'Searches real-time schedules via connected RailRadar tools for alternatives.' },
        { number: '4', title: 'Decide', description: 'Compares arrival times and delays to recommend the best recovery option.' },
        { number: '5', title: 'Recover', description: 'Executes your approved recovery plan, sends notifications, and updates your itinerary.' },
      ],
      steps: [
        { number: '01', title: 'Detect', description: 'TripGuard receives the travel disruption.' },
        { number: '02', title: 'Understand', description: 'AI analyzes the journey and constraints.' },
        { number: '03', title: 'Search', description: 'Real-time travel tools find alternatives.' },
        { number: '04', title: 'Optimize', description: 'TripGuard compares time, delay and practicality.' },
        { number: '05', title: 'Recommend', description: 'The AI presents the best recovery options.' },
        { number: '06', title: 'Approve', description: 'The traveler chooses the recovery plan.' },
        { number: '07', title: 'Recover', description: 'The selected recovery plan becomes the updated itinerary.' },
      ],
      agentArchitectureTitle: 'Agentic AI Architecture',
      agentArchitectureSubtitle:
        'Frontend → n8n Chat Trigger → TRIPGUARD AI Agent → RailRadar tools → recovery reasoning → approval → action workflow → notification → updated itinerary',
    },
  },
  te: {
    nav: {
      brand: 'TRIPGUARD AI',
      home: 'హోమ్',
      myJourney: 'నా ప్రయాణం (My Trip)',
      recovery: 'రికవరీ',
      whatIf: 'What-If',
      howItWorks: 'ఇది ఎలా పనిచేస్తుంది',
      dashboard: 'డ్యాష్‌బోర్డ్',
      startRecovery: 'Start Recovery',
    },
    hero: {
      badge: 'AI-Powered Travel Recovery',
      title: 'TRIPGUARD AI',
      subtitle: 'Autonomous Travel Recovery Agent',
      headlineLine1: 'Travel plans break.',
      headlineLine2: 'TRIPGUARD rebuilds them.',
      description:
        'An autonomous travel recovery agent that detects disruptions, reasons about alternatives, and helps you recover your journey.',
      startRecoveryBtn: 'Start Recovery',
      tryWhatIfBtn: 'Try What-If',
      seeHowItWorksBtn: 'ఎలా పనిచేస్తుందో చూడండి',
      timelineTitle: 'రికవరీ ప్రయాణ క్రమం',
      timelineSteps: {
        yourJourney: 'YOUR JOURNEY',
        disruptionDetected: 'DISRUPTION DETECTED',
        aiAnalysis: 'AI ANALYSIS',
        alternativesFound: 'ALTERNATIVES FOUND',
        recoveredJourney: 'RECOVERED JOURNEY',
      },
    },
    dashboard: {
      sectionTitle: 'ప్రయాణ స్థితి డ్యాష్‌బోర్డ్',
      journeyLabel: 'JOURNEY',
      statusLabel: 'STATUS',
      disruptionLabel: 'DISRUPTION',
      recoveryLabel: 'RECOVERY',
      actionLabel: 'ACTION',
      awaitingData: 'లైవ్ డేటా కోసం వేచి ఉంది',
      noActiveJourney: 'చాట్‌లో రైలు వివరాలు తెలపండి',
      noDisruptionLogged: 'ఇంకా అంతరాయం నమోదు కాలేదు',
      awaitingUserInput: 'వివరాల కోసం వేచి ఉంది',
      awaitingUserSelection: 'ఆమోదం కోసం వేచి ఉంది',
      alternativesFoundCount: (count: number) => `${count} ప్రత్యామ్నాయాలు కనుగొనబడ్డాయి`,
      planSelected: 'Recovery Plan Selected',
    },
    chat: {
      panelTitle: 'TRIPGUARD AI రికవరీ కన్సోల్',
      panelSubtitle: 'n8n Autonomous Travel Recovery Agent కు కనెక్ట్ చేయబడింది',
      initialGreeting:
        'హాయ్, నేను TripGuard AI.\nమీ ప్రయాణానికి ఏమి జరిగిందో చెప్పండి, సురక్షితమైన ప్రత్యామ్నాయాన్ని కనుగొనడంలో నేను మీకు సహాయం చేస్తాను.',
      inputPlaceholder:
        'మీ రైలు ఆలస్యం లేదా రద్దు వివరాలను టైప్ చేయండి... (ఉదా: "My train 12951 is delayed. Find me an alternative.")',
      sendButton: 'పంపు',
      clearButton: 'చాట్ క్లియర్ చేయండి',
      waitingForAgent: 'TRIPGUARD AI లైవ్ రైలు సమాచారాన్ని విశ్లేషిస్తోంది...',
      connectionError:
        'TRIPGUARD AI is temporarily unable to reach the recovery service. (TripGuard could not connect to the recovery service. Please try again.)',
      emptyResponseError: 'రికవరీ సర్వీస్ నుండి ఖాళీ సమాధానం వచ్చింది. మళ్ళీ ప్రయత్నించండి.',
      invalidResponseError:
        'TRIPGUARD AI is temporarily unable to reach the recovery service. Please try again.',
      noAlternativesReturned:
        'No different alternative was returned by the available train data.',
      approvalPrompt: 'Which option would you like to choose?',
      readyToProceedPrompt: 'TRIPGUARD AI is ready to proceed with this recovery.',
      approveRecoveryBtn: 'Approve Recovery',
      rejectRecoveryBtn: 'Reject',
      quickPromptsTitle: 'ఉదాహరణ సందేశాలు:',
      quickPrompts: [
        'My train 12951 is delayed. Find me an alternative.',
        'My train 12919 is delayed by 3 hours. I need to reach Delhi today.',
        'My train is cancelled. Find another train.',
        'I may miss my connection.',
        'Find the best alternative.',
      ],
      enterHint: 'పంపడానికి Enter నొక్కండి · కొత్త లైన్ కోసం Shift + Enter',
      processingTimeline: {
        title: 'Agent Processing Timeline',
        disruptionDetected: 'Disruption detected',
        checkingLiveStatus: 'Checking live train status',
        searchingAlternatives: 'Searching alternative trains',
        comparingOptions: 'Comparing recovery options',
        recommendationReady: 'Recommendation ready',
      },
    },
    travelStatus: {
      cardTitle: 'లైవ్ రైలు స్థితి (Travel Status)',
      disruptionBannerTitle: '🚨 TRIP DISRUPTION',
      emptyTitle: 'లైవ్ రైలు డేటా ఇంకా లోడ్ కాలేదు',
      emptyDescription:
        'చాట్‌లో మీ రైలు నంబర్‌ను పంపండి. n8n బ్యాకెండ్ అందించిన వాస్తవ వివరాలు మాత్రమే ఇక్కడ చూపబడతాయి.',
      fields: {
        trainNumber: 'Train',
        trainName: 'Train Name',
        journeyDate: 'Journey Date',
        source: 'Source',
        destination: 'Destination',
        route: 'Route',
        currentStatus: 'Status',
        currentStation: 'Current Station',
        previousStation: 'Previous Station',
        nextStation: 'Next Station',
        delay: 'Delay',
        scheduledDeparture: 'Scheduled Departure',
        scheduledArrival: 'Scheduled Arrival',
        expectedArrival: 'Expected Arrival',
        travelTime: 'Travel Time',
        risk: 'Risk',
        platform: 'Platform',
      },
    },
    recoveryOptions: {
      sectionTitle: 'ప్రత్యామ్నాయ ఎంపికలు (Recovery Options)',
      sectionSubtitle: 'Which option would you like to choose?',
      optionPrefix: 'OPTION',
      bestRecoveryBadge: '⭐ BEST RECOVERY',
      defaultBestExplanation:
        'Recommended because it provides the best available balance of arrival time and delay.',
      departure: 'Departure:',
      arrival: 'Arrival:',
      delay: 'Delay:',
      route: 'Route:',
      travelTime: 'Travel time:',
      whyThisOption: 'Why this option:',
      selectOption: 'SELECT OPTION',
      selectedBadge: 'Recovery Plan Selected',
      emptyOptions: 'ఇంకా ప్రత్యామ్నాయ రైళ్లు లోడ్ కాలేదు.',
      noDifferentAlternative:
        'No different alternative was returned by the available train data.',
    },
    actionStatus: {
      title: 'Recovery Consent & Action Status',
      defaultMvpStatus: 'Booking action prepared — awaiting secure confirmation.',
      bookingConfirmationRequired:
        'Recovery action prepared — booking confirmation is still required.',
      statusCardTitle: 'Recovery Plan Selected',
      afterApprovalChecklist: {
        recoveryApproved: 'Recovery approved',
        bookingActionRequested: 'Booking action requested',
        notificationSent: 'Notification sent',
        itineraryUpdated: 'Itinerary updated',
      },
      stages: {
        selected: 'Recovery option selected',
        preparation: 'Booking preparation',
        pendingConfirmation: 'Pending secure confirmation',
        notificationPrepared: 'Notification prepared',
        itineraryUpdated: 'Itinerary updated',
      },
      noTicketBookedDisclaimer:
        'Booking is only considered complete when the booking provider confirms it.',
    },
    updatedItinerary: {
      title: 'UPDATED JOURNEY',
      originalJourney: 'Original Journey',
      recoveryPlan: 'Recovery Plan',
      status: 'Status',
      recoveryPlanSelected: 'Recovery Plan Selected',
      timeline: {
        originalJourney: 'Original Journey',
        disruption: 'Disruption',
        alternativeFound: 'Alternative Found',
        userApproved: 'User Approved',
        recoveryPlan: 'Recovery Plan',
      },
    },
    whatIf: {
      title: 'WHAT-IF సిమ్యులేటర్',
      subtitle: 'CURRENT PLAN vs ALTERNATIVE పోలిక మరియు విశ్లేషణ.',
      inputPlaceholder: 'ప్రశ్న అడగండి (ఉదా: What if I take the alternative train?)',
      analyzeButton: 'సిమ్యులేట్ చేయండి',
      presetPrompts: [
        'What if I take the alternative train?',
        'What if my train is delayed by another 2 hours?',
        'What if I miss this connection?',
        'What if the alternative is also delayed?',
      ],
      comparisonTitle: 'CURRENT PLAN vs ALTERNATIVE',
      currentPlanHeader: 'CURRENT PLAN',
      alternativeHeader: 'ALTERNATIVE',
      vsLabel: 'vs',
      recommendationBadge: '⭐ TRIPGUARD RECOMMENDATION',
      metrics: {
        departure: 'Departure',
        arrival: 'Arrival',
        delay: 'Delay',
        travelTime: 'Travel time',
        route: 'Route',
        risk: 'Risk',
      },
      cards: {
        currentPlan: 'CURRENT PLAN',
        possibleImpact: 'POSSIBLE IMPACT',
        alternativePlan: 'ALTERNATIVE PLAN',
        recommendation: 'RECOMMENDATION',
      },
      emptyPrompt: 'పై ఉదాహరణలలో ఒకదాన్ని ఎంచుకుని n8n AI విశ్లేషణను చూడండి.',
    },
    preferences: {
      title: 'Trip Preferences (Trip Memory)',
      subtitle: 'మీరు అందించిన లేదా బ్యాకెండ్ నుండి వచ్చిన ప్రాధాన్యతలు మాత్రమే ఇక్కడ చూపబడతాయి.',
      emptyPreferencesNote: 'ఇంకా ఎటువంటి ప్రాధాన్యతలు నమోదు చేయలేదు.',
      addPreferencesButton: 'ప్రాధాన్యతలను సెట్ చేయండి',
      budget: 'Budget',
      maxDelay: 'Maximum acceptable delay',
      preferredTransport: 'Preferred transport',
      preferredArrivalTime: 'Preferred arrival time',
      comfortPreferences: 'Comfort preferences',
      travelStyle: 'Travel style',
      language: 'Language',
      safetyNoticeTitle: 'గోప్యతా భద్రత',
      safetyNoticeBody:
        'No OTP, PIN, or banking password is requested.',
    },
    liveAgents: {
      title: 'TRIPGUARD AGENTS',
      subtitle: 'రికవరీ సమయంలో ఏజెంట్ల స్థితి',
      agents: {
        disruptionDetection: '🛰 Disruption Detection',
        alternativeDiscovery: '🔎 Alternative Discovery',
        recoveryOptimization: '🧠 Recovery Optimization',
        safetyCheck: '🛡 Safety Check',
        decisionAgent: '📋 Decision Agent',
        notificationAgent: '📩 Notification Agent',
      },
      states: {
        idle: 'Standby',
        active: 'Running',
        completed: 'Verified',
        alert: 'Attention',
      },
    },
    safetyBadges: {
      confirmedLiveData: 'CONFIRMED BY LIVE DATA',
      aiRecommendation: 'AI RECOMMENDATION',
      aiReasoningEstimation: 'AI REASONING / ESTIMATION',
    },
    trustSection: {
      title: 'Safety, Consent & Real-Time Data Integrity',
      subtitle: 'సురక్షితమైన AI ప్రయాణ పునరుద్ధరణ సూత్రాలు',
      pillars: [
        'Human approval before consequential actions',
        'Real-time information comes from connected tools',
        'No OTP, PIN, or banking password is requested',
        'Booking is only considered complete when the booking provider confirms it',
      ],
    },
    howItWorks: {
      title: 'TRIPGUARD AI ఎలా పనిచేస్తుంది',
      subtitle: '5 దశల్లో ప్రయాణ పునరుద్ధరణ.',
      fiveSteps: [
        { number: '1', title: 'Detect', description: 'Identifies train delays, cancellations, or diversions as soon as reported.' },
        { number: '2', title: 'Understand', description: 'Analyzes your route constraints, boarding station, and connection margins.' },
        { number: '3', title: 'Discover', description: 'Searches real-time schedules via connected RailRadar tools for alternatives.' },
        { number: '4', title: 'Decide', description: 'Compares arrival times and delays to recommend the best recovery option.' },
        { number: '5', title: 'Recover', description: 'Executes your approved recovery plan, sends notifications, and updates your itinerary.' },
      ],
      steps: [
        { number: '01', title: 'Detect', description: 'TripGuard receives the travel disruption.' },
        { number: '02', title: 'Understand', description: 'AI analyzes the journey and constraints.' },
        { number: '03', title: 'Search', description: 'Real-time travel tools find alternatives.' },
        { number: '04', title: 'Optimize', description: 'TripGuard compares time, delay and practicality.' },
        { number: '05', title: 'Recommend', description: 'The AI presents the best recovery options.' },
        { number: '06', title: 'Approve', description: 'The traveler chooses the recovery plan.' },
        { number: '07', title: 'Recover', description: 'The selected recovery plan becomes the updated itinerary.' },
      ],
      agentArchitectureTitle: 'Agentic AI Architecture',
      agentArchitectureSubtitle:
        'Frontend → n8n Chat Trigger → TRIPGUARD AI Agent → RailRadar tools → recovery reasoning → approval → action workflow → notification → updated itinerary',
    },
  },
};
