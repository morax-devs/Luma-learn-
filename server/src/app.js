import cors from 'cors'
import express from 'express'
import courseRoutes from './routes/courseRoutes.js'
import lessonRoutes from './routes/lessonRoutes.js'
import quizRoutes from './routes/quizRoutes.js'
import profileRoutes from './routes/profileRoutes.js'
import progressRoutes from './routes/progressRoutes.js'
import quizResultRoutes from './routes/quizResultRoutes.js'
import authRoutes from './routes/authRoutes.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'

const app = express()
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173'

app.use(cors({ origin: allowedOrigin }))
app.use(express.json())

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'E-learning API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)
app.use('/api/courses', courseRoutes)
app.use('/api/courses/:courseId/progress', progressRoutes)
app.use('/api/quizzes', quizResultRoutes)
app.use('/api/quizzes', quizRoutes)
app.use('/api', lessonRoutes)

app.use(notFound)
app.use(errorHandler)

export default app
