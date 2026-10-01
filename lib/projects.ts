export type ProjectStatus = "live" | "prototype" | "in-development" | "concept";

export const statusLabel: Record<ProjectStatus, string> = {
  live: "Live",
  prototype: "Prototype ready",
  "in-development": "In development",
  concept: "Concept",
};

export interface FlagshipProject {
  slug: string;
  name: string;
  oneLiner: string;
  status: ProjectStatus;
  hasCaseStudy: boolean;
  /** A drawn stand-in for projects that can't show real screens yet. Takes priority over `image`. */
  visual?: "csn-network";
  /** Panel visual under public/, e.g. "/images/work/csn.png". Falls back to a placeholder. */
  image?: string;
}

export interface MoreWorkProject {
  slug: string;
  name: string;
  oneLiner: string;
  /** Omitted for private repos; the row then renders without a link. */
  githubUrl?: string;
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
    visual: "csn-network",
  },
  {
    slug: "agentnegotiate",
    name: "AgentNegotiate",
    oneLiner:
      "A simulation prototype where two AI agents negotiate a B2B purchase inside hard budget and price-floor limits, with a hash-chained audit trail.",
    status: "prototype",
    hasCaseStudy: true,
    image: "/images/work/agentNegotiate2.png",
  },
  {
    slug: "flavoland",
    name: "Flavoland",
    oneLiner:
      "Bringing authentic regional foods from Tamil Nadu to kitchens across India — starting nationally, with international markets to follow.",
    status: "in-development",
    hasCaseStudy: false,
    image: "/images/work/flavolandTempLandingPage.png",
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
    githubUrl: "https://github.com/nideshkaarthikrs/ShipToScale-PureLogic",
  },
  {
    slug: "apex-camino",
    name: "Apex Camino",
    oneLiner: "AI workout coach: tap to log sets, get the next session planned for you.",
  },
  {
    slug: "receipt",
    name: "Receipt",
    oneLiner: "Tamper-evident proof-of-work logs for freelancers, built on a hash chain.",
    githubUrl: "https://github.com/nideshkaarthikrs/receipt-end-term-project",
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
      "Sourcing authentic regional foods from Tamil Nadu — launching across India first, with international markets planned for later.",
    tag: "Early stage",
  },
];

export const shippedFor = ["SKV Pharma", "PharmaCubes", "Skipmer", "Homeopathy clinic"];

export const socialLinks = {
  linkedin: "https://linkedin.com/in/nidesh-kaarthik-r-s-6bb535362",
  github: "https://github.com/nideshkaarthikrs",
  instagram: "https://instagram.com/nidesh_kaarthik_",
  email: "mailto:rs.nideshkaarthik@gmail.com",
  bookACall: "https://cal.com/nideshkaarthikrs/15min",
};
