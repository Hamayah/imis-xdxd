import React, { useState } from 'react';

interface MetaPanelProps {
  roomId: string;
  extraInfo: Record<string, any>;
}

const MetaPanel: React.FC<MetaPanelProps> = ({ roomId, extraInfo }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-4">
      <div className="flex items-center justify-between mb-2">
        <div className="font-semibold text-gray-800">Room ID: <span className="font-mono text-sm">{roomId}</span></div>
        <button
          className="text-xs text-blue-600 hover:underline focus:outline-none focus:ring-2 focus:ring-blue-400 rounded px-2 py-1"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="extra-info-json"
        >
          {open ? 'Hide' : 'Show'} extra info
        </button>
      </div>
      {open && (
        <pre
          id="extra-info-json"
          className="bg-gray-50 rounded p-2 text-xs border text-gray-700 max-w-screen-md whitespace-pre-wrap break-words"
          style={{ wordBreak: 'break-word', maxWidth: '100vw' }}
          tabIndex={0}
        >
          {JSON.stringify(extraInfo, null, 2)}
        </pre>
      )}
    </div>
  );
};

export default MetaPanel; 