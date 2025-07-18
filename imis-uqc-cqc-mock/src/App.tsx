import CaseEvaluationPage from './components/CaseEvaluationPage';
import { MOCK_CASE } from './mockData';

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <CaseEvaluationPage caseData={MOCK_CASE} />
    </div>
  );
}

export default App;
