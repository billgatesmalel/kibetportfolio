import { useState, useEffect, useRef } from "react";

const NAV_LINKS = ["About", "Skills", "Projects", "Experience", "Contact"];

// Data will be fetched from the backend API
// const SKILLS = ...
// const PROJECTS = ...
// const EXPERIENCE = ...


// Constants moved to backend or initialized as empty


// Constants moved to backend


function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, inView];
}

function FadeIn({ children, delay = 0, className = "" }) {
  const [ref, inView] = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

export default function Portfolio() {
  const [active, setActive] = useState("About");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);
  const [skills, setSkills] = useState([]);
  const [projects, setProjects] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  const API_BASE_URL = "/api";


  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/portfolio`);
        const data = await res.json();
        setSkills(data.skills || []);
        setProjects(data.projects || []);
        setExperience(data.experience || []);
      } catch (err) {
        console.error("Failed to fetch portfolio data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const sections = NAV_LINKS.map((l) => document.getElementById(l.toLowerCase()));
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id.charAt(0).toUpperCase() + e.target.id.slice(1));
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => s && obs.observe(s));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const handleSubmit = async () => {
    if (formState.name && formState.email && formState.message) {
      try {
        const response = await fetch(`${API_BASE_URL}/contact`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formState),
        });
        if (response.ok) {
          setSent(true);
        } else {
          alert("Something went wrong. Please try again.");
        }
      } catch (error) {
        console.error("Submission error:", error);
        alert("Failed to connect to the server.");
      }
    }
  };


  return (
    <div style={styles.root}>
      <style>{CSS}</style>

      {/* NAV */}
      <nav style={{ ...styles.nav, ...(scrolled ? styles.navScrolled : {}) }}>
        <div style={styles.navInner}>
          <span style={styles.logo}>
            <span style={styles.logoAccent}>I</span>K
          </span>
          <div style={styles.navLinks}>
            {NAV_LINKS.map((l) => (
              <button
                key={l}
                onClick={() => scrollTo(l)}
                style={{
                  ...styles.navLink,
                  ...(active === l ? styles.navLinkActive : {}),
                }}
              >
                {l}
              </button>
            ))}
            <button style={styles.navCta} onClick={() => scrollTo("Contact")}>
              Hire Me
            </button>
          </div>
          <button style={styles.burger} onClick={() => setMenuOpen(!menuOpen)}>
            <span style={{ ...styles.burgerLine, ...(menuOpen ? styles.burgerLine1Open : {}) }} />
            <span style={{ ...styles.burgerLine, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...styles.burgerLine, ...(menuOpen ? styles.burgerLine3Open : {}) }} />
          </button>
        </div>
        {menuOpen && (
          <div style={styles.mobileMenu}>
            {NAV_LINKS.map((l) => (
              <button key={l} onClick={() => scrollTo(l)} style={styles.mobileLink}>
                {l}
              </button>
            ))}
          </div>
        )}
      </nav>

      {/* HERO */}
      <section style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroGrid}>
          <div style={styles.heroGridLine} />
          <div style={{ ...styles.heroGridLine, left: "33%" }} />
          <div style={{ ...styles.heroGridLine, left: "66%" }} />
          <div style={{ ...styles.heroGridLine, left: "100%" }} />
        </div>
        <div style={styles.heroContent}>
          <p style={styles.heroEyebrow} className="slide-up">
            <span style={styles.eyebrowDot} /> Web Developer · Mathematics & Computer Science Tutor
          </p>
          <h1 style={styles.heroName} className="slide-up delay-1">
            Ian<br />
            <span style={styles.heroNameAccent}>Kibet</span>
          </h1>
          <p style={styles.heroTagline} className="slide-up delay-2">
            Engineering robust digital solutions with mathematical precision.<br className="hide-sm" /> Building platforms like Kibeproxy Hub and Aerowin Aviator.
          </p>
          <div style={styles.heroActions} className="slide-up delay-3">
            <button style={styles.heroPrimary} onClick={() => scrollTo("Projects")}>
              View My Work
            </button>
            <button style={styles.heroSecondary} onClick={() => scrollTo("Contact")}>
              Get In Touch
            </button>
          </div>
        </div>
        <div style={styles.heroStats} className="slide-up delay-4">
          {[["2+", "Years"], ["KibeProxy", "Hub"], ["Aerowin", "Aviator"], ["GitHub", "active"]].map(([n, l]) => (
            <div key={l} style={styles.heroStat}>
              <span style={styles.heroStatNum}>{n}</span>
              <span style={styles.heroStatLabel}>{l}</span>
            </div>
          ))}
        </div>
        <div style={styles.scrollIndicator}>
          <div style={styles.scrollLine} />
          <span style={styles.scrollText}>Scroll</span>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" style={styles.section}>
        <div style={styles.container}>
          <FadeIn>
            <div style={styles.sectionLabel}><span style={styles.labelLine} />About</div>
          </FadeIn>
          <div style={styles.aboutGrid}>
            <FadeIn delay={0.1}>
              <div style={styles.aboutCard}>
                <div style={styles.avatarRing}>
                  <div style={styles.avatar}>
                    <img src="/profile.jpg" alt="Ian Kibet" style={styles.avatarImg} />
                  </div>
                </div>
                <div style={styles.aboutCardInfo}>
                  <h2 style={styles.aboutName}>
                    Ian Kibet
                    <svg style={styles.verifiedBadge} viewBox="0 0 24 24" aria-label="Verified account">
                      <path d="M22.25 12c0-1.43-.88-2.67-2.19-3.34.46-1.39.2-2.97-.81-4.08s-2.47-1.63-4.08-1.22c-.63-1.43-1.87-2.43-3.33-2.43s-2.7 1-3.33 2.43c-1.61-.41-3.14.28-4.08 1.22s-1.27 2.69-.81 4.08c-1.31.67-2.19 1.91-2.19 3.34s.88 2.67 2.19 3.34c-.46 1.39-.2 2.97.81 4.08s2.47 1.63 4.08 1.22c.63 1.43 1.87 2.43 3.33 2.43s2.7-1 3.33-2.43c1.61.41 3.14-.28 4.08-1.22s1.27-2.69.81-4.08c1.31-.67 2.19-1.91 2.19-3.34zm-11.71 4.2l-3.53-3.53 1.41-1.41 2.12 2.12 4.95-4.95 1.41 1.41-6.36 6.36z" />
                    </svg>
                  </h2>
                  <p style={styles.aboutTitle}>Mathematics & Computer Science Tutor</p>
                  <p style={styles.aboutLocation}>📍 Bomet, Kenya</p>
                  <div style={styles.aboutSocials}>
                    <a href="https://github.com/billgatesmalel" target="_blank" rel="noreferrer" style={styles.socialBtn}>GitHub</a>
                    <a href="https://github.com/billgatesmalel" target="_blank" rel="noreferrer" style={styles.socialBtn}>LinkedIn</a>
                    <a href="https://t.me/kibeproxy" target="_blank" rel="noreferrer" style={styles.socialBtn}>Telegram</a>
                    <a href="https://x.com/riggychii" target="_blank" rel="noreferrer" style={styles.socialBtn}>Twitter</a>
                  </div>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <div style={styles.aboutText}>
                <h3 style={styles.aboutHeading}>Building systems that scale.</h3>
                <p style={styles.aboutParagraph}>
                  I'm a dedicated web developer based in Bomet, Kenya, with a passion for building functional and aesthetically pleasing digital experiences. I have a deep interest in technology and its potential to solve complex problems through code and mathematics.
                </p>
                <p style={styles.aboutParagraph}>
                  I specialize in creating robust web applications, having built platforms like Kibeproxy Hub and Aerowin Aviator. Beyond development, I'm committed to sharing knowledge, having taught computer science at Ngererit Comprehensive School and Njuri High School.
                </p>
                <div style={styles.aboutPillsRow}>
                  {["Distributed Systems", "API Design", "Team Leadership", "OSS Contributor", "Technical Writing"].map((p) => (
                    <span key={p} style={styles.pill}>{p}</span>
                  ))}
                </div>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* SKILLS */}
      <section id="skills" style={{ ...styles.section, background: "#F7F6F3" }}>
        <div style={styles.container}>
          <FadeIn>
            <div style={styles.sectionLabel}><span style={styles.labelLine} />Skills</div>
            <h2 style={styles.sectionHeading}>Technical Expertise</h2>
          </FadeIn>
          <div style={styles.skillsGrid}>
            {skills.map((group, gi) => (

              <FadeIn key={group.category} delay={gi * 0.1}>
                <div style={styles.skillGroup}>
                  <div style={styles.skillGroupHeader}>
                    <span style={styles.skillGroupNum}>0{gi + 1}</span>
                    <h4 style={styles.skillGroupTitle}>{group.category}</h4>
                  </div>
                  <div style={styles.skillTags}>
                    {group.items.map((item) => (
                      <span key={item} style={styles.skillTag}>{item}</span>
                    ))}
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* PROJECTS */}
      <section id="projects" style={styles.section}>
        <div style={styles.container}>
          <FadeIn>
            <div style={styles.sectionLabel}><span style={styles.labelLine} />Projects</div>
            <h2 style={styles.sectionHeading}>Selected Work</h2>
          </FadeIn>
          <div style={styles.projectsGrid}>
            {projects.map((p, i) => (

              <FadeIn key={p.title} delay={i * 0.12}>
                <div style={styles.projectCard} className="project-card">
                  <div style={styles.projectTop}>
                    <div style={styles.projectMeta}>
                      <span style={styles.projectType}>{p.type}</span>
                      <span style={styles.projectYear}>{p.year}</span>
                    </div>
                    <div style={{ ...styles.projectMetric, color: p.color }}>{p.metric}</div>
                  </div>
                  <h3 style={styles.projectTitle}>{p.title}</h3>
                  <p style={styles.projectDesc}>{p.description}</p>
                  <div style={styles.projectTagsRow}>
                    {p.tags.map((t) => (
                      <span key={t} style={{ ...styles.projectTag, borderColor: p.color + "55", color: p.color }}>
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ ...styles.projectAccent, background: p.color }} />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* EXPERIENCE */}
      <section id="experience" style={{ ...styles.section, background: "#0D1B2A", color: "#E8E4DC" }}>
        <div style={styles.container}>
          <FadeIn>
            <div style={{ ...styles.sectionLabel, color: "#6B9FD4" }}>
              <span style={{ ...styles.labelLine, background: "#6B9FD4" }} />Experience
            </div>
            <h2 style={{ ...styles.sectionHeading, color: "#E8E4DC" }}>Career Timeline</h2>
          </FadeIn>
          <div style={styles.timeline}>
            {experience.map((e, i) => (

              <FadeIn key={e.company} delay={i * 0.15}>
                <div style={styles.timelineItem}>
                  <div style={styles.timelineDotCol}>
                    <div style={styles.timelineDot} />
                    {i < experience.length - 1 && <div style={styles.timelineConnector} />}
                  </div>
                  <div style={styles.timelineContent}>
                    <div style={styles.timelineHeader}>
                      <div>
                        <h3 style={styles.timelineRole}>{e.role}</h3>
                        <p style={styles.timelineCompany}>{e.company}</p>
                      </div>
                      <span style={styles.timelinePeriod}>{e.period}</span>
                    </div>
                    <p style={styles.timelineDesc}>{e.description}</p>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact" style={styles.section}>
        <div style={styles.container}>
          <FadeIn>
            <div style={styles.sectionLabel}><span style={styles.labelLine} />Contact</div>
            <h2 style={styles.sectionHeading}>Let's Work Together</h2>
            <p style={styles.contactIntro}>
              Open to senior & staff engineering roles, technical consulting, and interesting open source collaboration. Response within 24 hours.
            </p>
          </FadeIn>
          <div style={styles.contactGrid}>
            <FadeIn delay={0.1}>
              <div style={styles.contactInfo}>
                {[
                  { label: "Email", value: "kibetian2030@gmail.com" },
                  { label: "Location", value: "Bomet, Kenya" },
                  { label: "Phone", value: "+254 799 289 214" },
                ].map(({ label, value }) => (
                  <div key={label} style={styles.contactInfoRow}>
                    <span style={styles.contactInfoLabel}>{label}</span>
                    <span style={styles.contactInfoValue}>{value}</span>
                  </div>
                ))}
                <div style={styles.quickContactGrid}>
                  {[
                    { label: "WhatsApp", sub: "Message me", link: "https://wa.me/254799289214", color: "#25D366" },
                    { label: "Telegram", sub: "@kibeproxy", link: "https://t.me/kibeproxy", color: "#0088cc" },
                    { label: "Call Me", sub: "+254 799...", link: "tel:+254799289214", color: C.gold },
                    { label: "SMS", sub: "Text message", link: "sms:+254799289214", color: C.blue },
                  ].map((c) => (
                    <a key={c.label} href={c.link} target="_blank" rel="noreferrer" style={styles.quickContactCard} className="quick-btn">
                      <div style={{ ...styles.quickContactDot, background: c.color }} />
                      <div>
                        <div style={styles.quickContactLabel}>{c.label}</div>
                        <div style={styles.quickContactSub}>{c.sub}</div>
                      </div>
                    </a>
                  ))}
                </div>
                <div style={styles.contactSocials}>
                  <a href="https://github.com/billgatesmalel" target="_blank" rel="noreferrer" style={styles.contactSocialBtn}>GitHub</a>
                  <a href="https://github.com/billgatesmalel" target="_blank" rel="noreferrer" style={styles.contactSocialBtn}>LinkedIn</a>
                  <a href="https://t.me/kibeproxy" target="_blank" rel="noreferrer" style={styles.contactSocialBtn}>Telegram</a>
                  <a href="https://x.com/riggychii" target="_blank" rel="noreferrer" style={styles.contactSocialBtn}>Twitter</a>
                </div>
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              {sent ? (
                <div style={styles.sentBox}>
                  <div style={styles.sentIcon}>✓</div>
                  <h3 style={styles.sentTitle}>Message Received</h3>
                  <p style={styles.sentText}>Thanks for reaching out. I'll be in touch within 24 hours.</p>
                </div>
              ) : (
                <div style={styles.contactForm}>
                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>Name</label>
                    <input
                      style={styles.formInput}
                      placeholder="Your full name"
                      value={formState.name}
                      onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>Email</label>
                    <input
                      style={styles.formInput}
                      placeholder="your@email.com"
                      value={formState.email}
                      onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <div style={styles.formRow}>
                    <label style={styles.formLabel}>Message</label>
                    <textarea
                      style={{ ...styles.formInput, ...styles.formTextarea }}
                      placeholder="Tell me about the project or role..."
                      value={formState.message}
                      onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                      className="form-input"
                    />
                  </div>
                  <button style={styles.formSubmit} onClick={handleSubmit} className="submit-btn">
                    Send Message →
                  </button>
                </div>
              )}
            </FadeIn>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={styles.footer}>
        <div style={styles.footerInner}>
          <span style={styles.footerLogo}><span style={styles.logoAccent}>I</span>K</span>
          <p style={styles.footerText}>© 2026 Ian Kibet · Built with React</p>
          <p style={styles.footerText}>Bomet, Kenya</p>
        </div>
      </footer>
    </div>
  );
}

/* ─── STYLES ─────────────────────────────────────────────── */
const C = {
  navy: "#0D1B2A",
  navyMid: "#132236",
  navyLight: "#1E3450",
  gold: "#C9A84C",
  goldLight: "#E8C96A",
  blue: "#6B9FD4",
  cream: "#F7F6F3",
  white: "#FEFEFE",
  text: "#1A1A2E",
  textMuted: "#6B7280",
  textLight: "#9CA3AF",
  border: "#E5E0D8",
};

const styles = {
  root: {
    fontFamily: "'Outfit', 'Segoe UI', sans-serif",
    background: C.white,
    color: C.text,
    overflowX: "hidden",
  },
  // NAV
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100,
    transition: "all 0.3s ease",
    background: "transparent",
  },
  navScrolled: {
    background: "rgba(13,27,42,0.97)",
    backdropFilter: "blur(12px)",
    boxShadow: "0 1px 0 rgba(201,168,76,0.2)",
  },
  navInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 2rem",
    height: 68,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: "1.5rem",
    fontWeight: 800,
    color: C.white,
    letterSpacing: "-0.02em",
    fontFamily: "'Playfair Display', Georgia, serif",
  },
  logoAccent: { color: C.gold },
  navLinks: { display: "flex", alignItems: "center", gap: "0.25rem" },
  navLink: {
    background: "none",
    border: "none",
    color: "rgba(232,228,220,0.7)",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "0.5rem 0.875rem",
    cursor: "pointer",
    borderRadius: 4,
    letterSpacing: "0.02em",
    transition: "color 0.2s",
    fontFamily: "'Outfit', sans-serif",
  },
  navLinkActive: { color: C.gold },
  navCta: {
    background: C.gold,
    border: "none",
    color: C.navy,
    fontSize: "0.875rem",
    fontWeight: 700,
    padding: "0.5rem 1.25rem",
    borderRadius: 4,
    cursor: "pointer",
    marginLeft: "0.75rem",
    letterSpacing: "0.02em",
    fontFamily: "'Outfit', sans-serif",
    transition: "background 0.2s",
  },
  burger: {
    display: "none",
    flexDirection: "column",
    gap: 5,
    background: "none",
    border: "none",
    cursor: "pointer",
    padding: 8,
  },
  burgerLine: {
    display: "block",
    width: 24,
    height: 2,
    background: C.white,
    borderRadius: 2,
    transition: "all 0.3s",
  },
  burgerLine1Open: { transform: "translateY(7px) rotate(45deg)" },
  burgerLine3Open: { transform: "translateY(-7px) rotate(-45deg)" },
  mobileMenu: {
    background: C.navy,
    padding: "1rem 2rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    gap: "0.25rem",
  },
  mobileLink: {
    background: "none",
    border: "none",
    color: "rgba(232,228,220,0.85)",
    fontSize: "1rem",
    fontWeight: 500,
    padding: "0.625rem 0",
    cursor: "pointer",
    textAlign: "left",
    fontFamily: "'Outfit', sans-serif",
    borderBottom: `1px solid rgba(255,255,255,0.06)`,
  },
  // HERO
  hero: {
    minHeight: "100vh",
    background: C.navy,
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    position: "relative",
    overflow: "hidden",
    paddingTop: 68,
  },
  heroBg: {
    position: "absolute",
    inset: 0,
    background: `radial-gradient(ellipse 70% 60% at 80% 50%, #1E3450 0%, transparent 70%),
                 radial-gradient(ellipse 40% 40% at 15% 80%, rgba(201,168,76,0.08) 0%, transparent 60%)`,
  },
  heroGrid: { position: "absolute", inset: 0, pointerEvents: "none" },
  heroGridLine: {
    position: "absolute",
    top: 0,
    bottom: 0,
    width: 1,
    background: "rgba(255,255,255,0.03)",
  },
  heroContent: {
    position: "relative",
    maxWidth: 1200,
    margin: "0 auto",
    padding: "4rem 2rem 2rem",
    width: "100%",
  },
  heroEyebrow: {
    color: C.gold,
    fontSize: "0.8rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    display: "flex",
    alignItems: "center",
    gap: "0.5rem",
    marginBottom: "1.5rem",
  },
  eyebrowDot: {
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: C.gold,
    display: "inline-block",
  },
  heroName: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(3.5rem, 9vw, 7.5rem)",
    fontWeight: 800,
    color: C.white,
    lineHeight: 0.9,
    letterSpacing: "-0.03em",
    margin: "0 0 2rem",
  },
  heroNameAccent: { color: C.gold, fontStyle: "italic" },
  heroTagline: {
    color: "rgba(232,228,220,0.65)",
    fontSize: "clamp(1rem, 2vw, 1.2rem)",
    lineHeight: 1.6,
    maxWidth: 520,
    marginBottom: "2.5rem",
    fontWeight: 300,
  },
  heroActions: { display: "flex", gap: "1rem", flexWrap: "wrap" },
  heroPrimary: {
    background: C.gold,
    color: C.navy,
    border: "none",
    padding: "0.875rem 2rem",
    borderRadius: 4,
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
    fontFamily: "'Outfit', sans-serif",
    transition: "background 0.2s, transform 0.15s",
  },
  heroSecondary: {
    background: "transparent",
    color: C.white,
    border: `1px solid rgba(232,228,220,0.25)`,
    padding: "0.875rem 2rem",
    borderRadius: 4,
    fontSize: "0.9rem",
    fontWeight: 500,
    cursor: "pointer",
    letterSpacing: "0.04em",
    fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s",
  },
  heroStats: {
    position: "relative",
    display: "flex",
    gap: 0,
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 2rem",
    borderTop: `1px solid rgba(255,255,255,0.07)`,
    marginTop: "3rem",
  },
  heroStat: {
    flex: 1,
    padding: "1.75rem 0",
    borderRight: `1px solid rgba(255,255,255,0.07)`,
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    paddingLeft: "2rem",
  },
  heroStatNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "2rem",
    fontWeight: 700,
    color: C.gold,
    lineHeight: 1,
  },
  heroStatLabel: {
    fontSize: "0.75rem",
    color: "rgba(232,228,220,0.45)",
    letterSpacing: "0.08em",
    textTransform: "uppercase",
  },
  scrollIndicator: {
    position: "absolute",
    bottom: 24,
    left: "50%",
    transform: "translateX(-50%)",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  scrollLine: {
    width: 1,
    height: 40,
    background: `linear-gradient(to bottom, ${C.gold}, transparent)`,
    animation: "scrollPulse 2s ease-in-out infinite",
  },
  scrollText: {
    color: "rgba(232,228,220,0.3)",
    fontSize: "0.65rem",
    letterSpacing: "0.15em",
    textTransform: "uppercase",
  },
  // SECTIONS
  section: {
    padding: "6rem 0",
    background: C.white,
  },
  container: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 2rem",
  },
  sectionLabel: {
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: C.gold,
    marginBottom: "1rem",
  },
  labelLine: {
    display: "inline-block",
    width: 28,
    height: 2,
    background: C.gold,
    borderRadius: 1,
  },
  sectionHeading: {
    fontFamily: "'Playfair Display', Georgia, serif",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 700,
    color: C.text,
    letterSpacing: "-0.02em",
    marginBottom: "3rem",
    lineHeight: 1.1,
  },
  // ABOUT
  aboutGrid: {
    display: "grid",
    gridTemplateColumns: "340px 1fr",
    gap: "3rem",
    alignItems: "start",
  },
  aboutCard: {
    background: C.navy,
    borderRadius: 12,
    padding: "2.5rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "1.5rem",
    textAlign: "center",
  },
  avatarRing: {
    width: 96,
    height: 96,
    borderRadius: "50%",
    border: `2px solid ${C.gold}`,
    padding: 4,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  avatar: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
    background: `linear-gradient(135deg, ${C.navyLight}, ${C.gold}33)`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.5rem",
    fontWeight: 700,
    color: C.gold,
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
    borderRadius: "50%",
  },
  aboutCardInfo: { display: "flex", flexDirection: "column", gap: "0.25rem" },
  aboutName: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: C.white,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "0.4rem",
    margin: 0,
  },
  verifiedBadge: {
    width: 18,
    height: 18,
    fill: "#1D9BF0",
  },
  aboutTitle: { fontSize: "0.85rem", color: C.blue, fontWeight: 500, margin: 0 },
  aboutLocation: { fontSize: "0.8rem", color: "rgba(232,228,220,0.4)", margin: "0.25rem 0 0" },
  contactSocials: { display: "flex", gap: "0.5rem", marginTop: "1.5rem", flexWrap: "wrap" },
  contactSocialBtn: {
    padding: "0.4rem 0.8rem",
    borderRadius: 4,
    border: `1px solid ${C.border}`,
    color: C.textMuted,
    fontSize: "0.75rem",
    fontWeight: 600,
    textDecoration: "none",
    transition: "all 0.2s",
  },
  quickContactGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.75rem",
    marginTop: "1.5rem",
    marginBottom: "1.5rem",
  },
  quickContactCard: {
    background: "#F9F9FB",
    border: `1px solid rgba(13, 27, 42, 0.08)`,
    borderRadius: 8,
    padding: "0.875rem",
    display: "flex",
    alignItems: "center",
    gap: "0.75rem",
    textDecoration: "none",
    transition: "transform 0.2s, background 0.2s",
  },
  quickContactDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
  },
  quickContactLabel: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: C.navy,
    lineHeight: 1.2,
  },
  quickContactSub: {
    fontSize: "0.7rem",
    color: C.textMuted,
    marginTop: "0.1rem",
  },
  aboutSocials: { display: "flex", gap: "0.5rem", marginTop: "0.75rem", justifyContent: "center" },
  socialBtn: {
    color: "rgba(232,228,220,0.55)",
    fontSize: "0.75rem",
    fontWeight: 600,
    padding: "0.3rem 0.75rem",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: 4,
    textDecoration: "none",
    letterSpacing: "0.04em",
    transition: "color 0.2s, border-color 0.2s",
  },
  aboutText: { paddingTop: "0.5rem" },
  aboutHeading: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.6rem",
    fontWeight: 700,
    color: C.text,
    marginBottom: "1rem",
    lineHeight: 1.2,
  },
  aboutParagraph: {
    color: C.textMuted,
    lineHeight: 1.75,
    marginBottom: "1rem",
    fontSize: "0.95rem",
  },
  aboutPillsRow: { display: "flex", flexWrap: "wrap", gap: "0.5rem", marginTop: "1.5rem" },
  pill: {
    background: C.cream,
    color: C.textMuted,
    fontSize: "0.78rem",
    fontWeight: 600,
    padding: "0.35rem 0.85rem",
    borderRadius: 20,
    letterSpacing: "0.03em",
    border: `1px solid ${C.border}`,
  },
  // SKILLS
  skillsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
    gap: "1.5rem",
  },
  skillGroup: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 10,
    padding: "1.75rem",
    transition: "border-color 0.2s, box-shadow 0.2s",
  },
  skillGroupHeader: { display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "1.25rem" },
  skillGroupNum: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "0.85rem",
    fontWeight: 700,
    color: C.gold,
    opacity: 0.7,
  },
  skillGroupTitle: {
    fontSize: "0.85rem",
    fontWeight: 700,
    color: C.text,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    margin: 0,
  },
  skillTags: { display: "flex", flexWrap: "wrap", gap: "0.5rem" },
  skillTag: {
    background: C.cream,
    color: C.text,
    fontSize: "0.8rem",
    fontWeight: 500,
    padding: "0.35rem 0.75rem",
    borderRadius: 4,
    border: `1px solid ${C.border}`,
  },
  // PROJECTS
  projectsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
    gap: "1.5rem",
  },
  projectCard: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 12,
    padding: "2rem",
    position: "relative",
    overflow: "hidden",
    transition: "transform 0.25s, box-shadow 0.25s",
    cursor: "default",
  },
  projectTop: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: "1.25rem",
  },
  projectMeta: { display: "flex", flexDirection: "column", gap: "0.25rem" },
  projectType: { fontSize: "0.72rem", fontWeight: 700, color: C.textMuted, letterSpacing: "0.08em", textTransform: "uppercase" },
  projectYear: { fontSize: "0.72rem", color: C.textLight },
  projectMetric: { fontSize: "0.8rem", fontWeight: 700, letterSpacing: "0.03em" },
  projectTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.3rem",
    fontWeight: 700,
    color: C.text,
    marginBottom: "0.875rem",
    lineHeight: 1.2,
  },
  projectDesc: {
    color: C.textMuted,
    fontSize: "0.875rem",
    lineHeight: 1.7,
    marginBottom: "1.5rem",
  },
  projectTagsRow: { display: "flex", flexWrap: "wrap", gap: "0.4rem" },
  projectTag: {
    fontSize: "0.72rem",
    fontWeight: 600,
    padding: "0.25rem 0.6rem",
    borderRadius: 4,
    border: "1px solid",
    letterSpacing: "0.04em",
  },
  projectAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    opacity: 0.6,
  },
  // EXPERIENCE
  timeline: { display: "flex", flexDirection: "column", gap: 0 },
  timelineItem: { display: "flex", gap: "1.5rem" },
  timelineDotCol: { display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0 },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: "50%",
    background: C.gold,
    border: `2px solid ${C.navyLight}`,
    marginTop: "0.4rem",
    flexShrink: 0,
  },
  timelineConnector: {
    width: 1,
    flex: 1,
    background: "rgba(255,255,255,0.1)",
    margin: "6px 0",
    minHeight: 32,
  },
  timelineContent: {
    paddingBottom: "2.5rem",
    flex: 1,
  },
  timelineHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "1rem",
    marginBottom: "0.75rem",
    flexWrap: "wrap",
  },
  timelineRole: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.2rem",
    fontWeight: 700,
    color: "#E8E4DC",
    margin: 0,
  },
  timelineCompany: { fontSize: "0.85rem", color: C.blue, margin: "0.2rem 0 0", fontWeight: 500 },
  timelinePeriod: {
    fontSize: "0.75rem",
    color: "rgba(232,228,220,0.35)",
    fontWeight: 600,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    flexShrink: 0,
  },
  timelineDesc: {
    color: "rgba(232,228,220,0.55)",
    fontSize: "0.9rem",
    lineHeight: 1.7,
    margin: 0,
  },
  // CONTACT
  contactIntro: {
    color: C.textMuted,
    fontSize: "1rem",
    lineHeight: 1.7,
    maxWidth: 560,
    marginBottom: "3rem",
    marginTop: "-1.5rem",
  },
  contactGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1.4fr",
    gap: "3rem",
    alignItems: "start",
  },
  contactInfo: { display: "flex", flexDirection: "column", gap: "1.5rem" },
  contactInfoRow: {
    display: "flex",
    flexDirection: "column",
    gap: "0.2rem",
    paddingBottom: "1.5rem",
    borderBottom: `1px solid ${C.border}`,
  },
  contactInfoLabel: {
    fontSize: "0.7rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: C.textLight,
  },
  contactInfoValue: { fontSize: "0.95rem", color: C.text, fontWeight: 500 },

  contactForm: {
    background: C.cream,
    borderRadius: 12,
    padding: "2rem",
    display: "flex",
    flexDirection: "column",
    gap: "1.25rem",
  },
  formRow: { display: "flex", flexDirection: "column", gap: "0.5rem" },
  formLabel: {
    fontSize: "0.72rem",
    fontWeight: 700,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
    color: C.textMuted,
  },
  formInput: {
    background: C.white,
    border: `1px solid ${C.border}`,
    borderRadius: 6,
    padding: "0.75rem 1rem",
    fontSize: "0.9rem",
    color: C.text,
    outline: "none",
    fontFamily: "'Outfit', sans-serif",
    transition: "border-color 0.2s",
    width: "100%",
    boxSizing: "border-box",
  },
  formTextarea: { minHeight: 110, resize: "vertical" },
  formSubmit: {
    background: C.navy,
    color: C.gold,
    border: "none",
    borderRadius: 6,
    padding: "0.875rem 1.5rem",
    fontSize: "0.9rem",
    fontWeight: 700,
    cursor: "pointer",
    letterSpacing: "0.04em",
    fontFamily: "'Outfit', sans-serif",
    transition: "background 0.2s",
    alignSelf: "flex-end",
  },
  sentBox: {
    background: C.cream,
    borderRadius: 12,
    padding: "3rem 2rem",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "0.75rem",
    textAlign: "center",
  },
  sentIcon: {
    width: 52,
    height: 52,
    borderRadius: "50%",
    background: "#E8F5EF",
    color: "#2D7A55",
    fontSize: "1.25rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: 700,
  },
  sentTitle: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.25rem",
    fontWeight: 700,
    color: C.text,
    margin: 0,
  },
  sentText: { color: C.textMuted, fontSize: "0.9rem", margin: 0 },
  // FOOTER
  footer: {
    background: C.navy,
    borderTop: `1px solid rgba(255,255,255,0.06)`,
    padding: "2rem 0",
  },
  footerInner: {
    maxWidth: 1200,
    margin: "0 auto",
    padding: "0 2rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "1rem",
    flexWrap: "wrap",
  },
  footerLogo: {
    fontFamily: "'Playfair Display', serif",
    fontSize: "1.25rem",
    fontWeight: 800,
    color: C.white,
  },
  footerText: { color: "rgba(232,228,220,0.35)", fontSize: "0.8rem", margin: 0 },
};

/* ─── CSS ─────────────────────────────────────────────────── */
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700;800&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  .slide-up { animation: slideUp 0.8s ease forwards; opacity: 0; }
  .delay-1 { animation-delay: 0.15s; }
  .delay-2 { animation-delay: 0.3s; }
  .delay-3 { animation-delay: 0.45s; }
  .delay-4 { animation-delay: 0.6s; }

  @keyframes slideUp {
    from { opacity: 0; transform: translateY(32px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes scrollPulse {
    0%, 100% { opacity: 0.4; transform: scaleY(1); }
    50%       { opacity: 1;   transform: scaleY(1.15); }
  }

  .project-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 16px 40px rgba(0,0,0,0.08);
  }

  .form-input:focus {
    border-color: #C9A84C !important;
    box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
  }

  .submit-btn:hover { background: #1E3450 !important; }

  @media (max-width: 900px) {
    .aboutGrid { grid-template-columns: 1fr !important; }
    .contactGrid { grid-template-columns: 1fr !important; }
    .navLinks { display: none !important; }
    .burger { display: flex !important; }
  }

  @media (max-width: 600px) {
    .hide-sm { display: none; }
    .heroStats { flex-wrap: wrap; }
  }
`;