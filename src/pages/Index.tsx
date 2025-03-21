import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { MoonIcon, SunIcon } from 'lucide-react';
import { useTheme } from 'next-themes';
import mergenLogo from '../assets/mergen_logo.png';

const Index = () => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-background to-muted">
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
      
      <main className="flex-1 container mx-auto p-4 md:p-6">
        <div className="max-w-5xl mx-auto space-y-8">
          <section className="text-center space-y-4 py-8">
            <h2 className="text-4xl font-bold tracking-tight">
              Yapay Zeka Destekli Özel Ders Deneyimi
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mergen ile istediğiniz dersi, istediğiniz konuyu, kendi hızınızda öğrenin.
              Size özel bir öğretmen asistanı her zaman yanınızda.
            </p>
            <Button 
              size="lg" 
              className="mt-8"
              onClick={() => navigate('/chat')}
            >
              Mergen ile Sohbete Başla
            </Button>
          </section>
        </div>
      </main>
      
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Mergen AI Tutor. Tüm hakları saklıdır.
            </div>
            <div className="flex gap-4 text-sm text-muted-foreground">
              <a href="#" className="hover:text-primary transition-colors">Gizlilik Politikası</a>
              <a href="#" className="hover:text-primary transition-colors">Kullanım Şartları</a>
              <a href="#" className="hover:text-primary transition-colors">İletişim</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
