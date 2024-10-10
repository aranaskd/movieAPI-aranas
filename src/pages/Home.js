import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Container, Row, Col, Card } from 'react-bootstrap';

const url_api = "http://localhost:4000";

function Home() {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${url_api}/movies/getMovies`);
        const allMovies = response.data.movies || [];
        const randomMovies = allMovies.length ? allMovies.sort(() => 0.5 - Math.random()).slice(0, 6) : [];
        setMovies(randomMovies);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Could not fetch movies. Please try again later.');
      }
    };
    fetchMovies();
  }, []);

  const handleViewDetails = async (movieId) => {
    setLoadingDetails(true);
    try {
      const response = await axios.get(`${url_api}/movies/getMovie/${movieId}`);
      setSelectedMovie(response.data);
      setShowModal(true);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      setError('Could not fetch movie details. Please try again later.');
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMovie(null);
  };

  return (
    <Container className="mt-5">
      <div className="text-center p-5 shadow-lg rounded bg-light mb-5">
        <h1 className="display-4 text-primary">Welcome to MovieMania!</h1>
        <p className="lead mt-4">Discover the world of cinema, one masterpiece at a time.</p>
        <p>Explore top-rated films, track your favorites, and dive into the world of movies like never before!</p>
      </div>

      <div className="text-center">
        <h2 className="mb-4">Featured Movies</h2>
        {error && <p className="text-danger">{error}</p>}
      </div>
      
      <Row>
        {movies.length > 0 ? (
          movies.map((movie) => (
            <Col key={movie._id} md={4} className="mb-4">
              <Card className="h-100 shadow-sm">
                <Card.Body>
                  <Card.Title className="text-primary">{movie.title}</Card.Title>
                  <Card.Text>{movie.description}</Card.Text>
                </Card.Body>
                <Card.Footer className="text-center">
                  <Button variant="primary" onClick={() => handleViewDetails(movie._id)}>
                    View Details
                  </Button>
                </Card.Footer>
              </Card>
            </Col>
          ))
        ) : (
          <p className="text-center mt-4">No movies available</p>
        )}
      </Row>

      {/* Modal for displaying movie details */}
      {selectedMovie && (
        <Modal show={showModal} onHide={handleCloseModal} centered>
          <Modal.Header closeButton>
            <Modal.Title>{selectedMovie.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {loadingDetails ? (
              <p>Loading details...</p>
            ) : (
              <>
                <p><strong>Director:</strong> {selectedMovie.director}</p>
                <p><strong>Year:</strong> {selectedMovie.year}</p>
                <p><strong>Description:</strong> {selectedMovie.description}</p>
                <p><strong>Genre:</strong> {selectedMovie.genre}</p>
                <p><strong>Comments:</strong></p>
                <ul>
                  {selectedMovie.comments && selectedMovie.comments.length > 0 ? (
                    selectedMovie.comments.map((commentObj) => (
                      <li key={commentObj._id}>
                        <strong>User:</strong> {commentObj.userId} <br />
                        <strong>Comment:</strong> {commentObj.comment}
                      </li>
                    ))
                  ) : (
                    <li>No comments available</li>
                  )}
                </ul>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      )}
    </Container>
  );
}

export default Home;
