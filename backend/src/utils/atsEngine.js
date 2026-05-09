// ==============================
// STRICT ATS ENGINE (PRO LEVEL)
// ==============================

function normalize(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+.#% ]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
}

// ==============================
// SKILLS (STRICT FILTER)
// ==============================
function extractSkills(text) {
  const tokens = normalize(text);

  let skills = [];

  tokens.forEach((t) => {
    if (
      t.includes("react.js") ||
      t.includes("node") ||
      t.includes("next") ||
      t.includes("express") ||
      t.includes("mongo") ||
      t.includes("sql") ||
      t.includes("api") ||
      t.includes("docker") ||
      t.includes("aws") ||
      t.includes("git") ||
      t.includes("python") ||
      t.includes("java") ||
      t.includes("javascript") ||
      t.includes("typescript") ||
      t.includes("html") ||
      t.includes("css") ||
      t.includes("tailwind") ||
      t.includes("firebase") ||
      t.includes("graphql") ||
      t.includes("kubernetes") ||
      t.includes("azure") ||
      t.includes("linux") ||
      t.includes("flutter") ||
      t.includes("kotlin")
    ) {
      skills.push(t);
    }
  });

  return [...new Set(skills)];
}

// ==============================
// EXPERIENCE (STRICT IMPACT RULE)
// ==============================
function extractExperience(text) {
  const t = text.toLowerCase();

  const yearMatch = t.match(/(\d+)\+?\s*(years|year)/);
  const years = yearMatch ? parseInt(yearMatch[1]) : 0;

  const impactWords = [
    "built",
    "developed",
    "optimized",
    "improved",
    "increased",
    "reduced",
    "scaled",
    "designed"
  ];

  let impactScore = 0;
  impactWords.forEach((w) => {
    if (t.includes(w)) impactScore++;
  });

  const metrics = (t.match(/\d+%/g) || []).length;

  return { years, impactScore, metrics };
}

// ==============================
// STRICT ATS SCORING ENGINE
// ==============================
function calculateATSScore(text) {
  const skills = extractSkills(text);
  const exp = extractExperience(text);
  const t = text.toLowerCase();

  let score = 0;
  let penalty = 0;

  // =========================
  // 🚨 HARD BLOCK CONDITIONS
  // =========================
  if (skills.length === 0) return { score: 5, level: "Weak", reason: "No technical skills detected", debug: { skills: [], exp: { years: 0, impactScore: 0, metrics: 0 } } };
  if (text.length < 80) return { score: 0, level: "Weak", reason: "Too short resume", debug: { skills: [], exp: { years: 0, impactScore: 0, metrics: 0 } } };

  // =========================
  // 1. SKILLS (STRICT 30)
  // =========================
  let skillScore = skills.length * 3;

  // cap skill inflation
  skillScore = Math.min(30, skillScore);

  // penalty for low skill diversity
  if (skills.length < 3) penalty += 10;

  score += skillScore;

  // =========================
  // 2. EXPERIENCE (STRICT 25)
  // =========================
  let expScore = 0;

  if (exp.years >= 5) expScore = 25;
  else if (exp.years >= 2) expScore = 18;
  else if (exp.years > 0) expScore = 10;
  else expScore = 3;

  // 🚨 STRICT REQUIREMENT: IMPACT REQUIRED
  if (exp.impactScore === 0 && exp.metrics === 0) {
    expScore = Math.min(expScore, 8);
    penalty += 10;
  }

  expScore += Math.min(5, exp.impactScore + exp.metrics);
  score += Math.min(25, expScore);

  // =========================
  // 3. CAREER DEPTH (STRICT 15)
  // =========================
  let depth = skills.length >= 8 ? 15 :
    skills.length >= 5 ? 10 :
      skills.length >= 3 ? 6 : 3;

  score += depth;

  // =========================
  // 4. EDUCATION (STRICT 10)
  // =========================
  let edu =
    t.includes("b.tech") ||
      t.includes("bachelor") ||
      t.includes("m.tech") ||
      t.includes("degree") ||
      t.includes("university") ||
      t.includes("college")
      ? 10
      : 4;

  score += edu;

  // =========================
  // 5. RESUME QUALITY (STRICT 20)
  // =========================
  let quality = 0;

  if (t.includes("experience")) quality += 5;
  if (t.includes("project")) quality += 5;
  if (t.includes("%")) quality += 5;
  if (text.length > 600) quality += 5;

  // 🚨 STRICT PENALTY: NO STRUCTURE
  if (!t.includes("skills")) penalty += 5;
  if (!t.includes("education")) penalty += 5;
  if (!t.includes("experience")) penalty += 5;

  score += quality;

  // =========================
  // 🚨 ANTI-KEYWORD STUFFING
  // =========================
  const words = text.split(/\s+/).filter(w => w.length > 3);
  const repeatedWords = words.filter((w, i) => words.indexOf(w) !== i);

  if (new Set(words).size < words.length * 0.6) {
    penalty += 15;
  }

  // =========================
  // FINAL SCORE (STRICT CAP)
  // =========================
  let finalScore = score - penalty;

  // 🚨 STRICT CAP RULES
  if (exp.impactScore === 0) {
    finalScore = Math.min(finalScore, 70);
  }

  if (skills.length < 3) {
    finalScore = Math.min(finalScore, 50);
  }

  return {
    score: Math.max(0, Math.min(100, finalScore)),
    level:
      finalScore >= 85 ? "Strong" :
        finalScore >= 70 ? "Good" :
          finalScore >= 50 ? "Average" : "Weak",
    debug: {
      skills,
      exp,
      skillScore,
      expScore,
      depth,
      edu,
      quality,
      penalty
    }
  };
}

module.exports = { calculateATSScore };
