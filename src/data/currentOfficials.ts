// AUTO-GENERATED reference data for current (as of fetch date) officeholders.
// Sourced from Wikipedia's 'List of current United States senators' / 'governors' / 'representatives'.
// Used only to PRE-FILL the user's profile — always remains fully editable, since officeholders change over time.
export interface OfficialWithTerm {
  name: string;
  termEnd: string;
}

export interface StateOfficials {
  governor: OfficialWithTerm;
  senators: [OfficialWithTerm, OfficialWithTerm];
  representativeAtLarge?: OfficialWithTerm;
}

export const CURRENT_FEDERAL_OFFICIALS = {
  president: { name: "Donald Trump", termEnd: "2029" },
  vicePresident: { name: "JD Vance", termEnd: "2029" },
  speakerOfHouse: { name: "Mike Johnson", termEnd: "2027" },
  chiefJustice: "John Roberts",
  presidentParty: "Republican",
};

export const CURRENT_STATE_OFFICIALS: Record<string, StateOfficials> = {
  "Alabama": {
    governor: { name: "Kay Ivey", termEnd: "2027" },
    senators: [{ name: "Tommy Tuberville", termEnd: "2026" }, { name: "Katie Britt", termEnd: "2028" }],
  },
  "Alaska": {
    governor: { name: "Mike Dunleavy", termEnd: "2026" },
    senators: [{ name: "Dan Sullivan", termEnd: "2026" }, { name: "Lisa Murkowski", termEnd: "2028" }],
    representativeAtLarge: { name: "Nick Begich III", termEnd: "2027" },
  },
  "Arizona": {
    governor: { name: "Katie Hobbs", termEnd: "2027" },
    senators: [{ name: "Mark Kelly", termEnd: "2028" }, { name: "Ruben Gallego", termEnd: "2030" }],
  },
  "Arkansas": {
    governor: { name: "Sarah Huckabee Sanders", termEnd: "2027" },
    senators: [{ name: "Tom Cotton", termEnd: "2026" }, { name: "John Boozman", termEnd: "2028" }],
  },
  "California": {
    governor: { name: "Gavin Newsom", termEnd: "2027" },
    senators: [{ name: "Alex Padilla", termEnd: "2028" }, { name: "Adam Schiff", termEnd: "2030" }],
  },
  "Colorado": {
    governor: { name: "Jared Polis", termEnd: "2027" },
    senators: [{ name: "John Hickenlooper", termEnd: "2026" }, { name: "Michael Bennet", termEnd: "2028" }],
  },
  "Connecticut": {
    governor: { name: "Ned Lamont", termEnd: "2027" },
    senators: [{ name: "Richard Blumenthal", termEnd: "2028" }, { name: "Chris Murphy", termEnd: "2030" }],
  },
  "Delaware": {
    governor: { name: "Matt Meyer", termEnd: "2029" },
    senators: [{ name: "Chris Coons", termEnd: "2026" }, { name: "Lisa Blunt Rochester", termEnd: "2030" }],
    representativeAtLarge: { name: "Sarah McBride", termEnd: "2027" },
  },
  "Florida": {
    governor: { name: "Ron DeSantis", termEnd: "2027" },
    senators: [{ name: "Ashley Moody", termEnd: "2026" }, { name: "Rick Scott", termEnd: "2030" }],
  },
  "Georgia": {
    governor: { name: "Brian Kemp", termEnd: "2027" },
    senators: [{ name: "Jon Ossoff", termEnd: "2026" }, { name: "Raphael Warnock", termEnd: "2028" }],
  },
  "Hawaii": {
    governor: { name: "Josh Green", termEnd: "2026" },
    senators: [{ name: "Brian Schatz", termEnd: "2028" }, { name: "Mazie Hirono", termEnd: "2030" }],
  },
  "Idaho": {
    governor: { name: "Brad Little", termEnd: "2027" },
    senators: [{ name: "Jim Risch", termEnd: "2026" }, { name: "Mike Crapo", termEnd: "2028" }],
  },
  "Illinois": {
    governor: { name: "JB Pritzker", termEnd: "2027" },
    senators: [{ name: "Dick Durbin", termEnd: "2026" }, { name: "Tammy Duckworth", termEnd: "2028" }],
  },
  "Indiana": {
    governor: { name: "Mike Braun", termEnd: "2029" },
    senators: [{ name: "Todd Young", termEnd: "2028" }, { name: "Jim Banks", termEnd: "2030" }],
  },
  "Iowa": {
    governor: { name: "Kim Reynolds", termEnd: "2027" },
    senators: [{ name: "Joni Ernst", termEnd: "2026" }, { name: "Chuck Grassley", termEnd: "2028" }],
  },
  "Kansas": {
    governor: { name: "Laura Kelly", termEnd: "2027" },
    senators: [{ name: "Roger Marshall", termEnd: "2026" }, { name: "Jerry Moran", termEnd: "2028" }],
  },
  "Kentucky": {
    governor: { name: "Andy Beshear", termEnd: "2027" },
    senators: [{ name: "Mitch McConnell", termEnd: "2026" }, { name: "Rand Paul", termEnd: "2028" }],
  },
  "Louisiana": {
    governor: { name: "Jeff Landry", termEnd: "2028" },
    senators: [{ name: "Bill Cassidy", termEnd: "2026" }, { name: "John Kennedy", termEnd: "2028" }],
  },
  "Maine": {
    governor: { name: "Janet Mills", termEnd: "2027" },
    senators: [{ name: "Susan Collins", termEnd: "2026" }, { name: "Angus King", termEnd: "2030" }],
  },
  "Maryland": {
    governor: { name: "Wes Moore", termEnd: "2027" },
    senators: [{ name: "Chris Van Hollen", termEnd: "2028" }, { name: "Angela Alsobrooks", termEnd: "2030" }],
  },
  "Massachusetts": {
    governor: { name: "Maura Healey", termEnd: "2027" },
    senators: [{ name: "Ed Markey", termEnd: "2026" }, { name: "Elizabeth Warren", termEnd: "2030" }],
  },
  "Michigan": {
    governor: { name: "Gretchen Whitmer", termEnd: "2027" },
    senators: [{ name: "Gary Peters", termEnd: "2026" }, { name: "Elissa Slotkin", termEnd: "2030" }],
  },
  "Minnesota": {
    governor: { name: "Tim Walz", termEnd: "2027" },
    senators: [{ name: "Tina Smith", termEnd: "2026" }, { name: "Amy Klobuchar", termEnd: "2030" }],
  },
  "Mississippi": {
    governor: { name: "Tate Reeves", termEnd: "2028" },
    senators: [{ name: "Cindy Hyde-Smith", termEnd: "2026" }, { name: "Roger Wicker", termEnd: "2030" }],
  },
  "Missouri": {
    governor: { name: "Mike Kehoe", termEnd: "2029" },
    senators: [{ name: "Eric Schmitt", termEnd: "2028" }, { name: "Josh Hawley", termEnd: "2030" }],
  },
  "Montana": {
    governor: { name: "Greg Gianforte", termEnd: "2029" },
    senators: [{ name: "Steve Daines", termEnd: "2026" }, { name: "Tim Sheehy", termEnd: "2030" }],
  },
  "Nebraska": {
    governor: { name: "Jim Pillen", termEnd: "2027" },
    senators: [{ name: "Pete Ricketts", termEnd: "2026" }, { name: "Deb Fischer", termEnd: "2030" }],
  },
  "Nevada": {
    governor: { name: "Joe Lombardo", termEnd: "2027" },
    senators: [{ name: "Catherine Cortez Masto", termEnd: "2028" }, { name: "Jacky Rosen", termEnd: "2030" }],
  },
  "New Hampshire": {
    governor: { name: "Kelly Ayotte", termEnd: "2027" },
    senators: [{ name: "Jeanne Shaheen", termEnd: "2026" }, { name: "Maggie Hassan", termEnd: "2028" }],
  },
  "New Jersey": {
    governor: { name: "Mikie Sherrill", termEnd: "2030" },
    senators: [{ name: "Cory Booker", termEnd: "2026" }, { name: "Andy Kim", termEnd: "2030" }],
  },
  "New Mexico": {
    governor: { name: "Michelle Lujan Grisham", termEnd: "2027" },
    senators: [{ name: "Ben Ray Luján", termEnd: "2026" }, { name: "Martin Heinrich", termEnd: "2030" }],
  },
  "New York": {
    governor: { name: "Kathy Hochul", termEnd: "2026" },
    senators: [{ name: "Chuck Schumer", termEnd: "2028" }, { name: "Kirsten Gillibrand", termEnd: "2030" }],
  },
  "North Carolina": {
    governor: { name: "Josh Stein", termEnd: "2029" },
    senators: [{ name: "Thom Tillis", termEnd: "2026" }, { name: "Ted Budd", termEnd: "2028" }],
  },
  "North Dakota": {
    governor: { name: "Kelly Armstrong", termEnd: "2028" },
    senators: [{ name: "John Hoeven", termEnd: "2028" }, { name: "Kevin Cramer", termEnd: "2030" }],
    representativeAtLarge: { name: "Julie Fedorchak", termEnd: "2027" },
  },
  "Ohio": {
    governor: { name: "Mike DeWine", termEnd: "2027" },
    senators: [{ name: "Jon Husted", termEnd: "2026" }, { name: "Bernie Moreno", termEnd: "2030" }],
  },
  "Oklahoma": {
    governor: { name: "Kevin Stitt", termEnd: "2027" },
    senators: [{ name: "Alan Armstrong", termEnd: "2026" }, { name: "James Lankford", termEnd: "2028" }],
  },
  "Oregon": {
    governor: { name: "Tina Kotek", termEnd: "2027" },
    senators: [{ name: "Jeff Merkley", termEnd: "2026" }, { name: "Ron Wyden", termEnd: "2028" }],
  },
  "Pennsylvania": {
    governor: { name: "Josh Shapiro", termEnd: "2027" },
    senators: [{ name: "John Fetterman", termEnd: "2028" }, { name: "Dave McCormick", termEnd: "2030" }],
  },
  "Rhode Island": {
    governor: { name: "Dan McKee", termEnd: "2027" },
    senators: [{ name: "Jack Reed", termEnd: "2026" }, { name: "Sheldon Whitehouse", termEnd: "2030" }],
  },
  "South Carolina": {
    governor: { name: "Henry McMaster", termEnd: "2027" },
    senators: [{ name: "Darline Graham", termEnd: "2026" }, { name: "Tim Scott", termEnd: "2028" }],
  },
  "South Dakota": {
    governor: { name: "Larry Rhoden", termEnd: "2027" },
    senators: [{ name: "Mike Rounds", termEnd: "2026" }, { name: "John Thune", termEnd: "2028" }],
    representativeAtLarge: { name: "Dusty Johnson", termEnd: "2027" },
  },
  "Tennessee": {
    governor: { name: "Bill Lee", termEnd: "2027" },
    senators: [{ name: "Bill Hagerty", termEnd: "2026" }, { name: "Marsha Blackburn", termEnd: "2030" }],
  },
  "Texas": {
    governor: { name: "Greg Abbott", termEnd: "2027" },
    senators: [{ name: "John Cornyn", termEnd: "2026" }, { name: "Ted Cruz", termEnd: "2030" }],
  },
  "Utah": {
    governor: { name: "Spencer Cox", termEnd: "2029" },
    senators: [{ name: "Mike Lee", termEnd: "2028" }, { name: "John Curtis", termEnd: "2030" }],
  },
  "Vermont": {
    governor: { name: "Phil Scott", termEnd: "2027" },
    senators: [{ name: "Peter Welch", termEnd: "2028" }, { name: "Bernie Sanders", termEnd: "2030" }],
    representativeAtLarge: { name: "Becca Balint", termEnd: "2027" },
  },
  "Virginia": {
    governor: { name: "Abigail Spanberger", termEnd: "2030" },
    senators: [{ name: "Mark Warner", termEnd: "2026" }, { name: "Tim Kaine", termEnd: "2030" }],
  },
  "Washington": {
    governor: { name: "Bob Ferguson", termEnd: "2029" },
    senators: [{ name: "Patty Murray", termEnd: "2028" }, { name: "Maria Cantwell", termEnd: "2030" }],
  },
  "West Virginia": {
    governor: { name: "Patrick Morrisey", termEnd: "2029" },
    senators: [{ name: "Shelley Moore Capito", termEnd: "2026" }, { name: "Jim Justice", termEnd: "2030" }],
  },
  "Wisconsin": {
    governor: { name: "Tony Evers", termEnd: "2027" },
    senators: [{ name: "Ron Johnson", termEnd: "2028" }, { name: "Tammy Baldwin", termEnd: "2030" }],
  },
  "Wyoming": {
    governor: { name: "Mark Gordon", termEnd: "2027" },
    senators: [{ name: "Cynthia Lummis", termEnd: "2026" }, { name: "John Barrasso", termEnd: "2030" }],
    representativeAtLarge: { name: "Harriet Hageman", termEnd: "2027" },
  },
};
