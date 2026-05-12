export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const PORTFOLIO_DATA = {
    skills: [
      { category: "Languages", items: ["TypeScript", "Python", "Go", "SQL", "Rust"] },
      { category: "Frontend", items: ["React", "Next.js", "Tailwind CSS", "GraphQL", "WebGL"] },
      { category: "Backend", items: ["Node.js", "FastAPI", "PostgreSQL", "Redis", "gRPC"] },
      { category: "Infrastructure", items: ["AWS", "Docker", "Kubernetes", "Terraform", "CI/CD"] },
    ],
    projects: [
      {
        title: "Nexus Analytics Platform",
        type: "SaaS · Full Stack",
        year: "2024",
        description: "Real-time business intelligence dashboard processing 50M+ events/day. Built with React, Go microservices, and ClickHouse for sub-second query performance.",
        tags: ["React", "Go", "ClickHouse", "Kafka"],
        metric: "50M+ events/day",
        color: "#C9A84C",
      },
      {
        title: "Orbital API Gateway",
        type: "Open Source · Backend",
        year: "2023",
        description: "High-throughput API gateway with intelligent rate limiting, request validation, and zero-downtime deployments. 2.4k GitHub stars.",
        tags: ["Rust", "Kubernetes", "gRPC", "Prometheus"],
        metric: "2.4k ★ GitHub",
        color: "#6B9FD4",
      },
      {
        title: "Meridian Mobile",
        type: "Product · Mobile",
        year: "2023",
        description: "Cross-platform fintech app for expense tracking and investment insights. Onboarded 80k users in first quarter post-launch.",
        tags: ["React Native", "Python", "PostgreSQL", "Plaid"],
        metric: "80k users Q1",
        color: "#7EC8A4",
      },
    ],
    experience: [
      {
        role: "Senior Software Engineer",
        company: "Vertex Systems",
        period: "2022 – Present",
        description: "Lead architect for core data infrastructure serving 200+ enterprise clients. Reduced p99 latency by 68% through distributed caching redesign.",
      },
      {
        role: "Software Engineer II",
        company: "Bridgepoint Technologies",
        period: "2020 – 2022",
        description: "Built and shipped three customer-facing products from 0→1. Established frontend guild practices across 4 engineering teams.",
      },
      {
        role: "Software Engineer",
        company: "Kappa Labs",
        period: "2018 – 2020",
        description: "Developed ML pipeline tooling that cut model training time by 40%. First engineering hire; helped scale team from 3 to 18 engineers.",
      },
    ]
  };

  res.status(200).json(PORTFOLIO_DATA);
}
