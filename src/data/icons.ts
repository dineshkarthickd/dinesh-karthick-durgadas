import React from 'react';
import {
  Monitor,
  Server,
  Database,
  ShieldCheck,
  Cloud,
  Rocket,
  GitBranch,
  Smartphone,
  Palette,
} from 'lucide-react';

export const ICON_MAP: Record<string, React.ComponentType<{ size?: number; className?: string }>> = {
  Monitor,
  Server,
  Database,
  ShieldCheck,
  Cloud,
  Rocket,
  GitBranch,
  Smartphone,
  Palette,
};

export type IconKey = keyof typeof ICON_MAP;
