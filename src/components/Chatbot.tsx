import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PatientRecord } from '../types/patientRecord';
import { saveRecord } from '../utils/storage';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatbotProps {
  onRecordAdded: () => void;
}

function Chatbot({ onRecordAdded }: ChatbotProps) {
  const { t, language } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: t.chatbot.aiGreeting,
      isUser: false,
      timestamp: new Date().toISOString(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [patientId, setPatientId] = useState('');
  const [patientName, setPatientName] = useState('');
  const [showPatientInfo, setShowPatientInfo] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // 言語が変わったら最初のメッセージを更新
    setMessages([
      {
        id: '1',
        text: t.chatbot.aiGreeting,
        isUser: false,
        timestamp: new Date().toISOString(),
      },
    ]);
  }, [language, t.chatbot.aiGreeting]);

  const generateAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    // 症状に関するキーワードを検出
    if (lowerMessage.includes('痛') || lowerMessage.includes('痛み') || lowerMessage.includes('hurt') || lowerMessage.includes('pain')) {
      return language === 'ja' 
        ? '痛みについて詳しく教えてください。いつから痛みますか？どのような痛みですか？'
        : 'Please tell me more about the pain. When did it start? What kind of pain is it?';
    }
    
    if (lowerMessage.includes('熱') || lowerMessage.includes('発熱') || lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      return language === 'ja'
        ? '発熱についてお聞きします。体温は何度ですか？いつから熱がありますか？'
        : 'About the fever. What is your temperature? When did the fever start?';
    }
    
    if (lowerMessage.includes('咳') || lowerMessage.includes('cough')) {
      return language === 'ja'
        ? '咳について詳しく教えてください。どのような咳ですか？痰は出ますか？'
        : 'Please tell me more about the cough. What kind of cough is it? Do you have phlegm?';
    }
    
    if (lowerMessage.includes('頭痛') || lowerMessage.includes('headache')) {
      return language === 'ja'
        ? '頭痛について詳しく教えてください。どの部分が痛みますか？いつからですか？'
        : 'Please tell me more about the headache. Which part hurts? When did it start?';
    }
    
    // デフォルトの応答
    return t.chatbot.aiResponse;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isSending) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsSending(true);

    // AI応答をシミュレート（実際のAPI呼び出しの代わり）
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateAIResponse(userMessage.text),
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, aiResponse]);
      setIsSending(false);
    }, 1000);
  };

  const handleSaveToRecord = () => {
    if (messages.length <= 1) {
      alert(language === 'ja' ? '会話がありません。' : 'No conversation to save.');
      return;
    }

    // ユーザーメッセージのみを抽出して結合
    const userMessages = messages
      .filter((msg) => msg.isUser)
      .map((msg) => msg.text)
      .join('\n\n');

    if (!userMessages.trim()) {
      alert(language === 'ja' ? '保存する会話がありません。' : 'No conversation to save.');
      return;
    }

    const newRecord: PatientRecord = {
      id: Date.now().toString(),
      patientWords: userMessages,
      recordedBy: 'AI Chatbot',
      recordedAt: new Date().toISOString(),
      patientId: patientId.trim() || undefined,
      patientName: patientName.trim() || undefined,
    };

    saveRecord(newRecord);
    onRecordAdded();

    // 成功メッセージを表示
    alert(t.chatbot.savedToRecord);
  };

  const formatTime = (isoString: string): string => {
    const date = new Date(isoString);
    return date.toLocaleTimeString(language === 'ja' ? 'ja-JP' : 'en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center">
          <span className="mr-2">💬</span>
          {t.chatbot.title}
        </h2>
        <button
          onClick={() => setShowPatientInfo(!showPatientInfo)}
          className="text-sm text-ami-blue hover:text-ami-light-blue font-semibold"
        >
          {t.chatbot.patientInfo}
        </button>
      </div>

      {showPatientInfo && (
        <div className="mb-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-gray-700 mb-3">{t.chatbot.enterPatientInfo}</p>
          <div className="grid md:grid-cols-2 gap-3">
            <input
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              placeholder={t.form.patientIdPlaceholder}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent text-sm"
            />
            <input
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder={t.form.patientNamePlaceholder}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent text-sm"
            />
          </div>
        </div>
      )}

      <div className="border border-gray-200 rounded-lg h-96 flex flex-col bg-gray-50">
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.isUser
                    ? 'bg-ami-blue text-white'
                    : 'bg-white text-gray-800 border border-gray-200'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.isUser ? 'text-blue-100' : 'text-gray-500'
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}
          {isSending && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
          <form onSubmit={handleSend} className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t.chatbot.placeholder}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent"
              disabled={isSending}
            />
            <button
              type="submit"
              disabled={isSending || !input.trim()}
              className="bg-ami-blue hover:bg-ami-light-blue text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? t.chatbot.sending : t.chatbot.send}
            </button>
          </form>
          {messages.length > 1 && (
            <button
              onClick={handleSaveToRecord}
              className="mt-3 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
            >
              {t.chatbot.saveToRecord}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Chatbot;

