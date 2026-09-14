import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { Card, LoadingState, PageContainer } from '../components/ui'
import { courseService } from '../services/courseService'

const DEFAULT_CATEGORIES = ['AI & ML', 'Development', 'Data Science', 'Product Design', 'Cloud & DevOps', 'Business']
const DEFAULT_LEVELS = ['Beginner', 'Intermediate', 'Advanced', 'All levels', 'PhD']

export function CourseEditorPage() {
  const { courseId } = useParams()
  const isEditing = Boolean(courseId)
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState('basics')
  const [loading, setLoading] = useState(isEditing)
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [successMessage, setSuccessMessage] = useState('')

  // Tab 1: Basics
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('AI & ML')
  const [level, setLevel] = useState('Beginner')
  const [duration, setDuration] = useState('Self-paced')
  const [thumbnail, setThumbnail] = useState('AI')

  // Tab 2: Curriculum
  const [curriculum, setCurriculum] = useState([])
  const [newModuleTitle, setNewModuleTitle] = useState('')
  const [activeLessonModal, setActiveLessonModal] = useState(null) // { moduleId, lesson: { id, title, duration, content, videoUrl }, isNew: bool }

  // Tab 3: Quiz
  const [quizTitle, setQuizTitle] = useState('')
  const [quizDescription, setQuizDescription] = useState('')
  const [passingScore, setPassingScore] = useState(70)
  const [questions, setQuestions] = useState([])

  // Load course & quiz if editing
  useEffect(() => {
    if (!isEditing) return

    let isMounted = true
    const loadCourseData = async () => {
      try {
        setLoading(true)
        const [course, quiz] = await Promise.all([
          courseService.getCourseById(courseId),
          courseService.getCourseQuiz(courseId).catch(() => null),
        ])

        if (!isMounted) return

        if (course) {
          setTitle(course.title || '')
          setDescription(course.description || '')
          setCategory(course.category || 'AI & ML')
          setLevel(course.level || 'Beginner')
          setDuration(course.duration || 'Self-paced')
          setThumbnail(course.thumbnail || 'AI')
          setCurriculum(Array.isArray(course.curriculum) ? course.curriculum : [])
        }

        if (quiz) {
          setQuizTitle(quiz.title || '')
          setQuizDescription(quiz.description || '')
          setPassingScore(quiz.passingScore || 70)
          setQuestions(Array.isArray(quiz.questions) ? quiz.questions : [])
        } else if (course) {
          setQuizTitle(`${course.title} Assessment`)
        }
      } catch (err) {
        if (isMounted) setErrorMessage(err.message || 'Failed to load course details.')
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    loadCourseData()
    return () => { isMounted = false }
  }, [courseId, isEditing])

  // --- Curriculum Helper Methods ---
  const handleAddModule = (e) => {
    e.preventDefault()
    if (!newModuleTitle.trim()) return

    const newMod = {
      id: `mod-${Date.now()}`,
      title: newModuleTitle.trim(),
      duration: '',
      completion: 0,
      lessons: [],
    }

    setCurriculum((prev) => [...prev, newMod])
    setNewModuleTitle('')
  }

  const handleDeleteModule = (moduleId) => {
    setCurriculum((prev) => prev.filter((m) => m.id !== moduleId))
  }

  const handleUpdateModuleTitle = (moduleId, updatedTitle) => {
    setCurriculum((prev) => prev.map((m) => m.id === moduleId ? { ...m, title: updatedTitle } : m))
  }

  const handleOpenAddLesson = (moduleId) => {
    setActiveLessonModal({
      moduleId,
      isNew: true,
      lesson: {
        id: `les-${Date.now()}`,
        title: '',
        duration: '10 min',
        content: '',
        videoUrl: '',
      },
    })
  }

  const handleOpenEditLesson = (moduleId, lesson) => {
    setActiveLessonModal({
      moduleId,
      isNew: false,
      lesson: { ...lesson },
    })
  }

  const handleSaveLessonModal = (e) => {
    e.preventDefault()
    if (!activeLessonModal?.lesson.title.trim()) return

    const { moduleId, isNew, lesson } = activeLessonModal
    setCurriculum((prev) => prev.map((mod) => {
      if (mod.id !== moduleId) return mod
      if (isNew) {
        return { ...mod, lessons: [...(mod.lessons || []), lesson] }
      }
      return {
        ...mod,
        lessons: (mod.lessons || []).map((l) => l.id === lesson.id ? lesson : l),
      }
    }))
    setActiveLessonModal(null)
  }

  const handleDeleteLesson = (moduleId, lessonId) => {
    setCurriculum((prev) => prev.map((mod) => {
      if (mod.id !== moduleId) return mod
      return { ...mod, lessons: (mod.lessons || []).filter((l) => l.id !== lessonId) }
    }))
  }

  // --- Quiz Helper Methods ---
  const handleAddQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        explanation: '',
      },
    ])
  }

  const handleUpdateQuestion = (qIndex, field, value) => {
    setQuestions((prev) => prev.map((q, idx) => idx === qIndex ? { ...q, [field]: value } : q))
  }

  const handleUpdateOption = (qIndex, optIndex, value) => {
    setQuestions((prev) => prev.map((q, idx) => {
      if (idx !== qIndex) return q
      const newOpts = [...q.options]
      const oldVal = newOpts[optIndex]
      newOpts[optIndex] = value
      const updatedCorrect = q.correctAnswer === oldVal ? value : q.correctAnswer
      return { ...q, options: newOpts, correctAnswer: updatedCorrect }
    }))
  }

  const handleDeleteQuestion = (qIndex) => {
    setQuestions((prev) => prev.filter((_, idx) => idx !== qIndex))
  }

  // --- Main Save Handler ---
  const handleSaveCourse = async (e) => {
    e.preventDefault()
    setErrorMessage('')
    setSuccessMessage('')

    if (!title.trim() || !description.trim() || !category.trim() || !level.trim()) {
      setErrorMessage('Please fill in all required course basic details.')
      setActiveTab('basics')
      return
    }

    try {
      setSaving(true)
      const coursePayload = {
        title: title.trim(),
        description: description.trim(),
        category: category.trim(),
        level: level.trim(),
        duration: duration.trim() || 'Self-paced',
        thumbnail: thumbnail.trim() || 'AI',
        curriculum,
      }

      let savedCourse
      if (isEditing) {
        savedCourse = await courseService.updateCourse(courseId, coursePayload)
      } else {
        savedCourse = await courseService.createCourse(coursePayload)
      }

      const targetId = savedCourse.id || courseId
      // Save quiz if questions are configured
      if (questions.length > 0 || quizTitle.trim()) {
        await courseService.saveCourseQuiz(targetId, {
          title: quizTitle.trim() || `${title.trim()} Quiz`,
          description: quizDescription.trim(),
          passingScore: Number(passingScore) || 70,
          questions,
        })
      }

      setSuccessMessage(isEditing ? 'Course updated successfully.' : 'Course created successfully.')
      if (!isEditing && targetId) {
        setTimeout(() => navigate(`/instructor/courses/${targetId}/edit`), 800)
      }
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save course. Please check your inputs.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <PageContainer><LoadingState /></PageContainer>

  const totalLessons = curriculum.reduce((acc, m) => acc + (m.lessons?.length || 0), 0)

  return (
    <PageContainer className="instructor-editor-page">
      <div className="editor-topbar">
        <Link to="/instructor" className="back-link">
          ← Back to courses
        </Link>
        <div className="editor-title-group">
          <p className="eyebrow coral">COURSE AUTHORING</p>
          <h1>{isEditing ? `Edit: ${title || 'Course'}` : 'Create New Course'}</h1>
        </div>
        <div className="editor-actions">
          {isEditing && (
            <Link to={`/courses/${courseId}`} className="button button-secondary compact-btn" target="_blank">
              Preview ↗
            </Link>
          )}
          <button
            type="button"
            onClick={handleSaveCourse}
            className="button button-primary"
            disabled={saving}
          >
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Publish course'}
          </button>
        </div>
      </div>

      {successMessage && (
        <div className="settings-alert settings-alert-success">
          <span className="alert-icon">✓</span>
          <span>{successMessage}</span>
        </div>
      )}

      {errorMessage && (
        <div className="settings-alert settings-alert-error">
          <span className="alert-icon">!</span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="editor-tabs" role="tablist">
        <button
          type="button"
          className={`tab-btn ${activeTab === 'basics' ? 'active' : ''}`}
          onClick={() => setActiveTab('basics')}
        >
          1. Course Basics
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'curriculum' ? 'active' : ''}`}
          onClick={() => setActiveTab('curriculum')}
        >
          2. Curriculum ({curriculum.length} modules · {totalLessons} lessons)
        </button>
        <button
          type="button"
          className={`tab-btn ${activeTab === 'quiz' ? 'active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          3. Assessment ({questions.length} questions)
        </button>
      </div>

      {/* Tab 1: Course Basics */}
      {activeTab === 'basics' && (
        <Card className="editor-card">
          <div className="settings-card-header">
            <h2>Course Information</h2>
            <p>Define the high-level identity, topic category, and target skill level for this course.</p>
          </div>

          <div className="editor-form-grid">
            <div className="form-group span-full">
              <label htmlFor="course-title">Course Title *</label>
              <input
                id="course-title"
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Applied Machine Learning with Python"
                required
              />
            </div>

            <div className="form-group span-full">
              <label htmlFor="course-desc">Course Description *</label>
              <textarea
                id="course-desc"
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the skills learners will gain and practical projects they will build..."
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="course-category">Category *</label>
              <input
                id="course-category"
                type="text"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="e.g. AI & ML"
                required
              />
              <datalist id="category-suggestions">
                {DEFAULT_CATEGORIES.map((c) => <option key={c} value={c} />)}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="course-level">Skill Level *</label>
              <input
                id="course-level"
                type="text"
                list="level-suggestions"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                placeholder="e.g. Beginner, Advanced, or PhD"
                required
              />
              <datalist id="level-suggestions">
                {DEFAULT_LEVELS.map((l) => <option key={l} value={l} />)}
              </datalist>
            </div>

            <div className="form-group">
              <label htmlFor="course-duration">Estimated Duration</label>
              <input
                id="course-duration"
                type="text"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="e.g. 4 weeks or Self-paced"
              />
            </div>

            <div className="form-group">
              <label htmlFor="course-thumbnail">Thumbnail Badge</label>
              <input
                id="course-thumbnail"
                type="text"
                maxLength="4"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value.toUpperCase())}
                placeholder="e.g. AI, PY, DEV"
              />
            </div>
          </div>
        </Card>
      )}

      {/* Tab 2: Curriculum Builder */}
      {activeTab === 'curriculum' && (
        <div className="curriculum-builder">
          <div className="section-heading">
            <div>
              <p className="eyebrow">MODULES & LESSONS</p>
              <h2>Build the Learning Path</h2>
            </div>
          </div>

          <form onSubmit={handleAddModule} className="add-module-form">
            <input
              type="text"
              value={newModuleTitle}
              onChange={(e) => setNewModuleTitle(e.target.value)}
              placeholder="Module title (e.g. Module 1: Core Fundamentals)"
            />
            <button type="submit" className="button button-primary compact-btn">
              + Add module
            </button>
          </form>

          {curriculum.length === 0 ? (
            <div className="empty-curriculum-panel">
              <p>No modules created yet. Add your first module above to begin organizing lessons.</p>
            </div>
          ) : (
            <div className="modules-stack">
              {curriculum.map((mod, modIdx) => (
                <Card key={mod.id} className="module-builder-card">
                  <div className="module-builder-head">
                    <div className="module-head-left">
                      <span className="module-index">0{modIdx + 1}</span>
                      <input
                        type="text"
                        className="module-title-input"
                        value={mod.title}
                        onChange={(e) => handleUpdateModuleTitle(mod.id, e.target.value)}
                        placeholder="Module title"
                      />
                    </div>
                    <div className="module-head-actions">
                      <button
                        type="button"
                        onClick={() => handleOpenAddLesson(mod.id)}
                        className="button button-secondary compact-btn"
                      >
                        + Add lesson
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteModule(mod.id)}
                        className="button-icon-danger"
                        title="Delete module"
                        aria-label="Delete module"
                      >
                        ✕
                      </button>
                    </div>
                  </div>

                  <div className="module-lessons-list">
                    {(mod.lessons || []).length === 0 ? (
                      <p className="no-lessons-hint">No lessons in this module. Click &quot;+ Add lesson&quot; to add content.</p>
                    ) : (
                      mod.lessons.map((lesson, lesIdx) => (
                        <div key={lesson.id} className="builder-lesson-row">
                          <span className="lesson-num">{lesIdx + 1}</span>
                          <div className="lesson-row-info">
                            <strong>{lesson.title}</strong>
                            <div className="lesson-row-meta">
                              <span>⏱ {lesson.duration}</span>
                              {lesson.videoUrl && <span>📹 Video attached</span>}
                              {lesson.content && <span>📝 Text notes</span>}
                            </div>
                          </div>
                          <div className="lesson-row-actions">
                            <button
                              type="button"
                              onClick={() => handleOpenEditLesson(mod.id, lesson)}
                              className="button button-secondary compact-btn"
                            >
                              Edit ✎
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteLesson(mod.id, lesson.id)}
                              className="button-icon-danger"
                              title="Delete lesson"
                              aria-label="Delete lesson"
                            >
                              ✕
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Quiz Assessment */}
      {activeTab === 'quiz' && (
        <div className="quiz-builder">
          <Card className="editor-card">
            <div className="settings-card-header">
              <h2>Course Assessment</h2>
              <p>Reinforce mastery by creating a knowledge quiz for this course.</p>
            </div>

            <div className="editor-form-grid">
              <div className="form-group">
                <label htmlFor="quiz-title">Quiz Title</label>
                <input
                  id="quiz-title"
                  type="text"
                  value={quizTitle}
                  onChange={(e) => setQuizTitle(e.target.value)}
                  placeholder="e.g. Neural Networks Knowledge Check"
                />
              </div>

              <div className="form-group">
                <label htmlFor="quiz-score">Passing Score (%)</label>
                <input
                  id="quiz-score"
                  type="number"
                  min="1"
                  max="100"
                  value={passingScore}
                  onChange={(e) => setPassingScore(e.target.value)}
                />
              </div>

              <div className="form-group span-full">
                <label htmlFor="quiz-desc">Quiz Description</label>
                <textarea
                  id="quiz-desc"
                  rows="2"
                  value={quizDescription}
                  onChange={(e) => setQuizDescription(e.target.value)}
                  placeholder="Brief instructions for learners before taking the assessment..."
                />
              </div>
            </div>
          </Card>

          <div className="questions-section">
            <div className="section-heading">
              <div>
                <p className="eyebrow">QUESTIONS</p>
                <h2>Quiz Questions ({questions.length})</h2>
              </div>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="button button-primary compact-btn"
              >
                + Add question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="empty-curriculum-panel">
                <p>No questions added yet. Click &quot;+ Add question&quot; to test student comprehension.</p>
              </div>
            ) : (
              questions.map((q, qIdx) => (
                <Card key={qIdx} className="question-builder-card">
                  <div className="question-head">
                    <strong>Question {qIdx + 1}</strong>
                    <button
                      type="button"
                      onClick={() => handleDeleteQuestion(qIdx)}
                      className="button-icon-danger"
                      aria-label="Delete question"
                    >
                      ✕
                    </button>
                  </div>

                  <div className="form-group">
                    <label>Question Prompt</label>
                    <input
                      type="text"
                      value={q.question}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'question', e.target.value)}
                      placeholder="e.g. Which activation function helps prevent vanishing gradients?"
                    />
                  </div>

                  <div className="options-grid">
                    <label className="span-full">Options (Select radio for correct answer)</label>
                    {q.options.map((opt, optIdx) => (
                      <div key={optIdx} className="option-row">
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={q.correctAnswer === opt && opt.length > 0}
                          onChange={() => handleUpdateQuestion(qIdx, 'correctAnswer', opt)}
                          title="Mark as correct answer"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(qIdx, optIdx, e.target.value)}
                          placeholder={`Option ${optIdx + 1}`}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="form-group">
                    <label>Explanation (Shown after answering)</label>
                    <input
                      type="text"
                      value={q.explanation}
                      onChange={(e) => handleUpdateQuestion(qIdx, 'explanation', e.target.value)}
                      placeholder="e.g. ReLU mitigates vanishing gradients by providing a constant gradient for positive inputs."
                    />
                  </div>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Modal / Drawer for Adding / Editing Lesson */}
      {activeLessonModal && (
        <div className="lesson-modal-overlay">
          <div className="lesson-modal-card">
            <div className="lesson-modal-header">
              <h2>{activeLessonModal.isNew ? 'Add New Lesson' : 'Edit Lesson'}</h2>
              <button
                type="button"
                className="button-icon-close"
                onClick={() => setActiveLessonModal(null)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLessonModal} className="lesson-modal-form">
              <div className="form-group">
                <label>Lesson Title *</label>
                <input
                  type="text"
                  value={activeLessonModal.lesson.title}
                  onChange={(e) => setActiveLessonModal((prev) => ({
                    ...prev,
                    lesson: { ...prev.lesson, title: e.target.value },
                  }))}
                  placeholder="e.g. Understanding Backpropagation"
                  required
                />
              </div>

              <div className="form-group">
                <label>Estimated Duration</label>
                <input
                  type="text"
                  value={activeLessonModal.lesson.duration}
                  onChange={(e) => setActiveLessonModal((prev) => ({
                    ...prev,
                    lesson: { ...prev.lesson, duration: e.target.value },
                  }))}
                  placeholder="e.g. 15 min"
                />
              </div>

              <div className="form-group">
                <label>Video URL (Optional: YouTube, Vimeo, or MP4 link)</label>
                <input
                  type="url"
                  value={activeLessonModal.lesson.videoUrl || ''}
                  onChange={(e) => setActiveLessonModal((prev) => ({
                    ...prev,
                    lesson: { ...prev.lesson, videoUrl: e.target.value },
                  }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>

              <div className="form-group">
                <label>Lesson Text / Markdown Content</label>
                <textarea
                  rows="8"
                  value={activeLessonModal.lesson.content || ''}
                  onChange={(e) => setActiveLessonModal((prev) => ({
                    ...prev,
                    lesson: { ...prev.lesson, content: e.target.value },
                  }))}
                  placeholder="Write clear lesson concepts, code snippets, or notes in plain text or Markdown..."
                />
              </div>

              <div className="lesson-modal-actions">
                <button
                  type="button"
                  className="button button-secondary"
                  onClick={() => setActiveLessonModal(null)}
                >
                  Cancel
                </button>
                <button type="submit" className="button button-primary">
                  {activeLessonModal.isNew ? 'Add lesson' : 'Save lesson'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </PageContainer>
  )
}
