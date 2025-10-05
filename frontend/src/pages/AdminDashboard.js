import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Row, 
  Col,
  Modal,
  Form,
  Button,
  Table,
  Card,
  Badge,
  Dropdown,
  Spinner,
  Alert,
  InputGroup,
  FormControl,
  ButtonGroup
} from 'react-bootstrap';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaEllipsisV, 
  FaSearch, 
  FaFilter, 
  FaSort,
  FaListUl,
  FaChartBar,
  FaUserTie,
  FaClock
} from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import AdminLayout from '../components/layout/AdminLayout';
import { quizAPI } from '../services/api';

const AdminDashboard = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showQuestionModal, setShowQuestionModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    difficulty: '',
    sortBy: 'newest'
  });
  const [categories, setCategories] = useState([]);
  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: '',
    difficulty: 'easy',
    timeLimit: 30,
    questions: []
  });
  const [currentQuestion, setCurrentQuestion] = useState({
    question: '',
    options: ['', '', '', ''],
    correctAnswer: 0,
    explanation: '',
    points: 1
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalQuestions: 0,
    totalAttempts: 0
  });

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/quizzes', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setQuizzes(response.data.quizzes || []);
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      setError('Failed to load quizzes. Please try again.');
      if (error.response?.status === 401) {
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredQuizzes = quizzes.filter(quiz => {
    const matchesSearch = 
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.category.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesCategory = !filters.category || 
      quiz.category.toLowerCase() === filters.category.toLowerCase();
      
    const matchesDifficulty = !filters.difficulty || 
      quiz.difficulty === filters.difficulty;
      
    return matchesSearch && matchesCategory && matchesDifficulty;
  });
  
  // Sort quizzes
  const sortedQuizzes = [...filteredQuizzes].sort((a, b) => {
    if (filters.sortBy === 'newest') {
      return new Date(b.createdAt) - new Date(a.createdAt);
    } else if (filters.sortBy === 'oldest') {
      return new Date(a.createdAt) - new Date(b.createdAt);
    } else if (filters.sortBy === 'title') {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  const getDifficultyBadge = (difficulty) => {
    const variants = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger'
    };
    return <Badge bg={variants[difficulty] || 'secondary'}>{difficulty}</Badge>;
  };

  const handleQuizSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/quizzes', newQuiz, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowQuizModal(false);
      setNewQuiz({
        title: '',
        description: '',
        category: '',
        difficulty: 'easy',
        timeLimit: 30,
        questions: []
      });
      await fetchQuizzes();
    } catch (error) {
      console.error('Error creating quiz:', error);
      setError(error.response?.data?.message || 'Failed to create quiz');
    } finally {
      setIsSubmitting(false);
    }
  };

  const addQuestion = () => {
    setNewQuiz({
      ...newQuiz,
      questions: [...newQuiz.questions, { ...currentQuestion }]
    });
    setCurrentQuestion({
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: '',
      points: 1
    });
    setShowQuestionModal(false);
  };

  const deleteQuiz = async (id) => {
    if (window.confirm('Are you sure you want to delete this quiz? This action cannot be undone.')) {
      setIsDeleting(true);
      try {
        await quizAPI.delete(`/quizzes/${id}`);
        await fetchQuizzes();
        toast.success('Quiz deleted successfully');
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast.error(error.response?.data?.message || 'Failed to delete quiz');
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const duplicateQuiz = async (quizId) => {
    try {
      setLoading(true);
      const response = await quizAPI.post(`/quizzes/${quizId}/duplicate`);
      await fetchQuizzes();
      toast.success('Quiz duplicated successfully');
      navigate(`/admin/quizzes/${response.data._id}/edit`);
    } catch (error) {
      console.error('Error duplicating quiz:', error);
      toast.error('Failed to duplicate quiz');
    } finally {
      setLoading(false);
    }
  };

  // Get unique categories for filter
  const uniqueCategories = [...new Set(quizzes.map(q => q.category))];
  
  return (
    <AdminLayout>
      <Container fluid className="p-4">
        <Row className="mb-4 align-items-center">
          <Col md={8}>
            <div className="d-flex align-items-center mb-3">
              <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                <FaChartBar className="text-primary" size={24} />
              </div>
              <div>
                <h2 className="mb-0">Quiz Management</h2>
                <p className="text-muted mb-0">Create and manage your quizzes</p>
              </div>
            </div>
          </Col>
          <Col md={4} className="text-end">
            <Button 
              as={Link}
              to="/admin/quizzes/new"
              variant="primary" 
              className="me-2"
            >
              <FaPlus className="me-1" /> Create New Quiz
            </Button>
          </Col>
        </Row>

        {error && <Alert variant="danger">{error}</Alert>}

        {/* Stats Cards */}
        <Row className="mb-4 g-4">
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-primary bg-opacity-10 p-3 rounded-3 me-3">
                    <FaListUl className="text-primary" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Quizzes</h6>
                    <h3 className="mb-0">{stats.totalQuizzes}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-success bg-opacity-10 p-3 rounded-3 me-3">
                    <FaUserTie className="text-success" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Active Quizzes</h6>
                    <h3 className="mb-0">{stats.activeQuizzes}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-warning bg-opacity-10 p-3 rounded-3 me-3">
                    <FaListUl className="text-warning" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Questions</h6>
                    <h3 className="mb-0">{stats.totalQuestions}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="border-0 shadow-sm h-100">
              <Card.Body>
                <div className="d-flex align-items-center">
                  <div className="bg-info bg-opacity-10 p-3 rounded-3 me-3">
                    <FaChartBar className="text-info" />
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Attempts</h6>
                    <h3 className="mb-0">{stats.totalAttempts}</h3>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Card className="mb-4 border-0 shadow-sm">
          <Card.Body>
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4">
              <div className="mb-3 mb-md-0">
                <h5 className="card-title mb-0 d-flex align-items-center">
                  <FaListUl className="me-2 text-primary" />
                  My Quizzes
                </h5>
                <p className="text-muted mb-0 small">Manage and organize your quizzes</p>
              </div>
              <div className="d-flex flex-column flex-md-row gap-2 w-100 w-md-auto">
                <div className="flex-grow-1" style={{ maxWidth: '300px' }}>
                  <InputGroup className="mb-2 mb-md-0">
                    <FormControl
                      placeholder="Search quizzes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="border-end-0"
                    />
                    <Button variant="outline-secondary" className="border-start-0">
                      <FaSearch />
                    </Button>
                  </InputGroup>
                </div>
                
                <Dropdown className="me-2">
                  <Dropdown.Toggle variant="outline-secondary" id="category-filter">
                    <FaFilter className="me-1" />
                    {filters.category || 'All Categories'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    <Dropdown.Item 
                      active={!filters.category}
                      onClick={() => setFilters({...filters, category: ''})}
                    >
                      All Categories
                    </Dropdown.Item>
                    {uniqueCategories.map(category => (
                      <Dropdown.Item 
                        key={category}
                        active={filters.category === category}
                        onClick={() => setFilters({...filters, category})}
                      >
                        {category}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
                
                <Dropdown>
                  <Dropdown.Toggle variant="outline-secondary" id="sort-dropdown">
                    <FaSort className="me-1" />
                    {filters.sortBy === 'newest' ? 'Newest' : 
                     filters.sortBy === 'oldest' ? 'Oldest' : 'Title'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item 
                      active={filters.sortBy === 'newest'}
                      onClick={() => setFilters({...filters, sortBy: 'newest'})}
                    >
                      Newest
                    </Dropdown.Item>
                    <Dropdown.Item 
                      active={filters.sortBy === 'oldest'}
                      onClick={() => setFilters({...filters, sortBy: 'oldest'})}
                    >
                      Oldest
                    </Dropdown.Item>
                    <Dropdown.Item 
                      active={filters.sortBy === 'title'}
                      onClick={() => setFilters({...filters, sortBy: 'title'})}
                    >
                      Title
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </div>
            
            {loading ? (
              <div className="text-center my-5 py-5">
                <Spinner animation="border" role="status" className="text-primary">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
                <p className="mt-3 text-muted">Loading your quizzes...</p>
              </div>
            ) : sortedQuizzes.length === 0 ? (
              <div className="text-center py-5 my-4 bg-light rounded-3">
                <div className="mb-3">
                  <FaListUl size={48} className="text-muted mb-3" />
                  <h4>No quizzes found</h4>
                  <p className="text-muted mb-4">
                    {searchTerm || filters.category || filters.difficulty 
                      ? 'Try adjusting your search or filters' 
                      : 'Create your first quiz to get started!'}
                  </p>
                  <Button 
                    as={Link}
                    to="/admin/quizzes/new"
                    variant="primary"
                    className="px-4"
                  >
                    <FaPlus className="me-2" /> Create New Quiz
                  </Button>
                </div>
              </div>
            ) : (
              <Row>
                <Col>
                  <Card>
                    <Card.Header>Quizzes</Card.Header>
                    <Card.Body>
                      <div className="table-responsive">
                        <Table hover className="align-middle">
                          <thead className="bg-light">
                              <tr>
                                <th className="ps-4">Title</th>
                                <th>Category</th>
                                <th>Difficulty</th>
                                <th>Questions</th>
                                <th>Status</th>
                                <th>Last Updated</th>
                                <th className="text-end pe-4">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="border-top-0">
                              {sortedQuizzes.map((quiz) => (
                                <tr key={quiz._id}>
                                  <td className="ps-4">
                                    <div className="d-flex align-items-center">
                                      <div className="flex-shrink-0 me-3">
                                        <div className="bg-light rounded p-2">
                                          <FaListUl className="text-primary" />
                                        </div>
                                      </div>
                                      <div>
                                        <div className="fw-semibold text-truncate" style={{maxWidth: '200px'}}>
                                          {quiz.title}
                                        </div>
                                        <div className="text-muted small">
                                          ID: {quiz._id.substring(0, 8)}...
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <Badge bg="light" text="dark" className="text-uppercase border">
                                      {quiz.category || 'Uncategorized'}
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="d-flex align-items-center">
                                      <div className="me-2">
                                        {getDifficultyBadge(quiz.difficulty)}
                                      </div>
                                    </div>
                                  </td>
                                  <td>
                                    <Badge bg={quiz.questions?.length > 0 ? 'success' : 'warning'} className="rounded-pill">
                                      {quiz.questions?.length || 0} {quiz.questions?.length === 1 ? 'Question' : 'Questions'}
                                    </Badge>
                                  </td>
                                  <td>
                                    <Badge bg={quiz.isActive ? 'success' : 'secondary'} className="rounded-pill">
                                      {quiz.isActive ? 'Active' : 'Draft'}
                                    </Badge>
                                  </td>
                                  <td>
                                    <div className="text-muted small">
                                      {new Date(quiz.updatedAt).toLocaleDateString()}
                                    </div>
                                  </td>
                                  <td className="text-end pe-4">
                                    <Dropdown align="end">
                                      <Dropdown.Toggle 
                                        variant="light" 
                                        size="sm" 
                                        className="rounded-circle p-1"
                                        style={{width: '32px', height: '32px'}}
                                      >
                                        <FaEllipsisV />
                                      </Dropdown.Toggle>
                                      <Dropdown.Menu>
                                        <Dropdown.Item 
                                          as={Link}
                                          to={`/admin/quizzes/${quiz._id}/edit`}
                                        >
                                          <FaEdit className="me-2 text-primary" /> Edit Quiz
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                          onClick={() => duplicateQuiz(quiz._id)}
                                          disabled={isDeleting}
                                        >
                                          <FaPlus className="me-2 text-info" /> Duplicate
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item 
                                          className="text-danger"
                                          onClick={() => deleteQuiz(quiz._id)}
                                          disabled={isDeleting}
                                        >
                                          <FaTrash className="me-2" /> Delete
                                        </Dropdown.Item>
                                      </Dropdown.Menu>
                                    </Dropdown>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}
            </Card.Body>
          </Card>

          {/* Create Quiz Modal */}
          <Modal 
            show={showQuizModal} 
            onHide={() => setShowQuizModal(false)}
            backdrop="static"
            centered
          >
            <Modal.Header closeButton closeVariant={isSubmitting ? 'white' : undefined}>
              <Modal.Title>
                <FaPlus className="me-2" />
                Create New Quiz
              </Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleQuizSubmit}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Label>Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({ ...newQuiz, title: e.target.value })}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Description</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={newQuiz.description}
                    onChange={(e) => setNewQuiz({ ...newQuiz, description: e.target.value })}
                  />
                </Form.Group>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Category</Form.Label>
                      <Form.Control
                        type="text"
                        value={newQuiz.category}
                        onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                        required
                      />
                    </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    value={newQuiz.difficulty}
                    onChange={(e) => setNewQuiz({ ...newQuiz, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Limit (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    value={newQuiz.timeLimit}
                    onChange={(e) => setNewQuiz({ ...newQuiz, timeLimit: parseInt(e.target.value) })}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <h5>Questions</h5>
                <Button variant="outline-primary" size="sm" onClick={() => setShowQuestionModal(true)}>
                  Add Question
                </Button>
              </div>
              {newQuiz.questions.length > 0 ? (
                <ul className="list-group">
                  {newQuiz.questions.map((q, index) => (
                    <li key={index} className="list-group-item">
                      <strong>Q{index + 1}:</strong> {q.question}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted">No questions added yet</p>
              )}
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button 
              variant="outline-secondary" 
              onClick={() => setShowQuizModal(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleQuizSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner as="span" size="sm" animation="border" role="status" />
                  <span className="ms-2">Creating...</span>
                </>
              ) : 'Create Quiz'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Add Question Modal */}
      <Modal show={showQuestionModal} onHide={() => setShowQuestionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Question</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={currentQuestion.question}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
              required
            />
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Options</Form.Label>
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Check
                  type="radio"
                  name="correctAnswer"
                  checked={currentQuestion.correctAnswer === index}
                  onChange={() => setCurrentQuestion({ ...currentQuestion, correctAnswer: index })}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...currentQuestion.options];
                    newOptions[index] = e.target.value;
                    setCurrentQuestion({ ...currentQuestion, options: newOptions });
                  }}
                  required
                />
              </div>
            ))}
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Explanation (Optional)</Form.Label>
            <Form.Control
              as="textarea"
              rows={2}
              value={currentQuestion.explanation}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, explanation: e.target.value })}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              min="1"
              value={currentQuestion.points}
              onChange={(e) => setCurrentQuestion({ ...currentQuestion, points: parseInt(e.target.value) || 1 })}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuestionModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={addQuestion}
            disabled={!currentQuestion.question || currentQuestion.options.some(opt => !opt.trim())}
          >
            Add Question
          </Button>
        </Modal.Footer>
      </Modal>
      </Container>
    </AdminLayout>
  );
};

export default AdminDashboard;
