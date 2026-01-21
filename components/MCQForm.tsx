
import React, { useState, useEffect } from 'react';
import JSONDisplay from './JSONDisplay';
import { MCQPayload, AppEnvironment } from '../types';

const SUB_SHEET_OPTIONS = [
  'Questions',
  'Question Tags',
  'Options',
  'Explanations',
  'Metadata'
];

interface Props {
  environment: AppEnvironment;
}

const MCQForm: React.FC<Props> = ({ environment }) => {
  const [sheetName, setSheetName] = useState('');
  const [selectedSubSheets, setSelectedSubSheets] = useState<string[]>([]);
  const [payload, setPayload] = useState<MCQPayload>({
    spread_sheet_name: '',
    data_sets_to_be_loaded: []
  });

  const isProd = environment === AppEnvironment.PROD;
  const accentBorderClass = isProd ? 'border-indigo-600 bg-indigo-50 text-indigo-700 ring-indigo-600' : 'border-amber-600 bg-amber-50 text-amber-700 ring-amber-600';
  
  const isStep1Complete = sheetName.trim().length > 0;

  useEffect(() => {
    setPayload({
      spread_sheet_name: sheetName,
      data_sets_to_be_loaded: selectedSubSheets
    });
  }, [sheetName, selectedSubSheets]);

  const toggleSubSheet = (name: string) => {
    if (!isStep1Complete) return;
    setSelectedSubSheets(prev =>
      prev.includes(name)
        ? prev.filter(s => s !== name)
        : [...prev, name]
    );
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">MCQ Content Configuration</h2>
        <p className="text-slate-500 text-sm">Specify the spreadsheet and the subsheets you wish to load.</p>
      </div>

      <div className="space-y-6">
        {/* Step 1 */}
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
             <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${isStep1Complete ? 'bg-green-500 text-white' : 'bg-slate-300 text-white'}`}>1</span>
             <label className="block text-sm font-semibold text-slate-700">Spreadsheet Name</label>
          </div>
          <input
            type="text"
            className={`w-full px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 outline-none transition-all ${isProd ? 'focus:ring-indigo-500 focus:border-indigo-500' : 'focus:ring-amber-500 focus:border-amber-500'}`}
            placeholder="e.g. Authentication- theory"
            value={sheetName}
            onChange={(e) => setSheetName(e.target.value)}
          />
          {!isStep1Complete && (
            <p className="text-xs text-rose-500 font-medium animate-pulse">⚠️ Please enter the spreadsheet name to proceed.</p>
          )}
        </div>

        {/* Step 2 */}
        <div className={`space-y-3 transition-opacity duration-300 ${isStep1Complete ? 'opacity-100' : 'opacity-40 pointer-events-none'}`}>
          <div className="flex items-center space-x-2">
             <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${selectedSubSheets.length > 0 ? 'bg-green-500 text-white' : 'bg-slate-300 text-white'}`}>2</span>
             <label className="block text-sm font-semibold text-slate-700">Sub-sheets to be Loaded</label>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SUB_SHEET_OPTIONS.map((name) => (
              <label
                key={name}
                className={`flex items-center px-4 py-2 border rounded-lg cursor-pointer transition-all ${
                  selectedSubSheets.includes(name)
                    ? `ring-1 ${accentBorderClass}`
                    : 'border-slate-200 hover:border-slate-300 text-slate-600'
                }`}
              >
                <input
                  type="checkbox"
                  className="hidden"
                  checked={selectedSubSheets.includes(name)}
                  onChange={() => toggleSubSheet(name)}
                />
                <span className="text-sm font-medium">{name}</span>
              </label>
            ))}
          </div>
          {isStep1Complete && selectedSubSheets.length === 0 && (
            <p className="text-xs text-amber-600 font-medium">Select at least one sub-sheet.</p>
          )}
        </div>
      </div>

      <JSONDisplay 
        data={payload} 
        environment={environment} 
        isValid={isStep1Complete && selectedSubSheets.length > 0} 
        errorMessage={!isStep1Complete ? "Spreadsheet name is missing" : (selectedSubSheets.length === 0 ? "No sub-sheets selected" : "")}
      />
    </div>
  );
};

export default MCQForm;
