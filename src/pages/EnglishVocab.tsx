import { Link, useParams } from "react-router-dom";
import { useMemo } from "react";
import { READING_VOCAB, WRITING_VOCAB, type VocabWord } from "../data/english";
import { useEnglishProgress, type EnglishMode } from "../hooks/useEnglishProgress";
import { FlipCard } from "../components/FlipCard";
import "../App.css";

function groupByCategory(words: VocabWord[]): [string, VocabWord[]][] {
  const groups = new Map<string, VocabWord[]>();
  for (const w of words) {
    const list = groups.get(w.category) ?? [];
    list.push(w);
    groups.set(w.category, list);
  }
  return Array.from(groups.entries());
}

/** Flashcard-style vocabulary browser for the official USCIS reading/writing word lists. */
export function EnglishVocab() {
  const { list } = useParams<{ list: string }>();
  const isWriting = list === "writing";
  const words = isWriting ? WRITING_VOCAB : READING_VOCAB;
  const mode: EnglishMode = isWriting ? "vocab-writing" : "vocab-reading";
  const { isMastered, toggleMastered, getMasteredCount } = useEnglishProgress();

  const groups = useMemo(() => groupByCategory(words), [words]);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/english">← Back to English practice</Link>
      </p>
      <h1 className="page__title">{isWriting ? "Writing" : "Reading"} vocabulary</h1>
      <p className="page__subtitle">
        Official USCIS {isWriting ? "writing" : "reading"} test words. Tap a card to flip it, and
        mark words you already know. {getMasteredCount(mode)}/{words.length} marked as known.
      </p>
      {groups.map(([category, items]) => (
        <section key={category} style={{ marginBottom: "1.5rem" }}>
          <h2 className="page__title" style={{ fontSize: "1.05rem", textAlign: "left" }}>
            {category}
          </h2>
          <div className="card-grid">
            {items.map((item) => {
              const known = isMastered(mode, item.word);
              return (
                <div key={item.word}>
                  <FlipCard
                    frontLabel="English"
                    backLabel="Español"
                    front={<p>{item.word}</p>}
                    back={<p>{item.translation}</p>}
                  />
                  <button
                    type="button"
                    className={`btn ${known ? "btn--primary" : ""}`}
                    style={{ width: "100%", marginTop: "0.5rem", maxWidth: 480 }}
                    onClick={() => toggleMastered(mode, item.word)}
                  >
                    {known ? "✓ Known" : "Mark as known"}
                  </button>
                </div>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
