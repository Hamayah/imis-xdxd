import React from 'react';

const MAX_LEN = 300;

const AdditionalFeedback: React.FC<{
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
  flagged: boolean;
  onFlaggedChange: (flagged: boolean) => void;
}> = ({ value, onChange, disabled, flagged, onFlaggedChange }) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <label htmlFor="feedback-textarea" className="block font-semibold">Additional Feedback <span className="text-gray-400 font-normal">(optional)</span></label>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={flagged}
            onChange={e => onFlaggedChange(e.target.checked)}
            disabled={disabled}
            className="accent-orange-500 focus:ring-2 focus:ring-orange-400"
          />
          <span className="text-sm font-medium text-orange-600">Flag for meeting</span>
        </label>
      </div>
      <textarea
        id="feedback-textarea"
        className="w-full border rounded px-2 py-1 min-h-[64px] text-sm focus:ring-2 focus:ring-blue-400 resize-vertical"
        maxLength={MAX_LEN}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        aria-describedby="feedback-help"
      />
      <div className="flex justify-between items-center mt-1 text-xs text-gray-500">
        <span id="feedback-help">Max {MAX_LEN} chars</span>
        <span>{value.length} / {MAX_LEN}</span>
      </div>
    </div>
  );
};

export default AdditionalFeedback; 