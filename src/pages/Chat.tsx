import React from 'react';
import ChatInterface from '@/components/ChatInterface';
import { MoonIcon, SunIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import mergenLogo from '../assets/mergen_logo.png';

const Chat = () => {
  const { theme, setTheme } = useTheme();

  return (
    <div className="flex flex-col min-h-screen">
      <header className="px-6 py-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <img 
                src={mergenLogo} 
                alt="Mergen Logo" 
                className="w-16 h-16 rounded-2xl object-cover shadow-lg hover:shadow-xl transition-all duration-300"
              />
              <div>
                <h1 className="text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-mergen-800 to-mergen-600">
                  Mergen
                </h1>
                <p className="text-sm text-muted-foreground">Kişisel Özel Ders Asistanı</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              >
                <SunIcon className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <MoonIcon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Tema değiştir</span>
              </Button>
            </div>
          </div>
        </div>
      </header>
      
      <main className="flex-1 container mx-auto p-4">
        <div className="h-[calc(100vh-8rem)]">
          <div className="h-full bg-card rounded-2xl overflow-hidden border shadow-lg">
            <ChatInterface />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Chat; 