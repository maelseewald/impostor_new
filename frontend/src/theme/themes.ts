export type ThemeName =
  | 'purpleBlue'
  | 'sunset'
    | 'forest'
    | 'ocean'
    | 'roseGold'
    | 'midnight'
    | 'neon'
    | 'mango'
    | 'sage'
    | 'arctic'
    | 'ember'
    | 'lavender'
    | 'copper'
    | 'starlight'
    | 'black'
    | 'white';

export type Theme = {
  name: ThemeName;
  bgGradient: string;
  blob1: string;
  blob2: string;
  blob3: string;
  particle: string;
  tiltedGradient: string;
  textColor: string;
  textSecColor: string;
  boxShadowColor: string;
  boxInsetShadowColor: string;
  textPlaceholderColor: string;
  buttonAccentColor1: string;
  buttonAccentColor1Decent: string;
  buttonAccentColor2: string;
  buttonAccentColor2Decent: string;
};

export const themes: Record<ThemeName, Theme> = {
  purpleBlue: {
    name: 'purpleBlue',
    bgGradient: 'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
    blob1: 'rgba(168, 85, 247, 0.30)',
    blob2: 'rgba(59, 130, 246, 0.20)',
    blob3: 'rgba(6, 182, 212, 0.20)',
    particle: 'rgba(255, 255, 255, 0.40)',
    tiltedGradient: 'linear-gradient(to right, #ffffff, #e9d5ff, #a5f3fc)',
    textColor: '#ffffff',
    textSecColor: 'rgba(255, 255, 255, 0.7)',
    boxShadowColor: 'rgba(0,0,0,0.3)',
    boxInsetShadowColor: 'rgba(0,0,0)',
    textPlaceholderColor: 'rgba(255, 255, 255, 0.5)',
    buttonAccentColor1: 'rgba(147, 51, 234, 0.8)',
    buttonAccentColor1Decent: 'rgba(147, 51, 234, 0.2)',
    buttonAccentColor2: 'rgba(8, 145, 178, 0.8)',
    buttonAccentColor2Decent: 'rgba(8, 145, 178, 0.2)',
  },
  sunset: {
    name: 'sunset',
    bgGradient: 'linear-gradient(135deg,#0b1020 0%,#f97316 50%,#0b1020 100%)',
    blob1: 'rgba(252,165,0,0.30)',
    blob2: 'rgba(244,63,94,0.22)',
    blob3: 'rgba(250,204,21,0.18)',
    particle: 'rgba(255,255,255,0.36)',
    tiltedGradient: 'linear-gradient(90deg,#fb923c 0%,#f43f5e 100%)',
    textColor: '#ffffff',
    textSecColor: 'rgba(255,255,255,0.78)',
    boxShadowColor: 'rgba(3,6,10,0.5)',
    boxInsetShadowColor: 'rgba(255,255,255)',
    textPlaceholderColor: 'rgba(255,255,255,0.5)',
    buttonAccentColor1: 'rgba(245,158,11,0.95)',
    buttonAccentColor1Decent: 'rgba(245,158,11,0.18)',
    buttonAccentColor2: 'rgba(244,63,94,0.95)',
    buttonAccentColor2Decent: 'rgba(244,63,94,0.18)',
  },

  forest: {
    name: 'forest',
    bgGradient: 'linear-gradient(135deg,#071a12 0%,#0f9d58 50%,#071a12 100%)',
    blob1: 'rgba(34,197,94,0.28)',
    blob2: 'rgba(20,184,166,0.20)',
    blob3: 'rgba(132,204,22,0.14)',
    particle: 'rgba(255,255,255,0.28)',
    tiltedGradient: 'linear-gradient(90deg,#22c55e 0%,#14b8a6 100%)',
    textColor: '#ffffff',
    textSecColor: 'rgba(255,255,255,0.8)',
    boxShadowColor: 'rgba(2,8,6,0.5)',
    boxInsetShadowColor: 'rgba(255,255,255,0.3)',
    textPlaceholderColor: 'rgba(255,255,255,0.5)',
    buttonAccentColor1: 'rgba(16,185,129,0.95)',
    buttonAccentColor1Decent: 'rgba(16,185,129,0.18)',
    buttonAccentColor2: 'rgba(34,197,94,0.95)',
    buttonAccentColor2Decent: 'rgba(34,197,94,0.18)',
  },

  // 10 new clean themes
  ocean: {
    name: 'ocean',
    bgGradient: 'linear-gradient(135deg,#001f3f 0%,#0077b6 50%,#001f3f 100%)',
    blob1: 'rgba(3,105,161,0.28)',
    blob2: 'rgba(14,165,233,0.18)',
    blob3: 'rgba(6,95,70,0.12)',
    particle: 'rgba(255,255,255,0.32)',
    tiltedGradient: 'linear-gradient(90deg,#06b6d4 0%,#3b82f6 100%)',
    textColor: '#e6f7ff',
    textSecColor: 'rgba(230,247,255,0.75)',
    boxShadowColor: 'rgba(0,12,20,0.45)',
    boxInsetShadowColor: 'rgba(255,255,255,0.3)',
    textPlaceholderColor: 'rgba(230,247,255,0.45)',
    buttonAccentColor1: 'rgba(3,105,161,0.95)',
    buttonAccentColor1Decent: 'rgba(3,105,161,0.18)',
    buttonAccentColor2: 'rgba(14,165,233,0.95)',
    buttonAccentColor2Decent: 'rgba(14,165,233,0.18)',
  },

  roseGold: {
    name: 'roseGold',
    bgGradient: 'linear-gradient(135deg,#0f0b0c 0%,#b76e79 50%,#0f0b0c 100%)',
    blob1: 'rgba(183,110,121,0.28)',
    blob2: 'rgba(255,205,210,0.14)',
    blob3: 'rgba(255,183,77,0.12)',
    particle: 'rgba(255,255,255,0.28)',
    tiltedGradient: 'linear-gradient(90deg,#ffc9d6 0%,#fbc4ab 100%)',
    textColor: '#fff9f9',
    textSecColor: 'rgba(255,249,249,0.75)',
    boxShadowColor: 'rgba(15,8,10,0.5)',
    boxInsetShadowColor: 'rgba(255,255,255,0.2)',
    textPlaceholderColor: 'rgba(255,249,249,0.45)',
    buttonAccentColor1: 'rgba(183,110,121,0.95)',
    buttonAccentColor1Decent: 'rgba(183,110,121,0.18)',
    buttonAccentColor2: 'rgba(255,183,77,0.95)',
    buttonAccentColor2Decent: 'rgba(255,183,77,0.18)',
  },

  midnight: {
    name: 'midnight',
    bgGradient: 'linear-gradient(135deg,#000818 0%,#2b0d5b 50%,#000818 100%)',
    blob1: 'rgba(59,40,219,0.22)',
    blob2: 'rgba(99,102,241,0.14)',
    blob3: 'rgba(8,145,178,0.12)',
    particle: 'rgba(255,255,255,0.22)',
    tiltedGradient: 'linear-gradient(90deg,#7c3aed 0%,#4338ca 100%)',
    textColor: '#f6f7ff',
    textSecColor: 'rgba(246,247,255,0.72)',
    boxShadowColor: 'rgba(0,0,0,0.6)',
    boxInsetShadowColor: 'rgba(255,255,255,0.2)',
    textPlaceholderColor: 'rgba(246,247,255,0.4)',
    buttonAccentColor1: 'rgba(124,58,237,0.95)',
    buttonAccentColor1Decent: 'rgba(124,58,237,0.18)',
    buttonAccentColor2: 'rgba(67,56,202,0.95)',
    buttonAccentColor2Decent: 'rgba(67,56,202,0.18)',
  },

  neon: {
    name: 'neon',
    bgGradient: 'linear-gradient(135deg,#061220 0%,#0f172a 50%,#061220 100%)',
    blob1: 'rgba(255,0,140,0.22)',
    blob2: 'rgba(0,255,200,0.18)',
    blob3: 'rgba(0,180,255,0.14)',
    particle: 'rgba(255,255,255,0.28)',
    tiltedGradient: 'linear-gradient(90deg,#ff0080 0%,#00ffd6 100%)',
    textColor: '#eafcff',
    textSecColor: 'rgba(234,252,255,0.7)',
    boxShadowColor: 'rgba(0,0,0,0.6)',
    boxInsetShadowColor: 'rgba(255,255,255,0.2)',
    textPlaceholderColor: 'rgba(234,252,255,0.45)',
    buttonAccentColor1: 'rgba(255,0,140,0.95)',
    buttonAccentColor1Decent: 'rgba(255,0,140,0.18)',
    buttonAccentColor2: 'rgba(0,255,200,0.95)',
    buttonAccentColor2Decent: 'rgba(0,255,200,0.18)',
  },

  mango: {
    name: 'mango',
    bgGradient: 'linear-gradient(135deg,#1b1006 0%,#f59e0b 50%,#1b1006 100%)',
    blob1: 'rgba(251,146,60,0.28)',
    blob2: 'rgba(253,224,71,0.18)',
    blob3: 'rgba(234,88,12,0.12)',
    particle: 'rgba(255,255,255,0.3)',
    tiltedGradient: 'linear-gradient(90deg,#fbbf24 0%,#fb923c 100%)',
    textColor: '#fffaf0',
    textSecColor: 'rgba(255,250,240,0.75)',
    boxShadowColor: 'rgba(20,10,5,0.5)',
    boxInsetShadowColor: 'rgba(255,255,255,0.2)',
    textPlaceholderColor: 'rgba(255,250,240,0.45)',
    buttonAccentColor1: 'rgba(245,158,11,0.95)',
    buttonAccentColor1Decent: 'rgba(245,158,11,0.18)',
    buttonAccentColor2: 'rgba(234,88,12,0.95)',
    buttonAccentColor2Decent: 'rgba(234,88,12,0.18)',
  },

  sage: {
    name: 'sage',
    bgGradient: 'linear-gradient(135deg,#08110b 0%,#5a8a72 50%,#08110b 100%)',
    blob1: 'rgba(148,163,184,0.18)',
    blob2: 'rgba(34,197,94,0.18)',
    blob3: 'rgba(74,222,128,0.12)',
    particle: 'rgba(255,255,255,0.22)',
    tiltedGradient: 'linear-gradient(90deg,#9ae6b4 0%,#34d399 100%)',
    textColor: '#f3fff6',
    textSecColor: 'rgba(243,255,246,0.78)',
    boxShadowColor: 'rgba(6,10,8,0.45)',
    boxInsetShadowColor: 'rgba(255,255,255,0.2)',
    textPlaceholderColor: 'rgba(243,255,246,0.45)',
    buttonAccentColor1: 'rgba(34,197,94,0.95)',
    buttonAccentColor1Decent: 'rgba(34,197,94,0.18)',
    buttonAccentColor2: 'rgba(74,222,128,0.95)',
    buttonAccentColor2Decent: 'rgba(74,222,128,0.18)',
  },

  arctic: {
    name: 'arctic',
    bgGradient: 'linear-gradient(135deg,#02122a 0%,#7dd3fc 50%,#02122a 100%)',
    blob1: 'rgba(125,211,252,0.22)',
    blob2: 'rgba(219,234,254,0.14)',
    blob3: 'rgba(6,182,212,0.12)',
    particle: 'rgba(255,255,255,0.4)',
    tiltedGradient: 'linear-gradient(90deg,#93c5fd 0%,#0ea5e9 100%)',
    textColor: '#f7feff',
    textSecColor: 'rgba(247,254,255,0.78)',
    boxShadowColor: 'rgba(0,12,20,0.45)',
    boxInsetShadowColor: 'rgba(255,255,255,0.3)',
    textPlaceholderColor: 'rgba(247,254,255,0.45)',
    buttonAccentColor1: 'rgba(125,211,252,0.95)',
    buttonAccentColor1Decent: 'rgba(125,211,252,0.18)',
    buttonAccentColor2: 'rgba(6,182,212,0.95)',
    buttonAccentColor2Decent: 'rgba(6,182,212,0.18)',
  },

  ember: {
    name: 'ember',
    bgGradient: 'linear-gradient(135deg,#120706 0%,#b91c1c 50%,#120706 100%)',
    blob1: 'rgba(217,70,74,0.28)',
    blob2: 'rgba(245,158,11,0.18)',
    blob3: 'rgba(252,211,77,0.12)',
    particle: 'rgba(255,255,255,0.22)',
    tiltedGradient: 'linear-gradient(90deg,#f97316 0%,#ef4444 100%)',
    textColor: '#fff8f6',
    textSecColor: 'rgba(255,248,246,0.78)',
    boxShadowColor: 'rgba(10,6,6,0.6)',
    boxInsetShadowColor: 'rgba(255,255,255,0.2)',
    textPlaceholderColor: 'rgba(255,248,246,0.45)',
    buttonAccentColor1: 'rgba(217,70,74,0.95)',
    buttonAccentColor1Decent: 'rgba(217,70,74,0.18)',
    buttonAccentColor2: 'rgba(245,158,11,0.95)',
    buttonAccentColor2Decent: 'rgba(245,158,11,0.18)',
  },

  lavender: {
    name: 'lavender',
    bgGradient: 'linear-gradient(135deg,#0b0729 0%,#a78bfa 50%,#0b0729 100%)',
    blob1: 'rgba(167,139,250,0.28)',
    blob2: 'rgba(236,72,153,0.12)',
    blob3: 'rgba(99,102,241,0.12)',
    particle: 'rgba(255,255,255,0.28)',
    tiltedGradient: 'linear-gradient(90deg,#f3e8ff 0%,#c7b2ff 100%)',
    textColor: '#fffdfa',
    textSecColor: 'rgba(255,253,250,0.78)',
    boxShadowColor: 'rgba(6,4,20,0.45)',
    boxInsetShadowColor: 'rgba(255,255,255,0.2)',
    textPlaceholderColor: 'rgba(255,253,250,0.45)',
    buttonAccentColor1: 'rgba(167,139,250,0.95)',
    buttonAccentColor1Decent: 'rgba(167,139,250,0.18)',
    buttonAccentColor2: 'rgba(236,72,153,0.95)',
    buttonAccentColor2Decent: 'rgba(236,72,153,0.18)',
  },

  copper: {
    name: 'copper',
    bgGradient: 'linear-gradient(135deg,#0f0b04 0%,#7c2d12 50%,#0f0b04 100%)',
    blob1: 'rgba(124,45,18,0.28)',
    blob2: 'rgba(203,103,24,0.18)',
    blob3: 'rgba(240,219,178,0.12)',
    particle: 'rgba(255,255,255,0.24)',
    tiltedGradient: 'linear-gradient(90deg,#f6ad55 0%,#c2410c 100%)',
    textColor: '#fffaf6',
    textSecColor: 'rgba(255,250,246,0.78)',
    boxShadowColor: 'rgba(10,6,4,0.6)',
    boxInsetShadowColor: 'rgba(255,255,255,0.2)',
    textPlaceholderColor: 'rgba(255,250,246,0.45)',
    buttonAccentColor1: 'rgba(203,103,24,0.95)',
    buttonAccentColor1Decent: 'rgba(203,103,24,0.18)',
    buttonAccentColor2: 'rgba(124,45,18,0.95)',
    buttonAccentColor2Decent: 'rgba(124,45,18,0.18)',
  },

  starlight: {
    name: 'starlight',
    bgGradient: 'linear-gradient(135deg,#031026 0%,#3b185f 50%,#031026 100%)',
    blob1: 'rgba(147,51,234,0.18)',
    blob2: 'rgba(99,102,241,0.12)',
    blob3: 'rgba(255,255,255,0.06)',
    particle: 'rgba(255,255,255,0.55)',
    tiltedGradient: 'linear-gradient(90deg,#e9d5ff 0%,#a5f3fc 100%)',
    textColor: '#f7fbff',
    textSecColor: 'rgba(247,251,255,0.78)',
    boxShadowColor: 'rgba(0,0,0,0.6)',
    boxInsetShadowColor: 'rgba(255,255,255,0.3)',
    textPlaceholderColor: 'rgba(247,251,255,0.45)',
    buttonAccentColor1: 'rgba(147,51,234,0.95)',
    buttonAccentColor1Decent: 'rgba(147,51,234,0.18)',
    buttonAccentColor2: 'rgba(99,102,241,0.95)',
    buttonAccentColor2Decent: 'rgba(99,102,241,0.18)',
  },
  black: {
    name: 'black',
    bgGradient: 'linear-gradient(135deg,rgba(0, 0, 0, 1) 0%, rgba(23, 23, 23, 1) 50%, rgba(0, 0, 0, 1) 100%)',
    blob1: 'rgba(255,255,255,0.18)',
    blob2: 'rgba(255,255,255,0.3)',
    blob3: 'rgba(0,0,0,0.06)',
    particle: 'rgba(255,255,255,1)',
    tiltedGradient: 'linear-gradient(90deg, #ffffff 0%, #e0f2fe 50%, #ffffff 100%)',
    textColor: '#f7fbff',
    textSecColor: 'rgba(247,251,255,0.78)',
    boxShadowColor: 'rgba(255,255,255,0.2)',
    boxInsetShadowColor: 'rgba(255,255,255,0.8)',
    textPlaceholderColor: 'rgba(247,251,255,0.65)',
    buttonAccentColor1: 'rgba(255,255,255,0.95)',
    buttonAccentColor1Decent: 'rgba(255,255,255,0.18)',
    buttonAccentColor2: 'rgba(255,255,255,0.95)',
    buttonAccentColor2Decent: 'rgba(255,255,255,0.18)',
  },
  white: {
    name: 'white',
    bgGradient: 'linear-gradient(135deg,rgba(255, 255, 255, 1) 0%, rgba(232, 232, 232, 1) 50%, rgba(255, 255, 255, 1) 100%);',
    blob1: 'rgba(0,0,0,0.18)',
    blob2: 'rgba(0,0,0,0.3)',
    blob3: 'rgba(0,0,0,0.06)',
    particle: 'rgb(0,0,0)',
    tiltedGradient: 'linear-gradient(90deg, #111827 0%, #334155 50%, #111827 100%)',
    textColor: '#000000',
    textSecColor: 'rgba(48,48,48,0.78)',
    boxShadowColor: 'rgba(0,0,0,0.2)',
    boxInsetShadowColor: 'rgba(0,0,0,0.8)',
    textPlaceholderColor: 'rgba(51,51,51,0.65)',
    buttonAccentColor1: 'rgba(0,0,0,0.95)',
    buttonAccentColor1Decent: 'rgba(0,0,0,0.18)',
    buttonAccentColor2: 'rgba(0,0,0,0.95)',
    buttonAccentColor2Decent: 'rgba(0,0,0,0.18)',
  },
};
