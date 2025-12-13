import React from 'react';

interface CapabilitySelectorProps {
  availableCapabilities: string[];
  selectedCapabilities: string[];
  onChange: (selected: string[]) => void;
}

export const CapabilitySelector: React.FC<CapabilitySelectorProps> = ({
  availableCapabilities,
  selectedCapabilities,
  onChange,
}) => {
  const handleToggle = (cap: string) => {
    if (selectedCapabilities.includes(cap)) {
      onChange(selectedCapabilities.filter((c) => c !== cap));
    } else {
      onChange([...selectedCapabilities, cap]);
    }
  };

  return (
    <div className="mt-4 p-5 bg-slate-50/50 rounded-xl border border-slate-100">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
        Select Capabilities (Max 3)
      </p>
      <div className="flex flex-wrap gap-2">
        {availableCapabilities.map((cap) => {
          const isSelected = selectedCapabilities.includes(cap);
          return (
            <button
              key={cap}
              type="button"
              onClick={() => handleToggle(cap)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all duration-200 font-medium ${
                isSelected
                  ? 'bg-primary text-white border-primary shadow-sm shadow-primary/20'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-primary/30 hover:text-primary hover:shadow-sm'
              }`}
            >
              {cap}
            </button>
          );
        })}
      </div>
    </div>
  );
};