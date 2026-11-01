import { projects, certificates, type SkillTree } from './portfolio';
import type { IconKey } from './icons';

export interface LoadoutProofItem {
  icon: IconKey;
  short: string;
  projects: string[];
  job: boolean;
  certs: string[];
}

export const FALLBACK_PROOF: LoadoutProofItem = {
  icon: 'Monitor',
  short: 'SKILL',
  projects: [],
  job: false,
  certs: [],
};

export const loadoutProof: Record<SkillTree, LoadoutProofItem> = {
  Frontend: {
    icon: 'Monitor',
    short: 'FRONTEND',
    job: true,
    projects: ['alangaram', 'kailash-ghee', 'dharmar-mahal', 'aalam-studio'],
    certs: ['Frontend Web Developer — Modern HTML, CSS, JavaScript', 'ReactJS'],
  },
  Backend: {
    icon: 'Server',
    short: 'BACKEND',
    job: true,
    projects: [],
    certs: [
      'Docker for .NET Developer — Getting Started',
      'Entity Framework Core — The Complete Guide (.NET Core 7)',
      'Advanced C# Programming',
    ],
  },
  Databases: {
    icon: 'Database',
    short: 'DATABASES',
    job: true,
    projects: ['alangaram', 'kailash-ghee'],
    certs: [
      '70-462: SQL Server Database Administration (DBA)',
      'PostgreSQL Developer',
      'Oracle Database Foundation',
      'Database and SQL',
    ],
  },
  'Auth & Security': {
    icon: 'ShieldCheck',
    short: 'AUTH',
    job: false,
    projects: ['dharmar-mahal'],
    certs: [],
  },
  Cloud: {
    icon: 'Cloud',
    short: 'CLOUD',
    job: false,
    projects: ['alangaram', 'kailash-ghee'],
    certs: [
      'Oracle Cloud Infrastructure 2025 Certified Foundations Associate',
      'Oracle Cloud Architecture',
      'Journey to Cloud: Envisioning Your Solution',
      'Fundamentals of Coding & Cloud',
    ],
  },
  Hosting: {
    icon: 'Rocket',
    short: 'HOSTING',
    job: false,
    projects: ['alangaram', 'kailash-ghee', 'dharmar-mahal', 'aalam-studio'],
    certs: [],
  },
  'DevOps & Tools': {
    icon: 'GitBranch',
    short: 'DEVOPS',
    job: true,
    projects: ['alangaram', 'kailash-ghee', 'dharmar-mahal', 'aalam-studio'],
    certs: ['Docker for .NET Developer — Getting Started'],
  },
  'Desktop & Mobile': {
    icon: 'Smartphone',
    short: 'DESKTOP',
    job: false,
    projects: [],
    certs: [],
  },
  Creative: {
    icon: 'Palette',
    short: 'CREATIVE',
    job: false,
    projects: [],
    certs: ['Complete Figma Course: Web & Mobile Projects from Scratch'],
  },
};

// Dev-only integrity check
if (import.meta.env.DEV) {
  const validProjectIds = new Set(projects.map((p) => p.id));
  const validCertTitles = new Set(certificates.map((c) => c.title));

  Object.entries(loadoutProof).forEach(([tree, proof]) => {
    proof.projects.forEach((pid) => {
      if (!validProjectIds.has(pid)) {
        console.error(`[loadoutProof] Invalid project id "${pid}" for skill tree "${tree}"`);
      }
    });
    proof.certs.forEach((title) => {
      if (!validCertTitles.has(title)) {
        console.error(`[loadoutProof] Invalid certificate title "${title}" for skill tree "${tree}"`);
      }
    });
  });
}
