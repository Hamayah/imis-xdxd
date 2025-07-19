import React, { useState, useEffect } from 'react';
import type { CaseData, UQCValues, CQCValues } from '../mockData';
import MediaPanel from './MediaPanel';
import MetaPanel from './MetaPanel';
import UQCForm, { isUQCComplete, scoreUQC } from './UQCForm';
import CQCForm, { CQC_FIELDS, scoreCQC, type Category } from './CQCForm';
import AdditionalFeedback from './AdditionalFeedback';
import SummaryPanel from './SummaryPanel';
import ActionButtons from './ActionButtons';

const initialUQC: UQCValues = {
  v_clarity: null,
  a_clarity: null,
  v_complete: null,
  first3: null,
  ansa: false,
};

function getInitialCQCValues(category: Category | ''): CQCValues {
  if (!category) return {};
  const fields = category ? CQC_FIELDS[category] : [];
  return Object.fromEntries(fields.map(f => [f.id, null]));
}

function computeOverallRating(uqc: UQCValues, cqcRating: any): 'Good' | 'OK' | 'Bad' {
  if (!isUQCComplete(uqc) || !cqcRating) return 'Bad';
  const uqcScore = scoreUQC(uqc);
  const uqcPct = uqcScore.score / 4;
  const cqcPct = cqcRating.pct;
  const overallPct = 0.6 * uqcPct + 0.4 * cqcPct;
  if (uqc.ansa) return 'Bad';
  if (overallPct >= 0.75) return 'Good';
  if (overallPct >= 0.4) return 'OK';
  return 'Bad';
}

const DRAFT_KEY = 'imis-uqc-cqc-draft';

interface Props {
  caseData: CaseData;
}

const CaseEvaluationPage: React.FC<Props> = ({ caseData }) => {
  const [uqc, setUqc] = useState<UQCValues>(initialUQC);
  const uqcComplete = isUQCComplete(uqc);
  const uqcRating = uqcComplete ? scoreUQC(uqc) : null;

  const [primaryCategory, setPrimaryCategory] = useState<Category | ''>('');
  const [categoryFreeText, setCategoryFreeText] = useState('');
  const [cqcValues, setCqcValues] = useState<CQCValues>({});
  const [feedback, setFeedback] = useState('');
  const [flagged, setFlagged] = useState(false);
  const [loading, setLoading] = useState(false);

  // Reset CQC values on primary change
  const handlePrimaryCategoryChange = (cat: Category | '') => {
    setPrimaryCategory(cat);
    setCqcValues(getInitialCQCValues(cat));
    if (cat !== 'Others') setCategoryFreeText('');
  };

  // Load draft on mount
  useEffect(() => {
    const draft = localStorage.getItem(DRAFT_KEY);
    if (draft) {
      try {
        const parsed = JSON.parse(draft);
        setUqc(parsed.uqc || initialUQC);
        setPrimaryCategory(parsed.primaryCategory || '');
        setCategoryFreeText(parsed.categoryFreeText || '');
        setCqcValues(parsed.cqcValues || {});
        setFeedback(parsed.feedback || '');
        setFlagged(parsed.flagged || false);
      } catch {}
    }
    // eslint-disable-next-line
  }, []);

  const cqcFields = primaryCategory ? CQC_FIELDS[primaryCategory] : [];
  const cqcAnswers = cqcFields.map(f => !!cqcValues[f.id]);
  const cqcRating = cqcFields.length ? scoreCQC(primaryCategory, cqcAnswers) : null;

  const overallRating = uqcComplete && cqcRating ? computeOverallRating(uqc, cqcRating) : 'Bad';
  const submissionPayload = {
    room_id: caseData.room_id,
    extra_info: caseData.extra_info,
    primary_category: primaryCategory || '',
    category_free_text: primaryCategory === 'Others' ? categoryFreeText : '',
    uqc: {
      visual_clarity: uqc.v_clarity,
      audio_clarity: uqc.a_clarity,
      video_completeness: uqc.v_complete,
      exciting_first3: uqc.first3,
      ansa: uqc.ansa,
      score: uqcRating?.score ?? 0,
      rating: uqcRating?.rating ?? 'Bad',
    },
    cqc: {
      fields: Object.fromEntries(cqcFields.map(f => [f.id, cqcValues[f.id]])),
      score: cqcRating?.score ?? 0,
      possible: cqcRating?.possible ?? 0,
      pct: cqcRating?.pct ?? 0,
      rating: cqcRating?.rating ?? 'Bad',
    },
    overall_rating: overallRating,
    comments: feedback,
    flagged: flagged,
  };

  const handleCancel = () => {
    setUqc(initialUQC);
    setPrimaryCategory('');
    setCategoryFreeText('');
    setCqcValues({});
    setFeedback('');
    setFlagged(false);
    localStorage.removeItem(DRAFT_KEY);
  };
  const handleSubmit = async () => {
    setLoading(true);
    await new Promise(r => setTimeout(r, 800));
    // eslint-disable-next-line no-console
    console.log('Submitted:', submissionPayload);
    setLoading(false);
    handleCancel();
  };
  const cqcValid = primaryCategory && cqcFields.length && cqcFields.filter(f => cqcValues[f.id] !== null).length >= Math.ceil(cqcFields.length / 2);
  const submitEnabled = uqcComplete && cqcValid;

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-[1fr_500px] gap-8">
      {/* Left: Metadata + Forms */}
      <div>
        <MetaPanel roomId={caseData.room_id} extraInfo={caseData.extra_info} />
        <UQCForm value={uqc} onChange={setUqc} />
        <CQCForm
          primaryCategory={primaryCategory}
          onPrimaryCategoryChange={handlePrimaryCategoryChange}
          cqcValues={cqcValues}
          onCqcChange={setCqcValues}
          disabled={!uqcComplete}
          categoryFreeText={categoryFreeText}
          onCategoryFreeTextChange={setCategoryFreeText}
        />
        <AdditionalFeedback 
          value={feedback} 
          onChange={setFeedback} 
          flagged={flagged}
          onFlaggedChange={setFlagged}
        />
        <SummaryPanel payload={submissionPayload} />
        {overallRating && (
          <div className="mb-2">
            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${overallRating === 'Good' ? 'bg-green-100 text-green-600' : overallRating === 'OK' ? 'bg-amber-100 text-amber-600' : 'bg-red-100 text-red-600'}`}
              title="System overall rating"
              tabIndex={0}
            >
              {overallRating}
            </span>
            <span className="ml-2 text-xs text-gray-500">Overall rating</span>
          </div>
        )}
        <ActionButtons
          disabled={!submitEnabled}
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </div>
      {/* Right: MediaPanel */}
      <div>
        <MediaPanel
          highlightUrl={caseData.highlightUrl}
          highlightDuration={caseData.highlightDuration}
          fullUrl={caseData.fullUrl}
          fullDuration={caseData.fullDuration}
        />
      </div>
    </div>
  );
};

export default CaseEvaluationPage; 