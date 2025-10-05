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
import { toast } from 'react-hot-toast';
import { adminAPI, aiAPI, quizAPI } from '../../services/api';

const CATEGORY_OPTIONS = ['Programming', 'Frontend', 'Backend', 'Database', 'DevOps', 'General'];

const WorkingAdmin = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingQuizId, setEditingQuizId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    activeQuizzes: 0,
    totalQuestions: 0,
    totalAttempts: 0
  });

  const [newQuiz, setNewQuiz] = useState({
    title: '',
    description: '',
    category: CATEGORY_OPTIONS[0],
    difficulty: 'easy',
    timeLimit: 30,
    questions: []
  });

  const [showAIModal, setShowAIModal] = useState(false);
  const [aiForm, setAiForm] = useState({ topic: '', difficulty: 'medium', numQuestions: 10, category: CATEGORY_OPTIONS[0], timeMinutes: 10 });
  const [aiLoading, setAiLoading] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const fetchQuizzes = async () => {
    setLoading(true);
    try {
      let list = [];
      try {
        const { data } = await adminAPI.getAdminQuizzes();
        list = data.quizzes || [];
      } catch (err) {
        // Fallback to public quizzes list when admin fetch fails
        const { data } = await quizAPI.getQuizzes();
        list = data.quizzes || [];
      }
      setQuizzes(list.map(q => ({
        _id: q._id,
        title: q.title,
        description: q.description,
        category: q.category,
        difficulty: q.difficulty,
        questions: q.totalQuestions || (q.questions ? q.questions.length : 0),
        attempts: q.attempts || 0,
        isActive: q.isActive !== false,
        createdAt: q.createdAt
      })));

      setStats(prev => ({
        ...prev,
        totalQuizzes: list.length,
        activeQuizzes: list.filter(q => q.isActive !== false).length,
        totalQuestions: list.reduce((sum, q) => sum + (q.totalQuestions || (q.questions ? q.questions.length : 0)), 0),
        totalAttempts: 0
      }));
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      toast.error('Failed to load quizzes');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateQuiz = async () => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: newQuiz.title.trim(),
        description: newQuiz.description?.trim() || '',
        category: newQuiz.category,
        difficulty: newQuiz.difficulty,
        timeLimit: Math.max(30, Math.min(1800, Number(newQuiz.timeLimit) * 60)),
        questions: newQuiz.questions.map(q => ({
          type: q.type || 'multiple-choice',
          question: q.question,
          options: q.options,
          correctAnswer: Number(q.correctAnswer) || 0,
          explanation: q.explanation || '',
          points: q.points || 1,
          imageUrl: q.imageUrl || ''
        }))
      };

      if (!payload.title || !payload.category || payload.questions.length < 1) {
        toast.error('Please fill title, category and add at least 1 question');
        setIsSubmitting(false);
        return;
      }

      if (editingQuizId) {
        const { data } = await adminAPI.updateQuiz(editingQuizId, payload);
        const updated = data.quiz || { ...payload, _id: editingQuizId };
        setQuizzes(prev => prev.map(q => q._id === editingQuizId ? {
          ...q,
          title: updated.title,
          description: updated.description,
          category: updated.category,
          difficulty: updated.difficulty,
          questions: updated.totalQuestions || updated.questions?.length || q.questions,
        } : q));
        toast.success('Quiz updated successfully!');
      } else {
        const { data } = await adminAPI.createQuiz(payload);
        const created = data.quiz || payload;
        setQuizzes(prev => [{
          _id: created._id || Date.now(),
          title: created.title,
          description: created.description,
          category: created.category,
          difficulty: created.difficulty,
          questions: created.totalQuestions || created.questions?.length || 0,
          attempts: 0,
          isActive: true,
          createdAt: new Date().toISOString()
        }, ...prev]);
        setStats(prev => ({ ...prev, totalQuizzes: prev.totalQuizzes + 1 }));
        toast.success('Quiz created successfully!');
      }

      setShowQuizModal(false);
      setEditingQuizId(null);
      setNewQuiz({ title: '', description: '', category: CATEGORY_OPTIONS[0], difficulty: 'easy', timeLimit: 30, questions: [] });
    } catch (error) {
      console.error('Error creating quiz:', error);
      const msg = error.response?.data?.message || 'Failed to create quiz';
      toast.error(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditQuiz = async (id) => {
    try {
      setIsSubmitting(true);
      let quiz;
      try {
        const { data } = await adminAPI.getAdminQuiz(id);
        quiz = data.quiz;
      } catch (err) {
        // Fallback to public endpoint for read-only load if admin fetch fails for any reason
        const { data } = await quizAPI.getQuiz(id);
        quiz = data.quiz || data; // support either shape
      }

      setEditingQuizId(id);
      setNewQuiz({
        title: quiz.title || '',
        description: quiz.description || '',
        category: quiz.category || CATEGORY_OPTIONS[0],
        difficulty: quiz.difficulty || 'medium',
        timeLimit: Math.max(1, Math.round((quiz.timeLimit || 600) / 60)),
        questions: (quiz.questions || []).map(q => ({
          type: q.type || 'multiple-choice',
          question: q.question,
          options: q.options || [],
          correctAnswer: q.correctAnswer ?? 0,
          explanation: q.explanation || '',
          points: q.points || 1,
          imageUrl: q.imageUrl || ''
        }))
      });
      setShowQuizModal(true);
    } catch (error) {
      // Final fallback: prefill from local table data so editing isn't blocked
      const local = quizzes.find(q => q._id === id);
      if (local) {
        setEditingQuizId(id);
        setNewQuiz({
          title: local.title || '',
          description: local.description || '',
          category: local.category || CATEGORY_OPTIONS[0],
          difficulty: local.difficulty || 'medium',
          timeLimit: 10,
          questions: []
        });
        setShowQuizModal(true);
        toast.error('Loaded basic details. Questions unavailable due to server error.');
      } else {
        console.error('Error loading quiz:', error);
        const msg = error.response?.data?.message || 'Failed to load quiz for editing';
        toast.error(msg);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGenerateAIQuiz = async () => {
    if (!aiForm.topic.trim()) {
      toast.error('Please enter a topic');
      return;
    }
    setAiLoading(true);
    try {
      let data;
      try {
        const res = await adminAPI.generateAIQuiz({
          topic: aiForm.topic.trim(),
          difficulty: aiForm.difficulty,
          numQuestions: aiForm.numQuestions
        });
        data = res.data;
      } catch (err) {
        // Fallback to public endpoint on 401/403/404
        const res = await aiAPI.generate({
        topic: aiForm.topic.trim(),
        difficulty: aiForm.difficulty,
        numQuestions: aiForm.numQuestions
        });
        data = res.data;
      }
      const quiz = data.quiz;
      setNewQuiz({
        title: quiz.title,
        description: quiz.description,
        category: quiz.category || aiForm.topic || newQuiz.category,
        difficulty: quiz.difficulty || aiForm.difficulty,
        timeLimit: aiForm.timeMinutes,
        questions: quiz.questions
      });
      setShowAIModal(false);
      setShowQuizModal(true);
      toast.success('AI generated quiz draft ready! Review and save.');
    } catch (error) {
      console.error('AI generate error:', error);
      const msg = error.response?.data?.message || 'Failed to generate quiz';
      toast.error(msg);
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    if (window.confirm('Are you sure you want to delete this quiz?')) {
      try {
        setQuizzes(prev => prev.filter(quiz => quiz._id !== quizId));
        setStats(prev => ({
          ...prev,
          totalQuizzes: prev.totalQuizzes - 1
        }));
        toast.success('Quiz deleted successfully!');
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast.error('Failed to delete quiz');
      }
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const variants = {
      easy: 'success',
      medium: 'warning',
      hard: 'danger'
    };
    return variants[difficulty] || 'secondary';
  };

  return (
    <div className="min-h-screen bg-light">
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ background: 'linear-gradient(90deg, #0ea5e9 0%, #2563eb 60%, #7c3aed 100%)' }}>
        <div className="container-fluid">
          <Link className="navbar-brand" to="/admin">
            <FaChartBar className="me-2" />
            Admin Panel
          </Link>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">Welcome, Admin</span>
            <Button 
              variant="outline-light" 
              size="sm"
              onClick={() => window.location.href = '/login'}
            >
              Logout
            </Button>
          </div>
        </div>
      </nav>

      <Container fluid className="py-4">
        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center shadow-sm border-0">
              <Card.Body>
                <FaListUl className="text-primary mb-2" style={{ fontSize: '2rem' }} />
                <Card.Title>{stats.totalQuizzes}</Card.Title>
                <Card.Text className="text-muted">Total Quizzes</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm border-0">
              <Card.Body>
                <FaChartBar className="text-success mb-2" style={{ fontSize: '2rem' }} />
                <Card.Title>{stats.activeQuizzes}</Card.Title>
                <Card.Text className="text-muted">Active Quizzes</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm border-0">
              <Card.Body>
                <FaUserTie className="text-info mb-2" style={{ fontSize: '2rem' }} />
                <Card.Title>{stats.totalQuestions}</Card.Title>
                <Card.Text className="text-muted">Total Questions</Card.Text>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center shadow-sm border-0">
              <Card.Body>
                <FaClock className="text-warning mb-2" style={{ fontSize: '2rem' }} />
                <Card.Title>{stats.totalAttempts}</Card.Title>
                <Card.Text className="text-muted">Total Attempts</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Main Content */}
        <Row>
          <Col>
            <Card className="shadow-sm border-0">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Quiz Management</h5>
                <div className="d-flex gap-2">
                  <Button 
                    variant="outline-secondary"
                    onClick={() => setShowAIModal(true)}
                  >
                    ✨ AI Generate
                  </Button>
                  <Button 
                    variant="primary" 
                    onClick={() => setShowQuizModal(true)}
                  >
                    <FaPlus className="me-2" />
                    Create Quiz
                  </Button>
                </div>
              </Card.Header>
              <Card.Body>
                {/* Search and Filters */}
                <Row className="mb-3">
                  <Col md={6}>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaSearch />
                      </InputGroup.Text>
                      <FormControl
                        placeholder="Search quizzes..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </InputGroup>
                  </Col>
                </Row>

                {/* Quizzes Table */}
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" />
                    <p className="mt-2">Loading quizzes...</p>
                  </div>
                ) : (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>Title</th>
                        <th>Category</th>
                        <th>Difficulty</th>
                        <th>Questions</th>
                        <th>Attempts</th>
                        <th>Status</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {quizzes
                        .filter(quiz => 
                          (quiz.title || '').toLowerCase().includes(searchTerm.toLowerCase())
                        )
                        .map(quiz => (
                          <tr key={quiz._id}>
                            <td>
                              <strong>{quiz.title}</strong>
                              {quiz.description && (
                                <div className="text-muted small">{quiz.description}</div>
                              )}
                            </td>
                            <td>{quiz.category}</td>
                            <td>
                              <Badge bg={getDifficultyBadge(quiz.difficulty)}>
                                {quiz.difficulty}
                              </Badge>
                            </td>
                            <td>{quiz.questions}</td>
                            <td>{quiz.attempts}</td>
                            <td>
                              <Badge bg={quiz.isActive ? 'success' : 'secondary'}>
                                {quiz.isActive ? 'Active' : 'Inactive'}
                              </Badge>
                            </td>
                            <td>
                              <ButtonGroup size="sm">
                                <Button variant="outline-primary" onClick={() => handleEditQuiz(quiz._id)}>
                                  <FaEdit />
                                </Button>
                                <Button 
                                  variant="outline-danger"
                                  onClick={() => handleDeleteQuiz(quiz._id)}
                                >
                                  <FaTrash />
                                </Button>
                              </ButtonGroup>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Create Quiz Modal */}
      <Modal show={showQuizModal} onHide={() => setShowQuizModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Create New Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Quiz Preview Summary */}
          <div className="mb-3">
            <div className="d-flex flex-wrap align-items-center gap-2">
              <h5 className="mb-0 me-2">{newQuiz.title || 'Untitled Quiz'}</h5>
              <Badge bg="info" className="text-dark">{newQuiz.category || 'Category'}</Badge>
              <Badge bg={getDifficultyBadge(newQuiz.difficulty)}>{newQuiz.difficulty}</Badge>
              <Badge bg="secondary">{(newQuiz.timeLimit || 0)} min</Badge>
              <Badge bg="dark">{newQuiz.questions?.length || 0} questions</Badge>
            </div>
            {newQuiz.description && (
              <div className="text-muted small mt-1">{newQuiz.description}</div>
            )}
          </div>
          <Form>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Quiz Title</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuiz.title}
                    onChange={(e) => setNewQuiz({...newQuiz, title: e.target.value})}
                    placeholder="Enter quiz title"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Control
                    type="text"
                    value={newQuiz.category}
                    onChange={(e) => setNewQuiz({...newQuiz, category: e.target.value})}
                    placeholder="Enter category"
                  />
                </Form.Group>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newQuiz.description}
                onChange={(e) => setNewQuiz({...newQuiz, description: e.target.value})}
                placeholder="Enter quiz description"
              />
            </Form.Group>
            
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    value={newQuiz.difficulty}
                    onChange={(e) => setNewQuiz({...newQuiz, difficulty: e.target.value})}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Time Limit (minutes)</Form.Label>
                  <Form.Control
                    type="number"
                    value={newQuiz.timeLimit}
                    onChange={(e) => setNewQuiz({...newQuiz, timeLimit: parseInt(e.target.value)})}
                    min="1"
                    max="180"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Category</Form.Label>
                  <Form.Select
                    value={newQuiz.category}
                    onChange={(e) => setNewQuiz({ ...newQuiz, category: e.target.value })}
                  >
                    {CATEGORY_OPTIONS.map(opt => (
                      <option key={opt} value={opt}>{opt}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Total Questions</Form.Label>
                  <Form.Control
                    type="number"
                    value={newQuiz.questions?.length || 0}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            {/* Question Editor */}
            <div className="border rounded p-3">
              <div className="d-flex justify-content-between align-items-center mb-2">
                <strong>Questions</strong>
                <Button size="sm" variant="outline-primary" onClick={() => {
                  setNewQuiz({
                    ...newQuiz,
                    questions: [...newQuiz.questions, {
                      type: 'multiple-choice',
                      question: '',
                      options: ['', '', '', ''],
                      correctAnswer: 0,
                      explanation: '',
                      points: 1
                    }]
                  })
                }}>+ Add Question</Button>
              </div>

              {(newQuiz.questions || []).map((q, idx) => (
                <div key={idx} className="mb-3 p-2 border rounded">
                  <Form.Group className="mb-2">
                    <Form.Label>Question {idx + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      value={q.question}
                      onChange={(e) => {
                        const qs = [...newQuiz.questions];
                        qs[idx] = { ...qs[idx], question: e.target.value };
                        setNewQuiz({ ...newQuiz, questions: qs });
                      }}
                    />
                  </Form.Group>
                  <Row>
                    <Col md={8}>
                      {(q.options || []).map((opt, optIdx) => (
                        <Form.Group key={optIdx} className="mb-2">
                          <Form.Label>Option {optIdx + 1}</Form.Label>
                          <Form.Control
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const qs = [...newQuiz.questions];
                              const ops = [...qs[idx].options];
                              ops[optIdx] = e.target.value;
                              qs[idx] = { ...qs[idx], options: ops };
                              setNewQuiz({ ...newQuiz, questions: qs });
                            }}
                          />
                        </Form.Group>
                      ))}
                      <Form.Group className="mb-2">
                        <Form.Label>Image URL (optional)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="https://example.com/image.jpg"
                          value={q.imageUrl || ''}
                          onChange={(e) => {
                            const qs = [...newQuiz.questions];
                            qs[idx] = { ...qs[idx], imageUrl: e.target.value };
                            setNewQuiz({ ...newQuiz, questions: qs });
                          }}
                        />
                        {q.imageUrl ? (
                          <div className="mt-2">
                            <img src={q.imageUrl} alt={`Question ${idx + 1}`} style={{ maxHeight: 120 }} />
                          </div>
                        ) : null}
                      </Form.Group>
                    </Col>
                    <Col md={4}>
                      <Form.Group className="mb-2">
                        <Form.Label>Correct Answer (index)</Form.Label>
                        <Form.Control
                          type="number"
                          min={0}
                          max={(q.options || []).length - 1}
                          value={q.correctAnswer}
                          onChange={(e) => {
                            const qs = [...newQuiz.questions];
                            qs[idx] = { ...qs[idx], correctAnswer: parseInt(e.target.value || '0', 10) };
                            setNewQuiz({ ...newQuiz, questions: qs });
                          }}
                        />
                      </Form.Group>
                      <Form.Group className="mb-2">
                        <Form.Label>Points</Form.Label>
                        <Form.Control
                          type="number"
                          min={1}
                          value={q.points || 1}
                          onChange={(e) => {
                            const qs = [...newQuiz.questions];
                            qs[idx] = { ...qs[idx], points: parseInt(e.target.value || '1', 10) };
                            setNewQuiz({ ...newQuiz, questions: qs });
                          }}
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Form.Group>
                    <Form.Label>Explanation</Form.Label>
                    <Form.Control
                      type="text"
                      value={q.explanation || ''}
                      onChange={(e) => {
                        const qs = [...newQuiz.questions];
                        qs[idx] = { ...qs[idx], explanation: e.target.value };
                        setNewQuiz({ ...newQuiz, questions: qs });
                      }}
                    />
                  </Form.Group>
                  <div className="text-end mt-2">
                    <Button size="sm" variant="outline-danger" onClick={() => {
                      const qs = [...newQuiz.questions];
                      qs.splice(idx, 1);
                      setNewQuiz({ ...newQuiz, questions: qs });
                    }}>Remove</Button>
                  </div>
                </div>
              ))}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowQuizModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateQuiz}
            disabled={isSubmitting || !newQuiz.title || !newQuiz.category}
          >
            {isSubmitting ? 'Creating...' : 'Create Quiz'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* AI Generate Modal */}
      <Modal show={showAIModal} onHide={() => setShowAIModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>✨ AI Generate Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Topic</Form.Label>
              <Form.Control
                type="text"
                placeholder="e.g., JavaScript Arrays"
                value={aiForm.topic}
                onChange={(e) => setAiForm({ ...aiForm, topic: e.target.value })}
              />
            </Form.Group>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Difficulty</Form.Label>
                  <Form.Select
                    value={aiForm.difficulty}
                    onChange={(e) => setAiForm({ ...aiForm, difficulty: e.target.value })}
                  >
                    <option value="easy">Easy</option>
                    <option value="medium">Medium</option>
                    <option value="hard">Hard</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Number of Questions</Form.Label>
                  <Form.Control
                    type="number"
                    min={3}
                    max={20}
                    value={aiForm.numQuestions}
                    onChange={(e) => setAiForm({ ...aiForm, numQuestions: parseInt(e.target.value || '0', 10) })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAIModal(false)} disabled={aiLoading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleGenerateAIQuiz} disabled={aiLoading}>
            {aiLoading ? 'Generating...' : 'Generate'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default WorkingAdmin;

