const base = 'http://localhost:5000/api'

async function run() {
  const health = await fetch(`${base}/health`)
  console.log('health', health.status, await health.json())

  const login = await fetch(`${base}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'testuser@example.com', password: 'Password123!' }),
  })
  const loginJson = await login.json()
  console.log('login', login.status, loginJson)
  const token = loginJson.token

  const profile = await fetch(`${base}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log('profile', profile.status, await profile.json())

  const patch = await fetch(`${base}/profile`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ learningGoal: 'Learn backend APIs' }),
  })
  console.log('profile patch', patch.status, await patch.json())

  const progress = await fetch(`${base}/courses/ai-product-builder/progress`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log('progress', progress.status, await progress.json())

  const update = await fetch(`${base}/courses/ai-product-builder/progress/lessons/ai-05`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ completed: true }),
  })
  console.log('progress update', update.status, await update.json())

  const quizHist = await fetch(`${base}/quizzes/results/history`, {
    headers: { Authorization: `Bearer ${token}` },
  })
  console.log('quizHistory', quizHist.status, await quizHist.json())

  const quizSave = await fetch(`${base}/quizzes/ai-product-builder-checkpoint/results`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: JSON.stringify({ answers: { 'ai-q1': 'A specific user need' }, score: 80, percentage: 80, passed: true }),
  })
  console.log('save quiz', quizSave.status, await quizSave.json())
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
