import { ALL_QUESTIONS, EXAM_VERSION_LABELS } from "../data";
import type { CivicsProfile } from "../hooks/useCivicsProfile";
import { resolvePersonalizedAnswer, isYearStale, TIME_BOUND_FIELDS } from "../hooks/useCivicsProfile";
import type { ExamVersion } from "../types";

const VERSIONS: ExamVersion[] = ["2025", "2008", "65-20"];

// Page layout constants (jsPDF default unit is mm on "letter" format).
const PAGE_WIDTH = 215.9;
const PAGE_HEIGHT = 279.4;
const MARGIN = 18;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN * 2;

interface QuestionRow {
  question: string;
  answer: string;
  personalized: boolean;
  missing: boolean;
}

function buildRows(version: ExamVersion, profile: CivicsProfile): QuestionRow[] {
  const seen = new Set<string>();
  const questions =
    version === "65-20"
      ? ALL_QUESTIONS.filter((q) => q.isSpecial65_20)
      : ALL_QUESTIONS.filter((q) => q.versions.includes(version));

  const rows: QuestionRow[] = [];
  for (const q of questions) {
    if (seen.has(q.id)) continue;
    seen.add(q.id);

    let answer = q.answers[0];
    let personalized = false;
    let missing = false;
    if (q.personalizeField) {
      personalized = true;
      const resolved = resolvePersonalizedAnswer(profile, q.personalizeField);
      if (resolved) {
        answer = resolved;
      } else {
        answer = "Not set — fill in your profile (answers vary / current officeholder)";
        missing = true;
      }
    }
    rows.push({ question: q.question, answer, personalized, missing });
  }
  return rows;
}

/**
 * Builds a nicely formatted multi-page PDF question bank and triggers a browser
 * download. jsPDF (and its optional image-rendering deps) are loaded lazily on
 * first use so they don't bloat the app's initial bundle.
 */
export async function downloadQuestionBank(profile: CivicsProfile): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF({ unit: "mm", format: "letter" });
  let y = MARGIN;

  const addPageBreakIfNeeded = (neededHeight: number) => {
    if (y + neededHeight > PAGE_HEIGHT - MARGIN) {
      doc.addPage();
      y = MARGIN;
    }
  };

  // --- Title ---
  doc.setFont("helvetica", "bold");
  doc.setFontSize(20);
  doc.setTextColor(20, 20, 20);
  doc.text("US Citizenship Civics Question Bank", PAGE_WIDTH / 2, y, { align: "center" });
  y += 8;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, PAGE_WIDTH / 2, y, { align: "center" });
  y += 8;

  // --- Intro / legend ---
  doc.setFontSize(9.5);
  doc.setTextColor(70, 70, 70);
  const intro = doc.splitTextToSize(
    "Questions marked \u2605 are personal to you (your state officials) or change over time (current federal officeholders). Where a \u201cthrough <year>\u201d note appears, that's when the officeholder's current term ends \u2014 re-check and update your profile after that year.",
    CONTENT_WIDTH
  );
  doc.text(intro, MARGIN, y);
  y += intro.length * 4.2 + 2;

  const anyStale = TIME_BOUND_FIELDS.some((f) => profile[f].trim() && isYearStale(profile[`${f}TermEnd`]));
  if (anyStale) {
    doc.setTextColor(170, 60, 20);
    doc.setFont("helvetica", "bold");
    const warn = doc.splitTextToSize(
      "\u26A0 One or more of your saved officeholders may already be past their term-end year. Please verify and update your profile.",
      CONTENT_WIDTH
    );
    doc.text(warn, MARGIN, y);
    y += warn.length * 4.2 + 2;
    doc.setFont("helvetica", "normal");
  }
  y += 4;

  for (const version of VERSIONS) {
    const rows = buildRows(version, profile);

    // --- Section header band ---
    addPageBreakIfNeeded(14);
    doc.setFillColor(28, 58, 94);
    doc.rect(MARGIN, y, CONTENT_WIDTH, 9, "F");
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(255, 255, 255);
    doc.text(`${EXAM_VERSION_LABELS[version]}  (${rows.length} Questions)`, MARGIN + 3, y + 6.3);
    y += 13;

    rows.forEach((row, idx) => {
      doc.setFontSize(10.3);
      doc.setFont("helvetica", "bold");
      const qPrefix = `${idx + 1}. `;
      const qText = `${qPrefix}${row.question}${row.personalized ? "  \u2605" : ""}`;
      const qLines = doc.splitTextToSize(qText, CONTENT_WIDTH);

      doc.setFont("helvetica", "normal");
      doc.setFontSize(10);
      const aText = `Answer: ${row.answer}`;
      const aLines = doc.splitTextToSize(aText, CONTENT_WIDTH - 4);

      const blockHeight = qLines.length * 5 + aLines.length * 4.6 + 4;
      addPageBreakIfNeeded(blockHeight);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(10.3);
      doc.setTextColor(20, 20, 20);
      doc.text(qLines, MARGIN, y);
      y += qLines.length * 5;

      doc.setFont("helvetica", row.missing ? "italic" : "normal");
      doc.setFontSize(10);
      doc.setTextColor(row.missing ? 170 : 40, row.missing ? 60 : 90, row.missing ? 20 : 40);
      doc.text(aLines, MARGIN + 4, y);
      y += aLines.length * 4.6 + 4;
    });

    y += 3;
  }

  // --- Page numbers footer ---
  const totalPages = doc.getNumberOfPages();
  for (let p = 1; p <= totalPages; p++) {
    doc.setPage(p);
    doc.setFont("helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(140, 140, 140);
    doc.text(`Page ${p} of ${totalPages}`, PAGE_WIDTH / 2, PAGE_HEIGHT - 8, { align: "center" });
  }

  doc.save(`citizenship-question-bank-${new Date().toISOString().slice(0, 10)}.pdf`);
}
