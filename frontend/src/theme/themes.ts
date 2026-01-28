export type ThemeName =
  | 'purpleBlue'
  | 'sunset'
  | 'forest'
  | 'ocean'
  | 'fire'
  | 'ice'
  | 'cyberpunk'
  | 'lavender'
  | 'midnight'
  | 'tropical';

export type Theme = {
  name: ThemeName;
  gradient: string;
  blob1: string;
  blob2: string;
  blob3: string;
  particle: string;
};

export const themes: Record<ThemeName, Theme> = {
  purpleBlue: {
    name: 'purpleBlue',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
    blob1: 'rgba(168, 85, 247, 0.30)',
    blob2: 'rgba(59, 130, 246, 0.20)',
    blob3: 'rgba(6, 182, 212, 0.20)',
    particle: 'rgba(255, 255, 255, 0.40)',
  },

  sunset: {
    name: 'sunset',
    gradient: 'linear-gradient(135deg, #0b1020 0%, #b91c1c 50%, #0b1020 100%)',
    blob1: 'rgba(251, 146, 60, 0.30)',
    blob2: 'rgba(244, 63, 94, 0.22)',
    blob3: 'rgba(250, 204, 21, 0.18)',
    particle: 'rgba(255, 255, 255, 0.35)',
  },

  forest: {
    name: 'forest',
    gradient: 'linear-gradient(135deg, #071a12 0%, #064e3b 50%, #071a12 100%)',
    blob1: 'rgba(34, 197, 94, 0.25)',
    blob2: 'rgba(20, 184, 166, 0.20)',
    blob3: 'rgba(132, 204, 22, 0.18)',
    particle: 'rgba(255, 255, 255, 0.30)',
  },

  ocean: {
    name: 'ocean',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #0284c7 50%, #0f172a 100%)',
    blob1: 'rgba(14, 165, 233, 0.3)',
    blob2: 'rgba(6, 182, 212, 0.25)',
    blob3: 'rgba(2, 132, 199, 0.2)',
    particle: 'rgba(255, 255, 255, 0.35)',
  },

  fire: {
    name: 'fire',
    gradient: 'linear-gradient(135deg, #1a0500 0%, #f59e0b 50%, #7c2d12 100%)',
    blob1: 'rgba(251, 191, 36, 0.3)',
    blob2: 'rgba(244, 63, 94, 0.25)',
    blob3: 'rgba(220, 38, 38, 0.2)',
    particle: 'rgba(255, 255, 255, 0.4)',
  },

  ice: {
    name: 'ice',
    gradient: 'linear-gradient(135deg, #0c4a6e 0%, #cffafe 50%, #0c4a6e 100%)',
    blob1: 'rgba(6, 182, 212, 0.3)',
    blob2: 'rgba(207, 250, 254, 0.2)',
    blob3: 'rgba(14, 165, 233, 0.2)',
    particle: 'rgba(255, 255, 255, 0.4)',
  },

  cyberpunk: {
    name: 'cyberpunk',
    gradient: 'linear-gradient(135deg, #0f0c29 0%, #ff006e 50%, #8338ec 100%)',
    blob1: 'rgba(255, 0, 110, 0.3)',
    blob2: 'rgba(131, 56, 236, 0.25)',
    blob3: 'rgba(0, 255, 255, 0.2)',
    particle: 'rgba(255, 255, 255, 0.35)',
  },

  lavender: {
    name: 'lavender',
    gradient: 'linear-gradient(135deg, #ede9fe 0%, #c4b5fd 50%, #ede9fe 100%)',
    blob1: 'rgba(199, 210, 254, 0.3)',
    blob2: 'rgba(196, 181, 253, 0.25)',
    blob3: 'rgba(167, 139, 250, 0.2)',
    particle: 'rgba(255, 255, 255, 0.4)',
  },

  midnight: {
    name: 'midnight',
    gradient: 'linear-gradient(135deg, #0f172a 0%, #0c4a6e 50%, #0f172a 100%)',
    blob1: 'rgba(30, 58, 138, 0.3)',
    blob2: 'rgba(59, 130, 246, 0.25)',
    blob3: 'rgba(14, 165, 233, 0.2)',
    particle: 'rgba(255, 255, 255, 0.35)',
  },

  tropical: {
    name: 'tropical',
    gradient: 'linear-gradient(135deg, #fef9c3 0%, #fbbf24 50%, #f97316 100%)',
    blob1: 'rgba(253, 224, 71, 0.3)',
    blob2: 'rgba(251, 191, 36, 0.25)',
    blob3: 'rgba(249, 115, 22, 0.2)',
    particle: 'rgba(255, 255, 255, 0.4)',
  },
};
