import { useState } from 'react';
import { AppProvider } from './context/AppContext';
import PunchButton from './components/PunchButton';
import TimeView from './components/TimeView';
import TagManager from './components/TagManager';
import ExportImport from './components/ExportImport';

function App() {
  const [showTagManager, setShowTagManager] = useState(false);
  const [showExportImport, setShowExportImport] = useState(false);

  return (
    <AppProvider>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
        {/* Header */}
        <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
          <div className="max-w-4xl mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-gold-600 to-gold-500 rounded-xl flex items-center justify-center shadow-elegant">
                  <span className="text-xl">⏱</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-platinum-100 tracking-tight">
                    Acolyte Time
                  </h1>
                  <p className="text-xs text-platinum-500 uppercase tracking-widest">
                    Professional Time Tracking
                  </p>
                </div>
              </div>

              {/* Menu */}
              <div className="flex gap-2">
                <button
                  onClick={() => setShowTagManager(true)}
                  className="px-4 py-2 text-sm text-platinum-300 hover:text-platinum-100 hover:bg-slate-700 rounded-lg transition-all"
                  aria-label="Manage Tags"
                >
                  🏷 Tags
                </button>
                <button
                  onClick={() => setShowExportImport(true)}
                  className="px-4 py-2 text-sm text-platinum-300 hover:text-platinum-100 hover:bg-slate-700 rounded-lg transition-all"
                  aria-label="Export/Import"
                >
                  📦 Export
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
          <p className="text-sm text-platinum-600">
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

export default App;
