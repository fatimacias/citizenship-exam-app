import { Link } from "react-router-dom";
import type { ExamVersion } from "../types";
import { EXAM_VERSION_DESCRIPTIONS, EXAM_VERSION_LABELS, getQuestionsForVersion } from "../data";
import "../App.css";

const VERSIONS: ExamVersion[] = ["2025", "2008", "65-20"];

/** Home/menu screen: choose exam version, then level. */
export function Home() {
  return (
    <div className="page">
      <h1 className="page__title">US Citizenship Civics Test Study</h1>
      <p className="page__subtitle">
        Choose an official USCIS question set to practice. No account needed — your progress is
        saved on this device.
      </p>
      <div className="card-grid">
        {VERSIONS.map((version) => {
          const count = getQuestionsForVersion(version).length;
          return (
            <Link key={version} to={`/study/${version}`} className="option-card">
              <h3>{EXAM_VERSION_LABELS[version]}</h3>
              <p>{EXAM_VERSION_DESCRIPTIONS[version]}</p>
              <span className="option-card__meta">{count} questions</span>
            </Link>
          );
        })}
      </div>
      <p className="breadcrumb">
        Also practicing English? <Link to="/english">Try English practice →</Link>
      </p>
    </div>
  );
}
