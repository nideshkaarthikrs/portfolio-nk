export type ProjectStatus = "live" | "in-development" | "concept";

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  "in-development": "In development",
  concept: "Concept",
};

export interface FlagshipProject {
  slug: string;
  name: string;
  oneLiner: string;
  status: ProjectStatus;
  hasCaseStudy: boolean;
}

export interface MoreWorkProject {
  slug: string;
  name: string;
  oneLiner: string;
  githubUrl: string;
}

export interface ClientProject {
  slug: string;
  name: string;
  summary: string;
  siteUrl: string;
  siteLabel?: string;
  additionalSites?: { label: string; url: string }[];
  screenshot?: string;
}

export interface Venture {
  slug: string;
  name: string;
  role: string;
  description: string;
  tag: string;
}

export const flagshipProjects: FlagshipProject[] = [
  {
    slug: "csn",
    name: "CSN (Creative Sync Network)",
    oneLiner: "A platform for creators to co-produce and split revenue — currently in research and building.",
    status: "in-development",
    hasCaseStudy: false,
  },
  {
    slug: "agentnegotiate",
    name: "AgentNegotiate",
    oneLiner:
      "AI agents that negotiate B2B purchases for you, within spend limits and merchant policies, with a full audit trail and payment settlement.",
    status: "in-development",
    hasCaseStudy: true,
  },
  {
    slug: "agentarena",
    name: "AgentArena",
    oneLiner:
      "Blind head-to-head arena where AI video agents compete on prompt bounties and humans vote, producing a public Elo leaderboard.",
    status: "in-development",
    hasCaseStudy: false,
  },
];

export const moreWorkProjects: MoreWorkProject[] = [
  {
    slug: "promptshield",
    name: "PromptShield",
    oneLiner: "An RL environment for training and evaluating prompt-injection detectors.",
    githubUrl: "https://github.com/nideshkaarthikrs/PromptShield",
  },
  {
    slug: "disaster-relief-logistics-coordinator",
    name: "Disaster Relief Logistics Coordinator",
    oneLiner:
      "An OpenEnv-style disaster-response simulation where LLM agents deploy trucks, medical teams, and rescue units across a FastAPI-driven environment.",
    githubUrl: "https://github.com/nideshkaarthikrs/DisasterReliefLogisticsCoordinator",
  },
  {
    slug: "civiclens",
    name: "CivicLens",
    oneLiner: "AI document intelligence for Indian legal and regulatory documents.",
    githubUrl: "#",
  },
  {
    slug: "apex-camino",
    name: "Apex Camino",
    oneLiner: "AI workout coach: tap to log sets, get the next session planned for you.",
    githubUrl: "#",
  },
  {
    slug: "receipt",
    name: "Receipt",
    oneLiner: "Tamper-evident proof-of-work logs for freelancers, built on a hash chain.",
    githubUrl: "#",
  },
  {
    slug: "github-mcp-agent",
    name: "GitHub MCP Agent",
    oneLiner: "A Python MCP agent with scoped, read-only GitHub access.",
    githubUrl: "#",
  },
];

export const clientProjects: ClientProject[] = [
  {
    slug: "skv-pharma-group",
    name: "SKV Pharma, PharmaCubes & Skipmer",
    summary:
      "One design system, reskinned and deployed for three sister pharma brands under the same family — design, build, domain and deployment for each.",
    siteUrl: "https://skvpharma.co.in",
    siteLabel: "SKV Pharma",
    additionalSites: [
      { label: "PharmaCubes", url: "https://pharmacubes.co.in" },
      { label: "Skipmer", url: "https://skipmer.com" },
    ],
    screenshot: "/images/clients/pharma-family.png",
  },
  {
    slug: "homeopathy-clinic",
    name: "Vijaya Homeo Care",
    summary: "Design, build, domain and deployment for a homeopathy clinic's practice site.",
    siteUrl: "https://vijaya-homeo-care.netlify.app",
    screenshot: "/images/clients/homeopathy-clinic.png",
  },
];

export const ventures: Venture[] = [
  {
    slug: "csn",
    name: "CSN",
    role: "Co-founder",
    description: "Research and building stage, with a technical co-builder.",
    tag: "In development",
  },
  {
    slug: "flavoland",
    name: "Flavoland",
    role: "Founder",
    description:
      "Sourcing and exporting authentic regional foods from Tamil Nadu to international markets.",
    tag: "Early stage",
  },
];

export const shippedFor = ["SKV Pharma", "PharmaCubes", "Skipmer", "Homeopathy clinic"];

export const socialLinks = {
  linkedin: "https://linkedin.com/in/nidesh-kaarthik-r-s-6bb535362",
  github: "https://github.com/nideshkaarthikrs",
  instagram: "https://instagram.com/nidesh_kaarthik_",
  // TODO: real email and Cal.com booking link (spec Section 7).
  email: "mailto:hello@example.com",
  bookACall: "#",
};
