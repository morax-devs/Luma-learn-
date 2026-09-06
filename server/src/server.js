import dns from 'node:dns'
dns.setServers(['1.1.1.1', '8.8.8.8'])

import 'dotenv/config'
import app from './app.js'
import { connectDatabase } from './config/db.js'

const port = Number(process.env.PORT) || 5000

async function startServer() {
  try {
    await connectDatabase()
    app.listen(port, () => console.log(`E-learning API listening on port ${port}`))
  } catch (error) {
    console.error(`Server startup failed: ${error.message}`)
    process.exitCode = 1
  }
}

startServer()
