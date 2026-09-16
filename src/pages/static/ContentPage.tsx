'use client';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { fontFamily, fontWeight } from '../../design-system/tokens/typography';
import { StaticPageShell, type StaticPageProps } from './StaticPageShell';

export type ContentSlug = 'about' | 'privacy' | 'terms';

interface DocSection {
  heading: string;
  /** Paragraphs and/or bullet lists. */
  body: Array<string | { list: string[] }>;
}

interface DocContent {
  eyebrow: string;
  title: string;
  lede: string;
  /** Effective/updated date shown under the lede (legal pages). */
  updated?: string;
  sections: DocSection[];
}

const CONTENT: Record<ContentSlug, DocContent> = {
  about: {
    eyebrow: 'Our Story',
    title: 'About Walherb',
    lede: 'Walherb brings premium American wellness, beauty, bath and baby-care products to India — with import duties pre-paid, authenticity guaranteed, and customs handled on your behalf.',
    sections: [
      {
        heading: 'Why we exist',
        body: [
          'Shopping for trusted international wellness products from India has always meant a maze of grey-market sellers, surprise customs charges, and weeks of uncertainty. Walherb was built to remove that friction entirely.',
          'We source directly from official brand channels and authorized US retailers, then handle import, compliance, and last-mile delivery so you receive genuine products at a clear, all-inclusive price.',
        ],
      },
      {
        heading: 'How sourcing works',
        body: [
          'Walherb imports each product on your behalf as the facilitating importer. Products may be fulfilled directly from the listed seller, or from equivalent authorized suppliers and retailers when needed to ensure availability — always covered by our buyer protection and quality standards.',
          { list: [
            'Sourced from official brand websites, authorized US retailers, and certified distributors.',
            'Every batch is verified with purchase receipts and authenticity certificates.',
            'Duties and taxes are calculated and pre-paid, so there are no surprises at delivery.',
          ] },
        ],
      },
      {
        heading: 'What we stand for',
        body: [
          'Authenticity, transparency, and a genuinely premium experience from browse to doorstep. Every order is backed by responsive customer support, clear tracking, and a 14-day return policy.',
        ],
      },
    ],
  },

  privacy: {
    eyebrow: 'Legal',
    title: 'Privacy Policy',
    lede: 'This policy explains what information Walherb collects, how we use it, and the choices you have. We are committed to protecting your personal data and using it only to deliver and improve your experience.',
    updated: 'Last updated: 19 June 2026',
    sections: [
      {
        heading: '1. Information we collect',
        body: [
          'We collect information you provide directly and information generated as you use Walherb:',
          { list: [
            'Account & contact details — name, email, phone number, and shipping address.',
            'Order information — products purchased, payment confirmation, and delivery details.',
            'KYC documents — identity documents required by Indian customs for personal imports.',
            'Usage data — device, browser, and interactions used to improve the service.',
          ] },
        ],
      },
      {
        heading: '2. How we use your information',
        body: [
          'Your information is used to process orders, clear customs, provide support, prevent fraud, and meet legal obligations. We also use it to personalise your experience and communicate updates relevant to your orders.',
        ],
      },
      {
        heading: '3. Sharing & disclosure',
        body: [
          'We share data only with parties necessary to fulfil your order — logistics and customs partners, payment processors, and authorized suppliers — and with authorities where legally required. We never sell your personal data.',
        ],
      },
      {
        heading: '4. Data security & retention',
        body: [
          'Personal data is encrypted in transit and at rest, and retained only as long as needed to provide the service and satisfy legal, accounting, or reporting requirements.',
        ],
      },
      {
        heading: '5. Your rights',
        body: [
          'You may request access to, correction of, or deletion of your personal data, subject to legal retention requirements. To exercise these rights, contact us at privacy@walherb.com.',
        ],
      },
    ],
  },

  terms: {
    eyebrow: 'Legal',
    title: 'Terms & Conditions',
    lede: 'These terms govern your use of walherb.com and the purchase of products through our platform. By using Walherb, you agree to these terms.',
    updated: 'Last updated: 19 June 2026',
    sections: [
      {
        heading: '1. About these terms',
        body: [
          'Walherb operates an e-commerce platform that sources and imports international wellness products into India on behalf of its customers. By placing an order, you confirm you are at least 18 years old and that the information you provide is accurate.',
        ],
      },
      {
        heading: '2. Orders & pricing',
        body: [
          'All prices are shown in INR and include applicable import duties and taxes unless stated otherwise. We reserve the right to cancel or refuse any order, including where pricing errors, stock issues, or compliance concerns arise.',
        ],
      },
      {
        heading: '3. Import, KYC & customs',
        body: [
          'Personal imports into India require identity verification (KYC). You authorise Walherb to act as the facilitating importer and to use your submitted documents solely for customs clearance, in accordance with the Customs Act and FEMA regulations.',
        ],
      },
      {
        heading: '4. Shipping, returns & refunds',
        body: [
          'Estimated delivery windows are provided at checkout. Eligible products may be returned within 14 days of delivery in line with our Returns & Exchanges policy. Refunds are issued to the original payment method once a return is received and inspected.',
        ],
      },
      {
        heading: '5. Intellectual property',
        body: [
          'All content on this website is the exclusive property of Walherb and its affiliates or licensors and is protected by applicable law. If you believe a listing infringes your rights, please use our Report Infringement form.',
        ],
      },
      {
        heading: '6. Limitation of liability',
        body: [
          'Walherb is not liable for indirect or consequential losses arising from use of the platform, to the maximum extent permitted by law. Nothing in these terms limits liability that cannot be excluded under applicable law.',
        ],
      },
    ],
  },
};

const Body = ({ item }: { item: string | { list: string[] } }) => {
  if (typeof item === 'string') {
    return (
      <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', lineHeight: 1.75, color: '#5A5750' }}>
        {item}
      </Typography>
    );
  }
  return (
    <Box component="ul" sx={{ m: 0, pl: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
      {item.list.map((li) => (
        <Box component="li" key={li} sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.regular, fontSize: '14px', lineHeight: 1.7, color: '#5A5750' }}>
          {li}
        </Box>
      ))}
    </Box>
  );
};

export const ContentPage = ({ slug, ...shell }: { slug: ContentSlug } & StaticPageProps) => {
  const c = CONTENT[slug];
  return (
    <StaticPageShell {...shell} eyebrow={c.eyebrow} title={c.title} lede={c.lede}>
      <Box sx={{ backgroundColor: '#FFFFFF', border: '1px solid #E3E6EC', borderRadius: '16px', p: { xs: '20px', md: '32px' }, display: 'flex', flexDirection: 'column', gap: '28px' }}>
        {c.updated && (
          <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.medium, fontSize: '12px', color: '#97939E' }}>
            {c.updated}
          </Typography>
        )}
        {c.sections.map((section) => (
          <Box key={section.heading} sx={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <Typography sx={{ fontFamily: fontFamily.sans, fontWeight: fontWeight.semiBold, fontSize: '18px', color: '#474743' }}>
              {section.heading}
            </Typography>
            {section.body.map((item, i) => <Body key={i} item={item} />)}
          </Box>
        ))}
      </Box>
    </StaticPageShell>
  );
};

export default ContentPage;
