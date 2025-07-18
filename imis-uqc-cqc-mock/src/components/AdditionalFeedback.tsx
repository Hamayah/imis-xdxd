import React from 'react';

const MAX_LEN = 300;

const AdditionalFeedback: React.FC<{
  value: string;
  onChange: (v: string) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-4">
      <label htmlFor="feedback-textarea" className="block font-semibold mb-2">Additional Feedback <span className="text-gray-400 font-normal">(optional)</span></label>
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