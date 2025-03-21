import React, { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';
import GradeSelector from './GradeSelector';
import SubjectSelector from './SubjectSelector';
import TopicInput from './TopicInput';
import ChatMessage from './ChatMessage';
import { toast } from "sonner";
import { sendMessageToGemini, type GeminiRequestParams } from '@/lib/gemini-api';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: Date;
}

const ChatInterface: React.FC = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content: 'Merhaba! Ben Mergen, özel ders öğretmeni asistanınız. Hangi konuda yardımcı olabilirim?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [grade, setGrade] = useState<string>('');
  const [subject, setSubject] = useState<string>('');
  const [topic, setTopic] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showTestButton, setShowTestButton] = useState<boolean>(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!grade) {
      toast.error("Lütfen bir sınıf seçiniz.");
      return;
    }
    
    if (!subject) {
      toast.error("Lütfen bir ders seçiniz.");
      return;
    }
    
    if (!topic.trim()) {
      toast.error("Lütfen bir konu giriniz.");
      return;
    }
    
    const userMessage = `${grade}. sınıf ${subject === 'literature' ? 'Edebiyat' : 'Matematik'} dersinden "${topic}" konusunu öğrenmek istiyorum.`;
    
    const newUserMessage: Message = {
      id: Date.now().toString(),
      content: userMessage,
      isUser: true,
      timestamp: new Date()
    };
    
    setMessages(prev => [...prev, newUserMessage]);
    setIsSubmitting(true);
    
    try {
      console.log("API isteği gönderiliyor...");
      
      const params: GeminiRequestParams = {
        grade,
        subject,
        topic
      };
      
      const geminiResponse = await sendMessageToGemini(params);
      console.log("API yanıtı alındı:", geminiResponse);
      
      if (!geminiResponse.success || !geminiResponse.data) {
        throw new Error(geminiResponse.error?.message || "Yapay zeka yanıtı alınamadı");
      }
      
      const responseMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: geminiResponse.data.content,
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, responseMessage]);
      setTopic('');
      setShowTestButton(true);
    } catch (error) {
      console.error("Chat Arayüzü Hatası:", error);
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: error instanceof Error ? error.message : "Üzgünüm, yanıt üretirken bir hata oluştu. Lütfen tekrar deneyin.",
        isUser: false,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-auto p-6 space-y-6">
        <div className="space-y-6">
          {messages.map(message => (
            <ChatMessage
              key={message.id}
              content={message.content}
              isUser={message.isUser}
              timestamp={message.timestamp}
            />
          ))}
          {isSubmitting && (
            <div className="flex items-center gap-2 text-muted-foreground animate-pulse">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Yanıt hazırlanıyor...</span>
            </div>
          )}
          {showTestButton && (
            <div className="flex justify-center mt-4">
              <Button
                onClick={() => navigate('/test', {
                  state: {
                    grade,
                    subject,
                    topic
                  }
                })}
                className="bg-primary hover:bg-primary/90"
              >
                Test Oluştur
              </Button>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
      
      <Card className="border-t-0 rounded-t-none p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <TopicInput topic={topic} onTopicChange={setTopic} />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GradeSelector selectedGrade={grade} onGradeChange={setGrade} />
            <SubjectSelector selectedSubject={subject} onSubjectChange={setSubject} />
          </div>
          
          <div className="flex justify-end">
            <Button 
              type="submit" 
              className={cn(
                "min-w-[120px]",
                isSubmitting && "opacity-70 cursor-not-allowed"
              )}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Gönderiliyor
                </>
              ) : (
                'Gönder'
              )}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default ChatInterface;
