/*
API contract reference. The API adapters in this folder implement these shapes.

AUTH
GET    /auth/me                 -> { user: { id, name, role } | null }
POST   /auth/login              body: { email, password } -> { user, token }
POST   /auth/logout             -> { success: true }

COURSES
GET    /courses                 -> { courses: Course[] }
GET    /courses/:courseId       -> { course: Course }
POST   /courses/:courseId/enroll -> { enrollment: { courseId, enrolledAt } }

LESSONS / PROGRESS
GET    /courses/:courseId/progress -> { progress: { completedLessonIds, percentage } }
POST   /courses/:courseId/progress/lessons/:lessonId -> { progress: Progress }

QUIZZES
GET    /quizzes                 -> { quizzes: Quiz[] }
GET    /quizzes/:quizId         -> { quiz: Quiz }
POST   /quizzes/:quizId/results  body: QuizResultInput -> { result: QuizResult }
GET    /quizzes/results/history -> { results: QuizResult[] }

PROFILE
GET    /profile                 -> { profile: Profile }
PATCH  /profile                 body: ProfileInput -> { profile: Profile }

Course: { id, title, description, instructor, category, level, duration, thumbnail,
  rating, numberOfStudents, modules, lessons, curriculum }
Quiz: { id, courseId, title, description, passingScore, questions: Question[] }
Question: { id, question, options: string[], correctAnswer, explanation }
Progress: { completedLessonIds: string[], percentage: number }
QuizResult: { quizId, courseId, answers, score, percentage, passed, submittedAt }
Profile: { id, name, role, learningGoal, bio }
*/
