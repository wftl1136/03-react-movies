export interface Movie {
  id: number;
  title: string;
  release_date: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
}

// Пропси для MovieGrid
export interface MovieGridProps {
  movies: Movie[];
  onSelect: (movie: Movie) => void;
}

// Пропси для SearchBar
export interface SearchBarProps {
  onSubmit: (query: string) => void;
}

// Параметри для fetchMovies
export interface FetchMoviesParams {
  query: string;
  page?: number;
}

// Відповідь API TMDB для пошуку фільмів
export interface FetchMoviesResponse {
  results: Movie[];
  total_results: number;
  total_pages: number;
}
