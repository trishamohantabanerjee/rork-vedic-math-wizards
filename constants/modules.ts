import { VedicMathModule, Question } from '@/types/module';

export const PREMIUM_PRICE = 100;

export const vedicMathModules: VedicMathModule[] = [
  {
    id: 'subtraction-nikhilam',
    title: 'Magic Subtraction',
    description: 'Learn the "All from 9, last from 10" trick for super-fast subtraction!',
    operation: 'subtraction',
    difficulty: 'beginner',
    pointsReward: 100,
    isUnlocked: true,
    isCompleted: false,
    isPremium: false,
  },
  {
    id: 'addition-vertically',
    title: 'Vertical Addition',
    description: 'Master the art of adding numbers vertically and crosswise!',
    operation: 'addition',
    difficulty: 'beginner',
    pointsReward: 100,
    isUnlocked: false,
    isCompleted: false,
    isPremium: false,
  },
  {
    id: 'multiplication-urdhva',
    title: 'Cross Multiplication',
    description: 'Discover the Urdhva-Tiryagbhyam method for quick multiplication!',
    operation: 'multiplication',
    difficulty: 'intermediate',
    pointsReward: 150,
    isUnlocked: false,
    isCompleted: false,
    isPremium: true,
  },
  {
    id: 'division-paravartya',
    title: 'Magic Division',
    description: 'Master the Paravartya Yojayet method for effortless division!',
    operation: 'division',
    difficulty: 'advanced',
    pointsReward: 200,
    isUnlocked: false,
    isCompleted: false,
    isPremium: true,
  },
];

function padId(prefix: string, i: number) {
  return `${prefix}-${String(i).padStart(3, '0')}`;
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function uniqueNearbyOptions(correct: number, deltas: number[]): number[] {
  const set = new Set<number>();
  set.add(correct);
  for (const d of deltas) {
    const v = correct + d;
    if (v >= 0) set.add(v);
    if (set.size >= 4) break;
  }
  const arr = Array.from(set);
  if (arr.length < 4) {
    let k = 1;
    while (arr.length < 4) {
      const v = correct + (k % 2 === 0 ? -k : k);
      if (v >= 0 && !arr.includes(v)) arr.push(v);
      k += 1;
    }
  }
  return arr.slice(0, 4);
}

function toQ(id: string, question: string, correct: number, explanation: string, points = 20): Question {
  const optsNums = uniqueNearbyOptions(correct, [1, -1, 10, -10, 2, -2, 5, -5, 20, -20]);
  const options = shuffle(optsNums.map((n) => String(n)));
  return {
    id,
    question,
    options,
    correctAnswer: String(correct),
    explanation,
    points,
  };
}

function generateSubtractionQuestions(count: number): Question[] {
  const qs: Question[] = [];
  const bases = [100, 1000, 10000];
  for (let i = 1; i <= count; i += 1) {
    const base = bases[i % bases.length];
    const sub = Math.floor(Math.random() * (base - 1 - 11)) + 11; // avoid trivial cases
    const q = `${base} - ${sub} = ?`;
    const subStr = String(sub);
    const digits = subStr.split('').map((d) => parseInt(d, 10));
    const baseDigits = String(base).length - 1;
    while (digits.length < baseDigits) digits.unshift(0);
    const comps = digits.map((d, idx) => (idx === baseDigits - 1 ? 10 - d : 9 - d));
    const correct = parseInt(comps.join(''), 10);
    console.log('[Vedic][Subtraction]', { base, sub, digits, baseDigits, comps, correct });
    const expl = `Using \"All from 9 and the last from 10\": compute complements digit-wise to ${base}.`;
    qs.push(toQ(padId('sub', i), q, correct, expl));
  }
  return qs;
}

function generateAdditionQuestions(count: number): Question[] {
  const qs: Question[] = [];
  for (let i = 1; i <= count; i += 1) {
    const a = Math.floor(Math.random() * 900) + 100; // 3-digit
    const b = Math.floor(Math.random() * 900) + 100;
    const correct = a + b;
    const q = `${a} + ${b} = ?`;
    const expl = 'Add vertically and carry over when sum exceeds 9.';
    qs.push(toQ(padId('add', i), q, correct, expl));
  }
  return qs;
}

function generateMultiplicationQuestions(count: number): Question[] {
  const qs: Question[] = [];
  for (let i = 1; i <= count; i += 1) {
    const a = Math.floor(Math.random() * 90) + 10; // 2-digit
    const b = Math.floor(Math.random() * 90) + 10;
    const correct = a * b;
    const q = `${a} × ${b} = ?`;
    const expl = 'Use Urdhva-Tiryagbhyam (vertical and crosswise) to compute partials and sum.';
    qs.push(toQ(padId('mul', i), q, correct, expl, 25));
  }
  return qs;
}

function generateDivisionQuestions(count: number): Question[] {
  const qs: Question[] = [];
  for (let i = 1; i <= count; i += 1) {
    const divisor = Math.floor(Math.random() * 8) + 2; // 2..9
    const quotient = Math.floor(Math.random() * 90) + 10; // 2-digit quotient
    const dividend = divisor * quotient; // exact division
    const correct = quotient;
    const q = `${dividend} ÷ ${divisor} = ?`;
    const expl = 'Apply Paravartya Yojayet or standard exact division since it divides evenly here.';
    qs.push(toQ(padId('div', i), q, correct, expl, 25));
  }
  return qs;
}

export const subtractionQuestions: Question[] = generateSubtractionQuestions(40);
export const additionQuestions: Question[] = generateAdditionQuestions(40);
export const multiplicationQuestions: Question[] = generateMultiplicationQuestions(40);
export const divisionQuestions: Question[] = generateDivisionQuestions(40);

export function getQuestionsForModule(moduleId: string): Question[] {
  switch (moduleId) {
    case 'subtraction-nikhilam':
      return subtractionQuestions;
    case 'addition-vertically':
      return additionQuestions;
    case 'multiplication-urdhva':
      return multiplicationQuestions;
    case 'division-paravartya':
      return divisionQuestions;
    default:
      return subtractionQuestions;
  }
}
