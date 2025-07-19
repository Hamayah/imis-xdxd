import React from 'react';
import type { UQCValues, UQCRatingResult } from '../mockData';

const UQC_FIELDS = [
  {
    id: 'v_clarity',
    label: 'Visual clarity',
    good: 'clear / not laggy',
    bad: 'static / laggy / frozen',
    required: true,
  },
  {
    id: 'a_clarity',
    label: 'Audio clarity',
    good: 'clear',
    bad: 'laggy / distorted / unclear / heavy background noise',
    required: true,
  },
  {
    id: 'v_complete',
    label: 'Video completeness',
    good: 'key moment fully captured',
    bad: 'missing start or cut-off before reaction',
    required: true,
  },
  {
    id: 'first3',
    label: 'Exciting first 3s',
    good: 'something engaging in first 3s',
    bad: 'nothing happens first 3s',
    required: true,
  },
];

function isUQCComplete(v: UQCValues) {
  return (
    v.v_clarity && v.a_clarity && v.v_complete && v.first3
  );
}

function scoreUQC(v: UQCValues): UQCRatingResult {
  let score = 0;
  score += v.v_clarity === 'good' ? 1 : 0;
  score += v.a_clarity === 'good' ? 1 : 0;
  score += v.v_complete === 'good' ? 1 : 0;
  score += v.first3 === 'good' ? 1 : 0;
  if (v.ansa) score = Math.max(score - 1, 0);
  let rating: UQCRatingResult['rating'] = 'Bad';
  if (v.ansa) {
    rating = 'Bad';
  } else if (score === 4) {
    rating = 'Good';
  } else if (score === 3 || score === 2) {
    rating = 'OK';
  } else {
    rating = 'Bad';
  }
  return { score, rating };
}

const UQCForm: React.FC<{
  value: UQCValues;
  onChange: (v: UQCValues) => void;
  disabled?: boolean;
}> = ({ value, onChange, disabled }) => {
  const complete = isUQCComplete(value);
  const rating = complete ? scoreUQC(value) : null;
  return (
    <div className="bg-white rounded-md shadow-sm p-4 mb-4">
      <div className="font-semibold mb-2">Unified Quality Control (UQC) <span className="text-red-500">*</span></div>
      <div className="divide-y">
        {UQC_FIELDS.map((f) => (
          <div key={f.id} className="py-2 grid grid-cols-[auto_1fr_auto] items-center gap-2 group">
            <label className="font-medium" htmlFor={`uqc-${f.id}`}>{f.label}</label>
            <div className="flex gap-4">
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name={f.id}
                  id={`uqc-${f.id}-good`}
                  value="good"
                  checked={value[f.id as keyof UQCValues] === 'good'}
                  onChange={() => onChange({ ...value, [f.id]: 'good' })}
                  disabled={disabled}
                  className="accent-green-500 focus:ring-2 focus:ring-green-400"
                  aria-describedby={`uqc-${f.id}-desc`}
                />
                <span>Good</span>
              </label>
              <label className="inline-flex items-center gap-1 cursor-pointer">
                <input
                  type="radio"
                  name={f.id}
                  id={`uqc-${f.id}-bad`}
                  value="bad"
                  checked={value[f.id as keyof UQCValues] === 'bad'}
                  onChange={() => onChange({ ...value, [f.id]: 'bad' })}
                  disabled={disabled}
                  className="accent-red-500 focus:ring-2 focus:ring-red-400"
                  aria-describedby={`uqc-${f.id}-desc`}
                />
                <span>Bad</span>
              </label>
            </div>
            <div className="flex items-center gap-1">
              {value[f.id as keyof UQCValues] === 'good' && <span className="text-green-500" aria-label="Good">✓</span>}
              {value[f.id as keyof UQCValues] === 'bad' && <span className="text-red-500" aria-label="Bad">✕</span>}
              <span className="ml-1 text-xs text-gray-400 group-hover:block hidden" tabIndex={0} title={`Good: ${f.good}\nBad: ${f.bad}`}>?</span>
            </div>
            <div className="col-span-3 text-xs text-gray-500 mt-1" id={`uqc-${f.id}-desc`}>
              <span className="font-semibold">Good:</span> {f.good} <span className="ml-2 font-semibold">Bad:</span> {f.bad}
            </div>
          </div>
        ))}
        {/* ANSA row */}
        <div className="py-2 grid grid-cols-[auto_1fr_auto] items-center gap-2 group">
          <label className="font-medium" htmlFor="uqc-ansa">ANSA / Excessive profanity present?</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-1 cursor-pointer">
              <input
                type="checkbox"
                id="uqc-ansa"
                checked={value.ansa}
                onChange={e => onChange({ ...value, ansa: e.target.checked })}
                disabled={disabled}
                className="accent-red-500 focus:ring-2 focus:ring-red-400"
                aria-describedby="uqc-ansa-desc"
              />
              <span>Yes</span>
            </label>
          </div>
          <div className="flex items-center gap-1">
            {value.ansa && <span className="text-red-500" aria-label="Issue">!</span>}
          </div>
          <div className="col-span-3 text-xs text-gray-500 mt-1" id="uqc-ansa-desc">
            <span className="font-semibold">Default:</span> no issue. <span className="ml-2 font-semibold">Checked:</span> issue present (instantly bad case)
          </div>
        </div>
      </div>
      {complete && rating && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${rating.rating === 'Good' ? 'bg-green-100 text-green-600' : rating.rating === 'OK' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}
            title={`${rating.score} / 4 → ${rating.rating}`}
            tabIndex={0}
          >
            {rating.rating}
          </span>
          <span className="text-xs text-gray-500">UQC rating</span>
        </div>
      )}
    </div>
  );
};

export { isUQCComplete, scoreUQC };
export default UQCForm; 