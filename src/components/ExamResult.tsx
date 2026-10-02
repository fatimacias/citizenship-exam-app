import "./ExamResult.css";

export interface ExamResultProps {
  passed: boolean;
  correct: number;
  incorrect: number;
  askedCount: number;
  passThreshold: number;
  onRestart: () => void;
}

/**
 * Pass/fail summary shown once an exam-style session is decided, mirroring
 * how the real USCIS interview ends as soon as the outcome is certain.
 */
export function ExamResult({
  passed,
  correct,
  incorrect,
  askedCount,
  passThreshold,
  onRestart,
}: ExamResultProps) {
  return (
    <div className={`exam-result ${passed ? "exam-result--passed" : "exam-result--failed"}`}>
      <p className="exam-result__title">{passed ? "✅ Passed!" : "❌ Not passed"}</p>
      <p className="exam-result__score">
        {correct} correct / {incorrect} missed — out of {askedCount} question
        {askedCount === 1 ? "" : "s"} asked (needed {passThreshold} correct to pass)
      </p>
      <button className="btn btn--primary" onClick={onRestart}>
        Start a new practice exam
      </button>
    </div>
  );
}
