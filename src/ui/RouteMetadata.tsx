import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SITE_URL } from '../data/site';
import { getRouteByPath } from '../data/routes';

const SECTION_TITLES: Record<string, string> = {
  '/': 'Dinesh Karthick — Full-Stack Developer',
  '/about': 'About Me — Dinesh Karthick',
  '/skills': 'Skills — Dinesh Karthick',
  '/projects': 'Projects — Dinesh Karthick',
  '/experience': 'Experience — Dinesh Karthick',
  '/achievements': 'Achievements — Dinesh Karthick',
  '/academy': 'Academy — Dinesh Karthick',
  '/contact': 'Contact — Dinesh Karthick',
  '/mission-complete': 'Mission Passed — Dinesh Karthick',
};

export const RouteMetadata: React.FC = () => {
  const location = useLocation();

  useEffect(() => {
    const pathname = location.pathname;
    const route = getRouteByPath(pathname);

    // 1. Update Document Title: "<Section> — Dinesh Karthick"
    if (SECTION_TITLES[pathname]) {
      document.title = SECTION_TITLES[pathname];
    } else if (route?.label) {
      document.title = `${route.label} — Dinesh Karthick`;
    } else {
      document.title = 'Dinesh Karthick — Full-Stack Developer';
    }

    // 2. Update Canonical Link: SITE_URL + pathname (without query strings)
    const normalizedPath = pathname === '/' ? '/' : pathname.replace(/\/+$/, '');
    const canonicalHref = `${SITE_URL}${normalizedPath}`;

    let canonicalEl = document.querySelector<HTMLLinkElement>("link[rel='canonical']");
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonicalHref;
  }, [location.pathname]);

  return null;
};
