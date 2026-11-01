import type { Tier } from './portfolio';

export interface TierMeta {
  label: string;
  color: string;
  glow: string;
  text: string;
  border: string;
}

export const TIER_META: Record<Tier, TierMeta> = {
  gold: {
    label: 'GOLD TROPHY',
    color: '#ffc23d',
    glow: 'rgba(255, 194, 61, 0.45)',
    text: '#000000',
    border: '#ffc23d',
  },
  silver: {
    label: 'SILVER TROPHY',
    color: '#c9d1d9',
    glow: 'rgba(201, 209, 217, 0.35)',
    text: '#000000',
    border: '#c9d1d9',
  },
  bronze: {
    label: 'BRONZE TROPHY',
    color: '#cd7f32',
    glow: 'rgba(205, 127, 50, 0.35)',
    text: '#ffffff',
    border: '#cd7f32',
  },
};
