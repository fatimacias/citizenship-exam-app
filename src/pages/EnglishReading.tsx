import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { READING_SENTENCES } from "../data/english";
import { useEnglishProgress } from "../hooks/useEnglishProgress";
import { shuffle } from "../hooks/useQuiz";
import "../App.css";

/**
 * Reading practice: mirrors the real test, where the officer shows up to
 * 3 sentences and the applicant must read 1 aloud correctly. Since we can't
 * grade pronunciation automatically, the user self-assesses after reading
 * aloud - this keeps the practice honest without requiring microphone
 * permissions or a speech API.
 */
export function EnglishReading() {
  const sentences = useMemo(() => shuffle(READING_SENTENCES), []);
  const [index, setIndex] = useState(0);
  const { isMastered, toggleMastered, getMasteredCount } = useEnglishProgress();

  const current = sentences[index];
  if (!current) {
    return <p>No sentences available.</p>;
  }

  const mastered = isMastered("reading", current.id);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/english">← Back to English practice</Link>
      </p>
      <h1 className="page__title">Reading practice</h1>
      <p className="page__subtitle">
        Read the sentence below out loud. Sentence {index + 1} of {sentences.length} —{" "}
        {getMasteredCount("reading")}/{READING_SENTENCES.length} mastered overall.
      </p>
      <div className="vocab-card" style={{ maxWidth: 560, margin: "0 auto", textAlign: "center" }}>
        <p style={{ fontSize: "1.6rem", fontWeight: 600, margin: "1rem 0" }}>{current.text}</p>
      </div>
      <div className="quiz-nav" style={{ marginTop: "1rem" }}>
        <button
          type="button"
          className={`btn ${mastered ? "btn--primary" : ""}`}
          onClick={() => toggleMastered("reading", current.id)}
        >
          {mastered ? "✓ I can read this" : "I read it correctly"}
        </button>
      </div>
      <div className="quiz-nav">
        <button
          className="btn"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0}
        >
          Previous
        </button>
        <button
          className="btn btn--primary"
          onClick={() => setIndex((i) => Math.min(sentences.length - 1, i + 1))}
          disabled={index === sentences.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
