import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { AppraisalOutput } from '../types';

interface OutputDisplayProps {
  content: AppraisalOutput;
}

interface OutputCardProps {
  title: string;
  content: string;
  className?: string;
}

const OutputCard: React.FC<OutputCardProps> = ({ title, content, className = "" }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`bg-white rounded-xl shadow-[0_2px_12px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden flex flex-col group transition-all duration-300 hover:shadow-md ${className}`}>
      <div className="bg-slate-50/30 border-b border-slate-50 px-5 py-3 flex justify-between items-center">
        <h3 className="font-medium text-slate-500 text-xs uppercase tracking-widest">{title}</h3>
        <button
          onClick={handleCopy}
          className={`text-xs px-2.5 py-1 rounded-md font-medium transition-colors duration-200 flex items-center gap-1.5 opacity-0 group-hover:opacity-100 ${
            copied
              ? 'bg-emerald-50 text-emerald-600 opacity-100'
              : 'bg-white border border-slate-200 text-slate-500 hover:text-primary hover:border-primary/20'
          }`}
        >
          {copied ? (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" />
              </svg>
              Copied
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
              </svg>
              Copy
            </>
          )}
        </button>
      </div>
      <div className="p-5 overflow-y-auto prose prose-sm prose-slate max-w-none text-slate-700 leading-relaxed">
        <ReactMarkdown>{content}</ReactMarkdown>
      </div>
    </div>
  );
};

export const OutputDisplay: React.FC<OutputDisplayProps> = ({ content }) => {
  return (
    <div className="grid grid-cols-1 gap-5 h-full animate-fade-in-up content-start pb-10">
      <OutputCard 
        title="Summary" 
        content={content.summary} 
        className=""
      />
      <OutputCard 
        title="Linked Capabilities" 
        content={content.capabilities} 
        className=""
      />
      <OutputCard 
        title="Reflection" 
        content={content.reflection} 
        className=""
      />
      <OutputCard 
        title="Actions & PDP" 
        content={content.learningGoals} 
        className=""
      />
    </div>
  );
};