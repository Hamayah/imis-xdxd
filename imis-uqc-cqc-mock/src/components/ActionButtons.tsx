import React from 'react';

const ActionButtons: React.FC<{
  disabled: boolean;
  onCancel: () => void;
  onSubmit: () => void;
  loading?: boolean;
}> = ({ disabled, onCancel, onSubmit, loading }) => {
  return (
    <div className="flex gap-2 mt-4">
      <button
        type="button"
        className="px-4 py-2 rounded-md border bg-gray-100 hover:bg-gray-200 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400"
        onClick={onCancel}
        disabled={loading}
      >
        Previous
      </button>
      <button
        type="button"
        className={`px-4 py-2 rounded-md border bg-blue-600 text-white font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center gap-2 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
        onClick={onSubmit}
        disabled={disabled || loading}
      >
        {loading && <span className="w-4 h-4 border-2 border-white border-t-blue-400 rounded-full animate-spin inline-block" />}
        Next
      </button>
    </div>
  );
};

export default ActionButtons; 