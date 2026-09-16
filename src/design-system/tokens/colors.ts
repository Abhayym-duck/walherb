export const colors = {
  primaryGold: {
    50: '#EDE2D0',
    100: '#EBCFA8',
    200: '#F6C247',
    300: '#E8B20A',
    400: '#CC9C07',
    500: '#B88A03',
    600: '#947000',
    700: '#715500',
    800: '#543F00',
    900: '#362900',
    950: '#1F1700',
  },
  successGreen: {
    50: '#A8E0B1',
    100: '#61E27C',
    200: '#59CA71',
    300: '#4AB25F',
    400: '#3E954F',
    500: '#307C40',
    600: '#266334',
    700: '#184F24',
    800: '#093A13',
    900: '#002606',
    950: '#001503',
  },
  forestGreen: {
    50: '#BFD2C6',
    100: '#A9C5B2',
    200: '#92A79A',
    300: '#77877C',
    400: '#4F5C53',
    500: '#253028',
    600: '#18241D',
    700: '#0D1A13',
    800: '#05130A',
    900: '#000C03',
    950: '#000601',
  },
  neutral: {
    50: '#FFFFFF',
    100: '#FAFAFA',
    200: '#F3F3F3',
    300: '#E7E7E7',
    400: '#DADADA',
    500: '#CFCFCF',
    600: '#B0B0B0',
    700: '#8A8A8A',
    800: '#626262',
    900: '#353535',
    950: '#111111',
  },
  slate: {
    50: '#CDD5D0',
    100: '#B8C7BF',
    200: '#A6B1AB',
    300: '#97A09B',
    400: '#808681',
    500: '#666B66',
    600: '#505550',
    700: '#3A3F3A',
    800: '#252925',
    900: '#111411',
    950: '#000500',
  },
} as const;

export type ColorPalette = typeof colors;

// ─── Walherb Brand Colors (extracted from Figma) ─────────────────────────────
export const walherb = {
  // Announcement bar
  announcement:       '#D5A310',

  // Brand greens
  greenPrimary:       '#476D59',   // Header, cart button, logo
  greenDark:          '#1F322A',   // Footer bg, deep headings
  greenDeep:          '#0F3D25',   // Trust section headings
  greenMid:           '#33463E',   // FAQ left text
  greenLight:         '#5A8A6E',   // Supporting body text
  greenBg:            '#F0FAF4',   // Why-section background
  greenBgBadge:       '#CCEBD9',   // Why-section badge bg
  greenBadgeBorder:   '#B8D7C5',
  greenCard:          '#394C44',   // FAQ CTA card bg
  greenCardBorder:    '#4D6058',
  greenIcon:          '#358740',   // Service block icon bg / add-to-cart text
  greenIconBorder:    '#499B54',
  greenIconDark:      '#3D634F',   // Cart badge bg

  // Text
  textPrimary:        '#433C50',   // Main body text (slight purple)
  textHeading:        '#474743',   // Section headings
  textProduct:        '#3E3E3C',   // Product price
  textRating:         '#3D4440',   // Star rating number
  textSubtle:         '#575064',   // Trust-bar subtitles

  // Page UI
  bgPage:             '#F7F8FB',
  bgSection:          '#F7F7F7',
  border:             '#EDEDED',
  borderNav:          '#E3E6EC',

  // Product card
  addToCartBg:        '#F0FEF4',
  addToCartText:      '#358740',
  priceMuted:         '#B5B0B0',

  // Hero slide nav buttons
  heroNavBlue:        '#295B97',
  heroNavBlueBorder:  '#3365A1',
  heroNavGreen:       '#55A161',
  heroNavGreenBorder: '#5FAB6B',
  heroNavTeal:        '#50BEAC',
  heroNavTealBorder:  '#5AC8B6',

  // Footer
  footerMuted:        '#9E9E9E',
  footerDim:          '#C1C1C1',
  footerDimmer:       '#999999',
  footerBorder:       '#7A9B8D',
  footerDark:         '#1A1A1A',
  footerBorderDark:   '#333333',
} as const;
