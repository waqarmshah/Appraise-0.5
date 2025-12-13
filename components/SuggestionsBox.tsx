import React, { useState } from 'react';

interface SuggestionsBoxProps {
  questions: string[];
  onApply: (qaText: string) => void;
  onCancel: () => void;
}

export const SuggestionsBox: React.FC<SuggestionsBoxProps> = ({ questions, onApply, onCancel }) => {
  const [answers, setAnswers] = useState<Record<number, string>>({});

  const handleApply = () => {
    const parts = questions.map((q, i) => {
      const ans = answers[i]?.trim();
      if (!ans) return null;
      return `\n\n> AI Question: ${q}\n> My Answer: ${ans}`;
    }).filter(Boolean);

    if (parts.length === 0) {
      onCancel();
      return;
    }
    
    onApply(parts.join(''));
  };

  return (
    <div className="bg-amber-50/50 rounded-xl border border-amber-100/60 p-5 mb-2 animate-fade-in shadow-sm shadow-amber-500/5">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-xs font-bold text-amber-800 uppercase tracking-wide flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          AI Suggestions
        </h3>
        <button onClick={onCancel} className="text-amber-700 hover:text-amber-900 bg-amber-100/50 hover:bg-amber-100 rounded-md p-1 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3.5 h-3.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <p className="text-xs text-amber-700/80 mb-5 leading-relaxed">
        I've analyzed your note and found a few gaps. Answering these will improve the reflection quality.
      </p>
      <div className="space-y-4">
        {questions.map((q, i) => (
          <div key={i}>
            <p className="text-sm font-medium text-amber-900 mb-1.5">{q}</p>
            <input 
              type="text" 
              className="w-full text-sm p-3 rounded-lg border border-amber-200 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/10 outline-none !text-slate-800 !bg-white placeholder:text-amber-200/50 transition-all shadow-sm"
              placeholder="Type your answer here..."
              value={answers[i] || ''}
              onChange={e => setAnswers({...answers, [i]: e.target.value})}
            />
          </div>
        ))}
      </div>
      <div className="mt-5 flex gap-2">
        <button 
          onClick={handleApply}
          className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold py-2.5 px-5 rounded-lg transition-colors shadow-sm shadow-amber-500/20"
        >
          Add Answers to Note
        </button>
      </div>
    </div>
  )
}