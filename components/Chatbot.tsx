'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Note } from '@prisma/client';

interface Message {
  text: string;
  sender: 'user' | 'bot';
  notes?: Note[]; // Optional field for notes
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: input }),
      });

      const data = await res.json();
      const botMessage: Message = {
        text: data.message || "I couldn't find any notes for that query.",
        sender: 'bot',
        notes: data.notes || [],
      };
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const botError: Message = { text: 'Sorry, something went wrong. Please try again.', sender: 'bot' };
      setMessages(prev => [...prev, botError]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 w-80 max-w-xs z-50 bg-gray-100 rounded-xl shadow-lg flex flex-col h-[32rem] border border-gray-300">
      <div className="flex-1 overflow-y-auto space-y-4 p-4">
        {messages.map((msg, index) => (
          <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`p-3 rounded-lg max-w-[80%] ${
              msg.sender === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-300 text-gray-800'
            }`}>
              <p>{msg.text}</p>
              {msg.notes && msg.notes.length > 0 && (
                <div className="mt-2 space-y-2">
                  <p className="font-semibold text-sm">Found these notes:</p>
                  {msg.notes.map(note => (
                    <Link key={note.id} href={`/notes/${note.id}`} className="block p-2 rounded-md bg-white text-blue-600 hover:bg-gray-100 transition">
                      <p className="font-semibold">{note.title}</p>
                      <p className="text-xs text-gray-500">{note.subject} | Sem: {note.semester}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="p-3 rounded-lg bg-gray-300 text-gray-800 animate-pulse">
              <p>Typing...</p>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="flex items-center p-3 border-t bg-white">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
          className="flex-1 rounded-full border px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Ask me for notes..."
        />
        <button
          onClick={handleSendMessage}
          className="ml-2 bg-blue-500 text-white rounded-full p-2 hover:bg-blue-600 transition"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
}