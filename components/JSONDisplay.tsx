
import React, { useState } from 'react';
import { AppEnvironment } from '../types';

interface Props {
  data: any;
  environment: AppEnvironment;
  isValid: boolean;
  errorMessage?: string;
}

const REDIRECT_URLS = {
  [AppEnvironment.PROD]: 'https://nxtwave-assessments-backend-topin-prod-apis.ccbp.in/admin/nw_tasks/task/add/',
  [AppEnvironment.BETA]: 'https://nxtwave-assessments-backend-topin-beta.earlywave.in/admin/nw_tasks/task/add/'
};

const JSONDisplay: React.FC<Props> = ({ data, environment, isValid, errorMessage }) => {
  const [copied, setCopied] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const jsonString = JSON.stringify(data, null, 2);
  
  const isProd = environment === AppEnvironment.PROD;
  const currentRedirectUrl = REDIRECT_URLS[environment];
  
  const accentButtonClass = isProd 
    ? 'bg-indigo-600 hover:bg-indigo-700' 
    : 'bg-amber-600 hover:bg-amber-700';

  const copyToClipboard = () => {
    if (!isValid) {
      setShowWarning(true);
      setTimeout(() => setShowWarning(false), 3000);
      return;
    }

    navigator.clipboard.writeText(jsonString).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
        window.open(currentRedirectUrl, '_blank');
      }, 800);
    });
  };

  return (
    <div className="mt-8 space-y-3">
      <div className="flex justify-between items-center">
        <div className="flex flex-col">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Generated JSON Payload</span>
          {showWarning && (
            <span className="text-[10px] text-rose-600 font-bold animate-bounce mt-1">
              {errorMessage ? `Error: ${errorMessage}` : "Please complete all steps first!"}
            </span>
          )}
        </div>
        <button
          onClick={copyToClipboard}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-bold transition-all shadow-md active:transform active:scale-95 ${
            !isValid 
              ? 'bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300' 
              : copied
                ? 'bg-green-100 text-green-700 ring-1 ring-green-600'
                : `${accentButtonClass} text-white`
          }`}
        >
          {copied ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
              <span>Copied! Opening {environment} Admin...</span>
            </>
          ) : (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
              </svg>
              <span>Copy & Open Admin Page</span>
            </>
          )}
        </button>
      </div>
      
      <div className={`relative group transition-opacity duration-300 ${isValid ? 'opacity-100' : 'opacity-40'}`}>
        <pre className="bg-slate-900 text-slate-100 p-5 rounded-xl text-sm font-mono overflow-auto max-h-[400px] border border-slate-800 shadow-inner custom-scrollbar">
          <code>{jsonString}</code>
        </pre>
        <div className="absolute inset-0 rounded-xl pointer-events-none border border-white/5 group-hover:border-white/10 transition-colors"></div>
      </div>
      <p className="text-[10px] text-slate-400 italic">
        * Clicking copy will open the NxtWave <strong>{environment}</strong> admin task page in a new browser tab.
      </p>
    </div>
  );
};

export default JSONDisplay;
