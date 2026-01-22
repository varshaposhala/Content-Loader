
import React, { useState, useEffect } from 'react';
import { ContentType, CodingPayload, AppEnvironment } from '../types';
import JSONDisplay from './JSONDisplay';

interface Props {
  type: ContentType;
  environment: AppEnvironment;
}

const URLS = {
  [AppEnvironment.PROD]: 'https://nxtwave-assessments-backend-topin-prod-apis.ccbp.in/admin/nw_tasks/uploadfile/',
  [AppEnvironment.BETA]: 'https://nxtwave-assessments-backend-topin-beta.earlywave.in/admin/nw_tasks/uploadfile/add/'
};

const CodingForm: React.FC<Props> = ({ type, environment }) => {
  const [url, setUrl] = useState('');
  const [isJsonConverted, setIsJsonConverted] = useState(false);
  const [score, setScore] = useState(1);
  const [hasClickedUpload, setHasClickedUpload] = useState(false);

  const [payload, setPayload] = useState<CodingPayload>({
    input_dir_path_url: '',
    is_json_converted: false
  });

  const isProd = environment === AppEnvironment.PROD;
  const currentUploadUrl = URLS[environment];
  
  const getRequiredFolderName = () => {
    if (type === ContentType.CODING_QUESTIONS) return "Coding Questions";
    if (type === ContentType.CODE_ANALYSIS) return "Code Analysis MCQs";
    return "";
  };

  const requiredFolder = getRequiredFolderName();
  
  // Validation Logic
  const isUrlFormatValid = url.trim().startsWith('http');
  
  /**
   * Validates both folder presence and file presence inside that folder.
   * Checks for either the literal name or URL encoded name (with %20).
   * Must have characters after the folder name/slash to count as having a file.
   */
  const validateFolderAndFile = () => {
  };

  const { hasFolder, hasFile } = validateFolderAndFile();

  const step1Complete = hasClickedUpload;
  const step2Complete = step1Complete && isUrlFormatValid && hasFolder && hasFile;

  const accentBgClass = isProd ? 'bg-indigo-50/50 border-indigo-100' : 'bg-amber-50/50 border-amber-100';
  const accentCircleClass = isProd ? 'bg-indigo-600' : 'bg-amber-600';
  const accentButtonClass = isProd 
    ? 'border-indigo-200 text-indigo-700 hover:bg-indigo-50 hover:border-indigo-300' 
    : 'border-amber-200 text-amber-700 hover:bg-amber-50 hover:border-amber-300';
  const accentRingClass = isProd ? 'focus:ring-indigo-500' : 'focus:ring-amber-500';
  const accentToggleClass = isProd ? 'bg-indigo-600' : 'bg-amber-600';

  useEffect(() => {
    const newPayload: CodingPayload = {
      input_dir_path_url: url.trim(),
      is_json_converted: isJsonConverted
    };
    if (!isJsonConverted) {
      newPayload.question_score = score;
    }
    setPayload(newPayload);
  }, [url, isJsonConverted, score]);

  const openUploadPage = () => {
    window.open(currentUploadUrl, '_blank');
    setHasClickedUpload(true);
  };

  const getStep2ErrorMessage = () => {
    if (!step1Complete) return "";
    if (!url.trim()) return "⚠️ Please paste the link obtained after uploading.";
    if (!isUrlFormatValid) return "⚠️ JSON Link is not pasted or invalid.";
    if (!hasFolder) return `⚠️ Folder structure error: The URL must contain a folder named "${requiredFolder}".`;
    if (!hasFile) return `⚠️ File missing error: The folder "${requiredFolder}" must contain at least one file.`;
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {type === ContentType.CODE_ANALYSIS ? 'Code Analysis' : 'Coding Question'} Configuration
        </h2>
        <p className="text-slate-500 text-sm">Follow the steps below to prepare your question content for <strong>{environment}</strong>.</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: External Upload */}
        <div className={`p-5 rounded-xl border transition-all ${accentBgClass} ${step1Complete ? 'ring-2 ring-green-500' : ''}`}>
          <div className="flex items-start space-x-4">
            <div className={`${step1Complete ? 'bg-green-500' : accentCircleClass} text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 shadow-sm`}>
              {step1Complete ? '✓' : '1'}
            </div>
            <div className="flex-grow">
              <label className="block text-sm font-bold text-slate-800 mb-1">Upload ZIP File ({environment})</label>
              <p className="text-xs text-slate-600 mb-4">Ensure your ZIP contains a folder named <strong>"{requiredFolder}"</strong> with files inside.</p>
              <button
                onClick={openUploadPage}
                className={`inline-flex items-center space-x-2 px-5 py-2.5 bg-white border rounded-lg text-sm font-bold transition-all shadow-sm active:transform active:scale-95 ${accentButtonClass}`}
              >
                <span>Open Upload Page</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* Step 2: Input URL */}
        <div className={`flex items-start space-x-4 transition-all duration-300 ${step1Complete ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
          <div className={`${step2Complete ? 'bg-green-500' : accentCircleClass} text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 shadow-sm`}>
            {step2Complete ? '✓' : '2'}
          </div>
          <div className="flex-grow space-y-3">
            <label className="block text-sm font-bold text-slate-800">Paste Input Directory URL</label>
            <textarea
              className={`w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 outline-none transition-all font-mono text-sm min-h-[80px] ${accentRingClass}`}
              placeholder={`Paste the URL here. Must include "${requiredFolder}/filename"`}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {getStep2ErrorMessage() && (
               <p className="text-xs text-rose-500 font-medium animate-pulse">{getStep2ErrorMessage()}</p>
            )}
          </div>
        </div>

        {/* Step 3: Config */}
        <div className={`flex items-start space-x-4 transition-all duration-300 ${step2Complete ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
          <div className={`${accentCircleClass} text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 shadow-sm`}>3</div>
          <div className="flex-grow flex flex-wrap gap-8 items-center pt-0.5">
            <label className="flex items-center space-x-3 cursor-pointer group">
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isJsonConverted}
                  onChange={(e) => setIsJsonConverted(e.target.checked)}
                />
                <div className={`block w-11 h-6 rounded-full transition-colors ${isJsonConverted ? accentToggleClass : 'bg-slate-300'}`}></div>
                <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isJsonConverted ? 'translate-x-5' : ''}`}></div>
              </div>
              <span className="text-sm font-bold text-slate-700">JSON Converted</span>
            </label>

            {!isJsonConverted && (
              <div className="flex items-center space-x-3">
                <label className="text-sm font-bold text-slate-700">Question Score</label>
                <div className="relative">
                   <input
                    type="number"
                    min="0"
                    className={`w-20 px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 outline-none text-center font-bold text-slate-800 ${accentRingClass}`}
                    value={score}
                    onChange={(e) => setScore(Number(e.target.value))}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <JSONDisplay 
        data={payload} 
        environment={environment} 
        isValid={step2Complete}
        errorMessage={
          !step1Complete ? "JSON is not uploaded yet" : 
          (!url.trim() ? "JSON link is missing" : 
          (!isUrlFormatValid ? "JSON link is invalid" : 
          (!hasFolder ? `Missing "${requiredFolder}" folder` : 
          (!hasFile ? "No file specified in folder" : ""))))
        }
      />
    </div>
  );
};

export default CodingForm;
