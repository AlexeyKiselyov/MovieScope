import { useEffect } from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  canonical?: string;
  noindex?: boolean;
  // Open Graph / Twitter
  ogImage?: string;
  ogType?: string; // e.g., 'website' | 'article' | 'video.movie'
  twitterCard?: 'summary' | 'summary_large_image';
  // JSON-LD structured data
  jsonLd?: object | object[];
}

function setMetaTag(attr: 'name' | 'property', key: string, content: string) {
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    if (attr === 'name') {
      (el as HTMLMetaElement).setAttribute('name', key);
    } else {
      (el as HTMLMetaElement).setAttribute('property', key);
    }
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function removeMetaTag(attr: 'name' | 'property', key: string) {
  const el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (el) document.head.removeChild(el);
}

function setLinkTag(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    (el as HTMLLinkElement).rel = rel;
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function removeLinkTag(rel: string) {
  const el = document.head.querySelector(`link[rel="${rel}"]`);
  if (el) document.head.removeChild(el);
}

function injectJsonLd(id: string, data: object | object[]) {
  let script = document.getElementById(id) as HTMLScriptElement | null;
  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = id;
    document.head.appendChild(script);
  }
  script.text = JSON.stringify(data);
}

function removeJsonLd(id: string) {
  const script = document.getElementById(id);
  if (script) script.remove();
}

export default function SEO({
  title,
  description,
  canonical,
  noindex,
  ogImage,
  ogType = 'website',
  twitterCard = 'summary_large_image',
  jsonLd,
}: SEOProps) {
  useEffect(() => {
    const prevTitle = document.title;
    if (title) document.title = title;

    if (description) setMetaTag('name', 'description', description);
    if (canonical) setLinkTag('canonical', canonical);

    if (noindex) {
      setMetaTag('name', 'robots', 'noindex, nofollow');
    } else {
      // ensure robots is not incorrectly set
      const robots = document.head.querySelector('meta[name="robots"]');
      if (robots) robots.remove();
    }

    // Open Graph
    if (title) setMetaTag('property', 'og:title', title);
    if (description) setMetaTag('property', 'og:description', description);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:site_name', 'MovieScope');
    setMetaTag('property', 'og:url', canonical || window.location.href);
    if (ogImage) setMetaTag('property', 'og:image', ogImage);

    // Twitter
    setMetaTag('name', 'twitter:card', twitterCard);
    if (title) setMetaTag('name', 'twitter:title', title);
    if (description) setMetaTag('name', 'twitter:description', description);
    if (ogImage) setMetaTag('name', 'twitter:image', ogImage);
    if (canonical) setMetaTag('name', 'twitter:url', canonical);

    // JSON-LD
    if (jsonLd) injectJsonLd('jsonld-primary', jsonLd);

    return () => {
      if (title) document.title = prevTitle;
      if (description) removeMetaTag('name', 'description');
      if (canonical) removeLinkTag('canonical');
      if (noindex) removeMetaTag('name', 'robots');
      if (title) removeMetaTag('property', 'og:title');
      if (description) removeMetaTag('property', 'og:description');
      removeMetaTag('property', 'og:type');
      removeMetaTag('property', 'og:site_name');
      removeMetaTag('property', 'og:url');
      if (ogImage) removeMetaTag('property', 'og:image');
      removeMetaTag('name', 'twitter:card');
      if (title) removeMetaTag('name', 'twitter:title');
      if (description) removeMetaTag('name', 'twitter:description');
      if (ogImage) removeMetaTag('name', 'twitter:image');
      if (canonical) removeMetaTag('name', 'twitter:url');
      if (jsonLd) removeJsonLd('jsonld-primary');
    };
  }, [
    title,
    description,
    canonical,
    noindex,
    ogImage,
    ogType,
    twitterCard,
    jsonLd,
  ]);

  return null;
}
