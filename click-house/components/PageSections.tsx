import React, { useState } from 'react';
import { CMSData } from '../types';
import { Loader, CheckCircle, Send } from 'lucide-react';

interface PageSectionsProps {
  cmsData: CMSData;
}

export const CustomizationSection: React.FC<PageSectionsProps> = ({ cmsData }) => (
  <section 
    id="custom" 
    className="py-24 bg-cover bg-center bg-no-repeat bg-fixed relative"
    style={{ backgroundImage: `url('${cmsData.customBgUrl}')` }}
  >
    <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-0"></div>
    <div className="max-w-4xl mx-auto px-4 animate-fade-in relative z-10 text-center">
      <h3 className="text-4xl font-heading text-white mb-4 drop-shadow-lg">{cmsData.customTitle}</h3>
      <p className="text-lg text-ch-gray mb-8">
        Wybierz Keycapy, dobierz ulubione Switche (np. <strong>Gateron Yellow</strong>) i spersonalizuj kabel. Dostarczamy <strong>niszowe części</strong>, których brakuje w gigantach rynkowych.
      </p>
      <a href="#products" className="inline-block bg-ch-primary text-ch-bg-dark py-3 px-8 rounded-xl font-bold text-lg hover:bg-[#8d5ed8] transition duration-300 shadow-neon transform hover:scale-[1.05]">
        Przeglądaj Switche i Keycapy
      </a>
    </div>
  </section>
);

export const AboutSection: React.FC<PageSectionsProps> = ({ cmsData }) => (
  <section 
    id="about" 
    className="py-24 border-t border-gray-800 bg-cover bg-center bg-no-repeat relative"
    style={{ backgroundImage: `url('${cmsData.aboutBgUrl}')` }}
  >
     <div className="absolute inset-0 bg-ch-bg-dark/95 z-0"></div>
     <div className="max-w-7xl mx-auto px-4 text-center relative z-10">
      <h3 className="text-4xl font-heading text-ch-secondary mb-12">
        {cmsData.aboutTitle}
      </h3>
      <div className="grid md:grid-cols-3 gap-8">
        <div className="p-6 bg-[#181818]/90 rounded-xl shadow-lg border-l-4 border-ch-primary hover:shadow-neon transition duration-300 transform hover:-translate-y-1">
          <h4 className="text-2xl font-heading text-ch-primary mb-3">⚡️ Parametry E-Sportowe</h4>
          <p className="text-ch-gray text-left">Filtruj sprzęt po parametrach kluczowych dla gracza (Polling Rate, siła nacisku w gramach). Nasze opisy to fakty.</p>
        </div>
        <div className="p-6 bg-[#181818]/90 rounded-xl shadow-lg border-l-4 border-ch-secondary hover:shadow-cyan-glow transition duration-300 transform hover:-translate-y-1">
          <h4 className="text-2xl font-heading text-ch-secondary mb-3">⚙️ Kompatybilność Custom</h4>
          <p className="text-ch-gray text-left">Wszystkie części, od switchy po kable, są sprawdzone pod kątem kompatybilności z naszym asortymentem klawiatur.</p>
        </div>
        <div className="p-6 bg-[#181818]/90 rounded-xl shadow-lg border-l-4 border-ch-primary hover:shadow-neon transition duration-300 transform hover:-translate-y-1">
          <h4 className="text-2xl font-heading text-ch-primary mb-3">🛡️ Zero Ryzyka</h4>
          <p className="text-ch-gray text-left">Sprzedajemy tylko to, co przeszło naszą weryfikację jakościową. Koniec z przypadkowymi modelami i złymi sensorami.</p>
        </div>
      </div>
    </div>
  </section>
);

export const ContactSection: React.FC<PageSectionsProps> = ({ cmsData }) => {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    // Simulation of API call
    setTimeout(() => {
      setStatus('success');
      // Reset form status after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        const form = e.target as HTMLFormElement;
        form.reset();
      }, 3000);
    }, 1500);
  };

  return (
    <section 
      id="contact" 
      className="py-24 relative bg-cover bg-center"
      style={{ backgroundImage: `url('${cmsData.contactBgUrl}')` }}
    >
      <div className="absolute inset-0 bg-black/85 z-0"></div>
      <div className="max-w-xl mx-auto px-4 text-center relative z-10">
        <h3 className="text-4xl font-heading text-ch-secondary mb-4">
          {cmsData.contactTitle}
        </h3>
        <p className="text-lg text-ch-gray mb-10">
          Nie jesteśmy call center. Pomożemy Ci wybrać sprzęt, który faktycznie poprawi Twoje wyniki w grach.
        </p>
        <form className="space-y-4 relative" onSubmit={handleSubmit}>
          {status === 'success' ? (
            <div className="bg-green-500/20 border border-green-500 text-green-400 p-8 rounded-xl flex flex-col items-center justify-center h-[320px] animate-fade-in">
              <CheckCircle size={64} className="mb-4 text-green-400" />
              <h4 className="text-2xl font-bold mb-2">Wiadomość Wysłana!</h4>
              <p>Odezwiemy się najszybciej jak to możliwe.</p>
            </div>
          ) : (
            <>
              <input 
                type="text" placeholder="Imię" required 
                disabled={status === 'submitting'}
                className="w-full p-3 rounded-lg bg-[#141414] border border-gray-700 focus:border-ch-primary focus:ring-1 focus:ring-ch-primary transition duration-200 text-white outline-none disabled:opacity-50" 
              />
              <input 
                type="email" placeholder="E-mail" required 
                disabled={status === 'submitting'}
                className="w-full p-3 rounded-lg bg-[#141414] border border-gray-700 focus:border-ch-primary focus:ring-1 focus:ring-ch-primary transition duration-200 text-white outline-none disabled:opacity-50" 
              />
              <textarea 
                placeholder="Treść pytania..." rows={5} required 
                disabled={status === 'submitting'}
                className="w-full p-3 rounded-lg bg-[#141414] border border-gray-700 focus:border-ch-primary focus:ring-1 focus:ring-ch-primary transition duration-200 text-white outline-none disabled:opacity-50"
              ></textarea>
              <button 
                type="submit" 
                disabled={status === 'submitting'}
                className="w-full bg-ch-primary text-ch-bg-dark py-3 px-8 rounded-xl font-bold text-lg hover:bg-[#8d5ed8] transition duration-300 shadow-neon transform hover:scale-[1.01] flex items-center justify-center gap-2 disabled:bg-gray-600 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <><Loader className="animate-spin" size={20} /> Wysyłanie...</>
                ) : (
                  <><Send size={20} /> Wyślij Zapytanie</>
                )}
              </button>
            </>
          )}
        </form>
      </div>
    </section>
  );
};

export const Footer: React.FC = () => (
  <footer className="bg-black pt-10 pb-6 border-t-2 border-ch-primary/50">
    <div className="max-w-7xl mx-auto px-4 grid md:grid-cols-4 sm:grid-cols-2 gap-8 text-ch-gray">
      <div>
        <h4 className="text-xl font-heading text-ch-primary mb-4">Kategorie</h4>
        <ul className="space-y-2">
          <li className="hover:text-ch-primary transition cursor-pointer">Klawiatury</li>
          <li className="hover:text-ch-secondary transition cursor-pointer">Myszki</li>
          <li className="hover:text-ch-primary transition cursor-pointer">Switche</li>
          <li className="hover:text-ch-secondary transition cursor-pointer">Keycapy</li>
        </ul>
      </div>
      <div>
        <h4 className="text-xl font-heading text-ch-secondary mb-4">Obsługa Klienta</h4>
        <ul className="space-y-2">
          <li className="hover:text-ch-secondary transition cursor-pointer">Kontakt</li>
          <li className="hover:text-ch-primary transition cursor-pointer">FAQ Techniczne</li>
          <li className="hover:text-ch-secondary transition cursor-pointer">Zwroty i Reklamacje</li>
        </ul>
      </div>
      <div>
        <h4 className="text-xl font-heading text-ch-primary mb-4">O Click House</h4>
        <ul className="space-y-2">
          <li className="hover:text-ch-primary transition cursor-pointer">Nasza Misja</li>
          <li className="hover:text-ch-secondary transition cursor-pointer">Blog / Poradniki</li>
          <li className="hover:text-ch-primary transition cursor-pointer">Praca</li>
        </ul>
      </div>
      <div>
        <h4 className="text-xl font-heading text-ch-secondary mb-4">Społeczność</h4>
        <p className="mb-4">Dołącz do nas:</p>
        <div className="flex space-x-4 text-2xl">
          <a href="#" className="hover:text-ch-primary transition">👾 Discord</a>
          <a href="#" className="hover:text-ch-secondary transition">📺 YouTube</a>
        </div>
      </div>
    </div>
    <div className="max-w-7xl mx-auto px-4 mt-8 pt-4 border-t border-gray-800 text-center text-sm text-gray-500">
      &copy; 2025 Click House. Wszelkie prawa zastrzeżone.
    </div>
  </footer>
);