import React, { useState, useEffect, useCallback } from 'react';
import './App.css'; // Import the CSS file

// --- Configuration ---
// IMPORTANT: You MUST get your own free API key from themoviedb.org
const API_KEY_VALUE = 'f0dbfcd38c293fc33e869277548c9926'; // <-- PASTE YOUR 32-CHARACTER KEY HERE
const API_URL_PARAM = `api_key=${API_KEY_VALUE}`;

const BASE_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w500';
const YOUTUBE_URL = 'https://www.youtube.com/embed/';

// --- Helper Components ---

const StarIcon = ({ className }) => (
  <svg className={className} fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
  </svg>
);

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setQuery('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <div className="search-input-wrapper">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search movies or TV shows..."
          className="search-input"
        />
        <button type="submit" className="search-button">
          <svg className="search-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
        </button>
      </div>
    </form>
  );
};

const MovieCard = ({ movie, onCardClick, onBookmark, isBookmarked }) => {
  const { title, name, poster_path, vote_average } = movie;
  const movieTitle = title || name;

  if (!poster_path) return null;

  return (
    <div className="movie-card">
      <div className="card-content">
        <img src={`${IMG_URL}${poster_path}`} alt={movieTitle} className="card-poster" onClick={() => onCardClick(movie)} />
        <div 
          onClick={(e) => {
            e.stopPropagation();
            onBookmark(movie);
          }}
          className={`bookmark-icon ${isBookmarked ? 'bookmarked' : ''}`}
        >
          <StarIcon className="star-icon" />
        </div>
        <div className="card-rating">{vote_average.toFixed(1)}</div>
        <div className="card-info" onClick={() => onCardClick(movie)}>
          <h3 className="card-title">{movieTitle}</h3>
        </div>
      </div>
    </div>
  );
};

const MovieModal = ({ movie, trailerKey, onClose }) => {
  if (!movie) return null;

  const { title, name, overview, vote_average, release_date, first_air_date, genres } = movie;
  const movieTitle = title || name;
  const releaseYear = release_date ? release_date.substring(0, 4) : first_air_date ? first_air_date.substring(0, 4) : 'N/A';

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-inner">
          <button onClick={onClose} className="modal-close-button">×</button>
          
          {trailerKey ? (
            <div className="trailer-container">
              <iframe
                src={`${YOUTUBE_URL}${trailerKey}?autoplay=1`}
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="trailer-iframe"
              ></iframe>
            </div>
          ) : (
             <img src={`${IMG_URL}${movie.backdrop_path || movie.poster_path}`} alt={movieTitle} className="modal-backdrop" />
          )}

          <div className="modal-details">
            <h2 className="modal-title">{movieTitle}</h2>
            <div className="modal-meta">
              <span>{releaseYear}</span>
              <span className="modal-rating"><StarIcon className="star-icon" /> {vote_average.toFixed(1)}</span>
              <span>{genres?.map(g => g.name).join(', ')}</span>
            </div>
            <p className="modal-overview">{overview}</p>
          </div>
        </div>
      </div>
    </div>
  );
};


// --- Main App Component ---
export default function App() {
  const [movies, setMovies] = useState([]);
  const [status, setStatus] = useState('loading');
  const [sectionTitle, setSectionTitle] = useState('Trending Now');
  const [activeSection, setActiveSection] = useState('trending');
  
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [trailerKey, setTrailerKey] = useState(null);

  const [bookmarks, setBookmarks] = useState(() => {
    const savedBookmarks = localStorage.getItem('movieBookmarks');
    return savedBookmarks ? JSON.parse(savedBookmarks) : [];
  });

  const fetchMovies = useCallback(async (url, title) => {
    setStatus('loading');
    setSectionTitle(title);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error('Network response was not ok');
      const data = await response.json();
      setMovies(data.results);
      setStatus('success');
    } catch (error) {
      console.error("Failed to fetch movies:", error);
      setStatus('error');
    }
  }, []);

  useEffect(() => {
    if (activeSection === 'trending') {
      const trendingUrl = `${BASE_URL}/trending/all/week?${API_URL_PARAM}`;
      fetchMovies(trendingUrl, 'Trending Now');
    } else if (activeSection === 'bookmarks') {
      setSectionTitle('My Bookmarks');
      setMovies(bookmarks);
      setStatus(bookmarks.length > 0 ? 'success' : 'empty');
    }
  }, [activeSection, fetchMovies, bookmarks]);
  
  useEffect(() => {
    localStorage.setItem('movieBookmarks', JSON.stringify(bookmarks));
  }, [bookmarks]);

  const handleSearch = (query) => {
    const searchUrl = `${BASE_URL}/search/multi?${API_URL_PARAM}&query=${encodeURIComponent(query)}`;
    fetchMovies(searchUrl, `Results for "${query}"`);
    setActiveSection('search');
  };

  const handleCardClick = async (movie) => {
    setSelectedMovie(movie);
    const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
    try {
      const response = await fetch(`${BASE_URL}/${mediaType}/${movie.id}?${API_URL_PARAM}&append_to_response=videos`);
      const data = await response.json();
      const officialTrailer = data.videos?.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
      setTrailerKey(officialTrailer?.key || null);
    } catch (error) {
      console.error("Failed to fetch trailer:", error);
      setTrailerKey(null);
    }
  };

  const handleBookmark = (movie) => {
    setBookmarks(prevBookmarks => {
      const isBookmarked = prevBookmarks.some(b => b.id === movie.id);
      if (isBookmarked) {
        return prevBookmarks.filter(b => b.id !== movie.id);
      } else {
        const bookmarkMovie = { ...movie, media_type: movie.media_type || (movie.title ? 'movie' : 'tv') };
        return [...prevBookmarks, bookmarkMovie];
      }
    });
  };

  const renderContent = () => {
    if (status === 'loading') {
      return <div className="status-message">Loading...</div>;
    }
    if (status === 'error') {
      return <div className="status-message error">Failed to load content. Please try again later.</div>;
    }
    if (status === 'empty' || movies.length === 0) {
        return <div className="status-message">No movies or shows found.</div>;
    }
    return (
      <div className="movies-grid">
        {movies.map(movie => (
          <MovieCard
            key={movie.id}
            movie={movie}
            onCardClick={handleCardClick}
            onBookmark={handleBookmark}
            isBookmarked={bookmarks.some(b => b.id === movie.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <div className="app-container">
      <header className="header">
        <div className="container header-content">
          <h1 className="logo">MovieVault</h1>
          <nav className="main-nav">
            <button 
              onClick={() => setActiveSection('trending')}
              className={`nav-button ${activeSection === 'trending' ? 'active' : ''}`}
            >
              Trending
            </button>
            <button 
              onClick={() => setActiveSection('bookmarks')}
              className={`nav-button ${activeSection === 'bookmarks' ? 'active' : ''}`}
            >
              Bookmarks
            </button>
          </nav>
          <SearchBar onSearch={handleSearch} />
        </div>
      </header>

      <main className="container">
        <h2 className="section-title">{sectionTitle}</h2>
        {renderContent()}
      </main>

      {selectedMovie && (
        <MovieModal 
          movie={selectedMovie} 
          trailerKey={trailerKey}
          onClose={() => setSelectedMovie(null)} 
        />
      )}
    </div>
  );
}
