export const ROUTES = [
  {
    path: '/',
    label: 'MAIN MENU',
    menuLabel: 'START GAME',
    accent: 'var(--color-vice-pink)',
    artKey: 'menu',
    stillSrc: '/art/menu.webp',
    alt: 'Illustration of Dinesh Karthick in a neon retro-city style background',
    area: { name: 'SUNSET BOULEVARD', district: 'Vice Beach' },
    focus: { x: '76%', y: '10%' },
    menuBadge: 'MISSION 00 · START GAME',
  },
  {
    path: '/about',
    sectionId: 'about',
    label: 'ABOUT ME',
    menuLabel: 'ABOUT ME',
    accent: '#ff8a3d',
    artKey: 'about',
    stillSrc: '/art/about.webp',
    alt: 'Illustration of Dinesh Karthick at Ocean Drive cafe',
    area: { name: 'OCEAN DRIVE', district: 'Vice Beach' },
    focus: { x: '78%', y: '14%' },
    menuBadge: 'MISSION 01 · ABOUT ME',
  },
  {
    path: '/skills',
    sectionId: 'skills',
    label: 'SKILLS',
    menuLabel: 'SKILLS',
    accent: '#38d6ff',
    artKey: 'skills',
    stillSrc: '/art/skills.webp',
    alt: 'Illustration of Dinesh Karthick in tech district',
    area: { name: 'TECH DISTRICT', district: 'Downtown' },
    focus: { x: '73%', y: '19%' },
    menuBadge: 'MISSION 02 · SKILLS',
  },
  {
    path: '/projects',
    sectionId: 'projects',
    label: 'PROJECTS',
    menuLabel: 'PROJECTS',
    accent: '#2ee6c5',
    artKey: 'projects',
    stillSrc: '/art/projects.webp',
    alt: 'Illustration of Dinesh Karthick in a South Beach café',
    area: { name: 'BEACHFRONT CAFÉ', district: 'South Beach' },
    focus: { x: '75%', y: '17%' },
    menuBadge: 'MISSION 03 · PROJECTS',
  },
  {
    path: '/experience',
    sectionId: 'experience',
    label: 'EXPERIENCE',
    menuLabel: 'EXPERIENCE',
    accent: '#8b7bff',
    artKey: 'experience',
    stillSrc: '/art/experience.webp',
    alt: 'Illustration of Dinesh Karthick at Codunt Tower',
    area: { name: 'CODUNT TOWER', district: 'Downtown' },
    focus: { x: '75%', y: '15%' },
    menuBadge: 'MISSION 04 · EXPERIENCE',
  },
  {
    path: '/achievements',
    sectionId: 'achievements',
    label: 'ACHIEVEMENTS',
    menuLabel: 'ACHIEVEMENTS',
    accent: '#e64bff',
    artKey: 'achievements',
    stillSrc: '/art/achievements.webp',
    alt: 'Illustration of Dinesh Karthick on Neon Strip',
    area: { name: 'NEON STRIP', district: 'Little Havana' },
    focus: { x: '77%', y: '14%' },
    menuBadge: 'MISSION 05 · ACHIEVEMENTS',
  },
  {
    path: '/academy',
    sectionId: 'academy',
    label: 'ACADEMY',
    menuLabel: 'ACADEMY',
    accent: '#ff4d5e',
    artKey: 'academy',
    stillSrc: '/art/academy.webp',
    alt: 'Illustration of Dinesh Karthick at University Heights',
    area: { name: 'UNIVERSITY HEIGHTS', district: 'Vice Point' },
    focus: { x: '75%', y: '17%' },
    menuBadge: 'MISSION 06 · ACADEMY',
  },
  {
    path: '/contact',
    sectionId: 'contact',
    label: 'CONTACT',
    menuLabel: 'CONTACT',
    accent: '#3d8bff',
    artKey: 'contact',
    stillSrc: '/art/contact.webp',
    alt: 'Illustration of Dinesh Karthick at Midnight Avenue',
    area: { name: 'MIDNIGHT AVENUE', district: 'Ocean Beach' },
    focus: { x: '76%', y: '19%' },
    menuBadge: 'MISSION 07 · CONTACT',
  },
  {
    path: '/mission-complete',
    label: 'COMPLETE',
    menuLabel: 'EXIT GAME',
    accent: 'var(--color-vice-pink)',
    artKey: 'mission-complete',
    stillSrc: '/art/mission-complete.webp',
    alt: 'Illustration of Dinesh Karthick in Palani after completing missions',
    area: { name: 'PALANI', district: 'Home' },
    focus: { x: '73%', y: '17%' },
    menuBadge: 'DEBRIEF · EXIT GAME',
  },
] as const;

export const ROUTE_SEQUENCE: readonly string[] = ROUTES.map((r) => r.path);

export const TOTAL_SECTIONS = ROUTES.filter((r) => 'sectionId' in r && r.sectionId).length;

type SectionRoute = Extract<typeof ROUTES[number], { sectionId: string }>;

export const ALL_SECTION_IDS = (
  ROUTES.filter((r): r is SectionRoute => 'sectionId' in r && Boolean(r.sectionId))
).map((r) => r.sectionId);

export function getRouteByPath(path: string): typeof ROUTES[number] | undefined {
  return ROUTES.find((r) => r.path === path);
}

export interface ArtFocus {
  focusX: string;
  focusY: string;
}

export function getArtFocus(keyOrPath: string): ArtFocus {
  const clean = keyOrPath.replace(/^\/?(art\/)?/, '').replace(/\.webp$/, '');
  const match = ROUTES.find((r) => r.artKey === clean || r.path === clean || r.path === `/${clean}`);
  if (match) {
    return { focusX: match.focus.x, focusY: match.focus.y };
  }
  return { focusX: '75%', focusY: '15%' };
}

export function getPrevNextRoutes(pathname: string): {
  prevRoute: string | null;
  nextRoute: string | null;
} {
  const currentIndex = ROUTE_SEQUENCE.indexOf(pathname);
  if (currentIndex === -1) {
    return { prevRoute: null, nextRoute: null };
  }
  const prevRoute = currentIndex > 0 ? ROUTE_SEQUENCE[currentIndex - 1] : null;
  const nextRoute = currentIndex < ROUTE_SEQUENCE.length - 1 ? ROUTE_SEQUENCE[currentIndex + 1] : null;
  return { prevRoute, nextRoute };
}
