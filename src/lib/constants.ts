export const VOLUNTEER_UNITS = [
  "Organization & Reg",
  "Publicity & Media",
  "Logistics & Transport",
  "Technical & Sound",
  "Welfare & Care",
  "Master of Ceremonies (MC)",
  "Other Special Skills",
] as const;

export const AFRICAN_COUNTRIES = [
  "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon", "Central African Republic", "Chad", "Comoros", "Republic of the Congo", "Democratic Republic of the Congo", "Côte d’Ivoire", "Djibouti", "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "The Gambia", "Ghana", "Guinea", "Guinea-Bissau", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali", "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe", "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania", "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe",
] as const;

export const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "Federal Capital Territory",
] as const;
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
  { icon: "menu_book", title: "Boys' Education", body: "Helping boys understand menstrual health and take part in building respectful, supportive schools." },
] as const;

export const SPONSOR_TIERS = [
  { girls: 1, label: "Sponsors 1 girl for 3 full months with sanitary pads & self-care booklet." },
  { girls: 3, label: "Sponsors 3 girls with complete kits + reproductive health workbook.", popular: true },
  { girls: 10, label: "Full school club kit + community reproductive health workshop." },
] as const;
