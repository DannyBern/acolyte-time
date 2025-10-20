import { useState, useEffect, useRef } from 'react';
import { AppProvider } from './context/AppContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import PunchButton from './components/PunchButton';
import TimeView from './components/TimeView';
import TagManager from './components/TagManager';
import ExportImport from './components/ExportImport';
import SplashScreen from './components/SplashScreen';

function AppContent() {
  const { theme, toggleTheme } = useTheme();
  const [showTagManager, setShowTagManager] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  const appIntroAudioRef = useRef<HTMLAudioElement | null>(null);

  // Jouer le son d'intro quand le splash se termine (avec délai de 1 seconde)
  useEffect(() => {
    if (!showSplash && appIntroAudioRef.current) {
      // Attendre 1 seconde pour s'assurer que l'audio joue complètement
      const delayTimer = setTimeout(() => {
        if (appIntroAudioRef.current) {
          appIntroAudioRef.current.volume = 1.0; // Volume maximum
          appIntroAudioRef.current.play().catch(err => {
            console.log('Audio intro bloqué:', err);
          });
        }
      }, 1000);

      return () => clearTimeout(delayTimer);
    }
  }, [showSplash]);

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <AppProvider>
      {/* Audio d'intro de l'app - joue une fois au chargement */}
      <audio
        ref={appIntroAudioRef}
        src="/acolyte-time/app-intro.mp3"
        preload="auto"
      />

      <div className={`min-h-screen transition-colors duration-300 ${
        theme === 'dark'
          ? 'bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950'
          : 'bg-gradient-to-br from-gray-50 via-white to-gray-100'
      }`}>
        {/* Header */}
        <header className={`sticky top-0 z-40 backdrop-blur-md border-b transition-colors duration-300 ${
          theme === 'dark'
            ? 'bg-slate-900/80 border-slate-700/50'
            : 'bg-white/80 border-gray-200'
        }`}>
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src="/acolyte-time/acolyte-logo.png"
                  alt="Acolyte"
                  className="w-12 h-12 object-contain"
                />
              </div>

              {/* Menu */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTagManager(true)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'text-platinum-300 hover:text-platinum-100 hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Manage Tags"
                >
                  🏷 Tags
                </button>
                <button
                  onClick={() => setShowExportImport(true)}
                  className={`px-4 py-2 text-sm rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'text-platinum-300 hover:text-platinum-100 hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Export/Import"
                >
                  📦 Export
                </button>
                <button
                  onClick={toggleTheme}
                  className={`px-4 py-2 text-sm rounded-lg transition-all ${
                    theme === 'dark'
                      ? 'text-platinum-300 hover:text-platinum-100 hover:bg-slate-700'
                      : 'text-gray-700 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                  aria-label="Toggle Theme"
                >
                  {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
          {/* Punch Section */}
          <section>
            <PunchButton />
          </section>

          {/* Time View Section */}
          <section>
            <TimeView />
          </section>
        </main>

        {/* Footer */}
        <footer className="max-w-4xl mx-auto px-4 py-8 text-center">
          <p className={`text-sm transition-colors ${
            theme === 'dark' ? 'text-platinum-600' : 'text-gray-500'
          }`}>
            Made with precision for professionals
          </p>
        </footer>

        {/* Modals */}
        {showTagManager && <TagManager onClose={() => setShowTagManager(false)} />}
        {showExportImport && <ExportImport onClose={() => setShowExportImport(false)} />}
      </div>
    </AppProvider>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
