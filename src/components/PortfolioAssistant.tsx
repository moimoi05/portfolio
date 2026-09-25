import { useEffect, useRef, useState, type FormEvent } from 'react';
import { ArrowUpRight, Bot, Loader2, Send, Sparkles, X } from 'lucide-react';
import { PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH } from '../data/portfolioAssistantContract';
import { askPortfolioAssistant } from '../lib/portfolioAssistantClient';
import './PortfolioAssistant.css';

type ChatMessage = {
  id: number;
  role: 'assistant' | 'user';
  text: string;
  isError?: boolean;
};

const suggestedQuestions = [
  'What does Nam specialize in?',
  'Tell me about Nam’s AI experience',
  'What projects has Nam built?',
  'What is Nam researching?',
];

export function PortfolioAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const launcherRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const requestInFlight = useRef(false);
  const wasOpen = useRef(false);
  const nextMessageId = useRef(0);

  useEffect(() => {
    if (!isOpen) {
      if (wasOpen.current) launcherRef.current?.focus();
      return;
    }
    wasOpen.current = true;
    inputRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView?.({ block: 'end', behavior: 'smooth' });
  }, [messages, isLoading]);

  const sendQuestion = async (question: string) => {
    const message = question.trim();
    if (!message || message.length > PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH || requestInFlight.current) return;

    requestInFlight.current = true;
    setIsLoading(true);
    setDraft('');
    setMessages(previous => [...previous, { id: nextMessageId.current++, role: 'user', text: message }]);

    try {
      const answer = await askPortfolioAssistant(message);
      setMessages(previous => [...previous, { id: nextMessageId.current++, role: 'assistant', text: answer }]);
    } catch {
      setMessages(previous => [...previous, {
        id: nextMessageId.current++,
        role: 'assistant',
        text: "I couldn't reach the assistant right now. Please try again in a moment.",
        isError: true,
      }]);
    } finally {
      requestInFlight.current = false;
      setIsLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void sendQuestion(draft);
  };

  return (
    <div className="portfolio-assistant">
      {!isOpen && (
        <button
          ref={launcherRef}
          type="button"
          className="portfolio-assistant-launcher"
          aria-label="Ask AI about Nam"
          aria-expanded={isOpen}
          aria-controls="portfolio-assistant-panel"
          onClick={() => setIsOpen(true)}
        >
          <span className="portfolio-assistant-launcher-icon"><Sparkles size={18} aria-hidden="true" /></span>
          <span>Ask AI about Nam</span>
          <ArrowUpRight className="portfolio-assistant-launcher-arrow" size={17} aria-hidden="true" />
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
            <span className="portfolio-assistant-avatar"><Bot size={21} aria-hidden="true" /></span>
            <div className="portfolio-assistant-heading">
              <span className="portfolio-assistant-eyebrow">PORTFOLIO AI</span>
              <h2 id="portfolio-assistant-title">Nam&apos;s portfolio assistant</h2>
            </div>
            <button type="button" className="portfolio-assistant-close" aria-label="Close assistant" onClick={() => setIsOpen(false)}>
              <X size={19} aria-hidden="true" />
            </button>
          </header>

          <p className="portfolio-assistant-greeting">Hi! I&apos;m Nam&apos;s portfolio assistant. Ask me about his experience, projects, skills, or research.</p>

          {messages.length === 0 && (
            <div className="portfolio-assistant-suggestions" aria-label="Suggested questions">
              {suggestedQuestions.map(question => (
                <button key={question} type="button" onClick={() => void sendQuestion(question)}>{question}</button>
              ))}
            </div>
          )}

          <div className="portfolio-assistant-messages" role="log" aria-live="polite" aria-relevant="additions text" aria-label="Conversation">
            {messages.map(message => (
              <div className={`portfolio-assistant-message portfolio-assistant-message-${message.role}`} key={message.id}>
                <p className={message.isError ? 'portfolio-assistant-error' : undefined}>{message.text}</p>
              </div>
            ))}
            {isLoading && <p className="portfolio-assistant-loading" role="status"><Loader2 size={15} aria-hidden="true" /> Thinking…</p>}
            <div ref={messagesEndRef} />
          </div>

          <form className="portfolio-assistant-form" onSubmit={handleSubmit}>
            <label className="portfolio-assistant-input-wrap">
              <span className="sr-only">Your message</span>
              <textarea
                ref={inputRef}
                aria-label="Your message"
                placeholder="Ask about Nam’s work…"
                rows={1}
                maxLength={PORTFOLIO_ASSISTANT_MAX_MESSAGE_LENGTH}
                value={draft}
                onChange={event => setDraft(event.target.value)}
                onKeyDown={event => {
                  if (event.key === 'Enter' && !event.shiftKey) {
                    event.preventDefault();
                    void sendQuestion(draft);
                  }
                }}
              />
            </label>
            <button
              type="submit"
              className="portfolio-assistant-send"
              aria-label="Send question"
              disabled={isLoading || !draft.trim()}
            >
              <Send size={17} aria-hidden="true" />
            </button>
          </form>
          <p className="portfolio-assistant-note">Replies use information published on this portfolio.</p>
        </section>
      )}
    </div>
  );
}
