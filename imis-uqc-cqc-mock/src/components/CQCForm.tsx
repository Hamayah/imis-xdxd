import React, { useRef, useState } from 'react';
import type { CQCValues, CQCRatingResult } from '../mockData';

const CATEGORY_OPTIONS = [
  'Random Chatting',
  'Dancing',
  'Singing',
  'Gaming',
  'Debating',
  'Gifting',
  'Others',
] as const;

type Category = typeof CATEGORY_OPTIONS[number];

const CQC_FIELDS: Record<Category, { id: string; label: string; help?: string }[]> = {
  'Random Chatting': [
    { id: 'chat_present', label: 'Chatting present?', help: 'Is there actual chatting happening?' },
    { id: 'lang_understandable', label: 'Language understandable?', help: 'If mostly incomprehensible → No' },
    { id: 'content_contextual', label: 'Chat content understandable / contextual?', help: 'Not random noise' },
    { id: 'host_visible', label: 'Host visible in frame?' },
  ],
  'Dancing': [
    { id: 'dance_present', label: 'Dance moment present?' },
    { id: 'synced_music', label: 'Dance well synced w/ music?' },
    { id: 'host_interacts', label: 'Host interacts w/ viewers?', help: 'Acknowledges chat / reacts' },
    { id: 'host_visible', label: 'Host clearly visible full/upper body?' },
  ],
  'Singing': [
    { id: 'singing_present', label: 'Singing present?' },
    { id: 'song_recognizable', label: 'Song recognizable or on-key enough to identify?' },
    { id: 'host_interacts', label: 'Host interacts w/ viewers?' },
    { id: 'host_in_frame', label: 'Host in frame?' },
  ],
  'Gaming': [
    { id: 'game_moment', label: 'Game moment shown?', help: 'Not lobby idle' },
    { id: 'highlight_action', label: 'Highlight-worthy action?', help: 'Kill/clutch/funny/victory' },
    { id: 'no_loading', label: 'No irrelevant loading/static screen?', help: 'Yes ⇒ means clean gameplay' },
    { id: 'host_interacts', label: 'Host interacts w/ chat OR in-game reaction visible?' },
  ],
  'Debating': [
    { id: 'both_sides', label: 'Host presents both sides fairly?', help: 'Or structured POV' },
    { id: 'logical_argument', label: 'Clear logical argument / understandable topic?' },
    { id: 'no_interrupt', label: 'No disruptive interruptions?', help: 'Audio overlap, cross-talk' },
    { id: 'host_visible', label: 'Host visible in frame?' },
  ],
  'Gifting': [
    { id: 'gift_present', label: 'Gift event visible?' },
    { id: 'host_thanked', label: 'Host verbally thanks sender?' },
    { id: 'host_reacted', label: 'Host reaction visible?', help: 'Face/body/emote' },
    { id: 'full_reaction_captured', label: 'Clip captures full reaction sequence?', help: 'Begin gift → show reaction' },
  ],
  'Others': [
    { id: 'key_action', label: 'Key action present?' },
    { id: 'host_visible', label: 'Host visible?' },
    { id: 'understandable', label: 'Action understandable w/o full context?' },
  ],
};

function scoreCQC(_unused: string, answers: boolean[]): CQCRatingResult {
  const possible = answers.length;
  const score = answers.filter(Boolean).length;
  const pct = possible ? score / possible : 0;
  let rating: CQCRatingResult['rating'] = 'Bad';
  if (pct >= 0.75) rating = 'Good';
  else if (pct >= 0.40) rating = 'OK';
  return { score, possible, pct, rating };
}

const CQCForm: React.FC<{
  primaryCategory: Category | '';
  onPrimaryCategoryChange: (cat: Category | '') => void;
  secondaryCategories: Category[];
  onSecondaryCategoriesChange: (cats: Category[]) => void;
  cqcValues: CQCValues;
  onCqcChange: (v: CQCValues) => void;
  disabled?: boolean;
  categoryFreeText: string;
  onCategoryFreeTextChange: (s: string) => void;
}> = ({ primaryCategory, onPrimaryCategoryChange, secondaryCategories, onSecondaryCategoriesChange, cqcValues, onCqcChange, disabled, categoryFreeText, onCategoryFreeTextChange }) => {
  const fields = primaryCategory ? CQC_FIELDS[primaryCategory as Category] : [];
  const answers = fields.map(f => !!cqcValues[f.id]);
  const rating = fields.length ? scoreCQC(primaryCategory, answers) : null;

  // Custom multi-select dropdown for secondary categories
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  React.useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener('mousedown', handleClick);
    } else {
      document.removeEventListener('mousedown', handleClick);
    }
    return () => document.removeEventListener('mousedown', handleClick);
  }, [dropdownOpen]);

  const handleCheckbox = (cat: Category) => {
    if (cat === primaryCategory) return;
    if (secondaryCategories.includes(cat)) {
      onSecondaryCategoriesChange(secondaryCategories.filter(c => c !== cat));
    } else {
      onSecondaryCategoriesChange([...secondaryCategories, cat]);
    }
  };

  return (
    <div className={`bg-white rounded-md shadow-sm p-4 mb-4 ${disabled ? 'opacity-50 pointer-events-none' : ''}`}
      aria-disabled={disabled}
      title={disabled ? 'Complete UQC first' : undefined}
    >
      <div className="font-semibold mb-2">Category Quality Control (CQC) <span className="text-red-500">*</span></div>
      {/* Primary Category */}
      <div className="mb-4">
        <label htmlFor="primary-category-select" className="block text-sm font-medium mb-1">Primary Category (Select best-suited category)</label>
        <select
          id="primary-category-select"
          className="w-full border rounded px-2 py-1 focus:ring-2 focus:ring-blue-400"
          value={primaryCategory}
          onChange={e => onPrimaryCategoryChange(e.target.value as Category)}
          disabled={disabled}
        >
          <option value="">Select primary category...</option>
          {CATEGORY_OPTIONS.map(opt => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {primaryCategory === 'Others' && (
          <input
            type="text"
            className="mt-2 w-full border rounded px-2 py-1 text-sm focus:ring-2 focus:ring-blue-400"
            placeholder="Enter category code (e.g. EC, MG, PK...)"
            value={categoryFreeText}
            onChange={e => onCategoryFreeTextChange(e.target.value)}
            disabled={disabled}
            maxLength={12}
          />
        )}
      </div>
      {/* Secondary Category */}
      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Secondary Category (optional, select best 2 overlapping categories)</label>
        <div className="relative" ref={dropdownRef}>
          <button
            type="button"
            className="w-full border rounded px-2 py-1 text-left bg-white focus:ring-2 focus:ring-blue-400"
            onClick={() => setDropdownOpen(v => !v)}
            disabled={disabled}
            aria-haspopup="listbox"
            aria-expanded={dropdownOpen}
          >
            {secondaryCategories.length === 0 ? (
              <span className="text-gray-400">Select secondary categories...</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {secondaryCategories.map(cat => (
                  <span key={cat} className="bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full text-xs">{cat}</span>
                ))}
              </div>
            )}
          </button>
          {dropdownOpen && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded shadow-lg max-h-48 overflow-auto">
              {CATEGORY_OPTIONS.map(opt => {
                const isSelected = secondaryCategories.includes(opt);
                const atLimit = secondaryCategories.length >= 2 && !isSelected;
                return (
                  <label
                    key={opt}
                    className={`flex items-center px-3 py-2 cursor-pointer text-sm ${opt === primaryCategory ? 'text-gray-400 cursor-not-allowed' : ''} ${atLimit ? 'opacity-50' : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleCheckbox(opt)}
                      disabled={opt === primaryCategory || disabled || atLimit}
                      className="mr-2"
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
      {fields.length > 0 && (
        <div className="divide-y">
          {fields.map(f => (
            <div key={f.id} className="py-2 grid grid-cols-[auto_1fr_auto] items-center gap-2 group">
              <label className="font-medium" htmlFor={`cqc-${f.id}`}>{f.label}</label>
              <div className="flex gap-4">
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name={f.id}
                    id={`cqc-${f.id}-yes`}
                    value="yes"
                    checked={cqcValues[f.id] === true}
                    onChange={() => onCqcChange({ ...cqcValues, [f.id]: true })}
                    disabled={disabled}
                    className="accent-green-500 focus:ring-2 focus:ring-green-400"
                    aria-describedby={`cqc-${f.id}-desc`}
                  />
                  <span>Yes</span>
                </label>
                <label className="inline-flex items-center gap-1 cursor-pointer">
                  <input
                    type="radio"
                    name={f.id}
                    id={`cqc-${f.id}-no`}
                    value="no"
                    checked={cqcValues[f.id] === false}
                    onChange={() => onCqcChange({ ...cqcValues, [f.id]: false })}
                    disabled={disabled}
                    className="accent-red-500 focus:ring-2 focus:ring-red-400"
                    aria-describedby={`cqc-${f.id}-desc`}
                  />
                  <span>No</span>
                </label>
              </div>
              <div className="flex items-center gap-1">
                {cqcValues[f.id] === true && <span className="text-green-500" aria-label="Yes">✓</span>}
                {cqcValues[f.id] === false && <span className="text-red-500" aria-label="No">✕</span>}
                {f.help && <span className="ml-1 text-xs text-gray-400 group-hover:block hidden" tabIndex={0} title={f.help}>?</span>}
              </div>
              {f.help && (
                <div className="col-span-3 text-xs text-gray-500 mt-1" id={`cqc-${f.id}-desc`}>
                  {f.help}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      {rating && (
        <div className="mt-4 flex items-center gap-2">
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${rating.rating === 'Good' ? 'bg-green-100 text-green-600' : rating.rating === 'OK' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}
            title={`${rating.score} / ${rating.possible} (${Math.round(rating.pct*100)}%) → ${rating.rating}`}
            tabIndex={0}
          >
            {rating.rating}
          </span>
          <span className="text-xs text-gray-500">CQC rating</span>
        </div>
      )}
    </div>
  );
};

export { CATEGORY_OPTIONS, CQC_FIELDS, scoreCQC };
export type { Category };
export default CQCForm; 