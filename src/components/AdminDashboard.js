import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useUser } from '../contexts/UserContext';
import { Container, Button, Table, Alert, Modal, Form } from 'react-bootstrap';
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';
import '../styles/Admin.css'

const url_api = "https://movieapp-api-lms1.onrender.com";
const notyf = new Notyf();

function AdminDashboard() {
  const { user } = useUser();
  const [title, setTitle] = useState('');
  const [director, setDirector] = useState('');
  const [year, setYear] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [movieId, setMovieId] = useState('');
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);

  const fetchMovies = useCallback(async () => {
    try {
      const response = await axios.get(`${url_api}/movies/getMovies`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setMovies(response.data.movies || []);
    } catch (error) {
      console.error("Error fetching movies:", error);
      setError("Failed to load movies. Please try again.");
    }
  }, [user.token]); // fetchMovies now has a stable reference

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]); // Include fetchMovies as a dependency

  const handleShowAddModal = () => setShowAddModal(true);
  const handleCloseAddModal = () => setShowAddModal(false);

  const handleShowUpdateModal = (movie) => {
    setMovieId(movie._id);
    setTitle(movie.title);
    setDirector(movie.director);
    setYear(movie.year);
    setDescription(movie.description);
    setGenre(movie.genre);
    setShowUpdateModal(true);
  };
  const handleCloseUpdateModal = () => setShowUpdateModal(false);

  const handleAddMovie = async () => {
    try {
      await axios.post(
        `${url_api}/movies/addMovie`,
        { title, director, year, description, genre },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setShowAddModal(false);
      notyf.success('Movie added successfully');
      fetchMovies();
    } catch (error) {
      console.error('Error adding movie:', error);
      setError('Failed to add movie');
      notyf.error('Failed to add movie');
    }
  };

  const handleUpdateMovie = async () => {
    try {
      await axios.patch(
        `${url_api}/movies/updateMovie/${movieId}`,
        { title, director, year, description, genre },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setShowUpdateModal(false);
      notyf.success('Movie updated successfully');
      fetchMovies();
    } catch (error) {
      console.error('Error updating movie:', error);
      setError('Failed to update movie');
      notyf.error('Failed to update movie');
    }
  };

  const handleDeleteMovie = async (id) => {
    try {
      await axios.delete(`${url_api}/movies/deleteMovie/${id}`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      notyf.success('Movie deleted successfully');
      fetchMovies();
    } catch (error) {
      console.error('Error deleting movie:', error);
      setError('Failed to delete movie');
      notyf.error('Failed to delete movie');
    }
  };

  return (
    <Container className="admin-container mt-5">
      <h1 className="text-center mb-4 display-4">Admin Dashboard</h1>
      {error && <Alert variant="danger">{error}</Alert>}
      <div className="d-flex justify-content-end mb-3">
        <Button variant="primary" onClick={handleShowAddModal}>
          Add Movie
        </Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Director</th>
            <th>Year</th>
            <th>Description</th>
            <th>Genre</th>
            <th className="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {movies.map((movie) => (
            <tr key={movie._id}>
              <td>{movie.title}</td>
              <td>{movie.director}</td>
              <td>{movie.year}</td>
              <td>{movie.description}</td>
              <td>{movie.genre}</td>
              <td className="text-center">
                <Button variant="warning" className="m-1" onClick={() => handleShowUpdateModal(movie)}>
                  Update
                </Button>
                <Button variant="danger" className="m-1" onClick={() => handleDeleteMovie(movie._id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Add Movie Modal */}
      <Modal show={showAddModal} onHide={handleCloseAddModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter movie title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter director's name"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter release year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter movie description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseAddModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddMovie}>
            Add Movie
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Update Movie Modal */}
      <Modal show={showUpdateModal} onHide={handleCloseUpdateModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Update Movie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter movie title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Director</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter director's name"
                value={director}
                onChange={(e) => setDirector(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Control
                type="number"
                placeholder="Enter release year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter movie description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Genre</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseUpdateModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleUpdateMovie}>
            Update Movie
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default AdminDashboard;
