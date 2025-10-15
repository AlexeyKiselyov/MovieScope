export interface Movie {
  id: string;
  title: string;
  poster_path: string;
  vote_average: number;
}

export interface MovieDetails {
  genres: { name: string }[];
  poster_path: string;
  overview: string;
  original_title: string;
  vote_average: number;
  release_date: string;
}
