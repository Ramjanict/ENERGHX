export interface ClientProject {
  slug: string;
  title: string;
  tagline: string;
  category: string;
  status: "Ongoing" | "Completed" | "Upcoming";
  image: string;
  images?: string[];
  description: string;
  overview: string;
  developersNote: string;
  keyFeatures: string[];
  deliverables: string[];
  challenges: string[];
  futurePlans: string[];
  tags: string[];
  liveUrl: string;
  githubUrl: string;
  timeline: string;
  role: string;
  teamMembers: { name: string; role: string }[];
}

export const energhxProject: ClientProject = {
  slug: "energhx",
  title: "ENERGHX™ (EnerghxPlus)",
  tagline: "Net-Zero Energy Management & Clean-Tech Engineering SaaS",
  category: "CleanTech & Energy SaaS",
  status: "Completed",
  image:
    "https://raw.githubusercontent.com/Ramjanict/ENERGHX-/main/public/images/smart-energy-dashboard.jpg",
  images: [
    "https://raw.githubusercontent.com/Ramjanict/ENERGHX-/main/public/images/smart-energy-dashboard.jpg",
    "https://raw.githubusercontent.com/Ramjanict/ENERGHX-/main/public/images/netzero-green-building.jpg",
    "https://raw.githubusercontent.com/Ramjanict/ENERGHX-/main/public/images/renewable-microgrid-farm.jpg",
    "https://raw.githubusercontent.com/Ramjanict/ENERGHX-/main/public/images/ev-charging-hub.jpg",
    "https://raw.githubusercontent.com/Ramjanict/ENERGHX-/main/public/images/thermal-hvac-twin.jpg",
  ],
  description:
    "An enterprise clean-tech platform providing thermal comfort modeling, indoor air quality simulation, renewable microgrid sizing, and end-to-end net-zero energy management for sustainable built environments.",
  overview:
    "ENERGHX™ (EnerghxPlus) is a comprehensive web and SaaS platform engineered for energy transition professionals, architects, and facility managers. It bridges architectural building audits with complex renewable sizing engines (Solar PV, Wind, Biomass, BESS, and EV Charging), fluid thermal comfort simulations (PMV/PPD, IAQ), RES sequence validations, digital engineering contracts, and an integrated certified engineering Learning Management System (LMS).",
  developersNote:
    "Architected and developed the complete frontend ecosystem using React 19, TypeScript, and Vite with Tailwind CSS v4. Engineered complex multi-role authorization guards (Super Admin, Instructor, Basic Consumer, Standard Consumer, Server/Developer), integrated Redux Toolkit RTK Query state management with persistence, dynamic charting via Recharts, and automated client-side proposal/contract PDF generation with digital signature capture.",
  keyFeatures: [
    "Real-time smart energy dashboard tracking solar, wind, BESS battery storage, and net exporting",
    "Net-Zero Energy Building (NZEB) & Zero-Emission Vehicle (ZEV) transition simulations",
    "Thermal comfort modeling & Indoor Air Quality (IAQ) digital twin (CO2, PM2.5, TVOC, airflow)",
    "Granular building inventory, room zone management, and appliance duty-cycle auditing",
    "Automated sizing calculators for Solar PV arrays, Wind turbines, and Biomass systems",
    "Battery Energy Storage System (BESS) lifecycle modeling and dispatch schedule simulator",
    "Electric Vehicle (EV) charging station infrastructure planning and grid load optimization",
    "RES sequence validation and multi-tier engineering review approval matrix",
    "Digital proposal contracts with canvas signature capture and instant PDF export (jsPDF)",
    "Integrated Clean-Tech LMS with courses, modules, quizzes, and engineer certifications",
    "Multi-role RBAC for Super Admin, Instructors, Basic Consumers, Standard Consumers, and Servers",
  ],
  deliverables: [
    "Complete frontend architecture built with React 19, TypeScript, and Vite",
    "Multi-role layout system with dedicated dashboards for Admin, Consumer, and Server roles",
    "Full engineering simulation suite for NZEB, ZEV, FVM thermal comfort, and HVAC loads",
    "Digital contract proposal generator with automated checkout and PDF export",
    "Centralized state management using Redux Toolkit (RTK Query) and redux-persist",
    "Clean-Tech LMS platform supporting course catalogs, quizzes, and certificate issuance",
    "Production-ready deployment pipeline hosted on Vercel",
  ],
  challenges: [
    "Structuring complex multi-stage engineering calculation forms and state across sizing modules",
    "Handling high-performance real-time telemetry charts, airflow gradients, and simulation graphs",
    "Designing robust Role-Based Access Control (RBAC) protecting distinct portals across multiple personas",
    "Implementing accurate client-side PDF document generation and digital canvas signature binding",
  ],
  futurePlans: [
    "Live IoT sensor gateway integrations via WebSockets for real-time facility telemetry",
    "AI-driven predictive energy dispatch and HVAC load anomaly detection",
    "3D BIM (Building Information Modeling) file import and automated thermal envelope extraction",
    "Decentralized renewable energy carbon credit trading and blockchain verification",
  ],
  tags: [
    "React 19",
    "TypeScript",
    "Vite",
    "Tailwind CSS v4",
    "Redux Toolkit",
    "RTK Query",
    "Recharts",
    "Radix UI",
    "Framer Motion",
    "jsPDF",
    "CleanTech",
    "Net-Zero",
  ],
  liveUrl: "https://energhx.vercel.app/",
  githubUrl: "https://github.com/Ramjanict/ENERGHX-",
  timeline: "2025 - Present",
  role: "Frontend Engineer",
  teamMembers: [{ name: "Md Ramjan Ali", role: "Frontend Engineer" }],
};

export default energhxProject;
