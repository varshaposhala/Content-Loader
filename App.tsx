
import React, { useState } from 'react';
import { ContentType, AppEnvironment } from './types';
import MCQForm from './components/MCQForm';
import CodingForm from './components/CodingForm';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ContentType>(ContentType.MCQ);
  const [environment, setEnvironment] = useState<AppEnvironment>(AppEnvironment.PROD);

  const isProd = environment === AppEnvironment.PROD;
  const themeClass = isProd ? 'bg-indigo-700' : 'bg-amber-600';
  const sidebarActiveClass = isProd ? 'bg-indigo-100 text-indigo-700' : 'bg-amber-100 text-amber-700';
  const accentTextClass = isProd ? 'text-indigo-700' : 'text-amber-700';

  const formKey = `${environment}-${activeTab}`;

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-300">
      <header className={`${themeClass} text-white shadow-lg sticky top-0 z-50 transition-colors duration-500`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-white p-2 rounded-lg shadow-sm">
              <svg className={`w-6 h-6 ${accentTextClass}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight leading-tight">Content Loader</h1>
              <p className="text-[10px] uppercase tracking-widest opacity-80 font-bold">NxtWave Assessment Tools</p>
            </div>
          </div>

          <div className="flex items-center bg-black/20 p-1 rounded-xl backdrop-blur-sm border border-white/10">
            <button
              onClick={() => setEnvironment(AppEnvironment.PROD)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                isProd ? 'bg-white text-indigo-700 shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              PROD
            </button>
            <button
              onClick={() => setEnvironment(AppEnvironment.BETA)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                !isProd ? 'bg-white text-amber-700 shadow-sm' : 'text-white/70 hover:text-white'
              }`}
            >
              BETA
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 w-full">
        <div className="flex flex-col md:flex-row gap-8">
          <aside className="w-full md:w-64 flex-shrink-0">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveTab(ContentType.MCQ)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === ContentType.MCQ
                    ? sidebarActiveClass
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <span>MCQ Loading</span>
              </button>

              <button
                onClick={() => setActiveTab(ContentType.CODE_ANALYSIS)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === ContentType.CODE_ANALYSIS
                    ? sidebarActiveClass
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                </svg>
                <span>Code Analysis</span>
              </button>

              <button
                onClick={() => setActiveTab(ContentType.CODING_QUESTIONS)}
                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  activeTab === ContentType.CODING_QUESTIONS
                    ? sidebarActiveClass
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                <span>Coding Questions</span>
              </button>
            </nav>
            
            <div className={`mt-8 p-4 rounded-xl border ${isProd ? 'border-indigo-100 bg-indigo-50/50' : 'border-amber-100 bg-amber-50/50'}`}>
              <h4 className={`text-xs font-bold uppercase tracking-widest mb-2 ${accentTextClass}`}>Active Environment</h4>
              <p className="text-sm text-slate-600 font-medium">
                You are currently loading content into <strong className={accentTextClass}>{environment}</strong>.
              </p>
            </div>
          </aside>

          <div className="flex-grow">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className="p-6">
                {activeTab === ContentType.MCQ ? (
                  <MCQForm key={formKey} environment={environment} />
                ) : (
                  <CodingForm key={formKey} type={activeTab} environment={environment} />
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-slate-200 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          &copy; {new Date().getFullYear()} NxtWave Assessments Tooling
        </div>
      </footer>
    </div>
  );
};

export default App;
