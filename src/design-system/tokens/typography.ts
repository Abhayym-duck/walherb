export const fontFamily = {
  sans: "var(--font-dm-sans, 'DM Sans', sans-serif)",
} as const;

export const fontWeight = {
  regular: 400,
  medium: 500,
  semiBold: 600,
  bold: 700,
} as const;

export const fontSize = {
  displayLarge: 56,
  displayMedium: 44,
  displaySmall: 36,
  t1: 22,
  t2: 18,
  t3: 16,
  t4: 14,
  b1: 16,
  b2: 14,
  b3: 12,
  b4: 10,
} as const;

export const lineHeight = {
  displayLarge: '66px',
  displayMedium: '54px',
  displaySmall: '44px',
  t1: '28.6px',
  t2: '23.4px',
  t3: '20.8px',
  t4: '18.2px',
  b1: '22.4px',
  b2: '19.6px',
  b3: '16.8px',
  b4: '13px',
} as const;

export const typography = {
  displayLarge: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.displayLarge,
    lineHeight: lineHeight.displayLarge,
    fontWeight: fontWeight.bold,
  },
  displayMedium: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.displayMedium,
    lineHeight: lineHeight.displayMedium,
    fontWeight: fontWeight.bold,
  },
  displaySmall: {
    fontFamily: fontFamily.sans,
    fontSize: fontSize.displaySmall,
    lineHeight: lineHeight.displaySmall,
    fontWeight: fontWeight.bold,
  },
  t1Bold: { fontFamily: fontFamily.sans, fontSize: fontSize.t1, lineHeight: lineHeight.t1, fontWeight: fontWeight.bold },
  t1SemiBold: { fontFamily: fontFamily.sans, fontSize: fontSize.t1, lineHeight: lineHeight.t1, fontWeight: fontWeight.semiBold },
  t1Medium: { fontFamily: fontFamily.sans, fontSize: fontSize.t1, lineHeight: lineHeight.t1, fontWeight: fontWeight.medium },
  t2Bold: { fontFamily: fontFamily.sans, fontSize: fontSize.t2, lineHeight: lineHeight.t2, fontWeight: fontWeight.bold },
  t2SemiBold: { fontFamily: fontFamily.sans, fontSize: fontSize.t2, lineHeight: lineHeight.t2, fontWeight: fontWeight.semiBold },
  t2Medium: { fontFamily: fontFamily.sans, fontSize: fontSize.t2, lineHeight: lineHeight.t2, fontWeight: fontWeight.medium },
  t3Bold: { fontFamily: fontFamily.sans, fontSize: fontSize.t3, lineHeight: lineHeight.t3, fontWeight: fontWeight.bold },
  t3SemiBold: { fontFamily: fontFamily.sans, fontSize: fontSize.t3, lineHeight: lineHeight.t3, fontWeight: fontWeight.semiBold },
  t3Medium: { fontFamily: fontFamily.sans, fontSize: fontSize.t3, lineHeight: lineHeight.t3, fontWeight: fontWeight.medium },
  t4Bold: { fontFamily: fontFamily.sans, fontSize: fontSize.t4, lineHeight: lineHeight.t4, fontWeight: fontWeight.bold },
  t4SemiBold: { fontFamily: fontFamily.sans, fontSize: fontSize.t4, lineHeight: lineHeight.t4, fontWeight: fontWeight.semiBold },
  t4Medium: { fontFamily: fontFamily.sans, fontSize: fontSize.t4, lineHeight: lineHeight.t4, fontWeight: fontWeight.medium },
  b1Regular: { fontFamily: fontFamily.sans, fontSize: fontSize.b1, lineHeight: lineHeight.b1, fontWeight: fontWeight.regular },
  b1Medium: { fontFamily: fontFamily.sans, fontSize: fontSize.b1, lineHeight: lineHeight.b1, fontWeight: fontWeight.medium },
  b1SemiBold: { fontFamily: fontFamily.sans, fontSize: fontSize.b1, lineHeight: lineHeight.b1, fontWeight: fontWeight.semiBold },
  b2Regular: { fontFamily: fontFamily.sans, fontSize: fontSize.b2, lineHeight: lineHeight.b2, fontWeight: fontWeight.regular },
  b2Medium: { fontFamily: fontFamily.sans, fontSize: fontSize.b2, lineHeight: lineHeight.b2, fontWeight: fontWeight.medium },
  b2SemiBold: { fontFamily: fontFamily.sans, fontSize: fontSize.b2, lineHeight: lineHeight.b2, fontWeight: fontWeight.semiBold },
  b3Regular: { fontFamily: fontFamily.sans, fontSize: fontSize.b3, lineHeight: lineHeight.b3, fontWeight: fontWeight.regular },
  b3Medium: { fontFamily: fontFamily.sans, fontSize: fontSize.b3, lineHeight: lineHeight.b3, fontWeight: fontWeight.medium },
  b3SemiBold: { fontFamily: fontFamily.sans, fontSize: fontSize.b3, lineHeight: lineHeight.b3, fontWeight: fontWeight.semiBold },
  b4Regular: { fontFamily: fontFamily.sans, fontSize: fontSize.b4, lineHeight: lineHeight.b4, fontWeight: fontWeight.regular },
  b4Medium: { fontFamily: fontFamily.sans, fontSize: fontSize.b4, lineHeight: lineHeight.b4, fontWeight: fontWeight.medium },
} as const;
