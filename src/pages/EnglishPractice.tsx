import { Link } from "react-router-dom";
import { useEnglishProgress } from "../hooks/useEnglishProgress";
import { READING_SENTENCES, READING_VOCAB, WRITING_SENTENCES, WRITING_VOCAB } from "../data/english";
import "../App.css";

/**
 * English module hub. Mirrors the real USCIS English test structure: a
 * reading test (read 1 of 3 sentences aloud) and a writing test (write 1 of
 * 3 dictated sentences), plus vocabulary flashcards to prep for both.
 */
export function EnglishPractice() {
  const { getMasteredCount } = useEnglishProgress();

  const readingVocabCount = getMasteredCount("vocab-reading");
  const writingVocabCount = getMasteredCount("vocab-writing");
  const readingSentenceCount = getMasteredCount("reading");
  const writingSentenceCount = getMasteredCount("writing");

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">← Back to home</Link>
      </p>
      <h1 className="page__title">English Practice</h1>
      <p className="page__subtitle">
        The naturalization interview also tests English reading, writing, and speaking. Practice
        with the official USCIS vocabulary and sample sentences below.
      </p>
      <div className="card-grid">
        <Link to="/english/vocab/reading" className="option-card">
          <h3>📖 Vocabulary — Reading list</h3>
          <p>{READING_VOCAB.length} official words used in reading-test sentences.</p>
          <span className="option-card__meta">{readingVocabCount} marked as known</span>
        </Link>
        <Link to="/english/vocab/writing" className="option-card">
          <h3>✍️ Vocabulary — Writing list</h3>
          <p>{WRITING_VOCAB.length} official words used in writing-test sentences.</p>
          <span className="option-card__meta">{writingVocabCount} marked as known</span>
        </Link>
        <Link to="/english/reading" className="option-card">
          <h3>🗣️ Reading practice</h3>
          <p>Read sentences aloud, just like the officer will ask you to during the interview.</p>
          <span className="option-card__meta">
            {readingSentenceCount}/{READING_SENTENCES.length} mastered
          </span>
        </Link>
        <Link to="/english/writing" className="option-card">
          <h3>⌨️ Writing dictation</h3>
          <p>Listen to a sentence and type what you hear, like the officer dictating to you.</p>
          <span className="option-card__meta">
            {writingSentenceCount}/{WRITING_SENTENCES.length} mastered
          </span>
        </Link>
      </div>
    </div>
  );
}
