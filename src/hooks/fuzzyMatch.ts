/**
 * Lightweight fuzzy text matching for the "write the answer" level.
 * Normalizes case/accents/punctuation and tolerates small typos
 * (Levenshtein distance) so users aren't penalized for minor mistakes.
 */

/** Lowercase, strip accents/diacritics, and collapse punctuation/whitespace. */
export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip accents
    .toLowerCase()
    .replace(/[.,/#!$%^&*;:{}=\-_`~()'"]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** Classic Levenshtein edit distance between two strings. */
export function levenshtein(a: string, b: string): number {
  if (a === b) return 0;
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  let prevRow = new Array(bl + 1);
  let currRow = new Array(bl + 1);
  for (let j = 0; j <= bl; j++) prevRow[j] = j;

  for (let i = 1; i <= al; i++) {
    currRow[0] = i;
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      currRow[j] = Math.min(
        prevRow[j] + 1, // deletion
        currRow[j - 1] + 1, // insertion
        prevRow[j - 1] + cost // substitution
      );
    }
    [prevRow, currRow] = [currRow, prevRow];
  }
  return prevRow[bl];
}

/** Allowed edit-distance tolerance for typos, scaled by answer length. */
function toleranceFor(length: number): number {
  if (length <= 4) return 0;
  if (length <= 8) return 1;
  if (length <= 14) return 2;
  return 3;
}

/**
 * Checks whether `userInput` is a reasonable match for `acceptedAnswer`,
 * tolerating case, accents, punctuation, and small typos.
 */
export function fuzzyMatch(userInput: string, acceptedAnswer: string): boolean {
  const normUser = normalize(userInput);
  const normAnswer = normalize(acceptedAnswer);
  if (!normUser) return false;
  if (normUser === normAnswer) return true;

  // Allow the user to omit/include parenthetical hints, e.g.
  // "(George) Washington" -> both "washington" and "george washington" match.
  const strippedAnswer = normalize(acceptedAnswer.replace(/[()]/g, ""));
  if (normUser === strippedAnswer) return true;

  // If the answer contains multiple significant words, also accept
  // matching just the most distinctive (longest) word, e.g. a last name.
  const answerWords = strippedAnswer.split(" ").filter(Boolean);
  if (answerWords.length > 1) {
    const longestWord = answerWords.reduce((a, b) => (b.length > a.length ? b : a));
    if (normUser === longestWord) return true;
  }

  const distance = levenshtein(normUser, normAnswer);
  if (distance <= toleranceFor(normAnswer.length)) return true;

  const distanceStripped = levenshtein(normUser, strippedAnswer);
  if (distanceStripped <= toleranceFor(strippedAnswer.length)) return true;

  return false;
}

/** Returns true if `userInput` reasonably matches ANY of the accepted answers. */
export function isAnyAnswerMatch(userInput: string, acceptedAnswers: string[]): boolean {
  return acceptedAnswers.some((answer) => fuzzyMatch(userInput, answer));
}

export interface WordDiff {
  word: string;
  ok: boolean;
}

export interface DictationResult {
  /** True once the typed text is close enough to count as correct. */
  correct: boolean;
  /** 0-1 fraction of target words matched, for a lenient "close enough" pass. */
  score: number;
  /** Per-word feedback (target sentence words), for highlighting mistakes. */
  diff: WordDiff[];
}

/**
 * Compares a typed sentence (English writing-test dictation) against the
 * target sentence. Case/accents/punctuation are ignored; each target word
 * is matched against the typed word at the same position, with a small
 * typo tolerance. Passes at >=85% of words correct (the real test allows
 * minor spelling slips as long as the sentence is understandable).
 */
export function scoreDictation(typed: string, target: string): DictationResult {
  const typedWords = normalize(typed).split(" ").filter(Boolean);
  const targetWords = normalize(target).split(" ").filter(Boolean);

  const diff: WordDiff[] = targetWords.map((word, i) => {
    const candidate = typedWords[i];
    if (!candidate) return { word, ok: false };
    const ok = candidate === word || levenshtein(candidate, word) <= toleranceFor(word.length);
    return { word, ok };
  });

  const okCount = diff.filter((d) => d.ok).length;
  const score = targetWords.length > 0 ? okCount / targetWords.length : 0;
  return { correct: score >= 0.85, score, diff };
}
