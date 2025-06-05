import { useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import styles from "./App.module.css";
import SearchBar from "../SearchBar/SearchBar";
import { fetchMovies } from "../api/tmdb";
import MovieGrid from "../MovieGrid/MovieGrid";
import Loader from "../Loader/Loader";
import ErrorMessage from "../ErrorMessage/ErrorMessage";
import MovieModal from "../MovieModal/MovieModal";
import type { Movie } from "../../types/movie";

export default function App() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [queryFromSearchBar, setQueryFromSearchBar] = useState("");
  const [selectedMovie, setSelectedMovie] = useState<null | Movie>(null);

  const handleSearch = async (query: string, page: number = 1) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const fetchResult = await fetchMovies({ query, page });
      setMovies(fetchResult.results);
      setTotalPages(fetchResult.total_pages);
      if (fetchResult.results.length === 0) {
        toast("No movies found for your request.");
      }
    } catch (err) {
      const errorMessage = `${err}`;
      setError(errorMessage);
      toast.error(errorMessage);
      setMovies([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages || newPage === currentPage) return;
    setCurrentPage(newPage);
    handleSearch(queryFromSearchBar, newPage);
  };

  const updateQuery = (query: string) => {
    setQueryFromSearchBar(query);
    setCurrentPage(1);
    handleSearch(query, 1);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
  };

  const handleCloseModal = () => {
    setSelectedMovie(null);
  };

  return (
    <div className={styles.app}>
      <SearchBar onSubmit={updateQuery} />
      {isLoading ? (
        <Loader />
      ) : error ? (
        <ErrorMessage />
      ) : (
        <MovieGrid movies={movies} onSelect={handleMovieSelect} />
      )}
      {totalPages > 1 && !isLoading && !error && (
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={styles.paginationButton}
          >
            Prev
          </button>
          <span className={styles.pageInfo}>
            Page {currentPage} from {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={styles.paginationButton}
          >
            Next
          </button>
        </div>
      )}
      {selectedMovie && <MovieModal movie={selectedMovie} onClose={handleCloseModal} />}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 5000,
          style: {
            background: "#f40",
            color: "#fff",
          },
          error: {
            style: {
              background: "#f40",
              color: "#fff",
            },
          },
          success: {
            style: {
              background: "#2c7",
              color: "#fff",
            },
          },
        }}
      />
    </div>
  );
}
