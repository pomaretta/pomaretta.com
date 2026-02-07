/**
 * Challenge Templates - Pool of daily challenge types
 *
 * Each template defines a challenge type that can be generated daily.
 * Challenges are deterministic based on the date seed.
 */

export type ChallengeType = 'score' | 'collect' | 'survive' | 'complete' | 'avoid';

export interface ChallengeTemplate {
  id: string;
  type: ChallengeType;
  name: {
    en: string;
    es: string;
  };
  description: {
    en: (target: number, mode?: string, difficulty?: string) => string;
    es: (target: number, mode?: string, difficulty?: string) => string;
  };
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  targetRange: {
    min: number;
    max: number;
  };
  rewardPoints: number;
  badge?: string;
  unlock?: string;
}

export const challengeTemplates: ChallengeTemplate[] = [
  // EASY CHALLENGES (100-200 points)
  {
    id: 'score_easy',
    type: 'score',
    name: {
      en: 'Coding Starter',
      es: 'Iniciador de Código',
    },
    description: {
      en: (target) => `Score ${target}+ points in any mode`,
      es: (target) => `Consigue ${target}+ puntos en cualquier modo`,
    },
    difficulty: 'easy',
    targetRange: { min: 500, max: 1000 },
    rewardPoints: 100,
  },
  {
    id: 'collect_easy',
    type: 'collect',
    name: {
      en: 'Coffee Break',
      es: 'Pausa para Café',
    },
    description: {
      en: (target) => `Collect ${target} coffee cups`,
      es: (target) => `Recoge ${target} tazas de café`,
    },
    difficulty: 'easy',
    targetRange: { min: 5, max: 10 },
    rewardPoints: 100,
  },
  {
    id: 'survive_easy',
    type: 'survive',
    name: {
      en: 'Survivor',
      es: 'Superviviente',
    },
    description: {
      en: (target) => `Survive for ${target} seconds`,
      es: (target) => `Sobrevive durante ${target} segundos`,
    },
    difficulty: 'easy',
    targetRange: { min: 30, max: 45 },
    rewardPoints: 100,
  },

  // MEDIUM CHALLENGES (200-300 points)
  {
    id: 'score_medium',
    type: 'score',
    name: {
      en: 'Score Hunter',
      es: 'Cazador de Puntos',
    },
    description: {
      en: (target) => `Score ${target}+ points in one run`,
      es: (target) => `Consigue ${target}+ puntos en una partida`,
    },
    difficulty: 'medium',
    targetRange: { min: 1500, max: 2500 },
    rewardPoints: 200,
  },
  {
    id: 'collect_medium',
    type: 'collect',
    name: {
      en: 'Caffeine Addict',
      es: 'Adicto a la Cafeína',
    },
    description: {
      en: (target) => `Collect ${target} coffee cups in one game`,
      es: (target) => `Recoge ${target} tazas de café en una partida`,
    },
    difficulty: 'medium',
    targetRange: { min: 15, max: 25 },
    rewardPoints: 250,
  },
  {
    id: 'survive_medium',
    type: 'survive',
    name: {
      en: 'Endurance Runner',
      es: 'Corredor de Resistencia',
    },
    description: {
      en: (target) => `Survive for ${target} seconds without power-ups`,
      es: (target) => `Sobrevive ${target} segundos sin potenciadores`,
    },
    difficulty: 'medium',
    targetRange: { min: 60, max: 90 },
    rewardPoints: 300,
  },
  {
    id: 'avoid_medium',
    type: 'avoid',
    name: {
      en: 'Bug Dodger',
      es: 'Esquivador de Bugs',
    },
    description: {
      en: (target) => `Avoid ${target} obstacles without getting hit`,
      es: (target) => `Esquiva ${target} obstáculos sin ser golpeado`,
    },
    difficulty: 'medium',
    targetRange: { min: 20, max: 35 },
    rewardPoints: 250,
  },

  // HARD CHALLENGES (300-400 points)
  {
    id: 'score_hard',
    type: 'score',
    name: {
      en: 'Master Coder',
      es: 'Maestro Programador',
    },
    description: {
      en: (target) => `Score ${target}+ points in one run`,
      es: (target) => `Consigue ${target}+ puntos en una partida`,
    },
    difficulty: 'hard',
    targetRange: { min: 3000, max: 4500 },
    rewardPoints: 350,
    badge: 'master_coder',
  },
  {
    id: 'collect_hard',
    type: 'collect',
    name: {
      en: 'Coffee Connoisseur',
      es: 'Conocedor de Café',
    },
    description: {
      en: (target) => `Collect ${target} coffee cups without missing any`,
      es: (target) => `Recoge ${target} tazas de café sin perder ninguna`,
    },
    difficulty: 'hard',
    targetRange: { min: 30, max: 40 },
    rewardPoints: 400,
    badge: 'coffee_master',
  },
  {
    id: 'survive_hard',
    type: 'survive',
    name: {
      en: 'Iron Will',
      es: 'Voluntad de Hierro',
    },
    description: {
      en: (target) => `Survive for ${target} seconds with increasing speed`,
      es: (target) => `Sobrevive ${target} segundos con velocidad creciente`,
    },
    difficulty: 'hard',
    targetRange: { min: 120, max: 150 },
    rewardPoints: 400,
  },
  {
    id: 'avoid_hard',
    type: 'avoid',
    name: {
      en: 'Perfect Dodge',
      es: 'Esquiva Perfecta',
    },
    description: {
      en: (target) => `Avoid ${target} obstacles in a row without jumping`,
      es: (target) => `Esquiva ${target} obstáculos seguidos sin saltar`,
    },
    difficulty: 'hard',
    targetRange: { min: 15, max: 25 },
    rewardPoints: 350,
    badge: 'dodge_master',
  },

  // EXPERT CHALLENGES (400-500 points)
  {
    id: 'score_expert',
    type: 'score',
    name: {
      en: 'Legendary Developer',
      es: 'Desarrollador Legendario',
    },
    description: {
      en: (target) => `Score ${target}+ points in one perfect run`,
      es: (target) => `Consigue ${target}+ puntos en una partida perfecta`,
    },
    difficulty: 'expert',
    targetRange: { min: 5000, max: 7500 },
    rewardPoints: 500,
    badge: 'legendary_dev',
    unlock: 'golden_skin',
  },
  {
    id: 'collect_expert',
    type: 'collect',
    name: {
      en: 'Coffee Overlord',
      es: 'Señor del Café',
    },
    description: {
      en: (target) => `Collect ${target} coffee cups in under 2 minutes`,
      es: (target) => `Recoge ${target} tazas de café en menos de 2 minutos`,
    },
    difficulty: 'expert',
    targetRange: { min: 50, max: 75 },
    rewardPoints: 500,
    badge: 'coffee_god',
    unlock: 'coffee_theme',
  },
  {
    id: 'survive_expert',
    type: 'survive',
    name: {
      en: 'Immortal Code',
      es: 'Código Inmortal',
    },
    description: {
      en: (target) => `Survive for ${target} seconds at maximum speed`,
      es: (target) => `Sobrevive ${target} segundos a velocidad máxima`,
    },
    difficulty: 'expert',
    targetRange: { min: 180, max: 240 },
    rewardPoints: 500,
    badge: 'immortal',
    unlock: 'immortal_aura',
  },
];

/**
 * Get a random template based on a seed (date)
 */
export function getTemplateForDate(date: string): ChallengeTemplate {
  // Use date as seed for deterministic random selection
  const seed = date.split('-').reduce((acc, val) => acc + parseInt(val), 0);
  const index = seed % challengeTemplates.length;
  return challengeTemplates[index];
}

/**
 * Calculate target value within template range based on seed
 */
export function calculateTarget(template: ChallengeTemplate, seed: number): number {
  const range = template.targetRange.max - template.targetRange.min;
  const offset = seed % range;
  return template.targetRange.min + offset;
}
