import React from 'react';
import {
  Play,
  User,
  Cpu,
  FolderKanban,
  Briefcase,
  Trophy,
  GraduationCap,
  Mail,
  Flag,
} from 'lucide-react';
import {
  skills,
  projects,
  experience,
  certificates,
  computeDuration,
} from '../../data/portfolio';
import { getArtFocus, TOTAL_SECTIONS } from '../../data/routes';
import type { SectionId } from '../../game/GameContext';

export interface MenuItem {
  label: string;
  path: string;
  sectionId?: SectionId;
  badge: string;
  accent: string;
  icon: React.ComponentType<{ size?: number; className?: string; style?: React.CSSProperties }>;
  art: string;
  focusX: string;
  teaser: string;
  stats: string;
}

export function buildMenuItems(): MenuItem[] {
  const goldCount = certificates.filter((c) => c.tier === 'gold').length;
  const silverCount = certificates.filter((c) => c.tier === 'silver').length;
  const bronzeCount = certificates.filter((c) => c.tier === 'bronze').length;
  const liveExp = experience[0] ? computeDuration(experience[0].start) : '';

  return [
    {
      label: 'START GAME',
      path: '/about',
      badge: 'MISSION 00 · START GAME',
      accent: '#ff2e88',
      icon: Play,
      art: '/art/about.webp',
      focusX: getArtFocus('about').focusX,
      teaser: 'Begin the full tour',
      stats: `${TOTAL_SECTIONS} sections · ~3 min`,
    },
    {
      label: 'ABOUT ME',
      path: '/about',
      sectionId: 'about',
      badge: 'MISSION 01 · ABOUT ME',
      accent: '#ff8a3d',
      icon: User,
      art: '/art/about.webp',
      focusX: getArtFocus('about').focusX,
      teaser:
        'Software Engineer from Palani, Tamil Nadu, with a Master of Computer Applications.',
      stats: 'Palani · Software Engineer',
    },
    {
      label: 'SKILLS',
      path: '/skills',
      sectionId: 'skills',
      badge: 'MISSION 02 · SKILLS',
      accent: '#38d6ff',
      icon: Cpu,
      art: '/art/skills.webp',
      focusX: getArtFocus('skills').focusX,
      teaser: `${skills.length} skill trees unlocked`,
      stats: `${skills[0].tree} (${skills[0].level}%) · ${skills[1].tree} (${skills[1].level}%) · ${skills[2].tree} (${skills[2].level}%)`,
    },
    {
      label: 'PROJECTS',
      path: '/projects',
      sectionId: 'projects',
      badge: 'MISSION 03 · PROJECTS',
      accent: '#2ee6c5',
      icon: FolderKanban,
      art: '/art/projects.webp',
      focusX: getArtFocus('projects').focusX,
      teaser: `${projects.length} missions shipped`,
      stats: projects.map((p) => p.name.split(' ')[0]).join(' · '),
    },
    {
      label: 'EXPERIENCE',
      path: '/experience',
      sectionId: 'experience',
      badge: 'MISSION 04 · EXPERIENCE',
      accent: '#8b7bff',
      icon: Briefcase,
      art: '/art/experience.webp',
      focusX: getArtFocus('experience').focusX,
      teaser: experience[0]?.company || 'Codunt Technologies',
      stats: `Live duration: ${liveExp}`,
    },
    {
      label: 'ACHIEVEMENTS',
      path: '/achievements',
      sectionId: 'achievements',
      badge: 'MISSION 05 · ACHIEVEMENTS',
      accent: '#e64bff',
      icon: Trophy,
      art: '/art/achievements.webp',
      focusX: getArtFocus('achievements').focusX,
      teaser: `${certificates.length} trophies`,
      stats: `🥇${goldCount} · 🥈${silverCount} · 🥉${bronzeCount}`,
    },
    {
      label: 'ACADEMY',
      path: '/academy',
      sectionId: 'academy',
      badge: 'MISSION 06 · ACADEMY',
      accent: '#ff4d5e',
      icon: GraduationCap,
      art: '/art/academy.webp',
      focusX: getArtFocus('academy').focusX,
      teaser: 'MCA · Bharathiar University',
      stats: '2 degrees',
    },
    {
      label: 'CONTACT',
      path: '/contact',
      sectionId: 'contact',
      badge: 'MISSION 07 · CONTACT',
      accent: '#3d8bff',
      icon: Mail,
      art: '/art/contact.webp',
      focusX: getArtFocus('contact').focusX,
      teaser: "Let's build something",
      stats: 'Email · WhatsApp · LinkedIn',
    },
    {
      label: 'EXIT GAME',
      path: '/mission-complete',
      badge: 'DEBRIEF · EXIT GAME',
      accent: '#ff2e88',
      icon: Flag,
      art: '/art/mission-complete.webp',
      focusX: getArtFocus('mission-complete').focusX,
      teaser: 'Wrap up & see your stats',
      stats: 'XP · stars',
    },
  ];
}
