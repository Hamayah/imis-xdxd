import React, { useState } from 'react';

const SummaryPanel: React.FC<{ payload: any }> = ({ payload }) => {
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(JSON.stringify(payload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-800">Submission Preview</div>
        <div className="flex gap-2 items-center">
          <button
            className="text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
            onClick={() => setOpen(v => !v)}
            aria-expanded={open}
            aria-controls="summary-json"
          >
            {open ? 'Hide' : 'Show'} JSON
          </button>
          <button
            className="text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
            onClick={handleCopy}
            aria-label="Copy JSON to clipboard"
          >
            {copied ? 'Copied!' : 'Copy JSON'}
          </button>
        </div>
      </div>
      {open ? (
        <pre className="bg-gray-50 rounded p-2 text-xs border text-gray-700 max-w-screen-md whitespace-pre-wrap break-words" style={{ wordBreak: 'break-word', maxWidth: '100vw' }} tabIndex={0} id="summary-json">
          {JSON.stringify(payload, null, 2)}
        </pre>
      ) : (
        <div className="bg-gray-50 rounded p-2 text-xs border text-gray-400 select-none" tabIndex={0} id="summary-json">{'{...}'}</div>
      )}
    </div>
  );
};

export default SummaryPanel; 