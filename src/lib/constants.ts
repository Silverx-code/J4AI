export const VOLUNTEER_UNITS = [
  "Organization & Reg",
  "Publicity & Media",
  "Logistics & Transport",
  "Technical & Sound",
  "Welfare & Care",
  "Master of Ceremonies (MC)",
  "Other Special Skills",
] as const;

export const LOCATIONS = ["Borno State", "Lagos State", "FCT Abuja", "Other State"] as const;
export const AVAILABILITY = ["Full event", "Day 1 only", "Day 2 only", "Remote support"] as const;

export const NAV = [
  { href: "/", label: "Home", icon: "home" },
  { href: "/editions", label: "Editions", icon: "auto_stories" },
  { href: "/impact", label: "Impact", icon: "insights" },
  { href: "/get-involved", label: "Involved", icon: "volunteer_activism" },
  { href: "/news", label: "News", icon: "campaign" },
] as const;

export const PILLARS = [
  { icon: "inventory_2", title: "Dignity Kit Distribution", body: "Direct provision of pads, soap, and hygiene manuals straight to students." },
  { icon: "school", title: "Health & Stigma Workshops", body: "Interactive peer-led education dismantling fear, isolation, and shame." },
  { icon: "campaign", title: "Policy & Community Advocacy", body: "Collaborating with educators, community elders, and state leadership." },
] as const;

export const SPONSOR_TIERS = [
  { girls: 1, label: "Sponsors 1 girl for 3 full months with sanitary pads & self-care booklet." },
  { girls: 3, label: "Sponsors 3 girls with complete kits + reproductive health workbook.", popular: true },
  { girls: 10, label: "Full school club kit + community reproductive health workshop." },
] as const;
