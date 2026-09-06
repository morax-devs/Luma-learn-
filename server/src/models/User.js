import bcrypt from 'bcryptjs'
import mongoose from 'mongoose'

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, select: false },
  role: { type: String, enum: ['student', 'instructor', 'admin'], default: 'student' },
  learningGoal: { type: String, default: '' },
  bio: { type: String, default: '' },
}, { timestamps: true })

userSchema.pre('save', async function () {
  if (!this.isModified('password')) return
  const salt = await bcrypt.genSalt(10)
  this.password = await bcrypt.hash(this.password, salt)
})

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!candidatePassword || !this.password) return false
  const isBcryptHash = typeof this.password === 'string' && (this.password.startsWith('$2a$') || this.password.startsWith('$2b$') || this.password.startsWith('$2y$'))
  if (isBcryptHash) {
    try {
      return await bcrypt.compare(candidatePassword, this.password)
    } catch {
      return false
    }
  }

  // Handle any pre-existing legacy accounts stored as plaintext
  const isPlaintextMatch = candidatePassword === this.password
  if (isPlaintextMatch) {
    // Transparently upgrade legacy password to bcrypt hash on successful login
    this.password = candidatePassword
    await this.save()
  }
  return isPlaintextMatch
}

export const User = mongoose.model('User', userSchema)
