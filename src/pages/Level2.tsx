import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import type { ExamVersion } from "../types";
import { shuffle } from "../hooks/useQuiz";
import { useProgress } from "../hooks/useProgress";
import { usePersonalizedQuestions } from "../hooks/usePersonalizedQuestions";
import { Matching } from "../components/Matching";
import { ProfilePrompt } from "../components/ProfilePrompt";
import "../App.css";

const BATCH_SIZE = 5;

/** Level 2: matching quiz, questions presented in small batches. */
export function Level2() {
  const { version = "2025" } = useParams<{ version: string }>();
  const examVersion = version as ExamVersion;
  const { recordAnswer } = useProgress();
  const { questions: allQuestions, completeness } = usePersonalizedQuestions(examVersion);
  const { done, total } = completeness();

  const batches = useMemo(() => {
    const shuffled = shuffle(allQuestions);
    const chunks = [];
    for (let i = 0; i < shuffled.length; i += BATCH_SIZE) {
      chunks.push(shuffled.slice(i, i + BATCH_SIZE));
    }
    return chunks;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allQuestions]);

  const [batchIndex, setBatchIndex] = useState(0);
  const [correctCount, setCorrectCount] = useState(0);
  const [incorrectCount, setIncorrectCount] = useState(0);
  const [batchDone, setBatchDone] = useState(false);

  const currentBatch = batches[batchIndex];
  const isLastBatch = batchIndex >= batches.length - 1;

  if (!currentBatch) {
    return <p>No questions available.</p>;
  }

  function handleMatch(questionId: string, correct: boolean) {
    recordAnswer(examVersion, 2, questionId, correct);
    if (correct) setCorrectCount((c) => c + 1);
    else setIncorrectCount((c) => c + 1);
  }

  function handleNextBatch() {
    setBatchIndex((i) => Math.min(batches.length - 1, i + 1));
    setBatchDone(false);
  }

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/study/${examVersion}`}>← Back to levels</Link>
      </p>
      <h1 className="page__title">Matching</h1>
      <p className="page__subtitle">
        Batch {batchIndex + 1} of {batches.length}
      </p>
      <ProfilePrompt done={done} total={total} />
      <div className="session-stats">
        <div className="session-stats__item">
          <span className="session-stats__value">{correctCount}</span>
          <span className="session-stats__label">Correct</span>
        </div>
        <div className="session-stats__item">
          <span className="session-stats__value">{incorrectCount}</span>
          <span className="session-stats__label">Mismatches</span>
        </div>
      </div>
      <Matching
        key={batchIndex}
        questions={currentBatch}
        onMatch={handleMatch}
        onComplete={() => setBatchDone(true)}
      />
      {batchDone && (
        <div className="quiz-nav">
          {isLastBatch ? (
            <button className="btn btn--primary" onClick={() => setBatchIndex(0)}>
              Restart from first batch
            </button>
          ) : (
            <button className="btn btn--primary" onClick={handleNextBatch}>
              Next batch
            </button>
          )}
        </div>
      )}
    </div>
  );
}
