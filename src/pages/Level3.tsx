import { Link, useParams } from "react-router-dom";
import { EXAM_RULES, getQuestionsForVersion } from "../data";
import type { ExamVersion } from "../types";
import { useExamSession } from "../hooks/useExamSession";
import { useProgress } from "../hooks/useProgress";
import { WriteAnswer } from "../components/WriteAnswer";
import { ExamResult } from "../components/ExamResult";
import "../App.css";

/**
 * Level 3: write-the-answer, run as a real-exam simulation — a random
 * subset of questions, sized and scored like the actual USCIS interview.
 */
export function Level3() {
  const { version = "2025" } = useParams<{ version: string }>();
  const examVersion = version as ExamVersion;
  const allQuestions = getQuestionsForVersion(examVersion);
  const rules = EXAM_RULES[examVersion];
  const { recordAnswer } = useProgress();

  const {
    currentQuestion,
    index,
    askCount,
    passThreshold,
    correct,
    incorrect,
    answered,
    passed,
    isFinished,
    answer,
    next,
    restart,
  } = useExamSession({ questions: allQuestions, rules, version: examVersion, level: 3 });

  if (!currentQuestion) {
    return <p>No questions available.</p>;
  }

  function handleAnswer(isCorrect: boolean) {
    recordAnswer(examVersion, 3, currentQuestion.id, isCorrect);
    answer(isCorrect);
  }

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/study/${examVersion}`}>← Back to levels</Link>
      </p>
      <h1 className="page__title">Write the Answer</h1>
      <p className="page__subtitle">
        {isFinished
          ? "Practice exam complete"
          : `Question ${index + 1} of ${askCount} — need ${passThreshold} correct to pass`}
      </p>
      <div className="session-stats">
        <div className="session-stats__item">
          <span className="session-stats__value">{correct}</span>
          <span className="session-stats__label">Correct</span>
        </div>
        <div className="session-stats__item">
          <span className="session-stats__value">{incorrect}</span>
          <span className="session-stats__label">Missed</span>
        </div>
      </div>
      {!isFinished && (
        <>
          <WriteAnswer key={currentQuestion.id} question={currentQuestion} onAnswer={handleAnswer} />
          <div className="quiz-nav">
            <button className="btn btn--primary" onClick={next} disabled={!answered}>
              Next question
            </button>
          </div>
        </>
      )}
      {isFinished && (
        <ExamResult
          passed={passed}
          correct={correct}
          incorrect={incorrect}
          askedCount={index + 1}
          passThreshold={passThreshold}
          onRestart={restart}
        />
      )}
    </div>
  );
}
