import dns from 'node:dns'
dns.setServers(['1.1.1.1', '8.8.8.8'])

import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'
import { connectDatabase, disconnectDatabase } from '../src/config/db.js'
import { User } from '../src/models/User.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
dotenv.config({ path: path.resolve(__dirname, '../.env') })

const emailArg = process.argv[2]
if (!emailArg) {
  console.error('Usage: node server/scripts/setInstructor.js <user-email>')
  process.exit(1)
}

async function run() {
  try {
    await connectDatabase()
    const email = emailArg.toLowerCase().trim()
    const user = await User.findOne({ email })
    if (!user) {
      console.error(`User not found with email: "${email}"`)
      process.exit(1)
    }

    user.role = 'instructor'
    await user.save()

    console.log(`Success! User "${user.name}" (${user.email}) has been updated to role: "instructor".`)
  } catch (err) {
    console.error('Failed to update user role:', err.message)
    process.exit(1)
  } finally {
    await disconnectDatabase()
  }
}

run()
