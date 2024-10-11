import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button, Form, Card, Container, Row, Col } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import { useUser } from '../contexts/UserContext';

const url_api = "https://movieapp-api-lms1.onrender.com";
const notyf = new Notyf();

export default function Movies() {
  const { user } = useUser();
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [showCommentModal, setShowCommentModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentMovieId, setCurrentMovieId] = useState(null);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const response = await axios.get(`${url_api}/movies/getMovies`);
        setMovies(response.data.movies || []);
      } catch (err) {
        console.error('Error fetching movies:', err);
        setError('Could not fetch movies. Please try again later.');
      }
    };
    
    fetchMovies();
  }, []);

  const handleViewDetails = async (movieId) => {
    setLoading(true);
    try {
      const response = await axios.get(`${url_api}/movies/getMovie/${movieId}`);
      setSelectedMovie(response.data);
      setShowDetailsModal(true);
    } catch (err) {
      console.error('Error fetching movie details:', err);
      notyf.error('Could not fetch movie details. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = (movieId) => {
    setCurrentMovieId(movieId);
    setShowCommentModal(true);
  };

  const handleCloseCommentModal = () => {
    setShowCommentModal(false);
    setComment("");
  };

  const handleCloseDetailsModal = () => {
    setShowDetailsModal(false);
    setSelectedMovie(null);
  };

  const handleSaveComment = async () => {
    if (!comment.trim()) return;

    setLoading(true);
    try {
      await axios.patch(
        `${url_api}/movies/addComment/${currentMovieId}`,
        { comment },
        {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        }
      );
      notyf.success("Comment added successfully!");
      handleCloseCommentModal();
    } catch (err) {
      console.error('Error adding comment:', err);
      notyf.error('Could not add comment. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="movies-container mt-5">
      <h2 className="text-center mb-4">Featured Movies</h2>
      {error && <p className="text-danger text-center">{error}</p>}
      <Row>
        {movies.map((movie) => (
          <Col key={movie._id} md={4} className="mb-4">
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title className="text-primary">{movie.title}</Card.Title>
                <Card.Text>{movie.description}</Card.Text>
              </Card.Body>
              <Card.Footer className="text-center">
                <Button variant="primary" className="me-2" onClick={() => handleViewDetails(movie._id)}>
                  View Details
                </Button>
                {/* Conditionally render the Add Comment button */}
                {user && !user.isAdmin && (
                  <Button variant="warning" onClick={() => handleAddComment(movie._id)}>
                    Add Comment
                  </Button>
                )}
              </Card.Footer>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Details Modal */}
      <Modal show={showDetailsModal} onHide={handleCloseDetailsModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{selectedMovie?.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <p>Loading details...</p>
          ) : (
            <>
              <p><strong>Director:</strong> {selectedMovie?.director}</p>
              <p><strong>Year:</strong> {selectedMovie?.year}</p>
              <p><strong>Description:</strong> {selectedMovie?.description}</p>
              <p><strong>Genre:</strong> {selectedMovie?.genre}</p>
              <p><strong>Comments:</strong></p>
              <ul>
                {selectedMovie?.comments?.length > 0 ? (
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
          <Button variant="secondary" onClick={handleCloseDetailsModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Comment Modal */}
      <Modal show={showCommentModal} onHide={handleCloseCommentModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Comment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="comment">
            <Form.Label>Comment</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter your comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCommentModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSaveComment} disabled={loading}>
            {loading ? "Saving..." : "Save Comment"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
