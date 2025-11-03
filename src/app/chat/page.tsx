"use client";

import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: string;
}

const CHAT_API_URL = 'http://localhost:8000/api/chat'; 
const formatTimestamp = () => new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

export default function ChatBotPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: Date.now(),
      text: "Olá! Sou o assistente virtual da PsicoConnect. Estou aqui para ajudar com agendamentos ou tirar dúvidas.",
      sender: 'bot',
      timestamp: formatTimestamp(),
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatMessagesRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (smooth = true) => {
    messagesEndRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "auto" });
  };

  useEffect(() => {
    scrollToBottom(false);
  }, [messages]);
  
  const [showScrollButton, setShowScrollButton] = useState(false);
  
  const handleScroll = () => {
    if (chatMessagesRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatMessagesRef.current;
        const isNearBottom = scrollHeight - scrollTop - clientHeight < 50;
        setShowScrollButton(!isNearBottom);
    }
  };

  useEffect(() => {
    const chatElement = chatMessagesRef.current;
    if (chatElement) {
      chatElement.addEventListener('scroll', handleScroll);
      return () => chatElement.removeEventListener('scroll', handleScroll);
    }
  }, []);

  useEffect(() => {
    const textarea = document.getElementById('message-input') as HTMLTextAreaElement;
    if (textarea) {
        textarea.style.height = 'auto'; 
        const newHeight = Math.min(textarea.scrollHeight + 2, 100); 
        textarea.style.height = newHeight + 'px'; 
    }
  }, [input]);

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const currentInput = input.trim();
    if (currentInput === '' || isLoading) return;

    const userMessage: Message = {
      id: Date.now(),
      text: currentInput,
      sender: 'user',
      timestamp: formatTimestamp(),
    };

    setMessages(prevMessages => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: currentInput,
        }),
      });

      if (!response.ok) {
        throw new Error(`Erro ${response.status}: Falha na API. `);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: Date.now() + 1,
        text: data.reply || "Desculpe, não consegui obter uma resposta da IA.",
        sender: 'bot',
        timestamp: formatTimestamp(),
      };

      setMessages(prevMessages => [...prevMessages, botMessage]);

    } catch (error) {
      console.error("Erro no chat:", error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Erro: Não foi possível conectar ao bot. Verifique se o servidor (porta 8000) está a correr e se o CORS está configurado.",
        sender: 'bot',
        timestamp: formatTimestamp(),
      };
      setMessages(prevMessages => [...prevMessages, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <header className="chat-header">
        <div className="icon"><i className="fa-solid fa-robot"></i></div>
        <div>
          <h2>Assistente PsicoConnect</h2>
          <p>Como posso te ajudar hoje?</p>
        </div>
      </header>

      <div className="chat-content-wrapper"> 
        <div className="chat-messages" id="chat-messages" ref={chatMessagesRef}>
          
          {messages.map((msg) => (
            <div key={msg.id} className={`message ${msg.sender} break-words`}>
              <div>
                <ReactMarkdown
                  components={{
                    a: ({node, ...props}) => <a {...props} target="_blank" rel="noopener noreferrer" />
                  }}
                >
                  {msg.text}
                </ReactMarkdown>
              </div>
              <span className="timestamp">{msg.timestamp}</span>
            </div>
          ))}

          {isLoading && (
            <div className="message bot typing-indicator">
              <span></span><span></span><span></span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <footer className="chat-input-area">
          <textarea 
            id="message-input" 
            placeholder="Digite sua mensagem aqui..." 
            rows={1}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                    sendMessage();
                    e.preventDefault();
                }
            }}
            disabled={isLoading}
          />
          <button 
            id="send-button"
            onClick={() => sendMessage()}
            disabled={isLoading || input.trim() === ''}
          >
            {isLoading ? (
              <div className="typing-indicator" style={{padding: 0, margin: 0, marginBottom: 0}}>
                 <span style={{backgroundColor: '#fff'}}></span>
                 <span style={{backgroundColor: '#fff'}}></span>
                 <span style={{backgroundColor: '#fff'}}></span>
              </div>
            ) : (
              <i className="fa-solid fa-paper-plane"></i>
            )}
          </button>
        </footer>
        
        <button 
            id="scroll-down-button" 
            className={showScrollButton ? '' : 'hidden'}
            onClick={() => scrollToBottom(true)}
        >
            <i className="fa-solid fa-arrow-down"></i>
        </button>
      </div> 
      
      <style>{`
          .message.bot a {
              color: #1C4BB3;
              text-decoration: underline;
          }
          .message.bot a:hover {
              color: #528CFF;
          }
      `}</style>
    </>
  );
}