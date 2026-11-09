import { site } from '../data/site';

export const abs = (path: string) => new URL(path, site.url).href;

export type Crumb = { name: string; href: string };

export function organization(logoUrl: string) {
  return {
    '@type': 'ProfessionalService',
    '@id': `${site.url}/#org`,
    name: site.name,
    alternateName: site.shortName,
    url: `${site.url}/`,
    logo: logoUrl,
    image: logoUrl,
    telephone: site.phoneOfficeE164,
    email: site.email,
    slogan: site.tagline,
    description:
      'Business, executive and career coaching from Joe Hliboki in Montvale, New Jersey. Early-career coaching, executive coaching, corporate training and group programs.',
    address: {
      '@type': 'PostalAddress',
      addressLocality: site.locality,
      addressRegion: site.region,
      addressCountry: site.country,
    },
    areaServed: site.areaServed.map((name) => ({ '@type': 'Place', name })),
    founder: { '@id': `${site.url}/#joe` },
    sameAs: [site.linkedin, site.calendly],
  };
}

export function person(imageUrl?: string) {
  return {
    '@type': 'Person',
    '@id': `${site.url}/#joe`,
    name: site.owner,
    jobTitle: site.jobTitle,
    worksFor: { '@id': `${site.url}/#org` },
    url: `${site.url}/about/`,
    ...(imageUrl ? { image: imageUrl } : {}),
    sameAs: [site.linkedin],
  };
}

export function breadcrumbs(crumbs: Crumb[]) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: [{ name: 'Home', href: '/' }, ...crumbs].map((c, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: c.name,
      item: abs(c.href),
    })),
  };
}

export function service(name: string, path: string, description: string, audience: string) {
  return {
    '@type': 'Service',
    name,
    serviceType: name,
    url: abs(path),
    description,
    provider: { '@id': `${site.url}/#org` },
    areaServed: site.areaServed.map((n) => ({ '@type': 'Place', name: n })),
    audience: { '@type': 'Audience', audienceType: audience },
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    '@type': 'FAQPage',
    mainEntity: items.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}

export function webPage(path: string, name: string, description: string) {
  return {
    '@type': 'WebPage',
    '@id': `${abs(path)}#page`,
    url: abs(path),
    name,
    description,
    isPartOf: { '@id': `${site.url}/#website` },
    about: { '@id': `${site.url}/#org` },
  };
}

export function website() {
  return {
    '@type': 'WebSite',
    '@id': `${site.url}/#website`,
    url: `${site.url}/`,
    name: site.shortName,
    publisher: { '@id': `${site.url}/#org` },
  };
}
