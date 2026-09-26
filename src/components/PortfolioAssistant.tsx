import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUp, Bot, Loader2, X } from 'lucide-react';
import { PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH } from '../data/portfolioAssistantContract';
import { askPortfolioAssistant } from '../lib/portfolioAssistantClient';
import { useLanguage } from '../context/LanguageContext';
import './PortfolioAssistant.css';

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  isError?: boolean;
};

const STORAGE_KEY = 'portfolio-assistant-conversation:v1';
const MAX_CACHED_MESSAGES = 32;
const MAX_CACHED_MESSAGE_LENGTH = 3000;

const suggestedQuestions = {
  en: [
    'What does Nam specialize in?',
    'Tell me about Nam’s AI experience',
    'What projects has Nam built?',
    'What is Nam researching?',
    'What technologies does Nam use?',
  ],
  vi: [
    'Nam chuyên về lĩnh vực nào?',
    'Kể về kinh nghiệm AI của Nam',
    'Nam đã xây dựng những dự án nào?',
    'Nam đang nghiên cứu điều gì?',
    'Nam sử dụng những công nghệ nào?',
  ],
} as const;

function readCachedMessages(): ChatMessage[] {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const decoded: unknown = JSON.parse(stored);
    if (!Array.isArray(decoded)) return [];
    return decoded
      .filter((message): message is ChatMessage => typeof message === 'object' && message !== null
        && ((message as ChatMessage).role === 'assistant' || (message as ChatMessage).role === 'user')
        && typeof (message as ChatMessage).text === 'string')
      .slice(-MAX_CACHED_MESSAGES)
      .map((message, index) => ({
        id: Number.isSafeInteger(message.id) ? message.id : index,
        role: message.role,
        text: message.text.slice(0, MAX_CACHED_MESSAGE_LENGTH),
        ...(message.isError ? { isError: true } : {}),
      }));
  } catch {
    return [];
  }
}

export function PortfolioAssistant({ initiallyOpen = false }: { initiallyOpen?: boolean }) {
  const { language } = useLanguage();
  const isVietnamese = language === 'vi';
  const [isOpen, setIsOpen] = useState(initiallyOpen);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(readCachedMessages);
  const [isLoading, setIsLoading] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestInFlight = useRef(false);
  const wasOpen = useRef(false);
  const restoreFocusOnClose = useRef(false);
  const nextMessageId = useRef(messages.reduce((maxId, message) => Math.max(maxId, message.id), -1) + 1);

  useEffect(() => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-MAX_CACHED_MESSAGES)));
    } catch {
      // Keep the current conversation usable when browser storage is unavailable.
    }
  }, [messages]);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current && restoreFocusOnClose.current) launcherRef.current?.focus();
      wasOpen.current = false;
      restoreFocusOnClose.current = false;
      return;
    }

    wasOpen.current = true;
    inputRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        restoreFocusOnClose.current = true;
        setIsOpen(false);
      }
    };
    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (rootRef.current && !rootRef.current.contains(event.target as Node)) setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    document.addEventListener('pointerdown', closeOnOutsidePointer);
    return () => {
      window.removeEventListener('keydown', closeOnEscape);
      document.removeEventListener('pointerdown', closeOnOutsidePointer);
    };
  }, [isOpen]);

  useEffect(() => {
    const behavior = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth';
    messagesEndRef.current?.scrollIntoView?.({ block: 'end', behavior });
  }, [messages, isLoading, isOpen]);

  const closeAssistant = () => {
    restoreFocusOnClose.current = true;
    setIsOpen(false);
  };

  const sendQuestion = async (question: string) => {
    const message = question.trim();
    if (!message || message.length > PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH || requestInFlight.current) return;

    requestInFlight.current = true;
    setIsLoading(true);
    setDraft('');
    const userMessage: ChatMessage = { id: nextMessageId.current++, role: 'user', text: message };
    setMessages(previous => [...previous, userMessage].slice(-MAX_CACHED_MESSAGES));

    try {
      const answer = await askPortfolioAssistant(message);
      const assistantMessage: ChatMessage = { id: nextMessageId.current++, role: 'assistant', text: answer };
      setMessages(previous => [...previous, assistantMessage].slice(-MAX_CACHED_MESSAGES));
    } catch {
      const errorMessage: ChatMessage = {
        id: nextMessageId.current++,
        role: 'assistant',
        text: isVietnamese ? 'Hiện chưa thể kết nối với trợ lý. Vui lòng thử lại sau.' : "I couldn't reach the assistant right now. Please try again in a moment.",
        isError: true,
      };
      setMessages(previous => [...previous, errorMessage].slice(-MAX_CACHED_MESSAGES));
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendQuestion(draft);
  };

  return (
    <div className="portfolio-assistant" ref={rootRef}>
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          className="portfolio-assistant-launcher"
          aria-label={isVietnamese ? 'Hỏi AI về Nam' : 'Ask AI about Nam'}
          aria-expanded={isOpen}
          aria-controls="portfolio-assistant-panel"
          onClick={() => setIsOpen(true)}
        >
          <Bot size={15} aria-hidden="true" />
          <span>{isVietnamese ? 'Hỏi AI về Nam' : 'Ask AI about Nam'}</span>
          <ArrowUp size={13} aria-hidden="true" />
        </button>
      )}

      {isOpen && (
        <section
          id="portfolio-assistant-panel"
          className="portfolio-assistant-panel"
          role="dialog"
          aria-modal="false"
          aria-labelledby="portfolio-assistant-title"
        >
          <header className="portfolio-assistant-header">
            <span className="portfolio-assistant-avatar"><Bot size={18} aria-hidden="true" /></span>
            <div className="portfolio-assistant-heading">
              <span className="portfolio-assistant-eyebrow">PORTFOLIO AI</span>
              <h2 id="portfolio-assistant-title">{isVietnamese ? 'Trợ lý portfolio của Nam' : "Nam's portfolio assistant"}</h2>
            </div>
            <button type="button" className="portfolio-assistant-close" aria-label={isVietnamese ? 'Thu nhỏ trò chuyện' : 'Minimize chat'} onClick={closeAssistant}>
              <X size={17} aria-hidden="true" />
            </button>
          </header>

          <div className="portfolio-assistant-status"><span aria-hidden="true" />{isVietnamese ? 'TRỢ LÝ ĐANG SẴN SÀNG' : 'LIVE REASONING'}</div>
          <p className="portfolio-assistant-greeting">{isVietnamese ? 'Xin chào! Tôi là trợ lý portfolio của Nam. Hãy hỏi về kinh nghiệm, dự án, kỹ năng hoặc nghiên cứu của Nam.' : 'Hi! I’m Nam’s portfolio assistant. Ask about his experience, projects, skills, or research.'}</p>

          {messages.length === 0 && (
            <div className="portfolio-assistant-suggestions" aria-label={isVietnamese ? 'Câu hỏi gợi ý' : 'Suggested questions'}>
              {suggestedQuestions[language].map(question => (
                <button key={question} type="button" onClick={() => void sendQuestion(question)}>{question}</button>
              ))}
            </div>
          )}

          <div className="portfolio-assistant-messages" role="log" aria-live="polite" aria-relevant="additions text" aria-label={isVietnamese ? 'Hội thoại' : 'Conversation'}>
            {messages.map(message => (
              <div className={`portfolio-assistant-message portfolio-assistant-message-${message.role}`} key={message.id}>
                <p className={message.isError ? 'portfolio-assistant-error' : undefined}>{message.text}</p>
              </div>
            ))}
            {isLoading && <p className="portfolio-assistant-loading" role="status"><Loader2 size={14} aria-hidden="true" /> {isVietnamese ? 'Đang suy nghĩ…' : 'Thinking…'}</p>}
            <div ref={messagesEndRef} />
          </div>

          <form className="portfolio-assistant-form" onSubmit={handleSubmit}>
            <label className="portfolio-assistant-input-wrap">
              <span className="sr-only">{isVietnamese ? 'Tin nhắn của bạn' : 'Your message'}</span>
              <textarea
                ref={inputRef}
                aria-label={isVietnamese ? 'Tin nhắn của bạn' : 'Your message'}
                placeholder={isVietnamese ? 'Hỏi về công việc của Nam…' : 'Ask about Nam’s work…'}
                rows={1}
                maxLength={PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH}
                value={draft}
                onChange={event => setDraft(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing && event.keyCode !== 229) {
                    event.preventDefault();
                    void sendQuestion(draft);
                  }
                }}
              />
            </label>
            <button
              type="submit"
              className="portfolio-assistant-send"
              aria-label={isVietnamese ? 'Gửi câu hỏi' : 'Send question'}
              disabled={isLoading || !draft.trim()}
            >
              <ArrowUp size={16} aria-hidden="true" />
            </button>
          </form>
          <p className="portfolio-assistant-note">{isVietnamese ? 'Hội thoại được lưu trên thiết bị này · Câu trả lời dựa trên portfolio công khai' : 'Conversation saved on this device · Replies use public portfolio information'}</p>
        </section>
      )}
    </div>
  );
}
