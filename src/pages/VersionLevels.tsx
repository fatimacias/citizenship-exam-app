import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import type { ExamVersion } from "../types";
import { STUDY_LEVELS } from "../types";
import { EXAM_VERSION_LABELS, getQuestionById, getQuestionsForVersion } from "../data";
import { useProgress } from "../hooks/useProgress";
import "../App.css";

const VALID_VERSIONS: ExamVersion[] = ["2025", "2008", "65-20"];

/** Level picker for a chosen exam version, plus a missed-questions review list. */
export function VersionLevels() {
  const { version } = useParams<{ version: string }>();
  const { getLevelProgress } = useProgress();

  const examVersion = VALID_VERSIONS.includes(version as ExamVersion)
    ? (version as ExamVersion)
    : "2025";

  const questions = useMemo(() => getQuestionsForVersion(examVersion), [examVersion]);

  const missedQuestionIds = useMemo(() => {
    const ids = new Set<string>();
    for (const { level } of STUDY_LEVELS) {
      for (const id of getLevelProgress(examVersion, level).missedQuestionIds) {
        ids.add(id);
      }
    }
    return Array.from(ids);
  }, [examVersion, getLevelProgress]);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">← Choose a different version</Link>
      </p>
      <h1 className="page__title">{EXAM_VERSION_LABELS[examVersion]}</h1>
      <p className="page__subtitle">{questions.length} questions available. Pick a study level.</p>
      <div className="card-grid">
        {STUDY_LEVELS.map(({ level, name, description }) => {
          const progress = getLevelProgress(examVersion, level);
          return (
            <Link key={level} to={`/study/${examVersion}/level${level}`} className="option-card">
              <h3>
                Level {level}: {name}
              </h3>
              <p>{description}</p>
              {(progress.correctCount > 0 || progress.incorrectCount > 0) && (
                <span className="option-card__meta">
                  {progress.correctCount} correct / {progress.incorrectCount} missed
                </span>
              )}
            </Link>
          );
        })}
      </div>
      {missedQuestionIds.length > 0 && (
        <div>
          <h2 className="page__title" style={{ fontSize: "1.2rem" }}>
            Questions to review
          </h2>
          <ul className="missed-list">
            {missedQuestionIds.map((id) => {
              const q = getQuestionById(id);
              if (!q) return null;
              return (
                <li key={id}>
                  <strong>{q.question}</strong>
                  <p className="answers">{q.answers.join(" / ")}</p>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
