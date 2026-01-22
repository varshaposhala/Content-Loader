import React, { useState, useEffect, useRef } from 'react';
import JSZip from 'jszip';
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
  const [zipFile, setZipFile] = useState<File | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{ success: boolean; message: string } | null>(null);
  
  const [url, setUrl] = useState('');
  const [isJsonConverted, setIsJsonConverted] = useState(false);
  const [score, setScore] = useState(1);
  const [hasClickedUpload, setHasClickedUpload] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [payload, setPayload] = useState<CodingPayload>({
    input_dir_path_url: '',
    is_json_converted: false
  });

  const isProd = environment === AppEnvironment.PROD;
  const currentUploadUrl = URLS[environment];

  // Step 1 Logic: ZIP Verification
  const handleZipSelection = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setZipFile(file);
    setIsVerifying(true);
    setVerificationResult(null);

    try {
      const zip = new JSZip();
      const content = await zip.loadAsync(file);
      const filePaths = Object.keys(content.files);
      
      let isValid = false;
      let detectedType = "";

      if (type === ContentType.CODING_QUESTIONS) {
        // Robust check for Coding Questions:
        // 1. Check for Folder "Coding Questions"
        const hasFolder = filePaths.some(path => 
          path === "Coding Questions/" || 
          path.startsWith("Coding Questions/")
        );
        
        // 2. Check for File "coding_questions" (not a directory)
        const hasFile = filePaths.some(path => 
          path === "coding_questions" && !content.files[path].dir
        );

        isValid = hasFolder || hasFile;
        detectedType = hasFolder ? 'Folder ("Coding Questions")' : 'File ("coding_questions")';
      } else {
        // Standard check for Code Analysis
        isValid = filePaths.some(path => {
          const lowerPath = path.toLowerCase();
          return lowerPath.includes("code analysis mcqs") || lowerPath.includes("code_analysis_mcqs");
        });
        detectedType = "Code Analysis MCQs Structure";
      }

      if (isValid) {
        setVerificationResult({
          success: true,
          message: `Success! Valid structure detected: ${detectedType}.`
        });
      } else {
        const errorMsg = type === ContentType.CODING_QUESTIONS 
          ? 'Error: ZIP must contain folder "Coding Questions" or file "coding_questions".'
          : 'Error: ZIP must contain "Code Analysis MCQs" folder or file.';
        setVerificationResult({
          success: false,
          message: errorMsg
        });
      }
    } catch (err) {
      setVerificationResult({
        success: false,
        message: "Failed to read ZIP file. Ensure it's a valid archive."
      });
    } finally {
      setIsVerifying(false);
    }
  };
  
  // Validation Logic for Step 3 - Simple URL check as requested
  const isUrlFormatValid = url.trim().startsWith('http');

  const step1Complete = verificationResult?.success === true;
  const step2Complete = step1Complete && hasClickedUpload;
  const step3Complete = step2Complete && isUrlFormatValid;

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

  const verifyByRedirection = () => {
    if (url.trim()) {
      window.open(url.trim(), '_blank');
    }
  };

  const getUrlErrorMessage = () => {
    if (!step2Complete) return "";
    if (!url.trim()) return "⚠️ Please paste the link obtained after uploading.";
    if (!isUrlFormatValid) return "⚠️ URL must start with http:// or https://";
    return "";
  };

  return (
    <div className="space-y-6">
      <div className="border-b border-slate-100 pb-4">
        <h2 className="text-xl font-bold text-slate-800">
          {type === ContentType.CODE_ANALYSIS ? 'Code Analysis' : 'Coding Question'} Configuration
        </h2>
        <p className="text-slate-500 text-sm">Follow the mandatory verification flow for <strong>{environment}</strong>.</p>
      </div>

      <div className="space-y-6">
        {/* Step 1: ZIP Verification */}
        <div className={`p-5 rounded-xl border transition-all ${accentBgClass} ${step1Complete ? 'ring-2 ring-emerald-500 border-emerald-200' : ''}`}>
          <div className="flex items-start space-x-4">
            <div className={`${step1Complete ? 'bg-emerald-500' : accentCircleClass} text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 shadow-sm`}>
              {step1Complete ? '✓' : '1'}
            </div>
            <div className="flex-grow space-y-3">
              <div>
                <label className="block text-sm font-bold text-slate-800">Verify ZIP Locally</label>
                {type === ContentType.CODING_QUESTIONS ? (
                   <p className="text-xs text-slate-600 italic">Expecting: Folder "Coding Questions" OR File "coding_questions"</p>
                ) : (
                   <p className="text-xs text-slate-600 italic">Expecting: "Code Analysis MCQs" content</p>
                )}
              </div>
              
              <div className="flex items-center space-x-3">
                <input 
                  type="file" 
                  accept=".zip" 
                  className="hidden" 
                  ref={fileInputRef}
                  onChange={handleZipSelection}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className={`px-4 py-2 bg-white border rounded-lg text-sm font-bold shadow-sm transition-all hover:border-slate-400 active:scale-95 flex items-center space-x-2 ${isVerifying ? 'opacity-50 pointer-events-none' : ''}`}
                >
                  <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>{zipFile ? zipFile.name : 'Select ZIP File'}</span>
                </button>
                {isVerifying && <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>}
              </div>

              {verificationResult && (
                <div className={`text-xs font-bold px-3 py-2 rounded-lg flex items-center space-x-2 ${verificationResult.success ? 'bg-emerald-100 text-emerald-700 shadow-sm' : 'bg-rose-100 text-rose-700 shadow-sm'}`}>
                   {verificationResult.success ? (
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
                   ) : (
                     <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                   )}
                  <span>{verificationResult.message}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Step 2: External Upload */}
        <div className={`flex items-start space-x-4 transition-all duration-300 ${step1Complete ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
          <div className={`${step2Complete ? 'bg-emerald-500' : accentCircleClass} text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 shadow-sm`}>
            {step2Complete ? '✓' : '2'}
          </div>
          <div className="flex-grow">
            <label className="block text-sm font-bold text-slate-800 mb-1">Upload File to Admin</label>
            <p className="text-xs text-slate-600 mb-3">Upload your verified ZIP to the NxtWave portal.</p>
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

        {/* Step 3: Input URL */}
        <div className={`flex items-start space-x-4 transition-all duration-300 ${step2Complete ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
          <div className={`${step3Complete ? 'bg-emerald-500' : accentCircleClass} text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 shadow-sm`}>
            {step3Complete ? '✓' : '3'}
          </div>
          <div className="flex-grow space-y-3">
            <div className="flex justify-between items-center">
              <label className="block text-sm font-bold text-slate-800">Paste Input Directory URL</label>
              <button 
                onClick={verifyByRedirection}
                disabled={!url.trim()}
                className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded transition-colors ${url.trim() ? 'text-indigo-600 bg-indigo-50 hover:bg-indigo-100' : 'text-slate-300 cursor-not-allowed'}`}
              >
                Redirect to Verify ↗
              </button>
            </div>
            <textarea
              className={`w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 outline-none transition-all font-mono text-sm min-h-[80px] ${accentRingClass}`}
              placeholder="Example: https://storage.googleapis.com/.../coding_questions"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            {getUrlErrorMessage() && (
               <p className="text-xs text-rose-500 font-medium animate-pulse">{getUrlErrorMessage()}</p>
            )}
          </div>
        </div>

        {/* Step 4: Config */}
        <div className={`flex items-start space-x-4 transition-all duration-300 ${step3Complete ? 'opacity-100' : 'opacity-40 grayscale pointer-events-none'}`}>
          <div className={`${accentCircleClass} text-white w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-sm font-bold mt-0.5 shadow-sm`}>4</div>
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
                <input
                  type="number"
                  min="0"
                  className={`w-20 px-3 py-1.5 rounded-lg border border-slate-300 focus:ring-2 outline-none text-center font-bold text-slate-800 ${accentRingClass}`}
                  value={score}
                  onChange={(e) => setScore(Number(e.target.value))}
                />
              </div>
            )}
          </div>
        </div>
      </div>

      <JSONDisplay 
        data={payload} 
        environment={environment} 
        isValid={step3Complete}
        errorMessage={
          !step1Complete ? "ZIP verification pending" :
          !step2Complete ? "Upload step not initiated" :
          (!url.trim() ? "URL is missing" : 
          (!isUrlFormatValid ? "URL format is invalid" : ""))
        }
      />
    </div>
  );
};

export default CodingForm;
