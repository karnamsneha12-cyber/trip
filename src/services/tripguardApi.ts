import {
  LanguageCode,
  ParsedTripGuardResponse,
  PlanComparisonMetrics,
  RecoveryOption,
  TrainStatusData,
  TripPreferences,
  WhatIfAnalysis,
} from '../types/tripguard';

/**
 * ============================================================================
 * N8N BACKEND CONFIGURATION
 * ============================================================================
 * Single centralized configuration for the n8n Chat Trigger URL.
 * Reads from VITE_N8N_CHAT_URL in environment variables.
 * Do NOT hardcode API keys or RailRadar secrets in frontend code.
 * ============================================================================
 */
const DEFAULT_N8N_CHAT_URL =
  'https://pande2312.app.n8n.cloud/webhook/97a3a629-3d00-4248-afdd-dd80451a2554/chat';

function sanitizeN8nUrl(raw?: string): string {
  if (!raw) return '';
  return raw.replace(/["'|]+/g, '').trim();
}

const VITE_N8N_CHAT_URL: string = (() => {
  const fromEnv = sanitizeN8nUrl(import.meta.env?.VITE_N8N_CHAT_URL);
  if (fromEnv && !fromEnv.includes('pooja10.app.n8n.cloud')) {
    return fromEnv;
  }
  return DEFAULT_N8N_CHAT_URL;
})();

const RUNTIME_URL_STORAGE_KEY = 'tripguard_n8n_chat_url_override';
const LAST_ENV_URL_STORAGE_KEY = 'tripguard_last_env_n8n_url';
const SESSION_ID_STORAGE_KEY = 'tripguard_session_id';

/**
 * Returns the active n8n Chat Trigger URL from VITE_N8N_CHAT_URL.
 * Automatically clears any cached session override whenever VITE_N8N_CHAT_URL changes.
 */
export function getConfiguredN8nUrl(): string {
  const envUrl = sanitizeN8nUrl(VITE_N8N_CHAT_URL) || DEFAULT_N8N_CHAT_URL;
  if (typeof window !== 'undefined') {
    const lastEnvUrl = window.sessionStorage.getItem(LAST_ENV_URL_STORAGE_KEY);
    if (lastEnvUrl !== envUrl) {
      window.sessionStorage.setItem(LAST_ENV_URL_STORAGE_KEY, envUrl);
      window.sessionStorage.removeItem(RUNTIME_URL_STORAGE_KEY);
    }
    const override = sanitizeN8nUrl(
      window.sessionStorage.getItem(RUNTIME_URL_STORAGE_KEY) || ''
    );
    if (override.length > 0 && !override.includes('pooja10.app.n8n.cloud')) {
      return override;
    }
  }
  return envUrl;
}

export function setRuntimeN8nUrlOverride(url: string): void {
  if (typeof window !== 'undefined') {
    const cleaned = sanitizeN8nUrl(url);
    if (cleaned) {
      window.sessionStorage.setItem(RUNTIME_URL_STORAGE_KEY, cleaned);
    } else {
      window.sessionStorage.removeItem(RUNTIME_URL_STORAGE_KEY);
    }
  }
}

export function getSessionId(): string {
  if (typeof window === 'undefined') return 'tripguard-session-server';
  let existing = window.sessionStorage.getItem(SESSION_ID_STORAGE_KEY);
  if (!existing) {
    existing = `tg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    window.sessionStorage.setItem(SESSION_ID_STORAGE_KEY, existing);
  }
  return existing;
}

export function resetSessionId(): string {
  if (typeof window === 'undefined') return 'tripguard-session-server';
  const next = `tg_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  window.sessionStorage.setItem(SESSION_ID_STORAGE_KEY, next);
  return next;
}

export class TripGuardApiError extends Error {
  public readonly code:
    | 'BACKEND_UNAVAILABLE'
    | 'NETWORK_ERROR'
    | 'EMPTY_RESPONSE'
    | 'INVALID_RESPONSE'
    | 'TOOL_FAILURE';

  constructor(
    message: string,
    code:
      | 'BACKEND_UNAVAILABLE'
      | 'NETWORK_ERROR'
      | 'EMPTY_RESPONSE'
      | 'INVALID_RESPONSE'
      | 'TOOL_FAILURE'
  ) {
    super(message);
    this.name = 'TripGuardApiError';
    this.code = code;
  }
}

export interface SendMessageOptions {
  preferences?: TripPreferences;
  language?: LanguageCode;
  mode?: 'recovery' | 'whatif' | 'approval';
}

function stripMarkdownFormatting(text?: string): string | undefined {
  if (!text) return undefined;
  const cleaned = text.replace(/\*\*/g, '').replace(/^[\s*\-:]+|[\s*]+$/g, '').trim();
  return cleaned.length > 0 ? cleaned : undefined;
}

function cleanString(val: unknown): string | undefined {
  if (typeof val === 'string' && val.trim().length > 0) {
    return val.trim();
  }
  if (typeof val === 'number' && !Number.isNaN(val)) {
    return String(val);
  }
  return undefined;
}

/**
 * Parses concatenated or newline-delimited JSON streaming chunks from n8n Chat Trigger
 * (e.g. {"type":"begin",...}{"type":"item","content":"..."}{"type":"end",...})
 * and returns the assembled text from the final agent output block.
 */
function parseN8nStreamChunks(rawBodyText: string): string | null {
  if (!rawBodyText.includes('"type":"item"') && !rawBodyText.includes('"type":"begin"')) {
    return null;
  }

  // Split concatenated JSON objects like `}{` into separate lines
  const normalizedLines = rawBodyText.replace(/\}\s*\{/g, '}\n{').split('\n');
  const blocks: string[] = [];
  let currentBlock = '';

  for (const line of normalizedLines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const chunk = JSON.parse(trimmed) as {
        type?: string;
        content?: string;
      };
      if (chunk.type === 'begin') {
        if (currentBlock.trim().length > 0) {
          blocks.push(currentBlock);
        }
        currentBlock = '';
      } else if (chunk.type === 'item' && typeof chunk.content === 'string') {
        currentBlock += chunk.content;
      } else if (chunk.type === 'end') {
        if (currentBlock.trim().length > 0) {
          blocks.push(currentBlock);
          currentBlock = '';
        }
      }
    } catch {
      // Ignore malformed chunk line
    }
  }

  if (currentBlock.trim().length > 0) {
    blocks.push(currentBlock);
  }

  if (blocks.length === 0) {
    return null;
  }

  // Return the last complete agent response block (after any intermediate tool steps)
  const finalBlock = blocks[blocks.length - 1];
  return finalBlock.replace(/\n*RECOVERY_APPROVAL_REQUIRED\s*$/i, '').trim();
}

/**
 * Extracts structured TrainStatusData strictly from fields present in the n8n response.
 * Never fabricates missing fields.
 */
function extractTrainStatus(
  rawObj: Record<string, unknown>,
  rawText: string
): TrainStatusData | undefined {
  const statusCandidate =
    (rawObj.trainStatus as Record<string, unknown> | undefined) ||
    (rawObj.train_status as Record<string, unknown> | undefined) ||
    (rawObj.statusData as Record<string, unknown> | undefined) ||
    rawObj;

  const status: TrainStatusData = {};

  const assignIfPresent = (targetKey: keyof TrainStatusData, possibleKeys: string[]) => {
    for (const key of possibleKeys) {
      const val = cleanString(statusCandidate[key]);
      if (val !== undefined) {
        status[targetKey] = val;
        return;
      }
    }
  };

  assignIfPresent('trainNumber', ['trainNumber', 'train_number', 'trainNo', 'train_no']);
  assignIfPresent('trainName', ['trainName', 'train_name']);
  assignIfPresent('journeyDate', ['journeyDate', 'journey_date', 'date']);
  assignIfPresent('source', ['source', 'from', 'origin', 'sourceStation']);
  assignIfPresent('destination', ['destination', 'to', 'destinationStation']);
  assignIfPresent('route', ['route', 'routeTaken', 'via']);
  assignIfPresent('currentStatus', ['currentStatus', 'current_status', 'status', 'trainStatusText']);
  assignIfPresent('currentStation', ['currentStation', 'current_station', 'lastStation']);
  assignIfPresent('previousStation', ['previousStation', 'previous_station']);
  assignIfPresent('nextStation', ['nextStation', 'next_station', 'upcomingStation']);
  assignIfPresent('delay', ['delay', 'delayTime', 'delay_minutes', 'lateBy']);
  assignIfPresent('scheduledDeparture', ['scheduledDeparture', 'scheduled_departure']);
  assignIfPresent('scheduledArrival', ['scheduledArrival', 'scheduled_arrival', 'sta']);
  assignIfPresent('expectedArrival', ['expectedArrival', 'expected_arrival', 'eta']);
  assignIfPresent('travelTime', ['travelTime', 'travel_time', 'duration']);
  assignIfPresent('risk', ['risk', 'connectionRisk']);
  assignIfPresent('platform', ['platform', 'platformNumber', 'platform_no']);

  if (rawText) {
    const statusSectionText =
      rawText.split(/ALTERNATIVES\s+FROM|🛤️\s*RECOVERY\s*OPTIONS|Option\s+1\b/i)[0] || rawText;

    // 1. Parse "Train 12951 (Name)" or "Your train, 12951 Name, is..." or "TRAIN STATUS: 12919 (Name)"
    const trainNumAndName =
      statusSectionText.match(/TRAIN\s*STATUS\s*:\s*(\d{4,5})\s*\(([^)]+)\)/i) ||
      statusSectionText.match(/Train\s+(\d{4,5})\s*\(([^)]+)\)/i) ||
      statusSectionText.match(/(?:Your\s+train,?\s*|\bTrain\s+)\**(\d{4,5})\s+([^,.\n*()]+?)\**(?:\s*,|\s+is\b|\s+has\b|\n)/i);
    if (trainNumAndName) {
      if (!status.trainNumber) status.trainNumber = stripMarkdownFormatting(trainNumAndName[1]);
      if (!status.trainName) status.trainName = stripMarkdownFormatting(trainNumAndName[2]);
    }

    const inlineNameNum = statusSectionText.match(
      /Your\s+train\s+\**([^*(\n]+?)\s*\((\d{4,5})\)\**/i
    );
    if (inlineNameNum) {
      if (!status.trainName) status.trainName = stripMarkdownFormatting(inlineNameNum[1]);
      if (!status.trainNumber) status.trainNumber = stripMarkdownFormatting(inlineNameNum[2]);
    }

    // 2. Parse prose patterns from pande2312 agent output
    const delayedByAtMatch = statusSectionText.match(
      /delayed\s+by\s+([0-9]+\s*(?:minutes?|mins?|hours?|hrs?)(?:\s+[0-9]+\s*(?:minutes?|mins?))?)(?:\s+at\s+([^.,\n]+))?/i
    );
    if (delayedByAtMatch) {
      if (!status.delay && delayedByAtMatch[1]) {
        status.delay = stripMarkdownFormatting(delayedByAtMatch[1]);
      }
      if (!status.currentStation && delayedByAtMatch[2]) {
        status.currentStation = stripMarkdownFormatting(delayedByAtMatch[2]);
      }
    }

    const departedFromMatch = statusSectionText.match(
      /(?:departed\s+from|departure\s+from)\s+([A-Za-z0-9\s.()]+?)(?:\s+is\b|\s+and\b|\s+at\b|\.|,|\n)/i
    );
    if (departedFromMatch && !status.currentStation) {
      status.currentStation = stripMarkdownFormatting(departedFromMatch[1]);
    }

    const nextHaltMatch = statusSectionText.match(
      /next\s+scheduled\s+halt\s+is\s+([A-Za-z0-9\s.()]+?)(?:\.|,|\n)/i
    );
    if (nextHaltMatch && !status.nextStation) {
      status.nextStation = stripMarkdownFormatting(nextHaltMatch[1]);
    }

    const proseDelayMatch = statusSectionText.match(
      /with\s+a\s+(\d+[-\s]minute|\d+[-\s]hour[^\n.,]*)\s+delay/i
    );
    if (proseDelayMatch && !status.delay) {
      status.delay = stripMarkdownFormatting(proseDelayMatch[1]);
    }

    const estArrivalInMatch = statusSectionText.match(
      /estimated\s+arrival\s+(?:in|at)\s+([A-Za-z\s.()]+?)\s+at\s+([^\n.,]+)/i
    );
    if (estArrivalInMatch) {
      if (!status.destination) status.destination = stripMarkdownFormatting(estArrivalInMatch[1]);
      if (!status.expectedArrival) status.expectedArrival = stripMarkdownFormatting(estArrivalInMatch[2]);
    }

    const proseDestMatch = statusSectionText.match(
      /(?:final\s+destination,\s*|arrive\s+at\s+)([A-Za-z\s]+?)(?:\s+with\s+a|\.|,|\n)/i
    );
    if (proseDestMatch && !status.destination) {
      status.destination = stripMarkdownFormatting(proseDestMatch[1]);
    }

    if (!status.currentStatus) {
      if (/cancelled/i.test(statusSectionText)) {
        status.currentStatus = 'Cancelled';
      } else if (/diverted/i.test(statusSectionText)) {
        status.currentStatus = 'Diverted';
      } else if (status.delay || /delayed|delay/i.test(statusSectionText)) {
        status.currentStatus = 'Delayed';
      } else if (/currently\s+running/i.test(statusSectionText)) {
        status.currentStatus = 'Running';
      }
    }

    // 3. Parse "Searching for alternatives from Ratlam Jn to New Delhi" or "ALTERNATIVES FROM ... TO ..."
    const routeHeader =
      rawText.match(/ALTERNATIVES\s+FROM\s+([^\n]+?)\s+TO\s+([^\n*]+)/i) ||
      rawText.match(/alternatives\s+from\s+([^\n.]+?)\s+to\s+([^\n.]+)/i);
    if (routeHeader) {
      if (!status.source) status.source = stripMarkdownFormatting(routeHeader[1]);
      if (!status.destination) status.destination = stripMarkdownFormatting(routeHeader[2]);
      if (!status.route && status.source && status.destination) {
        status.route = `${status.source} → ${status.destination}`;
      }
    }

    // 4. Parse structured key: value lines if present
    const linePatterns: Array<{ key: keyof TrainStatusData; regex: RegExp }> = [
      { key: 'trainNumber', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Train(?:\s*Number)?\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'trainName', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Train\s*Name\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'journeyDate', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Journey\s*Date\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'source', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Source\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'destination', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Destination\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'route', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**(?:Route|Route\s*Taken)\s*\**\s*:\s*\**([^\n]+)/i },
      {
        key: 'currentStatus',
        regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**(?:Current\s*)?Status\s*\**\s*:\s*\**([^\n]+)/i,
      },
      {
        key: 'currentStation',
        regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**(?:Current\s*Station|Current\s*Location)\s*\**\s*:\s*\**([^\n]+)/i,
      },
      { key: 'previousStation', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Previous\s*Station\s*\**\s*:\s*\**([^\n]+)/i },
      {
        key: 'nextStation',
        regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**(?:Next\s*Station|Next\s*(?:Scheduled\s*)?Halt)\s*\**\s*:\s*\**([^\n]+)/i,
      },
      { key: 'delay', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Delay\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'scheduledArrival', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Scheduled\s*Arrival\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'expectedArrival', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Expected\s*Arrival\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'travelTime', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Travel\s*Time\s*\**\s*:\s*\**([^\n]+)/i },
      { key: 'platform', regex: /(?:^|\n)\s*(?:[*-]|\d+\.)?\s*\**Platform\s*\**\s*:\s*\**([^\n]+)/i },
    ];

    for (const { key, regex } of linePatterns) {
      if (!status[key]) {
        const match = statusSectionText.match(regex);
        if (match && match[1]) {
          const cleaned = stripMarkdownFormatting(match[1]);
          if (cleaned) {
            status[key] = cleaned;
          }
        }
      }
    }
  }

  return Object.keys(status).length > 0 ? status : undefined;
}

/**
 * Detects which option number (1, 2, or 3) the AI explicitly recommended in its response text.
 */
function detectRecommendedOptionNumber(rawText: string): 1 | 2 | 3 | undefined {
  if (!rawText) return undefined;
  const recSection = rawText.match(/RECOMMENDATION[\s\S]*?(?:Option\s*([123]))/i);
  if (recSection && recSection[1]) {
    return Number(recSection[1]) as 1 | 2 | 3;
  }
  const inlineRec = rawText.match(/recommend\s+\**Option\s*([123])/i);
  if (inlineRec && inlineRec[1]) {
    return Number(inlineRec[1]) as 1 | 2 | 3;
  }
  return undefined;
}

/**
 * Extracts up to 3 recovery alternatives strictly from the n8n backend response.
 * Supports JSON arrays, "Option 1/2/3" blocks, and "🛤️ RECOVERY OPTIONS\n- Train 12449 (...):" blocks.
 * Never creates fake alternatives.
 */
function extractAlternatives(
  rawObj: Record<string, unknown>,
  rawText: string
): RecoveryOption[] | undefined {
  const recommendedNum = detectRecommendedOptionNumber(rawText);

  const rawList =
    (rawObj.alternatives as unknown[]) ||
    (rawObj.options as unknown[]) ||
    (rawObj.recoveryOptions as unknown[]) ||
    (rawObj.recovery_options as unknown[]);

  if (Array.isArray(rawList) && rawList.length > 0) {
    const mapped: RecoveryOption[] = rawList.slice(0, 3).map((item, idx) => {
      const rec = (item && typeof item === 'object' ? item : {}) as Record<string, unknown>;
      const num = (idx + 1 <= 3 ? idx + 1 : 3) as 1 | 2 | 3;
      const isRec =
        rec.isRecommended === true ||
        rec.recommended === true ||
        (recommendedNum ? num === recommendedNum : num === 1);

      return {
        id: cleanString(rec.id) || `option-${num}`,
        optionNumber: num,
        trainName: cleanString(rec.trainName || rec.train_name || rec.name),
        trainNumber: cleanString(rec.trainNumber || rec.train_number || rec.trainNo || rec.number),
        departure: cleanString(rec.departure || rec.departureTime || rec.dep),
        arrival: cleanString(rec.arrival || rec.arrivalTime || rec.arr),
        delay: cleanString(rec.delay || rec.delayStatus),
        travelTime: cleanString(rec.travelTime || rec.travel_time || rec.duration),
        route: cleanString(rec.route || rec.via),
        risk: cleanString(rec.risk),
        source: cleanString(rec.source || rec.from),
        destination: cleanString(rec.destination || rec.to),
        whyThisOption: cleanString(
          rec.whyThisOption ||
            rec.why_this_option ||
            rec.reason ||
            rec.explanation ||
            rec.aiExplanation
        ),
        isRecommended: isRec,
        connectionFeasible:
          typeof rec.connectionFeasible === 'boolean' ? rec.connectionFeasible : undefined,
      };
    });
    return mapped.filter(
      (opt) =>
        opt.trainName ||
        opt.trainNumber ||
        opt.departure ||
        opt.arrival ||
        opt.whyThisOption
    );
  }

  // Pattern A: Parse "🛤️ RECOVERY OPTIONS" bulleted train blocks ("* **Train 12449 Goa Sampark Kranti Express**" or "- Train 12449 (Name):")
  if (rawText && /RECOVERY\s*OPTIONS/i.test(rawText)) {
    const optionsSection =
      rawText.split(/RECOVERY\s*OPTIONS/i)[1]?.split(/⭐\s*RECOMMENDATION|⚠️\s*APPROVAL/i)[0] || '';
    const recBlock = stripMarkdownFormatting(
      rawText.split(/⭐\s*RECOMMENDATION/i)[1]?.split(/⚠️\s*APPROVAL|RECOVERY_APPROVAL/i)[0]
    );

    const trainBlocks = optionsSection
      .split(/(?:^|\n)\s*[*-]\s*\**Train\s+/i)
      .slice(1);

    if (trainBlocks.length > 0) {
      const parsedFromBullets: RecoveryOption[] = [];
      trainBlocks.slice(0, 3).forEach((block, idx) => {
        const num = (idx + 1) as 1 | 2 | 3;
        const firstLine = block.split('\n')[0] || '';
        const parenMatch = firstLine.match(/^(\d{4,5})\s*\(([^)]+)\)/);
        const spaceMatch = firstLine.match(/^(\d{4,5})\s+([^\n*:]+)/);

        const trainNumber = stripMarkdownFormatting(
          parenMatch ? parenMatch[1] : spaceMatch ? spaceMatch[1] : undefined
        );
        const trainName = stripMarkdownFormatting(
          parenMatch ? parenMatch[2] : spaceMatch ? spaceMatch[2] : undefined
        );

        const getField = (pattern: RegExp) => {
          const m = block.match(pattern);
          return m && m[1] ? stripMarkdownFormatting(m[1]) : undefined;
        };

        const departure = getField(/Departure(?:\s+from\s+[^:\n]+)?\s*\**\s*:\s*([^\n]+)/i);
        const arrival = getField(/Arrival(?:\s+(?:at|in)\s+[^:\n]+)?\s*\**\s*:\s*([^\n]+)/i);
        const delay = getField(/Delay\s*\**\s*:\s*([^\n]+)/i);
        const travelTime = getField(/(?:Travel\s*Time|Duration)\s*\**\s*:\s*([^\n]+)/i);
        const route = getField(/Route\s*\**\s*:\s*([^\n]+)/i);
        const isRec = Boolean(
          (recBlock && trainNumber && recBlock.includes(trainNumber)) || idx === 0
        );
        const whyThisOption =
          getField(/(?:Why\s*this\s*option|Reason)\s*\**\s*:\s*([^\n]+)/i) ||
          (isRec && recBlock ? recBlock : undefined);

        if (trainNumber || trainName || departure || arrival) {
          parsedFromBullets.push({
            id: `option-${num}`,
            optionNumber: num,
            trainName,
            trainNumber,
            departure,
            arrival,
            delay,
            travelTime,
            route,
            whyThisOption,
            isRecommended: isRec,
          });
        }
      });

      if (parsedFromBullets.length > 0) {
        return parsedFromBullets;
      }
    }
  }

  // Pattern B: Parse structured Option 1 / Option 2 / Option 3 blocks
  if (rawText && /Option\s*[123]/i.test(rawText)) {
    const parsedOptions: RecoveryOption[] = [];
    const routeHeader = rawText.match(/ALTERNATIVES\s+FROM\s+([^\n]+?)\s+TO\s+([^\n*]+)/i);
    const sharedRoute =
      routeHeader && routeHeader[1] && routeHeader[2]
        ? `${stripMarkdownFormatting(routeHeader[1])} → ${stripMarkdownFormatting(routeHeader[2])}`
        : undefined;

    const optionRegex =
      /\**Option\s*([123])(?:\s*[—\-:]\s*([^\n*]+))?\**([\s\S]*?)(?=\**Option\s*[123]\b|\**RECOMMENDATION\**|\**APPROVAL\**|Which option would you like|$)/gi;

    let match: RegExpExecArray | null;
    while ((match = optionRegex.exec(rawText)) !== null && parsedOptions.length < 3) {
      const num = Number(match[1]) as 1 | 2 | 3;
      const inlineHeaderTitle = stripMarkdownFormatting(match[2]);
      const block = match[3] || '';

      let headerTrainName: string | undefined;
      let headerTrainNumber: string | undefined;

      if (inlineHeaderTitle) {
        const parenMatch = inlineHeaderTitle.match(/^(.+?)\s*\((\d{4,5})\)$/);
        if (parenMatch) {
          headerTrainName = stripMarkdownFormatting(parenMatch[1]);
          headerTrainNumber = stripMarkdownFormatting(parenMatch[2]);
        } else {
          headerTrainName = inlineHeaderTitle;
        }
      }

      const getField = (pattern: RegExp) => {
        const m = block.match(pattern);
        return m && m[1] ? stripMarkdownFormatting(m[1]) : undefined;
      };

      const trainName =
        headerTrainName || getField(/Train\s*Name\s*\**\s*:\s*([^\n]+)/i);
      const trainNumber =
        headerTrainNumber || getField(/Train\s*(?:Number|No\.?)\s*\**\s*:\s*([^\n]+)/i);
      const departure = getField(/Departure(?:\s*\([^)]+\))?\s*\**\s*:\s*([^\n]+)/i);
      const arrival = getField(/Arrival(?:\s*\([^)]+\))?\s*\**\s*:\s*([^\n]+)/i);
      const delay = getField(/Delay\s*\**\s*:\s*([^\n]+)/i);
      const travelTime = getField(/(?:Travel\s*Time|Duration)\s*\**\s*:\s*([^\n]+)/i);
      const route = getField(/Route\s*\**\s*:\s*([^\n]+)/i) || sharedRoute;
      const risk = getField(/Risk\s*\**\s*:\s*([^\n]+)/i);
      const whyThisOption = getField(
        /(?:Why\s*this\s*option|Why\s*it\s*is\s*suitable)\s*\**\s*:\s*([^\n]+)/i
      );

      if (trainName || trainNumber || departure || arrival || whyThisOption) {
        parsedOptions.push({
          id: `option-${num}`,
          optionNumber: num,
          trainName,
          trainNumber,
          departure,
          arrival,
          delay,
          travelTime,
          route,
          risk,
          whyThisOption,
          isRecommended: recommendedNum ? num === recommendedNum : num === 1,
        });
      }
    }

    if (parsedOptions.length > 0) {
      return parsedOptions;
    }
  }

  return undefined;
}

/**
 * Extracts What-If analysis sections and comparison metrics if present in the n8n response.
 */
function extractWhatIf(
  rawObj: Record<string, unknown>,
  rawText: string,
  originalQuery: string,
  isWhatIfMode: boolean,
  extractedStatus?: TrainStatusData,
  extractedAlternatives?: RecoveryOption[]
): WhatIfAnalysis | undefined {
  const whatIfObj = (rawObj.whatIf || rawObj.what_if) as Record<string, unknown> | undefined;
  if (whatIfObj && typeof whatIfObj === 'object') {
    return {
      scenarioQuery: originalQuery,
      currentPlan: cleanString(whatIfObj.currentPlan || whatIfObj.current_plan),
      possibleImpact: cleanString(whatIfObj.possibleImpact || whatIfObj.possible_impact),
      alternativePlan: cleanString(whatIfObj.alternativePlan || whatIfObj.alternative_plan),
      recommendation: cleanString(whatIfObj.recommendation),
      rawText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
  }

  const hasWhatIfHeaders =
    /CURRENT\s*PLAN/i.test(rawText) ||
    /POSSIBLE\s*IMPACT/i.test(rawText) ||
    /ALTERNATIVE\s*PLAN/i.test(rawText);

  if (hasWhatIfHeaders || isWhatIfMode) {
    const extractSection = (header: string, nextHeaders: string[]) => {
      const lookahead = nextHeaders.join('|');
      const regex = new RegExp(
        `${header}\\s*[:\\-\\*]*\\s*([\\s\\S]*?)(?=${lookahead}|$)`,
        'i'
      );
      const m = rawText.match(regex);
      return m && m[1] ? stripMarkdownFormatting(m[1]) : undefined;
    };

    const currentPlan =
      extractSection('CURRENT\\s*PLAN', [
        'POSSIBLE\\s*IMPACT',
        'ESTIMATED\\s*IMPACT',
        'ALTERNATIVE\\s*PLAN',
        'RECOMMENDATION',
      ]) ||
      extractSection('TRIP\\s*DISRUPTION', [
        'RECOVERY\\s*SEARCH',
        'RECOVERY\\s*OPTIONS',
        'RECOMMENDATION',
      ]);

    const possibleImpact =
      extractSection('POSSIBLE\\s*IMPACT', ['ALTERNATIVE\\s*PLAN', 'RECOMMENDATION']) ||
      extractSection('ESTIMATED\\s*IMPACT', ['ALTERNATIVES', 'RECOMMENDATION']);

    const alternativePlan =
      extractSection('ALTERNATIVE\\s*PLAN', ['RECOMMENDATION']) ||
      extractSection('RECOVERY\\s*OPTIONS', ['⭐\\s*RECOMMENDATION', 'RECOMMENDATION', 'APPROVAL']);

    const recommendation = extractSection('RECOMMENDATION', [
      '⚠️\\s*APPROVAL',
      'APPROVAL',
      '___END___',
    ]);

    let currentMetrics: PlanComparisonMetrics | undefined;
    if (extractedStatus) {
      currentMetrics = {
        label: [extractedStatus.trainName, extractedStatus.trainNumber]
          .filter(Boolean)
          .join(' #'),
        departure: extractedStatus.scheduledDeparture,
        arrival: extractedStatus.expectedArrival || extractedStatus.scheduledArrival,
        delay: extractedStatus.delay,
        travelTime: extractedStatus.travelTime,
        route:
          extractedStatus.route ||
          (extractedStatus.source && extractedStatus.destination
            ? `${extractedStatus.source} → ${extractedStatus.destination}`
            : undefined),
        risk: extractedStatus.risk || extractedStatus.currentStatus,
      };
    }

    let alternativeMetrics: PlanComparisonMetrics | undefined;
    const bestAlt =
      extractedAlternatives?.find((a) => a.isRecommended) || extractedAlternatives?.[0];
    if (bestAlt) {
      alternativeMetrics = {
        label: [bestAlt.trainName, bestAlt.trainNumber].filter(Boolean).join(' #'),
        departure: bestAlt.departure,
        arrival: bestAlt.arrival,
        delay: bestAlt.delay,
        travelTime: bestAlt.travelTime,
        route: bestAlt.route,
        risk: bestAlt.risk,
      };
    }

    if (currentPlan || possibleImpact || alternativePlan || recommendation || isWhatIfMode) {
      return {
        scenarioQuery: originalQuery,
        currentPlan,
        possibleImpact,
        alternativePlan,
        recommendation:
          recommendation ||
          (!currentPlan && !possibleImpact ? stripMarkdownFormatting(rawText) : undefined),
        currentMetrics,
        alternativeMetrics,
        rawText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
    }
  }

  return undefined;
}

/**
 * Sends the user's message to the configured n8n Chat Trigger endpoint (VITE_N8N_CHAT_URL).
 * Never generates fake AI responses or fake railway data.
 */
export async function sendMessage(
  message: string,
  options?: SendMessageOptions
): Promise<ParsedTripGuardResponse> {
  const rawEnvUrl = import.meta.env?.VITE_N8N_CHAT_URL;
  const endpointUrl = getConfiguredN8nUrl();

  if (!endpointUrl) {
    console.warn('[TripGuard n8n] DIAGNOSTIC — Missing VITE_N8N_CHAT_URL:', {
      category: 'MISSING_VITE_N8N_CHAT_URL',
      VITE_N8N_CHAT_URL: rawEnvUrl,
      resolvedUrl: endpointUrl,
    });
    throw new TripGuardApiError(
      'TRIPGUARD AI is temporarily unable to reach the recovery service.',
      'BACKEND_UNAVAILABLE'
    );
  }

  let parsedUrl: URL;
  try {
    parsedUrl = new URL(endpointUrl);
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      throw new Error(`Unsupported protocol: ${parsedUrl.protocol}`);
    }
  } catch (urlErr) {
    console.warn('[TripGuard n8n] DIAGNOSTIC — Incorrect URL:', {
      category: 'INCORRECT_URL',
      VITE_N8N_CHAT_URL: rawEnvUrl,
      resolvedUrl: endpointUrl,
      error: urlErr instanceof Error ? urlErr.message : String(urlErr),
    });
    throw new TripGuardApiError(
      'TRIPGUARD AI is temporarily unable to reach the recovery service.',
      'BACKEND_UNAVAILABLE'
    );
  }

  const sessionId = getSessionId();
  const requestPayload = {
    action: 'sendMessage',
    sessionId,
    chatInput: message,
  };

  console.info('[TripGuard n8n] Sending chat request to n8n Chat Trigger:', {
    url: endpointUrl,
    envVarConfigured: Boolean(rawEnvUrl),
    sessionId,
    payload: requestPayload,
  });

  let response: Response;
  try {
    response = await fetch(endpointUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json, text/plain, */*',
      },
      body: JSON.stringify(requestPayload),
    });
  } catch (networkErr) {
    console.warn('[TripGuard n8n] DIAGNOSTIC — Network or CORS error:', {
      category: 'NETWORK_OR_CORS_ERROR',
      url: endpointUrl,
      errorName: networkErr instanceof Error ? networkErr.name : 'UnknownError',
      errorMessage: networkErr instanceof Error ? networkErr.message : String(networkErr),
    });
    throw new TripGuardApiError(
      'TRIPGUARD AI is temporarily unable to reach the recovery service.',
      'NETWORK_ERROR'
    );
  }

  let rawBodyText = '';
  try {
    rawBodyText = await response.text();
  } catch (readErr) {
    console.warn('[TripGuard n8n] DIAGNOSTIC — Failed to read response stream:', {
      category: 'INVALID_RESPONSE',
      url: endpointUrl,
      status: response.status,
      error: readErr instanceof Error ? readErr.message : String(readErr),
    });
    throw new TripGuardApiError(
      'TRIPGUARD AI is temporarily unable to reach the recovery service.',
      'INVALID_RESPONSE'
    );
  }

  if (!response.ok) {
    console.warn('[TripGuard n8n] DIAGNOSTIC — Non-200 response from n8n Chat Trigger:', {
      category: 'NON_200_RESPONSE',
      url: endpointUrl,
      status: response.status,
      statusText: response.statusText,
      responseBody: rawBodyText || '(empty response body)',
    });
    throw new TripGuardApiError(
      'TRIPGUARD AI is temporarily unable to reach the recovery service.',
      'BACKEND_UNAVAILABLE'
    );
  }

  if (!rawBodyText || rawBodyText.trim().length === 0) {
    console.warn('[TripGuard n8n] DIAGNOSTIC — Empty 200 OK response body from n8n:', {
      category: 'EMPTY_RESPONSE',
      url: endpointUrl,
      status: response.status,
    });
    throw new TripGuardApiError(
      'The recovery service returned an empty response. Please try again.',
      'EMPTY_RESPONSE'
    );
  }

  // 1. Check if response is n8n streaming NDJSON chunks ({"type":"begin"}...{"type":"item","content":"..."})
  const streamedReply = parseN8nStreamChunks(rawBodyText);
  if (streamedReply !== null) {
    const trainStatus = extractTrainStatus({}, streamedReply);
    const alternatives = extractAlternatives({}, streamedReply);
    const askedForAlternative = /alternative|another\s+train|options/i.test(message);
    const noAlternativesFound =
      (askedForAlternative && (!alternatives || alternatives.length === 0)) ||
      /no\s+(?:different\s+)?alternative/i.test(streamedReply);

    return {
      replyText: streamedReply,
      trainStatus,
      alternatives,
      noAlternativesFound,
      recommendedOptionNumber: detectRecommendedOptionNumber(streamedReply),
      whatIf: extractWhatIf(
        {},
        streamedReply,
        message,
        options?.mode === 'whatif',
        trainStatus,
        alternatives
      ),
    };
  }

  // 2. Standard single JSON object or plain text response
  let parsedJson: unknown = null;
  try {
    parsedJson = JSON.parse(rawBodyText);
  } catch {
    const plainText = rawBodyText.replace(/\n*RECOVERY_APPROVAL_REQUIRED\s*$/i, '').trim();
    const trainStatus = extractTrainStatus({}, plainText);
    const alternatives = extractAlternatives({}, plainText);
    const askedForAlternative = /alternative|another\s+train|options/i.test(message);
    const noAlternativesFound =
      (askedForAlternative && (!alternatives || alternatives.length === 0)) ||
      /no\s+(?:different\s+)?alternative/i.test(plainText);

    return {
      replyText: plainText,
      trainStatus,
      alternatives,
      noAlternativesFound,
      recommendedOptionNumber: detectRecommendedOptionNumber(plainText),
      whatIf: extractWhatIf(
        {},
        plainText,
        message,
        options?.mode === 'whatif',
        trainStatus,
        alternatives
      ),
    };
  }

  const payloadObj: Record<string, unknown> =
    Array.isArray(parsedJson) && parsedJson.length > 0 && typeof parsedJson[0] === 'object'
      ? (parsedJson[0] as Record<string, unknown>)
      : parsedJson && typeof parsedJson === 'object'
      ? (parsedJson as Record<string, unknown>)
      : {};

  if (
    payloadObj.error ||
    payloadObj.toolError ||
    payloadObj.message === 'Error in workflow'
  ) {
    throw new TripGuardApiError(
      'TRIPGUARD AI is temporarily unable to reach the recovery service.',
      'TOOL_FAILURE'
    );
  }

  const rawReplyText =
    cleanString(payloadObj.output) ||
    cleanString(payloadObj.text) ||
    cleanString(payloadObj.message) ||
    cleanString(payloadObj.response) ||
    cleanString(payloadObj.reply) ||
    '';

  const replyText = rawReplyText.replace(/\n*RECOVERY_APPROVAL_REQUIRED\s*$/i, '').trim();

  const trainStatus = extractTrainStatus(payloadObj, replyText);
  const alternatives = extractAlternatives(payloadObj, replyText);
  const whatIf = extractWhatIf(
    payloadObj,
    replyText,
    message,
    options?.mode === 'whatif',
    trainStatus,
    alternatives
  );

  if (!replyText && !trainStatus && (!alternatives || alternatives.length === 0) && !whatIf) {
    throw new TripGuardApiError(
      'TRIPGUARD AI is temporarily unable to reach the recovery service.',
      'INVALID_RESPONSE'
    );
  }

  const askedForAlternative = /alternative|another\s+train|options/i.test(message);
  const noAlternativesFound =
    (askedForAlternative &&
      (!alternatives || alternatives.length === 0) &&
      /no\s+(?:different\s+)?alternative|could\s+not\s+find\s+any\s+alternative/i.test(
        replyText
      )) ||
    payloadObj.noAlternatives === true;

  return {
    replyText:
      replyText ||
      (trainStatus ? 'Live train status received from the recovery service.' : 'Response received.'),
    trainStatus,
    alternatives,
    noAlternativesFound,
    recommendedOptionNumber: detectRecommendedOptionNumber(replyText),
    whatIf,
    confirmedBooking: payloadObj.confirmedBooking === true,
    bookingReference: cleanString(payloadObj.bookingReference),
  };
}
