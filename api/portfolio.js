export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const PORTFOLIO_DATA = {
    skills: [
      { category: "Languages", items: ["HTML", "CSS", "JavaScript", "SQL", "PHP"] },
      { category: "Frontend", items: ["React", "Vite", "Tailwind CSS", "Bootstrap"] },
      { category: "Backend", items: ["Node.js", "Express", "MySQL", "PostgreSQL"] },
      { category: "Infrastructure", items: ["Vercel", "GitHub", "Netlify", "Firebase"] },
    ],
    projects: [
      {
        title: "Kibeproxy Hub",
        type: "SaaS · Full Stack",
        year: "2024",
        description: "A comprehensive proxy management platform featuring an automated store and inventory system for residential and mobile proxies.",
        tags: ["React", "Node.js", "PostgreSQL", "Supabase"],
        metric: "Live Platform",
        color: "#C9A84C",
      },
      {
        title: "Aerowin Aviator",
        type: "Web App · Gaming",
        year: "2024",
        description: "A high-performance gaming platform with real-time updates and seamless user interface for a premium betting experience.",
        tags: ["Next.js", "Socket.io", "Tailwind CSS"],
        metric: "Active Users",
        color: "#6B9FD4",
      },
    ],
    experience: [
      {
        role: "Computer Teacher",
        company: "Njuri High School",
        period: "April 2025 – August 2025",
        description: "Educated students on computer science fundamentals, including hardware, software systems, and introductory web development.",
      },
      {
        role: "Computer Teacher",
        company: "Ngererit Comprehensive School",
        period: "April 2024 – August 2024",
        description: "Facilitated computer literacy programs and managed the school's IT infrastructure while mentoring students in digital skills.",
      },
    ]
  };

  res.status(200).json(PORTFOLIO_DATA);
}
