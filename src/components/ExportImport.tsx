import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { exportToJSON, exportToCSV, importFromJSON, downloadFile } from '../utils/storage';

interface ExportImportProps {
  onClose: () => void;
}

const ExportImport: React.FC<ExportImportProps> = ({ onClose }) => {
  const { data, importData } = useApp();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExportJSON = () => {
    const json = exportToJSON(data);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(json, `acolyte-time-${timestamp}.json`, 'application/json');
  };

  const handleExportCSV = () => {
    const csv = exportToCSV(data.punches, data.tags);
    const timestamp = new Date().toISOString().split('T')[0];
    downloadFile(csv, `acolyte-time-${timestamp}.csv`, 'text/csv');
  };

  const handleImport = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const importedData = importFromJSON(text);

      const confirmed = window.confirm(
        `Import ${importedData.punches.length} punches and ${importedData.tags.length} tags? This will replace all existing data.`
      );

      if (confirmed) {
        importData(importedData);
        alert('Data imported successfully!');
        onClose();
      }
    } catch (error) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Failed to import data. Please check the file format.');
      }
    }

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-slate-850 rounded-2xl max-w-lg w-full shadow-elegant-xl border border-slate-700/50 animate-scale-in">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-700/50 flex items-center justify-between">
          <h2 className="text-2xl font-semibold text-platinum-100">Export / Import</h2>
          <button
            onClick={onClose}
            className="text-platinum-400 hover:text-platinum-100 text-2xl leading-none transition-colors"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Export Section */}
          <div>
            <h3 className="text-lg font-semibold text-platinum-100 mb-3 uppercase tracking-wider">
              Export Data
            </h3>
            <p className="text-sm text-platinum-400 mb-4">
              Download your time tracking data in JSON or CSV format.
            </p>

            <div className="space-y-3">
              <button
                onClick={handleExportJSON}
                className="w-full py-3 px-4 bg-gold-600 hover:bg-gold-500 text-slate-900 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between"
              >
                <span>📦 Export as JSON</span>
                <span className="text-sm opacity-75">Full backup</span>
              </button>

              <button
                onClick={handleExportCSV}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between"
              >
                <span>📊 Export as CSV</span>
                <span className="text-sm opacity-75">Spreadsheet</span>
              </button>
            </div>

            <div className="mt-4 p-3 bg-slate-900 rounded-lg border border-slate-700/50">
              <div className="text-xs text-platinum-500">
                <div className="flex justify-between mb-1">
                  <span>Total Punches:</span>
                  <span className="font-mono text-platinum-300">{data.punches.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tags:</span>
                  <span className="font-mono text-platinum-300">{data.tags.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-slate-700/50" />

          {/* Import Section */}
          <div>
            <h3 className="text-lg font-semibold text-platinum-100 mb-3 uppercase tracking-wider">
              Import Data
            </h3>
            <p className="text-sm text-platinum-400 mb-4">
              Restore your data from a previously exported JSON file.
            </p>

            <button
              onClick={handleImport}
              className="w-full py-3 px-4 bg-slate-700 hover:bg-slate-600 text-platinum-100 rounded-lg font-semibold transition-all transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
            >
              <span>📥</span>
              <span>Import from JSON</span>
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              onChange={handleFileSelected}
              className="hidden"
            />

            <div className="mt-4 p-3 bg-amber-900/20 rounded-lg border border-amber-500/30">
              <div className="text-xs text-amber-200">
                ⚠ Warning: Importing will replace all existing data. Export your current data first as a backup.
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-700/50">
          <button
            onClick={onClose}
            className="w-full py-2 text-platinum-400 hover:text-platinum-100 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExportImport;
