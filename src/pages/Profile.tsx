import { Link } from "react-router-dom";
import { useCivicsProfile, type TimeBoundField } from "../hooks/useCivicsProfile";
import { US_STATES } from "../data/usStates";
import { downloadQuestionBank } from "../utils/downloadQuestionBank";
import "../App.css";
import "./Profile.css";

const TIME_BOUND_HELP: { key: TimeBoundField; label: string; placeholder: string }[] = [
  { key: "governor", label: "Governor of your state", placeholder: "e.g. Jane Smith" },
  { key: "senator1", label: "U.S. Senator #1 for your state", placeholder: "e.g. John Doe" },
  { key: "senator2", label: "U.S. Senator #2 for your state", placeholder: "e.g. Mary Lee" },
  { key: "representative", label: "Your U.S. Representative", placeholder: "e.g. Pat Nguyen" },
  { key: "president", label: "President of the United States", placeholder: "e.g. Donald Trump" },
  { key: "vicePresident", label: "Vice President of the United States", placeholder: "e.g. JD Vance" },
  { key: "speakerOfHouse", label: "Speaker of the House of Representatives", placeholder: "e.g. Mike Johnson" },
];

/**
 * Lets the user enter their state and current officials once, so the
 * "answers vary" civics questions (your Senators, Governor, Representative,
 * state capital, and current federal officeholders) show and grade against
 * the user's own real, self-reported answers instead of a placeholder.
 * Time-bound roles also take a "valid through" year (e.g. a president
 * elected in 2024 serves through January 2029) so the app can flag the
 * answer as possibly stale once that year passes.
 */
export function Profile() {
  const { profile, setProfile, selectState, refreshCurrentData, completeness, isYearStale } = useCivicsProfile();
  const { done, total } = completeness();
  const selectedState = US_STATES.find((s) => s.name === profile.state);

  return (
    <div className="page">
      <p className="breadcrumb">
        <Link to="/">← Back home</Link>
      </p>
      <h1 className="page__title">My Profile</h1>
      <p className="page__subtitle">
        Some official USCIS questions ask about <em>your</em> state and today's officeholders — the
        real test expects your own answers, not a fixed fact. Fill these in once and every practice
        level will use them instead of showing "answers vary".
      </p>
      <div className="session-stats">
        <div className="session-stats__item">
          <span className="session-stats__value">
            {done}/{total}
          </span>
          <span className="session-stats__label">Personalized</span>
        </div>
      </div>

      <div className="profile-form">
        <label className="profile-form__field">
          <span>Your state</span>
          <select
            value={profile.state ?? ""}
            onChange={(e) => {
              const value = e.target.value;
              if (value) selectState(value);
              else setProfile({ state: null });
            }}
          >
            <option value="">Select your state…</option>
            {US_STATES.map((s) => (
              <option key={s.name} value={s.name}>
                {s.name}
              </option>
            ))}
          </select>
        </label>

        {selectedState && (
          <p className="profile-form__hint">
            Capital of {selectedState.name}: <strong>{selectedState.capital}</strong> (auto-filled, always correct)
          </p>
        )}

        {profile.state && (
          <p className="profile-form__hint">
            ✨ Governor, Senators, and federal officeholders were auto-filled with today's known officials for
            your state — edit any of them below, or{" "}
            <button type="button" className="profile-form__link-btn" onClick={refreshCurrentData}>
              re-sync with latest known data
            </button>
            .
          </p>
        )}

        {TIME_BOUND_HELP.map(({ key, label, placeholder }) => {
          const termEndKey = `${key}TermEnd` as const;
          const stale = profile[key].trim() !== "" && isYearStale(profile[termEndKey]);
          return (
            <div className="profile-form__row" key={key}>
              <label className="profile-form__field profile-form__field--name">
                <span>
                  {label}
                  {stale && <span className="profile-form__stale"> ⚠️ term may have ended — please verify</span>}
                </span>
                <input
                  type="text"
                  value={profile[key]}
                  placeholder={placeholder}
                  onChange={(e) => setProfile({ [key]: e.target.value })}
                />
              </label>
              <label className="profile-form__field profile-form__field--year">
                <span>Valid through (year)</span>
                <input
                  type="number"
                  inputMode="numeric"
                  value={profile[termEndKey]}
                  placeholder="e.g. 2028"
                  onChange={(e) => setProfile({ [termEndKey]: e.target.value })}
                />
              </label>
            </div>
          );
        })}

        <label className="profile-form__field">
          <span>Political party of the President</span>
          <input
            type="text"
            value={profile.presidentParty}
            placeholder="e.g. Republican / Democratic"
            onChange={(e) => setProfile({ presidentParty: e.target.value })}
          />
        </label>
        <p className="profile-form__hint">Uses the same "valid through" year as the President above.</p>

        <label className="profile-form__field">
          <span>Chief Justice of the United States</span>
          <input
            type="text"
            value={profile.chiefJustice}
            placeholder="e.g. John Roberts"
            onChange={(e) => setProfile({ chiefJustice: e.target.value })}
          />
        </label>
        <p className="profile-form__hint">Lifetime appointment — no expiration year needed.</p>
      </div>

      <p className="profile-form__note">
        💡 Governor, Senators, and federal officeholders are pre-filled from known current data as of this
        app's last update, but you can edit any of them — always double check against an official source
        (e.g. your Secretary of State's website) before your interview, since officials can change.
        Your Representative depends on your specific district, so unless your state has a single
        at-large seat you'll need to enter it yourself.
      </p>

      <div className="quiz-nav">
        <button className="btn btn--primary" onClick={() => downloadQuestionBank(profile)}>
          📥 Download question bank (.pdf)
        </button>
      </div>
      <p className="profile-form__hint">
        Includes all civics questions, your personalized answers, and the "valid through" years above.
      </p>
    </div>
  );
}
