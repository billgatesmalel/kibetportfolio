require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Portfolio Data
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

// Routes
app.get('/api/portfolio', (req, res) => {
  res.json(PORTFOLIO_DATA);
});

app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  // Configure transporter (Update with real credentials in .env)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: email,
    to: process.env.EMAIL_TO || process.env.EMAIL_USER,
    subject: `New Portfolio Message from ${name}`,
    text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
  };

  try {
    // For demo purposes, if no email is configured, we'll just log it
    if (!process.env.EMAIL_USER) {
      console.log("Contact form submitted (Demo mode):", { name, email, message });
      return res.status(200).json({ message: "Message received (Demo mode)" });
    }

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "Message sent successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to send message" });
  }
});

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'dist')));

// The "catchall" handler: for any request that doesn't
// match one above, send back React's index.html file.
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, 'dist', 'index.html');
  if (require('fs').existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.send("Backend is running. Please run 'npm run build' to generate the frontend 'dist' folder.");
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
