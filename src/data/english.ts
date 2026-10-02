// English module content, based on the official USCIS Reading and Writing
// Vocabulary lists used in the naturalization (N-400) English test. During
// the real interview, the officer reads up to 3 sentences built from the
// Reading list (you must read 1 correctly) and dictates up to 3 sentences
// built from the Writing list (you must write 1 correctly). The example
// sentences below are original practice sentences written to use only
// words from each official list, mirroring that format.

export type VocabCategory =
  | "People"
  | "Civics"
  | "Places"
  | "Holidays"
  | "Months"
  | "Question Words"
  | "Verbs"
  | "Other";

export interface VocabWord {
  word: string;
  category: VocabCategory;
  translation: string;
}

/** Official USCIS Reading Vocabulary list. */
export const READING_VOCAB: VocabWord[] = [
  // People
  { word: "Abraham Lincoln", category: "People", translation: "Abraham Lincoln" },
  { word: "George Washington", category: "People", translation: "George Washington" },
  // Civics
  { word: "American flag", category: "Civics", translation: "bandera estadounidense" },
  { word: "Bill of Rights", category: "Civics", translation: "Carta de Derechos" },
  { word: "capital", category: "Civics", translation: "capital" },
  { word: "citizen", category: "Civics", translation: "ciudadano/a" },
  { word: "city", category: "Civics", translation: "ciudad" },
  { word: "Congress", category: "Civics", translation: "Congreso" },
  { word: "country", category: "Civics", translation: "país" },
  { word: "Father of Our Country", category: "Civics", translation: "Padre de Nuestro País" },
  { word: "government", category: "Civics", translation: "gobierno" },
  { word: "President", category: "Civics", translation: "presidente" },
  { word: "right", category: "Civics", translation: "derecho" },
  { word: "Senators", category: "Civics", translation: "senadores" },
  { word: "state/states", category: "Civics", translation: "estado/estados" },
  { word: "White House", category: "Civics", translation: "Casa Blanca" },
  // Places
  { word: "America", category: "Places", translation: "América" },
  { word: "United States", category: "Places", translation: "Estados Unidos" },
  { word: "U.S.", category: "Places", translation: "EE. UU." },
  // Holidays
  { word: "Presidents' Day", category: "Holidays", translation: "Día de los Presidentes" },
  { word: "Memorial Day", category: "Holidays", translation: "Día de los Caídos" },
  { word: "Flag Day", category: "Holidays", translation: "Día de la Bandera" },
  { word: "Independence Day", category: "Holidays", translation: "Día de la Independencia" },
  { word: "Labor Day", category: "Holidays", translation: "Día del Trabajo" },
  { word: "Columbus Day", category: "Holidays", translation: "Día de la Raza/Colón" },
  { word: "Thanksgiving", category: "Holidays", translation: "Día de Acción de Gracias" },
  // Question words
  { word: "How", category: "Question Words", translation: "cómo" },
  { word: "What", category: "Question Words", translation: "qué" },
  { word: "When", category: "Question Words", translation: "cuándo" },
  { word: "Where", category: "Question Words", translation: "dónde" },
  { word: "Who", category: "Question Words", translation: "quién" },
  { word: "Why", category: "Question Words", translation: "por qué" },
  // Verbs
  { word: "can", category: "Verbs", translation: "poder" },
  { word: "come", category: "Verbs", translation: "venir" },
  { word: "do/does", category: "Verbs", translation: "hacer (auxiliar)" },
  { word: "elects", category: "Verbs", translation: "elige" },
  { word: "have/has", category: "Verbs", translation: "tener" },
  { word: "is/are/was/be", category: "Verbs", translation: "ser/estar" },
  { word: "lives/lived", category: "Verbs", translation: "vive/vivió" },
  { word: "meet", category: "Verbs", translation: "reunirse" },
  { word: "name", category: "Verbs", translation: "nombrar" },
  { word: "pay", category: "Verbs", translation: "pagar" },
  { word: "vote", category: "Verbs", translation: "votar" },
  { word: "want", category: "Verbs", translation: "querer" },
  // Other
  { word: "colors", category: "Other", translation: "colores" },
  { word: "dollar bill", category: "Other", translation: "billete de dólar" },
  { word: "first", category: "Other", translation: "primero" },
  { word: "largest", category: "Other", translation: "más grande" },
  { word: "many", category: "Other", translation: "muchos/as" },
  { word: "most", category: "Other", translation: "la mayoría" },
  { word: "north", category: "Other", translation: "norte" },
  { word: "one", category: "Other", translation: "uno" },
  { word: "people", category: "Other", translation: "gente/personas" },
  { word: "second", category: "Other", translation: "segundo" },
  { word: "south", category: "Other", translation: "sur" },
];

/** Official USCIS Writing Vocabulary list. */
export const WRITING_VOCAB: VocabWord[] = [
  // People
  { word: "Adams", category: "People", translation: "Adams" },
  { word: "Lincoln", category: "People", translation: "Lincoln" },
  { word: "Washington", category: "People", translation: "Washington" },
  // Civics
  { word: "American Indians", category: "Civics", translation: "indígenas americanos" },
  { word: "capital", category: "Civics", translation: "capital" },
  { word: "citizens", category: "Civics", translation: "ciudadanos" },
  { word: "Civil War", category: "Civics", translation: "Guerra Civil" },
  { word: "Congress", category: "Civics", translation: "Congreso" },
  { word: "Father of Our Country", category: "Civics", translation: "Padre de Nuestro País" },
  { word: "flag", category: "Civics", translation: "bandera" },
  { word: "free", category: "Civics", translation: "libre" },
  { word: "freedom of speech", category: "Civics", translation: "libertad de expresión" },
  { word: "President", category: "Civics", translation: "presidente" },
  { word: "right", category: "Civics", translation: "derecho" },
  { word: "Senators", category: "Civics", translation: "senadores" },
  { word: "state/states", category: "Civics", translation: "estado/estados" },
  { word: "White House", category: "Civics", translation: "Casa Blanca" },
  // Places
  { word: "Alaska", category: "Places", translation: "Alaska" },
  { word: "California", category: "Places", translation: "California" },
  { word: "Canada", category: "Places", translation: "Canadá" },
  { word: "Delaware", category: "Places", translation: "Delaware" },
  { word: "Mexico", category: "Places", translation: "México" },
  { word: "New York City", category: "Places", translation: "Nueva York (ciudad)" },
  { word: "United States", category: "Places", translation: "Estados Unidos" },
  { word: "Washington, D.C.", category: "Places", translation: "Washington, D.C." },
  // Months
  { word: "February", category: "Months", translation: "febrero" },
  { word: "May", category: "Months", translation: "mayo" },
  { word: "June", category: "Months", translation: "junio" },
  { word: "July", category: "Months", translation: "julio" },
  { word: "September", category: "Months", translation: "septiembre" },
  { word: "October", category: "Months", translation: "octubre" },
  { word: "November", category: "Months", translation: "noviembre" },
  // Holidays
  { word: "Presidents' Day", category: "Holidays", translation: "Día de los Presidentes" },
  { word: "Memorial Day", category: "Holidays", translation: "Día de los Caídos" },
  { word: "Flag Day", category: "Holidays", translation: "Día de la Bandera" },
  { word: "Independence Day", category: "Holidays", translation: "Día de la Independencia" },
  { word: "Labor Day", category: "Holidays", translation: "Día del Trabajo" },
  { word: "Columbus Day", category: "Holidays", translation: "Día de la Raza/Colón" },
  { word: "Thanksgiving", category: "Holidays", translation: "Día de Acción de Gracias" },
  // Verbs
  { word: "can", category: "Verbs", translation: "poder" },
  { word: "come", category: "Verbs", translation: "venir" },
  { word: "elect", category: "Verbs", translation: "elegir" },
  { word: "have/has", category: "Verbs", translation: "tener" },
  { word: "is/was/be", category: "Verbs", translation: "ser/estar" },
  { word: "lives/lived", category: "Verbs", translation: "vive/vivió" },
  { word: "meets", category: "Verbs", translation: "se reúne" },
  { word: "pay", category: "Verbs", translation: "pagar" },
  { word: "vote", category: "Verbs", translation: "votar" },
  { word: "want", category: "Verbs", translation: "querer" },
  // Other
  { word: "blue", category: "Other", translation: "azul" },
  { word: "dollar bill", category: "Other", translation: "billete de dólar" },
  { word: "fifty/50", category: "Other", translation: "cincuenta/50" },
  { word: "first", category: "Other", translation: "primero" },
  { word: "largest", category: "Other", translation: "más grande" },
  { word: "most", category: "Other", translation: "la mayoría" },
  { word: "north", category: "Other", translation: "norte" },
  { word: "one", category: "Other", translation: "uno" },
  { word: "one hundred/100", category: "Other", translation: "cien/100" },
  { word: "people", category: "Other", translation: "gente/personas" },
  { word: "red", category: "Other", translation: "rojo" },
  { word: "second", category: "Other", translation: "segundo" },
  { word: "south", category: "Other", translation: "sur" },
  { word: "taxes", category: "Other", translation: "impuestos" },
  { word: "white", category: "Other", translation: "blanco" },
];

export interface PracticeSentence {
  id: string;
  text: string;
}

/**
 * Practice sentences for the Reading test, written using only words from
 * READING_VOCAB. In the real test the officer shows up to 3 and you must
 * read 1 of them aloud correctly.
 */
export const READING_SENTENCES: PracticeSentence[] = [
  { id: "r1", text: "Who is the President of the United States?" },
  { id: "r2", text: "What is the capital of the United States?" },
  { id: "r3", text: "The President lives in the White House." },
  { id: "r4", text: "Citizens have the right to vote." },
  { id: "r5", text: "George Washington is the Father of Our Country." },
  { id: "r6", text: "The American flag has many colors." },
  { id: "r7", text: "We want a government for the people." },
  { id: "r8", text: "When do people vote for the President?" },
  { id: "r9", text: "Congress can meet here." },
  { id: "r10", text: "Thanksgiving and Labor Day are holidays." },
  { id: "r11", text: "The United States is one of the largest countries." },
  { id: "r12", text: "Many people come to America." },
  { id: "r13", text: "Senators have a name and a state." },
  { id: "r14", text: "Why do we have the Bill of Rights?" },
  { id: "r15", text: "Abraham Lincoln was a President." },
  { id: "r16", text: "Where is the capital of the U.S.?" },
  { id: "r17", text: "The second largest city has most of the people." },
  { id: "r18", text: "How many Senators are in Congress?" },
];

/**
 * Practice sentences for the Writing test, written using only words from
 * WRITING_VOCAB. In the real test the officer dictates up to 3 and you
 * must write 1 of them correctly.
 */
export const WRITING_SENTENCES: PracticeSentence[] = [
  { id: "w1", text: "Citizens have the right to vote." },
  { id: "w2", text: "The President lives in the White House." },
  { id: "w3", text: "Washington was the Father of Our Country." },
  { id: "w4", text: "The flag is red, white, and blue." },
  { id: "w5", text: "People pay taxes." },
  { id: "w6", text: "Congress meets in Washington, D.C." },
  { id: "w7", text: "We want freedom of speech." },
  { id: "w8", text: "California is the largest state." },
  { id: "w9", text: "Lincoln was the President during the Civil War." },
  { id: "w10", text: "Many people come to the United States." },
  { id: "w11", text: "Senators can vote in Congress." },
  { id: "w12", text: "Thanksgiving is in November." },
  { id: "w13", text: "Labor Day is in September." },
  { id: "w14", text: "The United States is north of Mexico." },
  { id: "w15", text: "Citizens are free to have most rights." },
];
