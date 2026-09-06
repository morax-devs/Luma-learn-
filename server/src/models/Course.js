import mongoose from 'mongoose'

const lessonSchema = new mongoose.Schema({
  id: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  duration: { type: String, default: '' },
  completed: { type: Boolean, default: false },
}, { _id: false })

const moduleSchema = new mongoose.Schema({
  id: { type: String, required: true, trim: true },
  title: { type: String, required: true, trim: true },
  duration: { type: String, default: '' },
  completion: { type: Number, default: 0, min: 0, max: 100 },
  lessons: { type: [lessonSchema], default: [] },
}, { _id: false })

const courseSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  instructor: { type: String, required: true },
  category: { type: String, required: true },
  level: { type: String, required: true },
  duration: { type: String, required: true },
  thumbnail: { type: String, default: '' },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  numberOfStudents: { type: Number, default: 0, min: 0 },
  modules: { type: Number, default: 0, min: 0 },
  lessons: { type: Number, default: 0, min: 0 },
  curriculum: { type: [moduleSchema], default: [] },
}, { timestamps: true })

export const Course = mongoose.model('Course', courseSchema)
