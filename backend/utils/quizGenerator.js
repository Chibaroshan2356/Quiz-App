// Generates varied multiple-choice questions for a topic with subtopic rotation and template diversification
// Returns an object { title, description, category, difficulty, timeLimit, questions, totalQuestions, totalPoints }

function normalizeDifficulty(difficulty) {
  const map = {
    easy: { options: 4, points: 1 },
    medium: { options: 4, points: 2 },
    hard: { options: 4, points: 3 },
  };
  return map[difficulty] || map.medium;
}

function deriveSubtopics(topic) {
  const lower = String(topic || '').toLowerCase();
  const tokens = lower.split(/\s+/).filter(Boolean);
  const heuristics = [
    lower.includes('algebra') ? ['variables', 'equations', 'inequalities', 'polynomials', 'functions'] : null,
    lower.includes('calculus') ? ['limits', 'derivatives', 'integrals', 'series', 'continuity'] : null,
    lower.includes('geometry') ? ['angles', 'triangles', 'circles', 'area', 'volume'] : null,
    lower.includes('javascript') ? ['variables', 'arrays', 'objects', 'promises', 'closures'] : null,
    lower.includes('react') ? ['components', 'state', 'props', 'hooks', 'effects'] : null,
    lower.includes('database') ? ['normalization', 'indexes', 'transactions', 'joins', 'ACID'] : null,
    lower.includes('http') ? ['status codes', 'methods', 'headers', 'caching', 'cookies'] : null,
  ].flat().filter(Boolean);
  const base = [
    ...new Set([
      ...tokens,
      tokens.join(' '),
      ...heuristics,
    ])
  ];
  return base.length ? base : [lower || 'general'];
}

function buildTemplates(topic) {
  const t = topic;
  return [
    (s) => ({
      stem: `Which statement best describes ${s} in the context of ${t}?`,
      correct: `${s} is a core aspect of ${t} understood by its purpose or effect.`,
      distractors: [
        `${s} is unrelated to ${t}.`,
        `${s} only applies to visual design and not ${t}.`,
        `${s} is purely historical folklore, not part of ${t}.`,
      ],
    }),
    (s) => ({
      stem: `When is ${s} most appropriately used in ${t}?`,
      correct: `When ${s} directly addresses a typical ${t} need.`,
      distractors: [
        `Only in rare, unrelated scenarios.`,
        `Never; it is always discouraged in ${t}.`,
        `Only for decorative purposes.`,
      ],
    }),
    (s) => ({
      stem: `What outcome is expected when applying ${s} within ${t}?`,
      correct: `It produces the standard ${t} result associated with ${s}.`,
      distractors: [
        `It always causes an error.`,
        `It has no effect on any ${t} process.`,
        `It contradicts basic ${t} principles.`,
      ],
    }),
    (s) => ({
      stem: `Which example best illustrates ${s} in ${t}?`,
      correct: `A case where ${s} is applied to achieve a specific ${t} goal.`,
      distractors: [
        `An unrelated example with no tie to ${t}.`,
        `A purely hypothetical case with no relevance to ${t}.`,
        `An example about a different field.`,
      ],
    }),
  ];
}

function isAlgebraTopic(lower) {
  return lower.includes('algebra') || lower.includes('equation') || lower.includes('polynomial') || lower.includes('inequalit');
}

function isHistoryTopic(lower) {
  return (
    lower.includes('history') ||
    lower.includes('world war') ||
    lower.includes('ww1') || lower.includes('world war i') ||
    lower.includes('ww2') || lower.includes('world war ii')
  );
}

function isBiologyTopic(lower) {
  return (
    lower.includes('biology') || lower.includes('cell') || lower.includes('genetic') || lower.includes('dna') ||
    lower.includes('ecosystem') || lower.includes('photosynthesis') || lower.includes('evolution')
  );
}

function isGeographyTopic(lower) {
  return (
    lower.includes('geography') || lower.includes('capital') || lower.includes('continent') || lower.includes('river') ||
    lower.includes('mountain') || lower.includes('country')
  );
}

function isEconomicsTopic(lower) {
  return (
    lower.includes('economics') || lower.includes('supply') || lower.includes('demand') || lower.includes('inflation') ||
    lower.includes('gdp') || lower.includes('market') || lower.includes('fiscal') || lower.includes('monetary')
  );
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function buildAlgebraTemplates() {
  // Algebra-focused templates producing concrete numeric/concept questions
  return [
    () => {
      // Solve linear equation ax + b = c
      const a = randomInt(2, 9);
      const x = randomInt(-5, 9);
      const b = randomInt(-9, 9);
      const c = a * x + b;
      const correct = `${x}`;
      const distractors = [
        `${x + a}`,
        `${x - a}`,
        `${(c - b)}` // common slip of forgetting divide by a
      ];
      return {
        stem: `Solve for x: ${a}x + ${b} = ${c}`,
        correct,
        distractors,
      };
    },
    () => {
      // Simplify expression
      const m = randomInt(2, 6);
      const n = randomInt(2, 6);
      const stem = `Simplify: ${m}x + ${n}x`;
      const correct = `${m + n}x`;
      const distractors = [ `${m - n}x`, `${m}x^${n}`, `${m*n}x` ];
      return { stem, correct, distractors };
    },
    () => {
      // Evaluate expression when x = k
      const a = randomInt(-5, 7);
      const b = randomInt(-5, 7);
      const k = randomInt(-4, 6);
      const value = a * k + b;
      const stem = `Evaluate ${a}x + ${b} when x = ${k}`;
      const correct = `${value}`;
      const distractors = [ `${a + b + k}`, `${a * (k + b)}`, `${a - k + b}` ];
      return { stem, correct, distractors };
    },
    () => {
      // Factor simple quadratic x^2 + sx + p where factors are integers
      const r1 = randomInt(-5, 5) || 2;
      const r2 = randomInt(-5, 5) || -3;
      const s = r1 + r2;
      const p = r1 * r2;
      const stem = `Factor: x^2 + ${s}x + ${p}`;
      const correct = `(x + ${r1})(x + ${r2})`;
      const distractors = [ `(x + ${s})(x + ${p})`, `(x - ${r1})(x - ${r2})`, `(x + ${r2})(x - ${r1})` ];
      return { stem, correct, distractors };
    },
    () => {
      // Inequality solution
      const a = randomInt(1, 6);
      const x = randomInt(-4, 6);
      const b = randomInt(-6, 6);
      const c = a * x + b + randomInt(1, 4);
      const stem = `Solve: ${a}x + ${b} < ${c}`;
      const bound = Math.floor((c - b - 1) / a);
      const correct = `x < ${bound + 1}`;
      const distractors = [ `x > ${bound}`, `x  ${bound}`, `x  ${bound}` ];
      return { stem, correct, distractors };
    },
  ];
}

function buildCodeTemplates(topic) {
  const lower = String(topic || '').toLowerCase();
  if (!(lower.includes('javascript') || lower.includes('react'))) return [];
  return [
    () => ({
      stem: `What is the output of this snippet?\n\nconst arr = [1,2,3];\nconsole.log(arr.map(x => x*2)[1]);`,
      correct: `4`,
      distractors: [`2`, `6`, `undefined`],
    }),
    () => ({
      stem: `In JavaScript, what does Array.prototype.filter return?`,
      correct: `A new array containing elements that pass the predicate.`,
      distractors: [
        `The count of elements that pass the predicate.`,
        `It mutates and returns the original array.`,
        `It throws if any element fails the predicate.`,
      ],
    }),
  ];
}

function buildHistorySubtopics(lower) {
  // Curated subtopics suitable for World Wars
  const isWW1 = lower.includes('ww1') || lower.includes('world war i');
  const isWW2 = lower.includes('ww2') || lower.includes('world war ii');
  const common = ['causes', 'alliances', 'battles', 'leaders', 'home front', 'technology', 'aftermath', 'treaties'];
  if (isWW1) return ['1914-1918', 'Triple Entente', 'Triple Alliance', 'Somme', 'Verdun', 'Kaiser Wilhelm II', 'Woodrow Wilson', 'Treaty of Versailles', ...common];
  if (isWW2) return ['1939-1945', 'Allies', 'Axis', 'Stalingrad', 'Normandy', 'Winston Churchill', 'Franklin D. Roosevelt', 'Adolf Hitler', 'Yalta', ...common];
  return ['World Wars overview', 'causes', 'alliances', 'battles', 'leaders', 'technology', 'home front', 'economy', 'treaties', 'aftermath'];
}

function buildHistoryTemplates(topic) {
  const lower = String(topic || '').toLowerCase();
  const isWW1 = lower.includes('ww1') || lower.includes('world war i');
  const isWW2 = lower.includes('ww2') || lower.includes('world war ii');
  const warLabel = isWW1 ? 'World War I' : isWW2 ? 'World War II' : 'the World Wars';

  // A pool of factual question builders
  const pool = [
    () => ({
      stem: `Which was a common cause of ${warLabel}?`,
      correct: `Militarism, alliances, imperialism, and nationalism.`,
      distractors: [
        `The invention of the printing press in the 15th century.`,
        `Debates over heliocentrism in the Renaissance.`,
        `A dispute about internet standards across Europe.`,
      ],
    }),
    () => ({
      stem: `Which opposing blocs fought in World War I?`,
      correct: `Triple Entente vs Triple Alliance.`,
      distractors: [
        `NATO vs Warsaw Pact.`,
        `Allies vs Central Powers is incorrect naming.`,
        `United Nations vs League of Nations.`,
      ],
    }),
    () => ({
      stem: `Which opposing blocs fought in World War II?`,
      correct: `Allies vs Axis.`,
      distractors: [
        `Triple Entente vs Triple Alliance.`,
        `NATO vs Warsaw Pact.`,
        `Coalition vs Confederacy.`,
      ],
    }),
    () => ({
      stem: `When did ${warLabel} occur?`,
      correct: isWW1 ? `1914–1918` : isWW2 ? `1939–1945` : `1914–1918 and 1939–1945`,
      distractors: [
        `1803–1815`,
        `1861–1865`,
        `1969–1972`,
      ],
    }),
    () => ({
      stem: `Which battle is closely associated with World War II?`,
      correct: `Stalingrad`,
      distractors: [`Waterloo`, `Hastings`, `Antietam`],
    }),
    () => ({
      stem: `Which battle is closely associated with World War I?`,
      correct: `Somme`,
      distractors: [`Midway`, `Gettysburg`, `Agincourt`],
    }),
    () => ({
      stem: `Who was the British Prime Minister during much of World War II?`,
      correct: `Winston Churchill`,
      distractors: [`Neville Chamberlain`, `Margaret Thatcher`, `Clement Attlee`],
    }),
    () => ({
      stem: `Which treaty formally ended World War I?`,
      correct: `Treaty of Versailles`,
      distractors: [`Treaty of Paris (1898)`, `Treaty of Tordesillas`, `Treaty of Ghent`],
    }),
    () => ({
      stem: `Which nations formed the Axis Powers?`,
      correct: `Germany, Italy, and Japan`,
      distractors: [`Germany, UK, and USA`, `Italy, France, and Spain`, `Japan, China, and Korea`],
    }),
    () => ({
      stem: `What was a major effect of total war on the home front?`,
      correct: `Rationing and large-scale mobilization of civilian economies.`,
      distractors: [`Immediate abolition of income taxes.`, `Universal conscription of only teenagers.`, `Complete shutdown of all factories.`],
    }),
  ];

  return pool;
}

function buildBiologyTemplates() {
  return [
    () => ({
      stem: `Which organelle is primarily responsible for energy production in eukaryotic cells?`,
      correct: `Mitochondria`,
      distractors: [`Ribosome`, `Golgi apparatus`, `Lysosome`],
    }),
    () => ({
      stem: `What is the base-pairing rule in DNA?`,
      correct: `A pairs with T; C pairs with G`,
      distractors: [`A pairs with C; T pairs with G`, `A pairs with G; C pairs with T`, `All bases pair randomly`],
    }),
    () => ({
      stem: `What is the primary purpose of photosynthesis?`,
      correct: `Convert light energy into chemical energy (glucose)`,
      distractors: [`Break down glucose to release energy`, `Fix nitrogen in the soil`, `Produce ATP in mitochondria`],
    }),
    () => ({
      stem: `Which evidence supports biological evolution?`,
      correct: `Fossil records and genetic similarities among species`,
      distractors: [`Seasonal weather patterns`, `Volcanic activity`, `Ocean tides`],
    }),
  ];
}

function buildGeographyTemplates() {
  return [
    () => ({
      stem: `What is the capital of Japan?`,
      correct: `Tokyo`,
      distractors: [`Kyoto`, `Osaka`, `Hiroshima`],
    }),
    () => ({
      stem: `Which is the longest river in the world (by most measures)?`,
      correct: `Nile`,
      distractors: [`Amazon`, `Yangtze`, `Mississippi`],
    }),
    () => ({
      stem: `On which continent is the Sahara Desert located?`,
      correct: `Africa`,
      distractors: [`Asia`, `Australia`, `South America`],
    }),
    () => ({
      stem: `Which mountain range includes Mount Everest?`,
      correct: `Himalayas`,
      distractors: [`Andes`, `Rockies`, `Alps`],
    }),
  ];
}

function buildEconomicsTemplates() {
  return [
    () => ({
      stem: `According to basic microeconomics, what happens when price rises (ceteris paribus)?`,
      correct: `Quantity demanded decreases`,
      distractors: [`Quantity demanded increases`, `Demand shifts right`, `Supply shifts left only`],
    }),
    () => ({
      stem: `What does GDP primarily measure?`,
      correct: `Total value of goods and services produced within a country`,
      distractors: [`Government tax revenues`, `Average household income`, `Money supply (M2)`],
    }),
    () => ({
      stem: `Which policy tool is associated with central banks?`,
      correct: `Monetary policy (e.g., interest rates)`,
      distractors: [`Fiscal policy (government spending)`, `Trade tariffs`, `Antitrust enforcement alone`],
    }),
    () => ({
      stem: `What is inflation?`,
      correct: `A sustained increase in the general price level`,
      distractors: [`A decrease in unemployment`, `A fall in GDP per capita`, `A rise in exports only`],
    }),
  ];
}

function shuffle(array) {
  return array
    .map((value) => ({ value, sort: Math.random() }))
    .sort((a, b) => a.sort - b.sort)
    .map(({ value }) => value);
}

function maybeAttachImage(topic) {
  const lower = String(topic || '').toLowerCase();
  // Simple heuristic demo images (replace with your CDN/asset URLs)
  if (lower.includes('world war')) return 'https://upload.wikimedia.org/wikipedia/commons/1/1b/WWI_Trench.jpg';
  if (lower.includes('algebra')) return '';
  if (lower.includes('javascript')) return '';
  if (lower.includes('geography')) return 'https://upload.wikimedia.org/wikipedia/commons/8/80/World_map_-_low_resolution.svg';
  return '';
}

function buildQuestion(idx, topic, subtopics, templates, codeTemplates, points) {
  // every third question can be code-oriented if available
  if (codeTemplates.length && idx % 3 === 2) {
    const ct = codeTemplates[idx % codeTemplates.length]();
    const all = shuffle([ct.correct, ...ct.distractors]);
    const correctIndex = all.indexOf(ct.correct);
    return {
      type: 'multiple-choice',
      question: ct.stem,
      options: all,
      correctAnswer: correctIndex,
      explanation: `Because ${ct.correct} matches the evaluated result or accurate definition.`,
      points,
      imageUrl: maybeAttachImage(topic),
    };
  }

  const sub = subtopics[idx % subtopics.length] || topic;
  const tpl = templates[idx % templates.length](sub);
  const all = shuffle([tpl.correct, ...tpl.distractors]);
  const correctIndex = all.indexOf(tpl.correct);
  return {
    type: 'multiple-choice',
    question: tpl.stem,
    options: all,
    correctAnswer: correctIndex,
    explanation: `The correct option best aligns with ${sub} within ${topic}.`,
    points,
    imageUrl: maybeAttachImage(topic),
  };
}

function generateQuiz({ topic, difficulty = 'medium', numQuestions = 10 }) {
  const { options, points } = normalizeDifficulty(difficulty);
  const lower = String(topic || '').toLowerCase();
  const subtopics = isHistoryTopic(lower) ? buildHistorySubtopics(lower) : deriveSubtopics(topic);
  const templates = isAlgebraTopic(lower)
    ? buildAlgebraTemplates()
    : isHistoryTopic(lower)
      ? buildHistoryTemplates(topic)
      : isBiologyTopic(lower)
        ? buildBiologyTemplates()
        : isGeographyTopic(lower)
          ? buildGeographyTemplates()
          : isEconomicsTopic(lower)
            ? buildEconomicsTemplates()
            : buildTemplates(topic);
  const codeTemplates = buildCodeTemplates(topic);

  const questions = Array.from({ length: numQuestions }).map((_, idx) =>
    buildQuestion(idx, topic, subtopics, templates, codeTemplates, points)
  );

  return {
    title: `${topic} Quiz (${difficulty})`,
    description: `Auto-generated quiz on ${topic} (${difficulty}). Review and edit before publishing.`,
    category: topic,
    difficulty,
    timeLimit: Math.min(60 * numQuestions, 1800),
    questions,
    totalQuestions: questions.length,
    totalPoints: questions.reduce((t, q) => t + (q.points || 1), 0),
  };
}

module.exports = { generateQuiz };


