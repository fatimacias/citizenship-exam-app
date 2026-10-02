import { Link } from "react-router-dom";
import { useMemo, useState } from "react";
import { WRITING_SENTENCES } from "../data/english";
import { useEnglishProgress } from "../hooks/useEnglishProgress";
import { scoreDictation, type DictationResult } from "../hooks/fuzzyMatch";
import { shuffle } from "../hooks/useQuiz";
import "../App.css";

const speechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

function speak(text: string) {
  if (!speechSupported) return;
  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";
  utterance.rate = 0.9;
  window.speechSynthesis.speak(utterance);
}

/**
 * Writing dictation practice: mirrors the real test, where the officer
 * reads a sentence aloud and the applicant writes it down. Uses the
 * browser's built-in text-to-speech (no API key/backend needed) with a
 * "reveal sentence" fallback for browsers without speech support.
 */
export function EnglishWriting() {
  const sentences = useMemo(() => shuffle(WRITING_SENTENCES), []);
  const [index, setIndex] = useState(0);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<DictationResult | null>(null);
  const [revealed, setRevealed] = useState(false);
  const { recordAttempt, toggleMastered, isMastered, getMasteredCount } = useEnglishProgress();

  const current = sentences[index];
  if (!current) {
    return <p>No sentences available.</p>;
  }

  function handleCheck(e: React.FormEvent) {
    e.preventDefault();
    if (!value.trim() || !current) return;
    const scored = scoreDictation(value, current.text);
    setResult(scored);
    recordAttempt("writing", scored.correct);
    if (scored.correct) toggleMastered("writing", current.id);
  }

  function goTo(nextIndex: number) {
    setIndex(nextIndex);
    setValue("");
    setResult(null);
    setRevealed(false);
  }

  const mastered = isMastered("writing", current.id);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/english">← Back to English practice</Link>
      </p>
      <h1 className="page__title">Writing dictation</h1>
      <p className="page__subtitle">
        Listen to the sentence, then type exactly what you hear. Sentence {index + 1} of{" "}
        {sentences.length} — {getMasteredCount("writing")}/{WRITING_SENTENCES.length} mastered
        overall.
      </p>

      <div className="quiz-nav" style={{ marginBottom: "1rem" }}>
        {speechSupported ? (
          <button type="button" className="btn btn--primary" onClick={() => speak(current.text)}>
            🔊 Listen
          </button>
        ) : (
          <button type="button" className="btn" onClick={() => setRevealed((r) => !r)}>
            👁 {revealed ? "Hide" : "Show"} sentence (no text-to-speech available)
          </button>
        )}
      </div>
      {revealed && !speechSupported && (
        <p style={{ textAlign: "center", fontStyle: "italic" }}>{current.text}</p>
      )}

      <form onSubmit={handleCheck} className="write-answer">
        <input
          type="text"
          className="write-answer__input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type what you heard..."
          disabled={!!result}
          autoComplete="off"
          autoFocus
        />
        {!result && (
          <button type="submit" className="write-answer__submit" disabled={!value.trim()}>
            Check
          </button>
        )}
      </form>

      {result && (
        <div className={`write-answer__feedback ${result.correct ? "is-correct" : "is-incorrect"}`}>
          <p>
            {result.correct
              ? "Correct! ✓"
              : `Close, but not quite (${Math.round(result.score * 100)}% of words matched).`}
          </p>
          <p className="write-answer__accepted">
            {result.diff.map((d, i) => (
              <span key={i} style={{ color: d.ok ? "inherit" : "#c0392b", fontWeight: d.ok ? 400 : 700 }}>
                {d.word}{" "}
              </span>
            ))}
          </p>
        </div>
      )}

      <div className="quiz-nav" style={{ marginTop: "1rem" }}>
        <button className="btn" onClick={() => goTo(Math.max(0, index - 1))} disabled={index === 0}>
          Previous
        </button>
        <button
          className="btn btn--primary"
          onClick={() => goTo(Math.min(sentences.length - 1, index + 1))}
          disabled={index === sentences.length - 1}
        >
          Next
        </button>
      </div>
      {mastered && <p className="breadcrumb">✓ Already mastered this sentence</p>}
    </div>
  );
}
