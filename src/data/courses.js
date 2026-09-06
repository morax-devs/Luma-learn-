export const courses = [
  {
    id: 'ai-product-builder',
    title: 'AI Product Builder',
    description: 'Learn how to turn machine learning ideas into useful, human-centered products.',
    instructor: 'Dr. Maya Patel',
    category: 'AI & ML',
    level: 'Intermediate',
    duration: '8 weeks',
    thumbnail: 'AI',
    rating: 4.9,
    numberOfStudents: 12480,
    modules: 6,
    lessons: 42,
    curriculum: [
      {
        id: 'ai-foundations', title: 'Foundations of useful AI', duration: '1h 45m', completion: 0,
        lessons: [
          { id: 'ai-01', title: 'What makes an AI product useful?', duration: '12 min', completed: false },
          { id: 'ai-02', title: 'From model capability to user value', duration: '18 min', completed: false },
          { id: 'ai-03', title: 'Mapping the human workflow', duration: '25 min', completed: false },
        ],
      },
      {
        id: 'ai-workflows', title: 'Designing AI workflows', duration: '2h 20m', completion: 0,
        lessons: [
          { id: 'ai-04', title: 'Designing useful AI workflows', duration: '22 min', completed: false },
          { id: 'ai-05', title: 'Prompting as product design', duration: '26 min', completed: false },
          { id: 'ai-06', title: 'Evaluating quality and trust', duration: '31 min', completed: false },
        ],
      },
      {
        id: 'ai-launch', title: 'Shipping with confidence', duration: '1h 50m', completion: 0,
        lessons: [
          { id: 'ai-07', title: 'Responsible launch checklists', duration: '24 min', completed: false },
          { id: 'ai-08', title: 'Learning from real usage', duration: '28 min', completed: false },
        ],
      },
    ],
  },
  {
    id: 'frontend-architecture',
    title: 'Frontend Architecture with React',
    description: 'Build maintainable React applications with clear boundaries and thoughtful patterns.',
    instructor: 'Jordan Lee',
    category: 'Development',
    level: 'Intermediate',
    duration: '6 weeks',
    thumbnail: 'FE',
    rating: 4.8,
    numberOfStudents: 9320,
    modules: 5,
    lessons: 36,
    curriculum: [
      {
        id: 'react-boundaries', title: 'Boundaries that scale', duration: '2h 10m', completion: 0,
        lessons: [
          { id: 'react-01', title: 'A mental model for frontend architecture', duration: '16 min', completed: false },
          { id: 'react-02', title: 'Drawing boundaries in React', duration: '24 min', completed: false },
        ],
      },
      {
        id: 'react-data', title: 'State and data flow', duration: '2h 05m', completion: 0,
        lessons: [
          { id: 'react-03', title: 'State boundaries and data flow', duration: '21 min', completed: false },
          { id: 'react-04', title: 'Designing resilient data fetching', duration: '27 min', completed: false },
        ],
      },
    ],
  },
  {
    id: 'data-storytelling',
    title: 'Data Storytelling',
    description: 'Make complex analysis memorable with strong narratives, visuals, and decisions.',
    instructor: 'Aisha Rahman',
    category: 'Data Science',
    level: 'Beginner',
    duration: '4 weeks',
    thumbnail: 'DS',
    rating: 4.7,
    numberOfStudents: 7810,
    modules: 4,
    lessons: 24,
    curriculum: [
      {
        id: 'story-structure', title: 'Structure your story', duration: '1h 30m', completion: 0,
        lessons: [
          { id: 'story-01', title: 'Start with the decision', duration: '14 min', completed: false },
          { id: 'story-02', title: 'Build a narrative arc', duration: '20 min', completed: false },
        ],
      },
      {
        id: 'story-visuals', title: 'Make data memorable', duration: '1h 40m', completion: 0,
        lessons: [
          { id: 'story-03', title: 'Choosing the right visual', duration: '18 min', completed: false },
          { id: 'story-04', title: 'The final presentation', duration: '29 min', completed: false },
        ],
      },
    ],
  },
]

export const studentProgress = []

export const categories = ['All courses', 'AI & ML', 'Development', 'Data Science', 'Product Design']

export const quizzes = [
  {
    id: 'ai-product-builder-checkpoint', courseId: 'ai-product-builder', title: 'AI product foundations checkpoint', description: 'Reflect on the decisions that make an AI product useful, trustworthy, and human-centered.', passingScore: 70, duration: '8 min',
    questions: [
      { id: 'ai-q1', question: 'What should an AI product decision begin with?', options: ['The newest model', 'A specific user need', 'A long feature list', 'A technical benchmark'], correctAnswer: 'A specific user need', explanation: 'Useful products begin with a real moment of need, not a capability looking for a problem.' },
      { id: 'ai-q2', question: 'What is the purpose of mapping a human workflow?', options: ['To remove all human decisions', 'To understand where the product can create leverage', 'To make the interface more complex', 'To replace user research'], correctAnswer: 'To understand where the product can create leverage', explanation: 'A workflow map reveals where AI can reduce friction while keeping people in control.' },
      { id: 'ai-q3', question: 'Which quality is most important when evaluating an AI output?', options: ['It is surprising', 'It is expensive to produce', 'It helps the user make progress', 'It uses the largest model'], correctAnswer: 'It helps the user make progress', explanation: 'Evaluation should connect output quality to the user outcome the product promises.' },
      { id: 'ai-q4', question: 'Why should trust be designed into an AI workflow?', options: ['Because users need clarity about system behavior', 'Because it removes the need for testing', 'Because it makes the model faster', 'Because it guarantees perfect outputs'], correctAnswer: 'Because users need clarity about system behavior', explanation: 'Clear expectations, feedback, and recovery paths help users work confidently with imperfect systems.' },
      { id: 'ai-q5', question: 'What is a strong first step before shipping an AI feature?', options: ['Hide uncertainty', 'Define how success will be recognized', 'Add more settings', 'Avoid observing real use'], correctAnswer: 'Define how success will be recognized', explanation: 'A clear success measure makes learning from real usage possible after launch.' },
    ],
  },
  {
    id: 'frontend-architecture-checkpoint', courseId: 'frontend-architecture', title: 'Architecture patterns checkpoint', description: 'Check your understanding of boundaries, state, and resilient React systems.', passingScore: 70, duration: '8 min',
    questions: [
      { id: 'react-q1', question: 'What is a useful purpose of a component boundary?', options: ['To hide every detail', 'To give a piece of behavior a clear responsibility', 'To increase file count', 'To avoid testing'], correctAnswer: 'To give a piece of behavior a clear responsibility', explanation: 'Good boundaries make responsibilities easier to understand, change, and test.' },
      { id: 'react-q2', question: 'Where should shared state usually live?', options: ['In the closest component always', 'At the lowest possible level', 'At the nearest common owner', 'In every component'], correctAnswer: 'At the nearest common owner', explanation: 'The nearest common owner can coordinate the state without making unrelated components depend on it.' },
      { id: 'react-q3', question: 'What makes data fetching resilient?', options: ['Ignoring loading states', 'Handling loading, success, and failure states', 'Fetching in every render', 'Avoiding user feedback'], correctAnswer: 'Handling loading, success, and failure states', explanation: 'Explicit states make asynchronous behavior predictable for both users and developers.' },
      { id: 'react-q4', question: 'What should a reusable component avoid?', options: ['A focused API', 'Clear naming', 'Knowing too much about its parent page', 'Accessible states'], correctAnswer: 'Knowing too much about its parent page', explanation: 'A focused component stays reusable when it receives the data and callbacks it needs through a clear API.' },
      { id: 'react-q5', question: 'Why are stable UI states important?', options: ['They reduce layout surprises', 'They prevent all bugs', 'They eliminate responsive design', 'They make all pages identical'], correctAnswer: 'They reduce layout surprises', explanation: 'Stable dimensions and explicit states help interfaces feel calm as data changes.' },
    ],
  },
  {
    id: 'data-storytelling-checkpoint', courseId: 'data-storytelling', title: 'Data storytelling checkpoint', description: 'Practice the principles behind clear, memorable analytical stories.', passingScore: 70, duration: '8 min',
    questions: [
      { id: 'story-q1', question: 'What should a data story help an audience do?', options: ['Memorize every number', 'Make a decision', 'Admire a chart', 'Avoid questions'], correctAnswer: 'Make a decision', explanation: 'A useful story connects evidence to the decision or action that follows.' },
      { id: 'story-q2', question: 'How should you choose a visual?', options: ['Start with the trendiest chart', 'Match the visual to the comparison', 'Use as many colors as possible', 'Always choose a pie chart'], correctAnswer: 'Match the visual to the comparison', explanation: 'The analytical relationship determines which visual makes the pattern easiest to see.' },
      { id: 'story-q3', question: 'What makes a narrative easier to follow?', options: ['A clear beginning, tension, and resolution', 'More jargon', 'Removing context', 'Showing every data point'], correctAnswer: 'A clear beginning, tension, and resolution', explanation: 'A narrative arc gives evidence a direction and helps an audience retain the meaning.' },
      { id: 'story-q4', question: 'Why is context important in a chart?', options: ['It explains what the audience is seeing', 'It makes charts decorative', 'It hides uncertainty', 'It replaces analysis'], correctAnswer: 'It explains what the audience is seeing', explanation: 'Context gives the numbers meaning and prevents an audience from drawing the wrong conclusion.' },
      { id: 'story-q5', question: 'What is a strong editing question for a presentation?', options: ['Can I add another chart?', 'What should the audience remember?', 'Can I make every label smaller?', 'Can I remove the takeaway?'], correctAnswer: 'What should the audience remember?', explanation: 'A focused takeaway keeps the story useful after the presentation ends.' },
    ],
  },
]
