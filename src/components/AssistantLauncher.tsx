import { useRef, useState, type ComponentType } from 'react';
import { ArrowUp, Bot } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import './PortfolioAssistant.css';

// Keep the chat client and saved conversation off the initial rendering path.
export function AssistantLauncher() {
  const { language } = useLanguage();
  const [Assistant, setAssistant] = useState<ComponentType<{ initiallyOpen: boolean }> | null>(null);
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);
  const pending = useRef(false);
  const isVietnamese = language === 'vi';
  const open = async () => {
    if (pending.current) return;
    pending.current = true;
    setLoading(true);
    setFailed(false);
    try {
      const module = await import('./PortfolioAssistant');
      setAssistant(() => module.PortfolioAssistant);
    } catch {
      setFailed(true);
    } finally {
      pending.current = false;
      setLoading(false);
    }
  };

  if (Assistant) return <Assistant initiallyOpen />;
  return (
    <div className="portfolio-assistant">
      <button type="button" className="portfolio-assistant-launcher" aria-expanded="false"
        aria-busy={loading} disabled={loading} onClick={() => void open()}>
        <Bot size={15} aria-hidden="true" />
        <span>{isVietnamese ? 'Hỏi AI về Nam' : 'Ask AI about Nam'}</span>
        <ArrowUp size={13} aria-hidden="true" />
      </button>
      {failed && <p className="portfolio-assistant-loading" role="status">{isVietnamese ? 'Chưa thể tải. Vui lòng thử lại.' : 'Unable to load. Please try again.'}</p>}
    </div>
  );
}
