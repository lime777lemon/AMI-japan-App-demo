import { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { PatientRecord } from '../types/patientRecord';
import { saveRecord, updateRecord } from '../utils/storage';
import { Clinic } from '../types/clinic';
import { findBestClinics } from '../utils/clinicSearch';
import { getClinics } from '../utils/clinicStorage';
import ClinicRecommendations from './ClinicRecommendations';
import { createSpeechRecognition, isSpeechRecognitionSupported } from '../utils/speechRecognition';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: string;
}

interface ChatbotProps {
  onRecordAdded: () => void;
  onClinicSaved?: () => void;
}

function Chatbot({ onRecordAdded, onClinicSaved }: ChatbotProps) {
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
  const [recommendedClinics, setRecommendedClinics] = useState<Clinic[]>([]);
  const [currentSymptom, setCurrentSymptom] = useState('');
  const [isSearchingClinics, setIsSearchingClinics] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef<any>(null);
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
    // カルテIDもリセット（新しい会話として扱う）
    setCurrentRecordId(null);
    setRecommendedClinics([]);
    setCurrentSymptom('');
    
    // 音声認識の言語設定を更新
    if (recognitionRef.current) {
      recognitionRef.current.lang = language === 'ja' ? 'ja-JP' : 'en-US';
    }
  }, [language, t.chatbot.aiGreeting]);

  // 音声認識の初期化
  useEffect(() => {
    if (!isSpeechRecognitionSupported()) {
      return;
    }

    const recognition = createSpeechRecognition(language === 'ja' ? 'ja-JP' : 'en-US');
    if (!recognition) {
      return;
    }

    recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        } else {
          interimTranscript += transcript;
        }
      }

      if (finalTranscript) {
        setInput((prev) => prev + finalTranscript.trim() + ' ');
        setInterimTranscript('');
      } else {
        setInterimTranscript(interimTranscript);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'no-speech') {
        // 音声が検出されなかった場合は無視
        return;
      }
      setIsListening(false);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript('');
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
        recognitionRef.current = null;
      }
    };
  }, [language]);

  // 音声認識の開始/停止
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert(language === 'ja' 
        ? 'お使いのブラウザは音声認識に対応していません。'
        : 'Your browser does not support speech recognition.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript('');
    } else {
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (error) {
        console.error('Failed to start speech recognition:', error);
        setIsListening(false);
      }
    }
  };

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

  // カルテに自動記録する関数
  const autoSaveToRecord = (userMessages: Message[]) => {
    if (userMessages.length === 0) return;

    const patientWords = userMessages
      .map((msg) => msg.text)
      .join('\n\n');

    if (!patientWords.trim()) return;

    // 既存のカルテがある場合は更新、ない場合は新規作成
    const recordId = currentRecordId || Date.now().toString();
    
    const record: PatientRecord = {
      id: recordId,
      patientWords: patientWords,
      recordedBy: 'AI Chatbot',
      recordedAt: currentRecordId 
        ? new Date().toISOString() // 更新時は現在時刻
        : new Date().toISOString(), // 新規作成時も現在時刻
      patientId: patientId.trim() || undefined,
      patientName: patientName.trim() || undefined,
    };

    // 既存のレコードがある場合は更新、ない場合は新規保存
    if (currentRecordId) {
      updateRecord(record);
    } else {
      saveRecord(record);
      setCurrentRecordId(recordId);
    }
    
    onRecordAdded();
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!input.trim() || isSending || isSearchingClinics) return;

    // 音声認識が動作中の場合は停止
    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      setInterimTranscript('');
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: input.trim(),
      isUser: true,
      timestamp: new Date().toISOString(),
    };

    const symptom = input.trim();
    setCurrentSymptom(symptom);
    
    // メッセージを追加
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput('');
    setInterimTranscript('');
    setIsSending(true);

    // 患者のメッセージを自動的にカルテに記録
    const userMessages = updatedMessages.filter((msg) => msg.isUser);
    autoSaveToRecord(userMessages);

    // AI応答を生成
    const aiResponseText = generateAIResponse(symptom);
    const aiResponse: Message = {
      id: (Date.now() + 1).toString(),
      text: aiResponseText,
      isUser: false,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    setIsSending(false);

    // 症状からクリニックを検索
    setIsSearchingClinics(true);
    try {
      const existingClinics = getClinics();
      const clinics = await findBestClinics(symptom, existingClinics);
      setRecommendedClinics(clinics);
      
      if (clinics.length > 0) {
        const clinicMessage: Message = {
          id: (Date.now() + 2).toString(),
          text: language === 'ja'
            ? `症状を分析しました。最適なクリニックを${clinics.length}件見つけました。下記をご確認ください。`
            : `I've analyzed your symptoms and found ${clinics.length} recommended clinics. Please see below.`,
          isUser: false,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, clinicMessage]);
      }
    } catch (error) {
      console.error('Clinic search error:', error);
    } finally {
      setIsSearchingClinics(false);
    }
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
          {isSearchingClinics && (
            <div className="flex justify-start">
              <div className="bg-white text-gray-800 border border-gray-200 rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-sm text-gray-600">
                    {language === 'ja' ? '最適なクリニックを検索中...' : 'Searching for best clinics...'}
                  </span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-200 p-4 bg-white rounded-b-lg">
          <form onSubmit={handleSend} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                type="text"
                value={input + interimTranscript}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t.chatbot.placeholder}
                className="w-full px-4 py-2 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ami-blue focus:border-transparent"
                disabled={isSending || isListening}
              />
              {isSpeechRecognitionSupported() && (
                <button
                  type="button"
                  onClick={toggleListening}
                  disabled={isSending}
                  className={`absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
                    isListening
                      ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                      : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
                  }`}
                  title={isListening 
                    ? (language === 'ja' ? '音声認識を停止' : 'Stop listening')
                    : (language === 'ja' ? '音声入力開始' : 'Start voice input')
                  }
                >
                  {isListening ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                  )}
                </button>
              )}
              {isListening && (
                <div className="absolute left-4 top-1/2 -translate-y-1/2 flex items-center gap-1 text-red-500 text-xs">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span>{language === 'ja' ? '聞いています...' : 'Listening...'}</span>
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={isSending || !input.trim() || isListening}
              className="bg-ami-blue hover:bg-ami-light-blue text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? t.chatbot.sending : t.chatbot.send}
            </button>
          </form>
          {messages.length > 1 && (
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-center text-xs text-green-600">
                <span className="mr-1">✓</span>
                {language === 'ja' 
                  ? '会話は自動的にカルテに記録されています'
                  : 'Conversation is automatically saved to medical record'}
              </div>
              <button
                onClick={handleSaveToRecord}
                className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm"
              >
                {t.chatbot.saveToRecord} {language === 'ja' ? '(手動保存)' : '(Manual Save)'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* クリニック候補表示 */}
      {recommendedClinics.length > 0 && (
        <ClinicRecommendations
          clinics={recommendedClinics}
          symptom={currentSymptom}
          onClinicSaved={onClinicSaved}
        />
      )}
    </div>
  );
}

export default Chatbot;

