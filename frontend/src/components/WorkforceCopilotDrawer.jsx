import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  X, 
  Send, 
  Sparkles, 
  ArrowRight, 
  TrendingUp, 
  CheckCircle2, 
  Lightbulb, 
  Loader2,
  RefreshCw
} from 'lucide-react';
import { chatWithCopilot } from '../services/api';

const QUICK_PROMPTS = [
  "Can we avoid hiring?",
  "What happens if we win 3 new projects next month?",
  "Which teams are overloaded?",
  "Which employees can be redistributed?",
  "Which skills are currently missing?",
  "When should we start hiring?",
  "Can we solve the Python shortage through reskilling?"
];

export default function WorkforceCopilotDrawer({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: "👋 **Hello! I'm your Workforce Copilot.**\n\nI continuously monitor employee workloads, project requirements, planned leaves, and skill gaps to help you optimize staffing.\n\nAsk me about upcoming project capacity, hiring timelines, or whether to **Hire, Reskill, or Redistribute**.",
      metrics: {
        total_employees: 120,
        current_utilization: '81.8%',
        critical_skill_gaps: 4
      },
      actions: ["Explore 'Win 3 New Projects' Scenario", "Check Overloaded Teams", "Review Reskilling Paths"]
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const text = textToSend || inputValue;
    if (!text.trim() || loading) return;

    const userMsg = { sender: 'user', text };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setLoading(true);

    try {
      const res = await chatWithCopilot(text);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: res.answer,
          metrics: res.key_metrics,
          actions: res.suggested_actions,
          followUps: res.follow_up_questions
        }
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: "⚠️ Sorry, I encountered an issue retrieving real-time metrics. Please verify that the backend engine is running on port 8000.",
          error: true
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderMarkdown = (content) => {
    // Simple markdown renderer for bold, bullet points, headers
    const lines = content.split('\n');
    return lines.map((line, idx) => {
      // Bold rendering
      let processed = line;
      // Headings
      if (line.startsWith('**') && line.endsWith('**') && !line.includes(':')) {
        return <h4 key={idx} className="font-semibold text-slate-900 mt-2 mb-1">{line.replace(/\*\*/g, '')}</h4>;
      }
      if (line.startsWith('- ')) {
        const bulletContent = line.substring(2);
        return (
          <li key={idx} className="ml-4 list-disc text-xs text-slate-700 my-0.5 leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(bulletContent) }} />
          </li>
        );
      }
      if (line.startsWith('1. ') || line.startsWith('2. ') || line.startsWith('3. ') || line.startsWith('4. ')) {
        return (
          <div key={idx} className="ml-2 text-xs text-slate-700 my-1 font-medium leading-relaxed">
            <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
          </div>
        );
      }
      if (!line.trim()) {
        return <div key={idx} className="h-1.5" />;
      }
      return (
        <p key={idx} className="text-xs text-slate-700 leading-relaxed mb-1">
          <span dangerouslySetInnerHTML={{ __html: formatInline(line) }} />
        </p>
      );
    });
  };

  const formatInline = (text) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
      .replace(/`([^`]+)`/g, '<code class="px-1 py-0.5 bg-slate-100 text-brand-700 rounded text-[11px] font-mono">$1</code>');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-[480px] bg-white shadow-2xl border-l border-slate-200 flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="px-5 py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-brand-950 text-white flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600/30 border border-brand-400/40 flex items-center justify-center">
            <Bot className="w-5 h-5 text-brand-300" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="font-bold text-sm tracking-tight text-white">Workforce Copilot</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </div>
            <p className="text-[11px] text-slate-300">Contextual AI • Real-time Workforce Engine</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Quick Prompt Pills Bar */}
      <div className="px-4 py-2 bg-slate-100 border-b border-slate-200 overflow-x-auto whitespace-nowrap scrollbar-none">
        <div className="flex space-x-1.5 text-xs">
          {QUICK_PROMPTS.slice(0, 4).map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSendMessage(prompt)}
              className="px-2.5 py-1 bg-white hover:bg-brand-50 hover:text-brand-700 text-slate-600 border border-slate-200 rounded-full text-[11px] font-medium transition-colors shadow-2xs flex-shrink-0"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Conversation Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50">
        {messages.map((msg, index) => (
          <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div
              className={`max-w-[92%] rounded-xl p-3.5 shadow-xs ${
                msg.sender === 'user'
                  ? 'bg-brand-600 text-white rounded-br-none'
                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none'
              }`}
            >
              {msg.sender === 'user' ? (
                <p className="text-xs font-medium leading-relaxed">{msg.text}</p>
              ) : (
                <div>
                  <div className="text-xs">{renderMarkdown(msg.text)}</div>

                  {/* Optional Key Metrics cards inside message */}
                  {msg.metrics && Object.keys(msg.metrics).length > 0 && (
                    <div className="mt-3 grid grid-cols-2 gap-2 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                      {Object.entries(msg.metrics).map(([key, val], kIdx) => (
                        <div key={kIdx} className="text-left">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                            {key.replace(/_/g, ' ')}
                          </span>
                          <span className="text-xs font-semibold text-slate-800">
                            {typeof val === 'number' ? val.toLocaleString() : val}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Suggested Action Chips */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100">
                      <div className="flex items-center space-x-1 text-[11px] font-semibold text-brand-700 mb-1.5">
                        <Lightbulb className="w-3.5 h-3.5" />
                        <span>Recommended Next Actions:</span>
                      </div>
                      <div className="space-y-1">
                        {msg.actions.map((act, aIdx) => (
                          <div key={aIdx} className="flex items-center space-x-1.5 text-[11px] text-slate-600">
                            <ArrowRight className="w-3 h-3 text-brand-500 flex-shrink-0" />
                            <span>{act}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Follow Up Questions */}
                  {msg.followUps && msg.followUps.length > 0 && (
                    <div className="mt-3 pt-2 border-t border-slate-100">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Related Inquiries
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {msg.followUps.map((fu, fIdx) => (
                          <button
                            key={fIdx}
                            onClick={() => handleSendMessage(fu)}
                            className="text-[11px] px-2 py-0.5 bg-brand-50 hover:bg-brand-100 text-brand-700 rounded-md font-medium text-left transition-colors"
                          >
                            {fu}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
            <span className="text-[10px] text-slate-400 mt-1 px-1">
              {msg.sender === 'user' ? 'You' : 'Workforce AI'}
            </span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-2 text-xs text-slate-500 bg-white p-3 rounded-lg border border-slate-200 w-fit">
            <Loader2 className="w-4 h-4 animate-spin text-brand-600" />
            <span>Calculating workforce capacity & synthesizing recommendations...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <div className="p-3 bg-white border-t border-slate-200">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center space-x-2"
        >
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Ask about project capacity, hiring, reskilling..."
            className="flex-1 px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white text-slate-800"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputValue.trim()}
            className="px-3 py-2 bg-brand-600 hover:bg-brand-700 disabled:opacity-50 text-white rounded-lg transition-colors flex items-center justify-center shadow-xs"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
        <p className="text-[10px] text-slate-400 text-center mt-2">
          Backed by deterministic capacity calculations & enterprise workforce telemetry
        </p>
      </div>
    </div>
  );
}
