export const profile = {
  name: "Dinesh Karthick Durgadas",
  firstName: "DINESH",
  lastName: "KARTHICK",
  title: "Full-Stack Developer",
  tagline: "WEB · DESKTOP · MOBILE · CLOUD",
  location: "Palani, Tamil Nadu, India",
  quote: "Clean code is my weapon.",
  bio:
    "Hey, I'm Dinesh Karthick — a Full-Stack Developer at Codunt Technologies. I build complete applications end to end: React & TypeScript frontends, .NET and Node.js backends, desktop apps with Electron, mobile apps with Flutter — secured with Azure B2C & Microsoft Entra ID and shipped to Azure, Firebase and Vercel. Away from the code, I edit videos, design in Photoshop and build 3D in Blender.",
  infoCards: [
    { label: "ROLE", value: "Software Engineer @ Codunt Technologies" },
    { label: "LOCATION", value: "Palani, Tamil Nadu, India" },
    { label: "STATUS", value: "Pursuing MCA · Bharathiar University" },
  ],
  currentQuest: "AI & Machine Learning",
};

export const graduationDate = "2028-05-31T00:00:00+05:30";

export const skills = [
  { tree: "Frontend", level: 90, tools: ["React (JSX / TSX)", "TypeScript", "JavaScript", "HTML5", "CSS3", "Responsive UI", "Component-Based Development"] },
  { tree: "Backend", level: 88, tools: [".NET 6–10", "ASP.NET", "C#", "Entity Framework Core", "Node.js", "REST APIs", "Docker"] },
  { tree: "Databases", level: 85, tools: ["SQL Server (DBA)", "PostgreSQL", "MySQL", "SQLite", "Oracle Database", "Firebase DB", "Supabase DB"] },
  { tree: "Auth & Security", level: 85, tools: ["Microsoft Entra ID", "Azure AD", "Azure B2C", "SPA Authentication", "Tenant Permissions", "Login Workflows"] },
  { tree: "Cloud", level: 80, tools: ["Microsoft Azure", "Oracle Cloud (OCI)", "AWS", "Firebase", "Supabase"] },
  { tree: "Hosting", level: 85, tools: ["Vercel", "Azure Deployment", "Firebase Hosting"] },
  { tree: "DevOps & Tools", level: 82, tools: ["Git", "GitHub", "Visual Studio", "VS Code", "PowerShell", "Build & Deployment"] },
  { tree: "Desktop & Mobile", level: 75, tools: ["Electron.js", "Windows EXE Apps", "Flutter", "Dart"] },
  { tree: "Creative", level: 78, tools: ["Photoshop", "Premiere Pro", "After Effects", "Blender", "Figma", "Canva"] },
] as const;

export type SkillTree = typeof skills[number]['tree'];

export function computeDuration(startDateStr: string): string {
  const start = new Date(startDateStr);
  const now = new Date();

  let years = now.getFullYear() - start.getFullYear();
  let months = now.getMonth() - start.getMonth();

  if (now.getDate() < start.getDate()) {
    months--;
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  const yrStr = years > 0 ? `${years} ${years === 1 ? 'yr' : 'yrs'}` : '';
  const moStr = months > 0 ? `${months} ${months === 1 ? 'mo' : 'mos'}` : '';

  if (yrStr && moStr) return `${yrStr} ${moStr}`;
  if (yrStr) return yrStr;
  if (moStr) return moStr;
  return '1 mo';
}

export const extraLanguages = ["C#", "TypeScript", "JavaScript", "Dart", "SQL", "Python", "PHP", "C"];

export const projects = [
  {
    id: "alangaram",
    name: "Alangaram Imitation Jewellery",
    oneLiner: "Elegant online store for an imitation jewellery brand.",
    description:
      "A full e-commerce storefront with an editorial, luxury look — featured collections, wishlist, cart, online payments through Razorpay and quick ordering over WhatsApp, with smooth-scroll animations and a Firebase backend.",
    tech: ["React", "Vite", "Tailwind CSS", "React Router", "Firebase", "Razorpay", "Lenis"],
    live: "https://alangaramimitationjewellery.vercel.app/",
    image: "/projects/alangaram-desktop.webp",
    imageMobile: "/projects/alangaram-mobile.webp",
    classified: false,
  },
  {
    id: "kailash-ghee",
    name: "Kailash Ghee",
    oneLiner: "E-commerce site for a premium A2 cow ghee brand from Oddanchatram.",
    description:
      "Product catalogue with multiple pack sizes and prices, cart, checkout via UPI or cash on delivery, Tamil / English language switch, WhatsApp ordering and delivery across Tamil Nadu — animated with Framer Motion.",
    tech: ["React", "Vite", "Tailwind CSS", "Framer Motion", "React Router", "Firebase"],
    live: "https://kailash-ghee.vercel.app/",
    image: "/projects/kailash-ghee-desktop.webp",
    imageMobile: "/projects/kailash-ghee-mobile.webp",
    classified: false,
  },
  {
    id: "dharmar-mahal",
    name: "Dharmar Mahal Invoice",
    oneLiner: "Secure invoice generator for the Dharmar Mahal event hall.",
    description:
      "A private, login-protected invoicing system built for the Dharmar Mahal event hall — secure staff access and invoice generation.",
    tech: ["React", "jsPDF"],
    live: "https://dharmar-mahal-invoice.vercel.app/",
    image: "/projects/dharmar-mahal-invoice-desktop.webp",
    imageMobile: "/projects/dharmar-mahal-invoice-mobile.webp",
    classified: true,
  },
  {
    id: "aalam-studio",
    name: "Aalam Studio",
    oneLiner: "Website for a premium photography & videography studio in Palani.",
    description:
      "Showcases the studio's services — wedding, candid, drone, 360° video, live streaming, LED projection and post-production — with a gallery, studio stats and \"Book Your Date\" calls to action.",
    tech: ["React", "Vite", "Tailwind CSS", "React Router"],
    live: "https://aalam-studio.vercel.app/",
    image: "/projects/aalam-studio-desktop.webp",
    imageMobile: "/projects/aalam-studio-mobile.webp",
    classified: false,
  },
];

export const experience = [
  {
    role: "Software Engineer",
    company: "Codunt Technologies",
    start: "2024-12-01",
    end: null, // present — duration computed live
    points: [
      "Build modern web applications with React.js and scalable backends with ASP.NET / .NET and C#",
      "Design and integrate REST APIs backed by SQL Server, PostgreSQL and Firebase",
      "Solve complex problems with clean, maintainable code focused on reliable, user-friendly software",
    ],
  },
];

export const ownWords =
  "I am a React.js and .NET Developer with experience in building modern web applications and scalable backend solutions. I enjoy solving complex problems, writing clean and maintainable code, and continuously learning new technologies. I am passionate about delivering high-quality software and am currently expanding my expertise in AI and Machine Learning while seeking opportunities to contribute to innovative development teams.";

import certData from './certificates.json';

export type Tier = "gold" | "silver" | "bronze";
export interface Certificate {
  title: string;
  issuer: string;
  date: string;
  tier: Tier;
  preview: string;
  srcName?: string;
  verify?: string;
}

export const certificates: Certificate[] = certData as Certificate[];

export const education = [
  { degree: "MCA — Master of Computer Applications", institution: "Bharathiar University", years: "2026 – 2028", inProgress: true },
  { degree: "B.Sc Computer Science", institution: "Arulmigu Palaniandavar College of Arts and Culture", years: "2022 – 2025", inProgress: false },
];

export const contact = {
  email: "dineshkarthick1610@gmail.com",
  whatsapp: "https://wa.me/917010857596",
  phoneTel: "tel:+917010857596",
  linkedin: "https://www.linkedin.com/in/dinesh-karthick-durgadas-94a920295",
  github: "https://github.com/dineshkarthickd",
  instagram: "https://www.instagram.com/dinesh.durgadas/",
  location: "Palani, Tamil Nadu, India",
};
