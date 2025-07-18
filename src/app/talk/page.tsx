'use client';

import { useState, useEffect, useRef } from 'react';
import { Star, User as UserIcon, Send } from 'lucide-react';
import Image from 'next/image';

const smilecvClinic = {
  name: 'SmileCV Dental Clinic',
  address: '100, St Mary Street, Convent, 81100 Johor Bahru, Johor.',
  logo: '/cvDental.jpg',
};

const dentists = [
  {
    id: 'xueqi',
    name: 'Dr Xue Qi',
    rating: 4.5,
  },
  {
    id: 'niren',
    name: 'Dr Niren',
    rating: 4.5,
  },
];

export default function TalkToDentistPage() {
  const [selectedDentist, setSelectedDentist] = useState<{
    id: string;
    name: string;
    rating: number;
  } | null>(null);
  const [messages, setMessages] = useState<{ sender: 'user' | 'dentist'; text: string; timestamp: Date }[]>([]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedDentist]);

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages(prev => [...prev, { sender: 'user', text: input, timestamp: new Date() }]);
    setInput('');
    // Simulate dentist reply
    setTimeout(() => {
      setMessages(prev => [...prev, { sender: 'dentist', text: 'Thank you for your message! I will get back to you soon.', timestamp: new Date() }]);
    }, 1200);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-white p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-5xl font-bold mb-10 text-[#1c788c] text-center">Talk to Dentist</h1>
        {!selectedDentist ? (
          <div className="flex flex-col gap-8">
            {dentists.map((dentist) => (
              <div
                key={dentist.id}
                className="bg-white border border-gray-200 rounded-3xl flex flex-row items-center w-full py-8 px-6 shadow-md cursor-pointer hover:bg-[#eaf6fa] transition"
                onClick={() => setSelectedDentist(dentist)}
              >
                <div className="w-24 h-24 flex items-center justify-center bg-[#eaf6fa] rounded-full overflow-hidden mr-8">
                  {/* Placeholder for future image */}
                  <UserIcon className="w-16 h-16 text-[#1c788c]" />
                </div>
                <div className="flex flex-col items-start justify-center flex-1">
                  <div className="text-2xl font-bold text-[#1c788c] mb-1">{dentist.name}</div>
                  <div className="flex items-center mb-2">
                    {/* 4 full stars and 1 half star for 4.5 rating */}
                    {[...Array(4)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400" fill="#facc15" />
                    ))}
                    <Star className="w-5 h-5 text-yellow-400" fill="url(#half)" style={{ clipPath: 'inset(0 50% 0 0)' }} />
                    <span className="ml-2 font-bold text-gray-800">4.5</span>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <Image src={smilecvClinic.logo} alt="SmileCV Dental Clinic logo" width={32} height={32} className="object-contain rounded" />
                    <span className="text-base text-gray-700 font-inter">{smilecvClinic.name}</span>
                  </div>
                  <div className="text-sm text-gray-500 font-inter mt-1">{smilecvClinic.address}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col items-center w-full max-w-2xl mx-auto">
            <button onClick={() => { setSelectedDentist(null); setMessages([]); }} className="mb-4 text-blue-500 hover:underline self-start">&larr; Back to dentist list</button>
            <div className="text-xl font-bold font-poppins text-[#1c788c] mb-2">Chat with {selectedDentist.name}</div>
            <div className="text-base text-gray-700 font-inter mb-4 flex items-center gap-2">
              <Image src={smilecvClinic.logo} alt="SmileCV Dental Clinic logo" width={28} height={28} className="object-contain rounded" />
              {smilecvClinic.name}
            </div>
            <div className="flex items-center mb-4">
              {[...Array(4)].map((_, i) => (
                <Star key={i} className="w-5 h-5 text-yellow-400" fill="#facc15" />
              ))}
              <Star className="w-5 h-5 text-yellow-400" fill="url(#half)" style={{ clipPath: 'inset(0 50% 0 0)' }} />
              <span className="ml-2 font-bold text-gray-800">4.5</span>
            </div>
            {/* Chat UI */}
            <div className="w-full flex-1 flex flex-col bg-[#eaf6fa] rounded-lg p-4 mb-4 max-h-96 overflow-y-auto" style={{ minHeight: 300 }}>
              {messages.length === 0 && (
                <div className="text-gray-400 text-center my-8">Say hello to {selectedDentist.name}!</div>
              )}
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex mb-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}> 
                  <div className={`max-w-xs px-4 py-2 rounded-2xl shadow ${msg.sender === 'user' ? 'bg-blue-500 text-white rounded-br-none' : 'bg-white text-gray-900 rounded-bl-none border'}`}> 
                    <span>{msg.text}</span>
                    <div className="text-[10px] text-gray-400 mt-1 text-right">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            {/* Input area */}
            <div className="w-full flex items-center gap-2 mt-2">
              <textarea
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={1}
                placeholder="Type your message..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                style={{ minHeight: '40px', maxHeight: '100px' }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim()}
                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Send Message"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>
      {/* SVG defs for half star fill */}
      <svg width="0" height="0">
        <defs>
          <linearGradient id="half" x1="0" x2="1" y1="0" y2="0">
            <stop offset="50%" stopColor="#facc15" />
            <stop offset="50%" stopColor="white" stopOpacity="1" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
} 