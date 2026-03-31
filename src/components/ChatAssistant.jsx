import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Minimize2, Maximize2 } from 'lucide-react';

export default function ChatAssistant({ resumeText }) {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Hi! I analyzed your resume. What would you like to know or improve?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const messagesEndRef = useRef(null);
  const chatRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (chatRef.current && !chatRef.current.contains(event.target)) {
        setIsExpanded(false);
      }
    }

    if (isExpanded) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isExpanded]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    const newMessages = [...messages, { role: 'user', text: userText }];
    
    setMessages(newMessages);
    setInput('');
    setIsTyping(true);

    try {
      // Build conversation history for the API
      const messagesPayload = [
        { role: "system", content: `You are an expert technical recruiter analyzing a resume. The user's resume text is provided here: ${resumeText}` },
        ...messages.map(m => ({ role: m.role, content: m.text })),
        { role: "user", content: userText }
      ];

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ messages: messagesPayload })
      });

      if (!response.ok) {
        throw new Error("Chat server error. Are you running locally without a Vercel runtime?");
      }

      const data = await response.json();
      const reply = data.choices[0]?.message?.content || "I'm not sure what to say.";

      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
    } catch (err) {
      console.error(err);
      setMessages((prev) => [...prev, { role: 'assistant', text: "Sorry, I encountered an error connecting to the AI." }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div ref={chatRef} className={`chat-wrapper glass-panel ${isExpanded ? 'expanded' : ''}`}>
      <div className="chat-container">
        
        <div className="chat-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bot size={24} color="var(--primary-color)" />
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>AI Resume Coach</h3>
            <span className="status-dot"></span>
          </div>
          <button 
            className="icon-btn" 
            onClick={() => setIsExpanded(!isExpanded)}
            title={isExpanded ? "Minimize Chat" : "Expand Chat"}
          >
            {isExpanded ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>

        <div className="chat-messages">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.role}`}>
              <div className="avatar">
                {msg.role === 'assistant' ? <Bot size={20} color="white" /> : <User size={20} color="white" />}
              </div>
              <div className="bubble">
                {msg.text}
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="message assistant">
              <div className="avatar">
                <Bot size={20} color="white" />
              </div>
              <div className="bubble typing">
                <span></span><span></span><span></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="chat-input-area">
          <div className="input-wrapper">
            <input 
              type="text" 
              className="chat-input"
              placeholder="Ask me anything about your resume..."
              value={input}
              onFocus={() => setIsExpanded(true)}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button 
              className="send-btn" 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
            >
              <Send size={18} />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
