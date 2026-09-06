import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  moduleTitle: { type: String, required: true },
  title: { type: String, required: true, trim: true },
  content: { type: String, default: '' },
  duration: { type: String, required: true },
  order: { type: Number, required: true },
}, { timestamps: true })

export const Lesson = mongoose.model('Lesson', lessonSchema)
