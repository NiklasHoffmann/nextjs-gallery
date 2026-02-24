export const siteConfig = {
  name: 'Next.js Starter',
  description:
    'A production-ready Next.js 16 starter with TypeScript, Tailwind CSS, MongoDB, i18n, and more.',
  url: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/NiklasHoffmann/NextJSRaw',
  },
  creator: {
    name: 'Niklas Hoffmann',
    url: 'https://github.com/NiklasHoffmann',
  },
};

export type SiteConfig = typeof siteConfig;
