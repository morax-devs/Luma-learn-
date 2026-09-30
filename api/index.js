import 'dotenv/config'
import { connectDatabase } from '../server/src/config/db.js'
import app from '../server/src/app.js'

// Connect to DB once (Vercel reuses function instances)
let isConnected = false

async function ensureDbConnected() {
  if (!isConnected) {
    await connectDatabase()
    isConnected = true
  }
}

export default async function handler(req, res) {
  await ensureDbConnected()
  app(req, res)
}
