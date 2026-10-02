import { Link, useParams } from "react-router-dom";
import { getQuestionsForVersion } from "../data";
import type { ExamVersion } from "../types";
import { useQuiz } from "../hooks/useQuiz";
import { useProgress } from "../hooks/useProgress";
import { MultipleChoice } from "../components/MultipleChoice";
import "../App.css";

/** Level 1: multiple choice quiz. */
export function Level1() {
  const { version = "2025" } = useParams<{ version: string }>();
  const examVersion = version as ExamVersion;
  const questions = getQuestionsForVersion(examVersion);
  const { recordAnswer } = useProgress();

  const { questions: ordered, currentQuestion, index, total, isLastQuestion, sessionCorrect, sessionIncorrect, answer, next, restart } =
    useQuiz({ questions });

  if (!currentQuestion) {
    return <p>No questions available.</p>;
  }

  function handleAnswer(correct: boolean) {
    recordAnswer(examVersion, 1, currentQuestion.id, correct);
    answer(correct);
  }

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/study/${examVersion}`}>← Back to levels</Link>
      </p>
      <h1 className="page__title">Multiple Choice</h1>
      <p className="page__subtitle">
        Question {index + 1} of {total}
      </p>
      <div className="session-stats">
        <div className="session-stats__item">
          <span className="session-stats__value">{sessionCorrect}</span>
          <span className="session-stats__label">Correct</span>
        </div>
        <div className="session-stats__item">
          <span className="session-stats__value">{sessionIncorrect}</span>
          <span className="session-stats__label">Missed</span>
        </div>
      </div>
      <MultipleChoice key={currentQuestion.id} question={currentQuestion} pool={ordered} onAnswer={handleAnswer} />
      <div className="quiz-nav">
        {isLastQuestion ? (
          <button className="btn btn--primary" onClick={restart}>
            Restart session
          </button>
        ) : (
          <button className="btn btn--primary" onClick={next}>
            Next question
          </button>
        )}
      </div>
    </div>
  );
}
