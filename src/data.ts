export const PROFILE = {
  name: 'Korede Afolami',
  firstName: 'Korede',
  alias: 'Umar',
  role: 'Software Engineer',
  blurb:
    'I build backend systems and the infrastructure that keeps them standing up. Go, Python, Kubernetes, and a persistent suspicion that the problem is the network.',
  location: 'Dallas, TX',
  email: 'afolamikorede@gmail.com',
  phone: '(682) 374-5260',
  github: 'https://github.com/the1umar',
  githubLabel: 'github.com/the1umar',
  linkedin: 'https://linkedin.com/in/korede-afolami-/',
  linkedinLabel: 'linkedin.com/in/korede-afolami-',
  resume: './Korede_Afolami_Resume.pdf',
  photo: './umar.jpeg',
} as const

export type Experience = {
  mark: string
  org: string
  title: string
  place: string
  period: string
  year: string
  current?: boolean
  points: string[]
  stack: string[]
}

export const EXPERIENCE: Experience[] = [
  {
    mark: 'C',
    org: 'Cisco',
    title: 'Software Engineer Intern',
    place: 'Boulder, CO',
    period: 'May 2026 - August 2026',
    year: '2026',
    points: [
      'Authored a technical RFC and system design for a greenfield, cell-based backend service in Go that re-implements the admin API of a legacy Splunk Cloud platform, defining its per-cell deployment model, request routing, Istio-based network policies, and service-account auth strategy.',
      'Onboarded the service to an internal Kubernetes + GitOps platform using infrastructure-as-code (Vault policies, namespaces, deploy keys) and Backstage scaffolding, standing up a passing CI/CD pipeline with automated ArgoCD deploys to a live cloud dev environment.',
      'Validated the full suite of backend admin operations against a live service instance via Kubernetes port-forwarding, documenting API-contract deltas between the legacy and cell-native implementations.',
      'Replaced Okta/OAuth downstream authentication with Vault-provisioned service-account tokens and validated integrations across 3 internal microservice clients, removing a hard dependency on credential-based token exchange.',
    ],
    stack: ['Go', 'Kubernetes', 'Istio', 'ArgoCD', 'Vault', 'Terraform'],
  },
  {
    mark: 'S',
    org: 'Splunk',
    title: 'Software Engineer Intern',
    place: 'Boulder, CO',
    period: 'May 2025 - August 2025',
    year: '2025',
    points: [
      'Built, containerized and deployed a Python serverless backend on AWS with Terraform and PostgreSQL via Prisma ORM that visualized 5,000+ GitLab CI/CD pipeline executions weekly, including upstream/downstream relationships, cutting debugging cycles from hours to minutes.',
      'Integrated GitLab GraphQL + REST APIs to aggregate job-level metrics, removing manual investigation time for failed releases entirely and accelerating readiness checks by ~30%.',
      'Automated Slack alerting for 200+ stakeholders across release engineering, PM and CINC teams, giving them real-time release health and cutting incident response lag by ~40%.',
    ],
    stack: ['Python', 'AWS', 'Terraform', 'PostgreSQL', 'Prisma', 'GraphQL'],
  },
  {
    mark: 'TT',
    org: 'Texas Tech University',
    title: 'Teaching Assistant, Computer Science',
    place: 'Lubbock, TX',
    period: 'January 2025 - Present',
    year: 'now',
    current: true,
    points: [
      'Support 190+ students across Data Structures and Discrete Mathematics through grading and written feedback, lifting measured student performance by ~15%.',
    ],
    stack: ['Data Structures', 'Discrete Math'],
  },
]

export type Project = {
  index: string
  name: string
  period: string
  status: string
  summary: string
  points: string[]
  stack: string[]
}

export const PROJECTS: Project[] = [
  {
    index: '01',
    name: 'CampusPlay',
    period: 'January 2026 - Present',
    status: 'building',
    summary: 'A pickup-sports finder for university students.',
    points: [
      'Full-stack platform to create, join and discover pickup games, on PostgreSQL (Prisma ORM) with a Node.js + TypeScript backend and Tailwind on the front.',
      'Google Maps API for GPS-based discovery, JWT auth gated on @university.edu domain verification, and Firebase Cloud Messaging for real-time notifications.',
      'Shipping as a containerized serverless AWS application, roughly 40% less infrastructure overhead than traditional hosting.',
    ],
    stack: ['TypeScript', 'Node.js', 'PostgreSQL', 'Prisma', 'AWS', 'Tailwind'],
  },
  {
    index: '02',
    name: 'Layered Full-Stack Application',
    period: 'January 2026',
    status: 'shipped',
    summary: 'Spring Boot, JPA and React, wired end to end.',
    points: [
      'Java + Spring Boot + Spring Data JPA + Hibernate over PostgreSQL, with RESTful APIs designed against a modern frontend for genuine end-to-end data flow.',
      'Layered backend architecture (controller, service, repository) handling CRUD, request validation, exception handling and persistence through JPA/Hibernate.',
      'React frontend connected via Axios, managing state and component lifecycle against clean, explicit API contracts.',
    ],
    stack: ['Java', 'Spring Boot', 'Hibernate', 'PostgreSQL', 'React'],
  },
  {
    index: '03',
    name: 'RAG Chatbot',
    period: 'May 2025',
    status: 'shipped',
    summary: 'Retrieval-augmented generation for course material.',
    points: [
      'Python retrieval-augmented chatbot answering contextual queries in under a second across test sets of 500+ prompts.',
      'LangChain pipelines over Llama 3.1-70B, with vector storage in ChromaDB for semantic retrieval.',
      'Streamlit UI for student users, supporting auto-grading and QA tasks and improving grading workflow efficiency by ~25%.',
    ],
    stack: ['Python', 'LangChain', 'ChromaDB', 'Llama 3.1', 'Streamlit'],
  },
]

export const SKILLS: { label: string; items: string[] }[] = [
  {
    label: 'Languages',
    items: ['Go', 'Python', 'Java', 'TypeScript', 'JavaScript', 'C', 'C++', 'SQL'],
  },
  {
    label: 'Infrastructure',
    items: ['Kubernetes', 'Docker', 'Terraform', 'AWS', 'Istio', 'ArgoCD', 'Vault', 'Git'],
  },
  {
    label: 'Frameworks',
    items: ['Node.js', 'React', 'Next.js', 'FastAPI', 'Spring Boot', 'Prisma'],
  },
  {
    label: 'Coursework',
    items: [
      'Compilers',
      'Data Structures & Algorithms',
      'Computer Architecture',
      'Database Systems',
      'Networking',
      'Discrete Math',
    ],
  },
]

export const EDUCATION = {
  school: 'Texas Tech University',
  place: 'Lubbock, TX',
  degree: 'B.S. Computer Science, Minor in Mathematics',
  gpa: '3.9',
  grad: 'December 2026',
}

export const LEADERSHIP = {
  org: 'ColorStack TTU',
  title: 'Vice President',
  period: 'December 2024 - Present',
  points: [
    'Direct a 14-member executive team and run company collaborations with Apple, Amazon, Dell, Datadog, Paycom and FourJs, reaching 200+ member students.',
  ],
}
