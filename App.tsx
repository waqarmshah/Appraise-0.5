import React, { useState, useMemo } from 'react';
import { AppMode, AppraisalOutput } from './types';
import { GP_CAPABILITIES, HOSPITAL_CAPABILITIES } from './constants';
import { generateAppraisalContent, generateSuggestions } from './services/geminiService';
import { calculateTopCapabilities } from './utils/scoring';
import { CapabilitySelector } from './components/CapabilitySelector';
import { OutputDisplay } from './components/OutputDisplay';
import { SuggestionsBox } from './components/SuggestionsBox';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.GP);
  const [note, setNote] = useState('');
  const [isAuto, setIsAuto] = useState(true);
  const [selectedCapabilities, setSelectedCapabilities] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Suggestions State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const [output, setOutput] = useState<AppraisalOutput | null>(null);
  const [showSubscription, setShowSubscription] = useState(false);

  const activeCapabilities = useMemo(() => {
    return mode === AppMode.GP ? GP_CAPABILITIES : HOSPITAL_CAPABILITIES;
  }, [mode]);

  const handleAnalyze = async () => {
    if (!note.trim()) return;
    setIsAnalyzing(true);
    const questions = await generateSuggestions(mode, note);
    setSuggestions(questions);
    setIsAnalyzing(false);
  };

  const handleApplySuggestions = (addedText: string) => {
    setNote(prev => prev + addedText);
    setSuggestions([]);
  };

  const handleGenerate = async () => {
    if (!note.trim()) return;
    
    setIsGenerating(true);
    
    // Phase 1 Logic: Keyword Scoring
    let finalSelection: string[] | "AUTO" = "AUTO";

    if (isAuto) {
      // Execute local keyword scoring first
      const scoredCaps = calculateTopCapabilities(note, activeCapabilities);
      // If we got matches, use them. If we got "AUTO" (score 0), keep as "AUTO".
      if (scoredCaps.length > 0 && scoredCaps[0] !== "AUTO") {
        finalSelection = scoredCaps;
      } else {
        finalSelection = "AUTO";
      }
    } else {
      finalSelection = selectedCapabilities;
    }

    const result = await generateAppraisalContent(
      mode,
      activeCapabilities,
      finalSelection,
      note
    );

    setOutput(result);
    setIsGenerating(false);
  };

  const registerInterest = () => {
    // In a real app, this would send an email/API call
    alert("Thanks! You've registered interest for the Pro tier.");
    setShowSubscription(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#fcfdfd]">
      {/* Navbar - Minimal & Premium */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-semibold text-lg shadow-sm shadow-primary/20">
              A
            </div>
            <h1 className="text-xl font-semibold text-slate-800 tracking-tight">Appraise</h1>
          </div>
          
          {/* Refined Toggle */}
          <div className="bg-slate-100 p-1 rounded-full flex relative w-[180px] h-9 shadow-inner">
            <div 
              className={`absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white rounded-full shadow-sm transition-all duration-300 cubic-bezier(0.4, 0, 0.2, 1) ${mode === AppMode.HOSPITAL ? 'translate-x-full left-1' : 'left-1 translate-x-0'}`}
            ></div>
            <button 
              onClick={() => {
                setMode(AppMode.GP);
                setSelectedCapabilities([]);
                setSuggestions([]);
              }}
              className={`relative z-10 w-1/2 flex items-center justify-center text-xs font-medium rounded-full transition-colors duration-200 ${mode === AppMode.GP ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              GP
            </button>
            <button 
              onClick={() => {
                setMode(AppMode.HOSPITAL);
                setSelectedCapabilities([]);
                setSuggestions([]);
              }}
              className={`relative z-10 w-1/2 flex items-center justify-center text-xs font-medium rounded-full transition-colors duration-200 ${mode === AppMode.HOSPITAL ? 'text-primary' : 'text-slate-500 hover:text-slate-700'}`}
            >
              Hospital
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 w-full max-w-6xl mx-auto p-6 md:p-10 grid gap-10 lg:grid-cols-2">
        
        {/* Left Column: Input */}
        <div className="flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 md:p-8 transition-shadow hover:shadow-md duration-500">
            <label htmlFor="note-input" className="block text-sm font-medium text-slate-700 mb-3 pl-1">
              Clinical Note / Reflection
            </label>
            <textarea
              id="note-input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="E.g., Discussed DNACPR with family of 85F admitted with aspiration pneumonia..."
              className="w-full h-64 p-4 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:border-primary/50 focus:ring-4 focus:ring-primary/5 outline-none transition-all resize-none !text-slate-800 placeholder:text-slate-400 text-sm leading-relaxed"
            />
            
            <div className="mt-4 flex justify-end">
               {suggestions.length === 0 && (
                <button 
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !note.trim()}
                  className="text-xs font-medium text-primary/90 hover:text-primary flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors py-1 px-2 rounded hover:bg-primary/5"
                >
                  {isAnalyzing ? (
                     <span className="flex items-center gap-1">Analyzing...</span>
                  ) : (
                    <>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3.5 h-3.5">
                        <path d="M15.98 1.804a1 1 0 00-1.96 0l-.24 1.192a1 1 0 01-.784.785l-1.192.238a1 1 0 000 1.96l1.192.238a1 1 0 01.785.785l.238 1.192a1 1 0 001.96 0l.238-1.192a1 1 0 01.785-.785l1.192-.238a1 1 0 000-1.96l-1.192-.238a1 1 0 01-.785-.785l-.238-1.192zM6.949 5.684a1 1 0 00-1.898 0l-.683 3.418a1 1 0 01-.797.797l-3.418.683a1 1 0 000 1.898l3.418.683a1 1 0 01.797.797l.683 3.418a1 1 0 001.898 0l.683-3.418a1 1 0 01.797-.797l3.418-.683a1 1 0 000-1.898l-3.418-.683a1 1 0 01-.797-.797l-.683-3.418zM16.5 13a.5.5 0 01.5.5v.5h.5a.5.5 0 010 1h-.5v.5a.5.5 0 01-1 0v-.5h-.5a.5.5 0 010-1h.5v-.5a.5.5 0 01.5-.5z" />
                      </svg>
                      Get AI Suggestions
                    </>
                  )}
                </button>
               )}
            </div>

            {suggestions.length > 0 && (
              <div className="mt-4">
                <SuggestionsBox 
                  questions={suggestions} 
                  onApply={handleApplySuggestions}
                  onCancel={() => setSuggestions([])}
                />
              </div>
            )}

            <div className="mt-6 flex flex-col gap-5">
              <label className="flex items-center gap-3 cursor-pointer group select-none">
                <div className="relative flex items-center">
                  <input 
                    type="checkbox" 
                    checked={isAuto} 
                    onChange={(e) => setIsAuto(e.target.checked)}
                    className="peer sr-only" 
                  />
                  <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-focus:ring-2 peer-focus:ring-primary/20 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                </div>
                <span className="text-sm font-medium text-slate-600 group-hover:text-slate-800 transition-colors">
                  Auto-link 3 capabilities
                </span>
              </label>

              {!isAuto && (
                <div className="animate-fade-in">
                  <CapabilitySelector 
                    availableCapabilities={activeCapabilities}
                    selectedCapabilities={selectedCapabilities}
                    onChange={setSelectedCapabilities}
                  />
                </div>
              )}

              <button
                onClick={handleGenerate}
                disabled={isGenerating || !note.trim()}
                className="mt-2 w-full bg-primary hover:bg-[#356962] text-white font-medium py-3.5 px-6 rounded-xl shadow-sm hover:shadow-md active:scale-[0.99] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white/90" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </>
                ) : (
                  'Generate Appraisal'
                )}
              </button>
            </div>
          </div>

          {/* Pro Card - Subtle & Bottom */}
          <div className="bg-slate-800 rounded-xl p-5 text-white shadow-lg shadow-slate-200/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                 <h3 className="font-semibold text-base">Appraise Pro</h3>
                 <span className="bg-amber-400 text-slate-900 text-[10px] font-bold px-1.5 py-0.5 rounded tracking-wide uppercase">Coming Soon</span>
              </div>
              <p className="text-slate-400 text-xs">Save notes, log history, and access advanced reasoning.</p>
            </div>
            <div className="flex items-center gap-3">
               <span className="text-sm font-medium">£10<span className="text-slate-400 font-normal">/mo</span></span>
               <button 
                onClick={() => setShowSubscription(true)}
                className="bg-white/10 hover:bg-white/15 text-white text-xs font-medium py-2 px-4 rounded-lg transition-colors border border-white/5 whitespace-nowrap"
               >
                Register Interest
               </button>
            </div>
          </div>
        </div>

        {/* Right Column: Output or Ghost State */}
        <div className="h-full min-h-[600px]">
          {output ? (
            <div className="h-full">
              <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold mb-3 text-center md:text-right px-2">
                AI-assisted draft — review before submission
              </p>
              <OutputDisplay content={output} />
            </div>
          ) : (
            /* Premium Ghost State */
            <div className="h-full rounded-2xl bg-gradient-to-br from-white to-slate-50/50 border border-slate-100 p-8 shadow-sm relative overflow-hidden flex flex-col gap-10 opacity-70">
               {/* Decorative soft gradient blob */}
               <div className="absolute top-0 right-0 w-64 h-64 bg-teal-50/50 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>

               {/* Skeleton Item 1 */}
               <div className="relative">
                  <div className="h-4 w-32 bg-slate-200/70 rounded mb-4"></div>
                  <div className="space-y-2.5">
                    <div className="h-2.5 w-full bg-slate-100 rounded"></div>
                    <div className="h-2.5 w-[92%] bg-slate-100 rounded"></div>
                    <div className="h-2.5 w-[60%] bg-slate-100 rounded"></div>
                  </div>
               </div>

               {/* Skeleton Item 2 */}
               <div className="relative">
                  <div className="h-4 w-24 bg-slate-200/70 rounded mb-4"></div>
                  <div className="space-y-2.5">
                    <div className="h-2.5 w-full bg-slate-100 rounded"></div>
                    <div className="h-2.5 w-[98%] bg-slate-100 rounded"></div>
                    <div className="h-2.5 w-[95%] bg-slate-100 rounded"></div>
                    <div className="h-2.5 w-[80%] bg-slate-100 rounded"></div>
                  </div>
               </div>

               {/* Skeleton Item 3 */}
               <div className="relative">
                  <div className="h-4 w-36 bg-slate-200/70 rounded mb-4"></div>
                  <div className="space-y-2.5">
                    <div className="h-2.5 w-[70%] bg-slate-100 rounded"></div>
                    <div className="h-2.5 w-[65%] bg-slate-100 rounded"></div>
                    <div className="h-2.5 w-[75%] bg-slate-100 rounded"></div>
                  </div>
               </div>
               
               {/* Skeleton Item 4 */}
               <div className="relative">
                  <div className="h-4 w-28 bg-slate-200/70 rounded mb-4"></div>
                  <div className="space-y-2.5">
                    <div className="h-2.5 w-[90%] bg-slate-100 rounded"></div>
                    <div className="h-2.5 w-[85%] bg-slate-100 rounded"></div>
                  </div>
               </div>

            </div>
          )}
        </div>
      </main>

      {/* Subscription Modal */}
      {showSubscription && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm transition-opacity">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-100 max-w-sm w-full p-6 animate-fade-in-up">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Join the Waitlist</h3>
            <p className="text-slate-600 text-sm mb-6 leading-relaxed">
              Appraise Pro will offer a personal logbook, saved history, and our most powerful medical reasoning model for £10/month.
            </p>
            <div className="flex gap-3">
              <button 
                onClick={() => setShowSubscription(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-600 font-medium text-sm hover:bg-slate-50 transition-colors"
              >
                Close
              </button>
              <button 
                onClick={registerInterest}
                className="flex-1 py-2.5 px-4 rounded-xl bg-primary text-white font-medium text-sm hover:bg-secondary transition-colors shadow-lg shadow-primary/20"
              >
                I'm Interested
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;