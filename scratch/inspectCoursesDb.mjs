import dns from 'node:dns'
dns.setServers(['1.1.1.1', '8.8.8.8'])
import 'dotenv/config'
import mongoose from 'mongoose'

async function check() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    console.log('No MONGODB_URI found.')
    return
  }
  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
    console.log('Connected to MongoDB!')
    const courses = await mongoose.connection.db.collection('courses').find({}).toArray()
    console.log(`Found ${courses.length} courses in database:`)
    courses.forEach((c, i) => {
      console.log(`[${i}] _id: ${c._id}, id: ${c.id}, title: "${c.title}"`)
    })
    await mongoose.disconnect()
  } catch (err) {
    console.log('MongoDB connection error:', err.message)
  }
}

check()
