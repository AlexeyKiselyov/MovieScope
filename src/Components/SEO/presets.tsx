import SEO from './SEO';

const getBaseUrl = () =>
  import.meta.env.VITE_SITE_URL || window.location.origin;

export function HomeSEO() {
  const BASE_URL = getBaseUrl();
  return (
    <SEO
      title="MovieScope — Trending Movies"
      description="Trending movies of the day/week on MovieScope. Discover what's popular right now."
      canonical={BASE_URL + '/'}
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MovieScope',
        url: BASE_URL + '/',
        potentialAction: {
          '@type': 'SearchAction',
          target: BASE_URL + '/movies?query={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

export function MoviesSEO({ query }: { query: string }) {
  const BASE_URL = getBaseUrl();
  const title = query
    ? `Search: ${query} — MovieScope`
    : 'Search Movies — MovieScope';
  const description = query
    ? `Search results for "${query}" on MovieScope.`
    : 'Find a movie by title on MovieScope.';
  const canonical =
    BASE_URL +
    (query ? `/movies?query=${encodeURIComponent(query)}` : '/movies');
  return (
    <SEO
      title={title}
      description={description}
      canonical={canonical}
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        name: 'MovieScope',
        url: BASE_URL + '/movies',
        potentialAction: {
          '@type': 'SearchAction',
          target: BASE_URL + '/movies?query={search_term_string}',
          'query-input': 'required name=search_term_string',
        },
      }}
    />
  );
}

export function MovieDetailsSEO({
  movieId,
  original_title,
  overview,
  poster_path,
  vote_average,
}: {
  movieId: string;
  original_title: string;
  overview: string;
  poster_path?: string | null;
  vote_average?: number | null;
}) {
  const BASE_URL = getBaseUrl();
  const description =
    overview && overview.trim().length > 0
      ? overview.slice(0, 160)
      : `${original_title} — movie details: rating, overview, cast, and reviews.`;
  const ogImage = poster_path
    ? `https://image.tmdb.org/t/p/w500${poster_path}`
    : undefined;
  return (
    <SEO
      title={`${original_title} — MovieScope`}
      description={description}
      canonical={BASE_URL + `/movies/${movieId}`}
      ogImage={ogImage}
      ogType="video.movie"
      jsonLd={{
        '@context': 'https://schema.org',
        '@type': 'Movie',
        name: original_title,
        image: ogImage,
        description:
          overview && overview.trim().length > 0 ? overview : undefined,
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue:
            typeof vote_average === 'number' ? vote_average.toFixed(1) : '0',
          ratingCount: 1,
          bestRating: '10',
          worstRating: '0',
        },
      }}
    />
  );
}
