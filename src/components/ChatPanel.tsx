import React, { useState, useRef, useEffect } from 'react';
import {
  AlertCircle,
  Bot,
  Send,
  Settings2,
  Trash2,
  User,
  CheckCircle2,
  Link2,
  Copy,
  Check,
} from 'lucide-react';
import { ChatMessage, RecoveryOption } from '../types/tripguard';
import { UITranslations } from '../i18n/translations';
import {
  getConfiguredN8nUrl,
  setRuntimeN8nUrlOverride,
} from '../services/tripguardApi';

interface ChatPanelProps {
  messages: ChatMessage[];
  isLoading: boolean;
  onSendMessage: (messageText: string) => void;
  onClearConversation: () => void;
  alternatives: RecoveryOption[];
  selectedOption?: RecoveryOption;
  onSelectOption: (option: RecoveryOption) => void;
  t: UITranslations;
}

export const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isLoading,
  onSendMessage,
  onClearConversation,
  alternatives,
  selectedOption,
  onSelectOption,
  t,
}) => {
  const [inputValue, setInputValue] = useState('');
  const [showUrlConfig, setShowUrlConfig] = useState(false);
  const [customUrlInput, setCustomUrlInput] = useState(() => getConfiguredN8nUrl());
  const [copiedUrl, setCopiedUrl] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [messages, isLoading]);

  const handleSend = () => {
    const trimmed = inputValue.trim();
    if (!trimmed || isLoading) return;
    setInputValue('');
    onSendMessage(trimmed);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSaveEndpointUrl = (e: React.FormEvent) => {
    e.preventDefault();
    setRuntimeN8nUrlOverride(customUrlInput);
    setShowUrlConfig(false);
  };

  const handleCopyEndpointUrl = async () => {
    const linkToCopy =
      customUrlInput.trim() ||
      getConfiguredN8nUrl() ||
      'https://pande2312.app.n8n.cloud/webhook/97a3a629-3d00-4248-afdd-dd80451a2554/chat';
    try {
      await navigator.clipboard.writeText(linkToCopy);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch {
      // Clipboard fallback not needed
    }
  };

  const activeEndpoint = getConfiguredN8nUrl();

  return (
    <div className="glass-panel rounded-2xl flex flex-col h-[700px] lg:h-[760px] overflow-hidden shadow-2xl">
      {/* Chat Header */}
      <div className="px-5 py-4 border-b border-slate-800/80 bg-slate-950/60 flex items-center justify-between gap-3 shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-xl bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center shrink-0">
            <Bot className="w-5 h-5 text-cyan-300" aria-hidden="true" />
          </div>
          <div className="min-w-0">
            <h2 className="text-sm sm:text-base font-semibold text-white truncate">
              {t.chat.panelTitle}
            </h2>
            <p className="text-xs text-slate-400 truncate flex items-center gap-1.5">
              <span
                className={`w-2 h-2 rounded-full ${
                  activeEndpoint ? 'bg-emerald-400' : 'bg-amber-400'
                }`}
              />
              <span>
                {activeEndpoint
                  ? t.chat.panelSubtitle
                  : 'VITE_N8N_CHAT_URL awaiting endpoint configuration'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopyEndpointUrl}
            aria-label="Copy n8n Chat Trigger URL"
            title={activeEndpoint}
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            {copiedUrl ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                <span className="hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                <span className="hidden sm:inline">Copy URL</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setCustomUrlInput(getConfiguredN8nUrl());
              setShowUrlConfig((prev) => !prev);
            }}
            aria-label="Configure n8n Chat Trigger URL"
            title="Configure n8n Chat Trigger URL"
            className="px-2.5 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Settings2 className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
            <span className="hidden sm:inline">n8n URL</span>
          </button>

          <button
            type="button"
            onClick={onClearConversation}
            aria-label={t.chat.clearButton}
            className="px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 rounded-lg inline-flex items-center gap-1.5 transition-colors cursor-pointer whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
          >
            <Trash2 className="w-3.5 h-3.5 text-slate-400" aria-hidden="true" />
            <span>{t.chat.clearButton}</span>
          </button>
        </div>
      </div>

      {/* Collapsible n8n Webhook URL Inspector / Override Bar */}
      {showUrlConfig && (
        <form
          onSubmit={handleSaveEndpointUrl}
          className="px-5 py-3.5 bg-slate-900/95 border-b border-cyan-500/30 space-y-2 shrink-0"
        >
          <div className="flex items-center justify-between text-xs">
            <label
              htmlFor="n8n-webhook-url-input"
              className="font-mono font-semibold text-cyan-300 flex items-center gap-1.5"
            >
              <Link2 className="w-3.5 h-3.5" aria-hidden="true" />
              <span>VITE_N8N_CHAT_URL Endpoint</span>
            </label>
            <span className="text-slate-400">No API keys or secrets stored</span>
          </div>
          <div className="flex gap-2">
            <input
              id="n8n-webhook-url-input"
              type="url"
              value={customUrlInput}
              onChange={(e) => setCustomUrlInput(e.target.value)}
              placeholder="https://pande2312.app.n8n.cloud/webhook/97a3a629-3d00-4248-afdd-dd80451a2554/chat"
              className="flex-1 px-3 py-1.5 text-xs font-mono bg-slate-950 text-white border border-slate-700 rounded-lg focus:outline-none focus:border-cyan-400"
            />
            <button
              type="button"
              onClick={handleCopyEndpointUrl}
              className="px-3 py-1.5 text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-lg inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
            >
              {copiedUrl ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-400" aria-hidden="true" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-cyan-400" aria-hidden="true" />
                  <span>Copy Link</span>
                </>
              )}
            </button>
            <button
              type="submit"
              className="px-3.5 py-1.5 text-xs font-semibold bg-cyan-500 hover:bg-cyan-400 text-slate-950 rounded-lg cursor-pointer whitespace-nowrap"
            >
              Save URL
            </button>
          </div>
        </form>
      )}

      {/* Messages Viewport */}
      <div
        role="log"
        aria-live="polite"
        className="flex-1 overflow-y-auto p-5 space-y-4 scroll-smooth"
      >
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';

          if (isUser) {
            return (
              <div key={msg.id} className="flex justify-end">
                <div className="max-w-[85%] sm:max-w-[78%] flex items-start gap-2.5">
                  <div className="rounded-2xl rounded-tr-sm px-4 py-3 bg-gradient-to-r from-sky-600 to-cyan-600 text-white shadow-md">
                    <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>
                    <span className="block text-[10px] font-mono text-cyan-100/80 text-right mt-1.5 tabular-nums">
                      {msg.timestamp}
                    </span>
                  </div>
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 border border-sky-400/40 flex items-center justify-center shrink-0 mt-0.5">
                    <User className="w-4 h-4 text-sky-300" aria-hidden="true" />
                  </div>
                </div>
              </div>
            );
          }

          return (
            <div key={msg.id} className="flex justify-start">
              <div className="max-w-[90%] sm:max-w-[84%] flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 border ${
                    msg.isError
                      ? 'bg-red-500/15 border-red-500/40 text-red-300'
                      : 'bg-cyan-500/15 border-cyan-500/40 text-cyan-300'
                  }`}
                >
                  {msg.isError ? (
                    <AlertCircle className="w-4 h-4" aria-hidden="true" />
                  ) : (
                    <Bot className="w-4 h-4" aria-hidden="true" />
                  )}
                </div>

                <div
                  className={`rounded-2xl rounded-tl-sm px-4 py-3.5 space-y-2.5 ${
                    msg.isError
                      ? 'bg-red-950/35 border border-red-500/40 text-red-100'
                      : 'glass-card text-slate-100'
                  }`}
                >
                  {/* Safety Data Separation Header when structured data or AI reasoning is returned */}
                  {!msg.isError && (msg.trainStatus || msg.alternatives) && (
                    <div className="flex flex-wrap items-center gap-2 pb-1.5 border-b border-slate-800/80 text-[10px] font-mono">
                      {msg.trainStatus && (
                        <span className="text-emerald-300">
                          {t.safetyBadges.confirmedLiveData}
                        </span>
                      )}
                      {msg.trainStatus && msg.alternatives && (
                        <span aria-hidden="true" className="text-slate-600">
                          ·
                        </span>
                      )}
                      {msg.alternatives && msg.alternatives.length > 0 && (
                        <span className="text-cyan-300">
                          {t.safetyBadges.aiRecommendation}
                        </span>
                      )}
                    </div>
                  )}

                  <p className="text-sm whitespace-pre-wrap leading-relaxed">{msg.text}</p>

                  {/* If alternatives were returned in this message, show inline approval prompt & buttons */}
                  {msg.alternatives && msg.alternatives.length > 0 && (
                    <div className="pt-2 border-t border-slate-800/80 space-y-2">
                      <p className="text-xs font-semibold text-cyan-300">
                        {t.chat.approvalPrompt}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {msg.alternatives.slice(0, 3).map((alt) => {
                          const isChosen =
                            selectedOption?.optionNumber === alt.optionNumber;
                          return (
                            <button
                              key={alt.id}
                              type="button"
                              onClick={() => onSelectOption(alt)}
                              className={`px-3 py-1.5 rounded-lg font-mono text-xs font-semibold transition-all cursor-pointer inline-flex items-center gap-1.5 ${
                                isChosen
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                                  : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-200 border border-cyan-500/40'
                              }`}
                            >
                              {isChosen && (
                                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              )}
                              <span>
                                {t.recoveryOptions.selectOption} {alt.optionNumber}
                                {alt.trainNumber ? ` (#${alt.trainNumber})` : ''}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  <span className="block text-[10px] font-mono text-slate-400 tabular-nums">
                    TripGuard AI · {msg.timestamp}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {/* Typing / Loading Animation while waiting for n8n */}
        {isLoading && (
          <div className="flex justify-start" aria-live="assertive">
            <div className="flex items-start gap-3 max-w-[85%]">
              <div className="w-8 h-8 rounded-lg bg-cyan-500/15 border border-cyan-500/40 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4 text-cyan-300 animate-pulse" aria-hidden="true" />
              </div>
              <div className="glass-card rounded-2xl rounded-tl-sm px-4 py-3 space-y-2">
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" />
                  <span
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: '150ms' }}
                  />
                  <span
                    className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"
                    style={{ animationDelay: '300ms' }}
                  />
                </div>
                <p className="text-xs text-slate-300">{t.chat.waitingForAgent}</p>
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Quick Prompt Suggestions */}
      <div className="px-5 py-2.5 bg-slate-950/50 border-t border-slate-800/80 shrink-0">
        <p className="text-[11px] font-medium text-slate-400 mb-2">
          {t.chat.quickPromptsTitle}
        </p>
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {t.chat.quickPrompts.map((promptText) => (
            <button
              key={promptText}
              type="button"
              disabled={isLoading}
              onClick={() => onSendMessage(promptText)}
              className="px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-slate-800 text-xs text-slate-200 hover:text-cyan-300 border border-slate-700/80 hover:border-cyan-500/40 transition-colors whitespace-nowrap shrink-0 cursor-pointer disabled:opacity-50"
            >
              {promptText}
            </button>
          ))}
        </div>
      </div>

      {/* Chat Input Form */}
      <div className="p-4 bg-slate-950/80 border-t border-slate-800/80 shrink-0">
        <div className="flex items-end gap-2.5">
          <div className="flex-1">
            <label htmlFor="tripguard-chat-input" className="sr-only">
              Message TripGuard AI
            </label>
            <textarea
              id="tripguard-chat-input"
              rows={2}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={t.chat.inputPlaceholder}
              disabled={isLoading}
              className="w-full px-3.5 py-2.5 text-sm bg-slate-900/90 text-white placeholder-slate-400 border border-slate-700/80 rounded-xl focus:outline-none focus:border-cyan-400 resize-none disabled:opacity-60"
            />
          </div>

          <button
            type="button"
            onClick={handleSend}
            disabled={isLoading || !inputValue.trim()}
            aria-label={t.chat.sendButton}
            className="px-5 py-3 rounded-xl font-semibold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 to-sky-400 hover:from-cyan-300 hover:to-sky-300 disabled:opacity-40 transition-all inline-flex items-center gap-2 cursor-pointer shrink-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
          >
            <span>{t.chat.sendButton}</span>
            <Send className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
        <p className="text-[11px] text-slate-400 mt-1.5">{t.chat.enterHint}</p>
      </div>
    </div>
  );
};
