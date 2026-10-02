import { Link } from "react-router-dom";
import "../App.css";

interface VocabCard {
  word: string;
  translation: string;
  example: string;
}

// Minimal starter sample in the style of the USCIS reading/writing vocab
// lists. Full English module content/scope is intentionally deferred to a
// later iteration - see README roadmap.
const SAMPLE_VOCAB: VocabCard[] = [
  {
    word: "citizen",
    translation: "ciudadano/a",
    example: "She became a United States citizen last year.",
  },
  {
    word: "government",
    translation: "gobierno",
    example: "The government is divided into three branches.",
  },
];

/** Placeholder landing page for the (separate, future) English practice module. */
export function EnglishPractice() {
  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">← Back to home</Link>
      </p>
      <h1 className="page__title">English Practice</h1>
      <p className="page__subtitle">
        More reading, writing, and speaking practice content is coming soon. For now, here are a
        couple of sample vocabulary cards to get a feel for the format.
      </p>
      <div className="card-grid">
        {SAMPLE_VOCAB.map((card) => (
          <div key={card.word} className="vocab-card">
            <h3>{card.word}</h3>
            <p className="translation">{card.translation}</p>
            <p>{card.example}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
