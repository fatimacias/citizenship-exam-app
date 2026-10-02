import { Link, useParams } from "react-router-dom";
import { useMemo, useState } from "react";
import type { ExamVersion } from "../types";
import { shuffle } from "../hooks/useQuiz";
import { usePersonalizedQuestions } from "../hooks/usePersonalizedQuestions";
import { Flashcard } from "../components/Flashcard";
import { ProfilePrompt } from "../components/ProfilePrompt";
import "../App.css";

/** Level 0: flashcard study mode. No scoring, just memorization. */
export function StudyLevel0() {
  const { version = "2025" } = useParams<{ version: string }>();
  const examVersion = version as ExamVersion;
  const { questions: baseQuestions, completeness } = usePersonalizedQuestions(examVersion);
  const questions = useMemo(() => shuffle(baseQuestions), [baseQuestions]);
  const [index, setIndex] = useState(0);
  const { done, total } = completeness();

  const current = questions[index];
  if (!current) {
    return <p>No questions available.</p>;
  }

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to={`/study/${examVersion}`}>← Back to levels</Link>
      </p>
      <h1 className="page__title">Flashcards</h1>
      <p className="page__subtitle">
        Card {index + 1} of {questions.length}
      </p>
      <ProfilePrompt done={done} total={total} />
      <Flashcard key={current.id} question={current} />
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
          onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
          disabled={index === questions.length - 1}
        >
          Next
        </button>
      </div>
    </div>
  );
}
