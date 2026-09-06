import mongoose from 'mongoose'

export async function connectDatabase() {
  const uri = process.env.MONGODB_URI
  if (!uri) throw new Error('MONGODB_URI is required to start the API.')

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 })
    console.log('MongoDB connected (Primary Atlas)')
    return
  } catch (primaryError) {
    console.warn('Primary MongoDB Atlas connection failed:', primaryError.message)
    const localUri = process.env.LOCAL_MONGODB_URI || 'mongodb://127.0.0.1:27017/elearning'
    try {
      await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 })
      console.log('MongoDB connected (Local Fallback)')
      return
    } catch (localError) {
      console.error('Local MongoDB fallback connection failed:', localError.message)
      throw new Error('MongoDB connection failed. Please ensure Atlas IP is whitelisted or local MongoDB is running.', { cause: localError })
    }
  }
}

export async function disconnectDatabase() {
  await mongoose.disconnect()
}
