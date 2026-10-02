import { Link } from "react-router-dom";
import "./ProfilePrompt.css";

export interface ProfilePromptProps {
  done: number;
  total: number;
}

/** Small nudge shown on study pages when the user hasn't fully set up their civics profile yet. */
export function ProfilePrompt({ done, total }: ProfilePromptProps) {
  if (done >= total) return null;
  return (
    <Link to="/profile" className="profile-prompt">
      📍 {done}/{total} personalized answers set — add your state &amp; officials so no question shows
      "answers vary"
    </Link>
  );
}
