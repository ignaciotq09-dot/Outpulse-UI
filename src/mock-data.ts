import type {
  User,
  ICP,
  Lead,
  Campaign,
  SearchHistoryEntry,
  Notification,
} from "@/types";

function hoursAgo(h: number): string {
  return new Date(Date.now() - h * 60 * 60 * 1000).toISOString();
}

function daysAgo(d: number): string {
  return new Date(Date.now() - d * 24 * 60 * 60 * 1000).toISOString();
}

function minutesAgo(m: number): string {
  return new Date(Date.now() - m * 60 * 1000).toISOString();
}

export const mockUser: User = {
  name: "Ignacio Torres",
  email: "ignacio@outpulse.com",
  company: "Outpulse",
  plan: "growth",
  usage: {
    leadsUsed: 324,
    leadsLimit: 500,
    searchesUsed: 12,
    searchesLimit: 50,
  },
};

export const mockICP: ICP = {
  id: "mock-icp-1",
  sourceUrl: "https://linear.app",
  sourceCompanyName: "Linear",
  companyDescription:
    "Linear is a modern project management tool built for software teams. It provides a streamlined interface for issue tracking, sprint planning, and product roadmaps, designed to replace bloated tools like Jira with a fast, keyboard-first experience that engineers actually want to use.",
  valueProposition:
    "Linear helps engineering teams ship faster by replacing slow, cluttered project management tools with an opinionated, beautifully designed workspace that feels native to how developers already work.",
  industry: ["B2B SaaS", "Developer Tools", "Project Management Software"],
  companySize: { min: 50, max: 2000 },
  targetTitles: [
    "Engineering Manager",
    "VP of Engineering",
    "Head of Product",
    "CTO",
    "Director of Engineering",
    "Staff Software Engineer",
    "Principal Engineer",
    "Chief Product Officer",
  ],
  seniorityLevels: ["Manager", "Director", "VP", "C-Suite"],
  geos: ["North America", "Western Europe", "United Kingdom", "Australia"],
  painPoints: [
    "Jira is too heavy and slow for engineering teams",
    "Project tracking fragmented across multiple tools",
    "Sprint planning takes hours instead of minutes",
    "Engineers resist using existing PM tools",
    "No single source of truth for product roadmap",
  ],
  techStack: [
    "React",
    "TypeScript",
    "Next.js",
    "Vercel",
    "PostgreSQL",
    "Slack",
    "GitHub",
    "Figma",
  ],
  triggers: [
    "Raised Series C in the last 6 months",
    "Posted engineering manager roles in the last 30 days",
    "CEO posted about developer productivity on LinkedIn in the last 2 weeks",
    "Recently migrated off Jira (mentioned in engineering blog)",
    "Launched new product line in the last quarter",
  ],
  exclusions: [
    "Companies under 20 employees",
    "Consulting agencies",
    "Non-tech enterprises",
  ],
  createdAt: hoursAgo(2),
};

export const mockLeads: Lead[] = [
  {
    id: "lead-1",
    icpId: "mock-icp-1",
    company: "Flowplane",
    companyDomain: "flowplane.io",
    contactName: "Marcus Chen",
    contactTitle: "VP of Engineering",
    contactLinkedIn: "https://linkedin.com/in/marcuschen",
    contactEmail: "marcus.chen@flowplane.io",
    emailStatus: "verified",
    score: 96,
    scoredAt: minutesAgo(30),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "VP-level", dimension: "seniorityLevels" },
      { label: "Uses React + TypeScript", dimension: "techStack" },
      { label: "Raised Series B last quarter", dimension: "triggers" },
      { label: "North America", dimension: "geos" },
    ],
    proofPack: {
      summary:
        "Flowplane is a Series B developer platform company that recently posted 4 engineering manager roles and moved off Jira per their engineering blog. The VP of Engineering is actively discussing project tracking pain points on LinkedIn.",
      dimensions: [
        {
          dimension: "industry",
          confidence: 95,
          reasoning:
            "Flowplane builds CI/CD tooling for mid-market engineering teams, squarely in the developer tools and B2B SaaS space.",
          sources: [
            {
              title: "Flowplane — Modern CI/CD for growing teams",
              url: "https://flowplane.io/about",
              snippet:
                "Flowplane helps engineering teams ship with confidence through intelligent CI/CD pipelines that learn from your codebase.",
            },
          ],
        },
        {
          dimension: "triggers",
          confidence: 92,
          reasoning:
            "Flowplane raised a $45M Series B in November 2025 and has posted 4 engineering manager roles in the last 3 weeks, signaling rapid team growth.",
          sources: [
            {
              title: "Flowplane raises $45M Series B to reimagine CI/CD",
              url: "https://techcrunch.com/2025/11/15/flowplane-series-b",
              snippet:
                "Developer tools startup Flowplane has raised $45 million in a Series B round led by Accel, bringing total funding to $68 million.",
            },
            {
              title: "Engineering Manager — Platform Team at Flowplane",
              url: "https://flowplane.io/careers/em-platform",
              snippet:
                "We're looking for an Engineering Manager to lead our platform team as we scale from 40 to 80 engineers over the next year.",
            },
          ],
        },
        {
          dimension: "targetTitles",
          confidence: 91,
          reasoning:
            "Marcus Chen is VP of Engineering at Flowplane, directly responsible for engineering org tooling decisions.",
          sources: [
            {
              title: "Marcus Chen — VP of Engineering at Flowplane",
              url: "https://linkedin.com/in/marcuschen",
              snippet:
                "Leading engineering at Flowplane. Previously Staff Engineer at Stripe. Passionate about developer experience and team velocity.",
            },
          ],
        },
        {
          dimension: "techStack",
          confidence: 88,
          reasoning:
            "Flowplane's stack includes React, TypeScript, and Next.js — matching Linear's ICP technology profile.",
          sources: [
            {
              title: "Our Engineering Stack — Flowplane Blog",
              url: "https://flowplane.io/blog/our-stack-2025",
              snippet:
                "We run a React/TypeScript frontend on Next.js, backed by PostgreSQL and deployed on Vercel.",
            },
          ],
        },
        {
          dimension: "painPoints",
          confidence: 85,
          reasoning:
            "Marcus Chen recently posted about the challenges of coordinating sprint planning across 6 engineering squads using fragmented tools.",
          sources: [
            {
              title: "Marcus Chen on LinkedIn",
              url: "https://linkedin.com/in/marcuschen/posts/sprint-planning",
              snippet:
                "Sprint planning across 6 squads shouldn't take a full day. We're burning hours in Jira just to get alignment on what's shipping next week.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-2",
    icpId: "mock-icp-1",
    company: "Usermatic",
    companyDomain: "usermatic.com",
    contactName: "Priya Sharma",
    contactTitle: "CTO",
    contactLinkedIn: "https://linkedin.com/in/priyasharma-cto",
    contactEmail: "priya@usermatic.com",
    emailStatus: "verified",
    score: 94,
    scoredAt: hoursAgo(1),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "C-Suite", dimension: "seniorityLevels" },
      { label: "Migrated off Jira", dimension: "triggers" },
      { label: "150-person eng team", dimension: "companySize" },
      { label: "Uses GitHub + Slack", dimension: "techStack" },
    ],
    proofPack: {
      summary:
        "Usermatic is a 200-person product analytics company whose CTO publicly wrote about leaving Jira last month. Their engineering blog details the productivity gains from switching to lighter-weight tooling, making them a high-intent prospect.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 96,
          reasoning:
            "CTO Priya Sharma published a blog post titled 'Why we left Jira' detailing their migration to lighter tools, directly matching the 'migrated off Jira' trigger.",
          sources: [
            {
              title: "Why We Left Jira — Usermatic Engineering Blog",
              url: "https://usermatic.com/blog/why-we-left-jira",
              snippet:
                "After 3 years on Jira, we finally pulled the plug. Our engineers were spending more time managing tickets than writing code.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 93,
          reasoning:
            "Usermatic is a B2B SaaS product analytics platform serving mid-market companies.",
          sources: [
            {
              title: "Usermatic — Product Analytics for Growing Teams",
              url: "https://usermatic.com",
              snippet:
                "Understand how your users actually use your product. Usermatic gives product teams the analytics they need without the complexity.",
            },
          ],
        },
        {
          dimension: "companySize",
          confidence: 90,
          reasoning:
            "Usermatic has approximately 200 employees with a 150-person engineering organization, well within the 50–2000 range.",
          sources: [
            {
              title: "Usermatic Company Profile — LinkedIn",
              url: "https://linkedin.com/company/usermatic",
              snippet: "201-500 employees · Software Development · San Francisco, CA",
            },
          ],
        },
        {
          dimension: "seniorityLevels",
          confidence: 98,
          reasoning:
            "Priya Sharma is CTO, the most senior technical decision-maker at the company.",
          sources: [
            {
              title: "Priya Sharma — CTO at Usermatic",
              url: "https://linkedin.com/in/priyasharma-cto",
              snippet:
                "CTO at Usermatic. Building the future of product analytics. Ex-Google, ex-Datadog.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-3",
    icpId: "mock-icp-1",
    company: "Nodecraft",
    companyDomain: "nodecraft.dev",
    contactName: "James Okafor",
    contactTitle: "Director of Engineering",
    contactLinkedIn: "https://linkedin.com/in/jamesokafor",
    contactEmail: "james@nodecraft.dev",
    emailStatus: "verified",
    score: 91,
    scoredAt: hoursAgo(2),
    fitSignals: [
      { label: "Developer Tools", dimension: "industry" },
      { label: "Director-level", dimension: "seniorityLevels" },
      { label: "Hiring 6 EMs", dimension: "triggers" },
      { label: "Western Europe", dimension: "geos" },
    ],
    proofPack: {
      summary:
        "Nodecraft is a Berlin-based developer tools company that posted 6 engineering manager roles in the past month. Their Director of Engineering recently spoke at a conference about the need for better project tracking in distributed teams.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 94,
          reasoning:
            "Nodecraft has 6 open engineering manager positions posted in the last 30 days, indicating significant team expansion.",
          sources: [
            {
              title: "Nodecraft Careers — Engineering Manager roles",
              url: "https://nodecraft.dev/careers",
              snippet:
                "Join our growing engineering org. We're hiring 6 Engineering Managers across Platform, Infrastructure, and Product teams.",
            },
            {
              title: "Nodecraft hiring spree signals expansion",
              url: "https://sifted.eu/articles/nodecraft-hiring-2025",
              snippet:
                "Berlin-based Nodecraft is on a hiring tear, posting over 20 engineering roles as it prepares to launch its enterprise tier.",
            },
          ],
        },
        {
          dimension: "geos",
          confidence: 92,
          reasoning:
            "Nodecraft is headquartered in Berlin, Germany, firmly within the Western Europe target geography.",
          sources: [
            {
              title: "Nodecraft — About",
              url: "https://nodecraft.dev/about",
              snippet:
                "Founded in Berlin in 2022, Nodecraft builds backend infrastructure tooling for modern engineering teams.",
            },
          ],
        },
        {
          dimension: "painPoints",
          confidence: 87,
          reasoning:
            "James Okafor gave a talk at DevOps Days Berlin about coordination challenges across distributed engineering teams using legacy PM tools.",
          sources: [
            {
              title: "DevOps Days Berlin 2025 — Talks",
              url: "https://devopsdays.org/berlin-2025/talks",
              snippet:
                "James Okafor: 'Coordination at Scale — Why your PM tool is your biggest bottleneck in distributed engineering.'",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 90,
          reasoning:
            "Nodecraft builds backend infrastructure tooling, placing them in the Developer Tools vertical.",
          sources: [
            {
              title: "Nodecraft",
              url: "https://nodecraft.dev",
              snippet:
                "Backend infrastructure tooling that lets your team focus on product, not plumbing.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-4",
    icpId: "mock-icp-1",
    company: "Pulsemetric",
    companyDomain: "pulsemetric.com",
    contactName: "Sarah Kim",
    contactTitle: "Head of Product",
    contactLinkedIn: "https://linkedin.com/in/sarahkim-pm",
    contactEmail: "sarah.kim@pulsemetric.com",
    emailStatus: "verified",
    score: 88,
    scoredAt: hoursAgo(3),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "Director-level", dimension: "seniorityLevels" },
      { label: "CEO posted about productivity", dimension: "triggers" },
      { label: "Uses React + Next.js", dimension: "techStack" },
      { label: "Fragmented tooling", dimension: "painPoints" },
    ],
    proofPack: {
      summary:
        "Pulsemetric is a 120-person observability startup whose CEO recently posted about developer productivity on LinkedIn. Their Head of Product has been vocal about the need for better cross-functional planning tools.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 89,
          reasoning:
            "Pulsemetric's CEO posted a LinkedIn article about developer productivity and tool consolidation two weeks ago, directly matching the CEO productivity trigger.",
          sources: [
            {
              title: "Why developer productivity is our #1 priority in 2026",
              url: "https://linkedin.com/posts/pulsemetric-ceo-productivity",
              snippet:
                "We've been measuring developer productivity for our customers but neglecting our own. This quarter, we're consolidating from 7 tools to 3.",
            },
          ],
        },
        {
          dimension: "painPoints",
          confidence: 86,
          reasoning:
            "Sarah Kim posted about the challenge of coordinating product and engineering planning across fragmented tools.",
          sources: [
            {
              title: "Sarah Kim on LinkedIn",
              url: "https://linkedin.com/in/sarahkim-pm/recent-activity",
              snippet:
                "Product and engineering are using 4 different tools to plan the same roadmap. There has to be a better way.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 91,
          reasoning: "Pulsemetric is a B2B SaaS observability platform.",
          sources: [
            {
              title: "Pulsemetric — Observability for modern teams",
              url: "https://pulsemetric.com",
              snippet:
                "Full-stack observability that helps engineering teams find and fix issues before users notice.",
            },
          ],
        },
        {
          dimension: "techStack",
          confidence: 84,
          reasoning:
            "Pulsemetric's job postings mention React, TypeScript, and Next.js as core frontend technologies.",
          sources: [
            {
              title: "Senior Frontend Engineer — Pulsemetric",
              url: "https://pulsemetric.com/careers/senior-fe",
              snippet:
                "You'll work with React, TypeScript, and Next.js to build dashboards that surface real-time data.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-5",
    icpId: "mock-icp-1",
    company: "Trackwise",
    companyDomain: "trackwise.io",
    contactName: "Daniel Reeves",
    contactTitle: "Engineering Manager",
    contactLinkedIn: "https://linkedin.com/in/danielreeves",
    contactEmail: "daniel@trackwise.io",
    emailStatus: "verified",
    score: 87,
    scoredAt: hoursAgo(4),
    fitSignals: [
      { label: "Project Management", dimension: "industry" },
      { label: "Manager-level", dimension: "seniorityLevels" },
      { label: "New product launch", dimension: "triggers" },
      { label: "North America", dimension: "geos" },
    ],
    proofPack: {
      summary:
        "Trackwise is a project management SaaS that launched a new enterprise tier last month. Their Engineering Manager is actively evaluating internal tooling changes as the team scales from 60 to 100 engineers.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 88,
          reasoning:
            "Trackwise launched their enterprise product line in December 2025, matching the 'new product line' trigger signal.",
          sources: [
            {
              title: "Trackwise launches Enterprise tier",
              url: "https://trackwise.io/blog/enterprise-launch",
              snippet:
                "Today we're launching Trackwise Enterprise, bringing our lightweight project tracking to teams of 500+.",
            },
          ],
        },
        {
          dimension: "companySize",
          confidence: 85,
          reasoning:
            "Trackwise has approximately 80 employees and is scaling to 120, within the ICP company size range.",
          sources: [
            {
              title: "Trackwise — LinkedIn Company Page",
              url: "https://linkedin.com/company/trackwise",
              snippet: "51-200 employees · Software Development · Austin, TX",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 93,
          reasoning:
            "Trackwise is a direct competitor in the project management software space.",
          sources: [
            {
              title: "Trackwise",
              url: "https://trackwise.io",
              snippet:
                "Lightweight project tracking for teams that move fast. No bloat, no complexity.",
            },
          ],
        },
        {
          dimension: "geos",
          confidence: 95,
          reasoning: "Trackwise is headquartered in Austin, TX — North America.",
          sources: [],
        },
      ],
    },
  },
  {
    id: "lead-6",
    icpId: "mock-icp-1",
    company: "Signalforge",
    companyDomain: "signalforge.co",
    contactName: "Aisha Patel",
    contactTitle: "Director of Developer Experience",
    contactLinkedIn: "https://linkedin.com/in/aishapatel",
    contactEmail: "aisha@signalforge.co",
    emailStatus: "verified",
    score: 85,
    scoredAt: hoursAgo(6),
    fitSignals: [
      { label: "Developer Tools", dimension: "industry" },
      { label: "Director-level", dimension: "seniorityLevels" },
      { label: "Raised Series C", dimension: "triggers" },
      { label: "Uses PostgreSQL + Vercel", dimension: "techStack" },
      { label: "UK", dimension: "geos" },
    ],
    proofPack: {
      summary:
        "Signalforge is a London-based developer experience platform that raised a $72M Series C three months ago. Their Director of Developer Experience is responsible for internal tooling decisions across a 200-engineer organization.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 95,
          reasoning:
            "Signalforge closed a $72M Series C in January 2026, directly matching the funding trigger.",
          sources: [
            {
              title: "Signalforge raises $72M to scale developer experience platform",
              url: "https://techcrunch.com/2026/01/10/signalforge-series-c",
              snippet:
                "London-based Signalforge has raised $72 million in Series C funding led by Insight Partners to expand its developer experience platform.",
            },
          ],
        },
        {
          dimension: "geos",
          confidence: 97,
          reasoning: "Signalforge is headquartered in London, UK.",
          sources: [
            {
              title: "Signalforge — About",
              url: "https://signalforge.co/about",
              snippet:
                "Founded in London in 2021. Offices in London, New York, and Sydney.",
            },
          ],
        },
        {
          dimension: "techStack",
          confidence: 82,
          reasoning:
            "Signalforge runs on PostgreSQL and deploys via Vercel, matching the ICP tech stack.",
          sources: [
            {
              title: "How We Build at Signalforge",
              url: "https://signalforge.co/blog/how-we-build",
              snippet:
                "Our stack: Next.js on Vercel, PostgreSQL for persistence, Redis for caching, and GitHub Actions for CI.",
            },
          ],
        },
        {
          dimension: "seniorityLevels",
          confidence: 90,
          reasoning:
            "Aisha Patel is Director-level, owning developer experience and internal tooling for the entire engineering org.",
          sources: [
            {
              title: "Aisha Patel — Director of Developer Experience",
              url: "https://linkedin.com/in/aishapatel",
              snippet:
                "Director of DX at Signalforge. Making engineers' lives better. Previously Spotify, GitHub.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-7",
    icpId: "mock-icp-1",
    company: "Canvaswork",
    companyDomain: "canvaswork.app",
    contactName: "Tom Andersen",
    contactTitle: "Staff Software Engineer",
    contactEmail: "tom.andersen@canvaswork.app",
    emailStatus: "catch-all",
    score: 84,
    scoredAt: hoursAgo(8),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "Uses TypeScript + React", dimension: "techStack" },
      { label: "Posted EM roles", dimension: "triggers" },
      { label: "Australia", dimension: "geos" },
    ],
    proofPack: {
      summary:
        "Canvaswork is a Sydney-based collaboration platform that posted 3 engineering manager roles this month. A Staff Engineer there has been writing about the need for better internal tooling on their engineering blog.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 86,
          reasoning:
            "Canvaswork has posted 3 engineering manager roles in the last 30 days, signaling org growth.",
          sources: [
            {
              title: "Canvaswork Careers",
              url: "https://canvaswork.app/careers",
              snippet:
                "We're hiring 3 Engineering Managers to lead squads across our collaboration platform.",
            },
          ],
        },
        {
          dimension: "geos",
          confidence: 96,
          reasoning: "Canvaswork is based in Sydney, Australia.",
          sources: [
            {
              title: "Canvaswork — About Us",
              url: "https://canvaswork.app/about",
              snippet: "Built in Sydney. Used by teams worldwide.",
            },
          ],
        },
        {
          dimension: "techStack",
          confidence: 89,
          reasoning: "Canvaswork uses React, TypeScript, and Vercel based on job postings.",
          sources: [
            {
              title: "Senior Frontend Engineer — Canvaswork",
              url: "https://canvaswork.app/careers/sfe",
              snippet:
                "Stack: React, TypeScript, TailwindCSS, deployed on Vercel. We care deeply about developer experience.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 88,
          reasoning:
            "Canvaswork is a B2B collaboration SaaS platform for distributed teams.",
          sources: [
            {
              title: "Canvaswork",
              url: "https://canvaswork.app",
              snippet:
                "Real-time collaboration for distributed teams. Whiteboards, docs, and project tracking in one place.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-8",
    icpId: "mock-icp-1",
    company: "Deploystack",
    companyDomain: "deploystack.com",
    contactName: "Elena Volkov",
    contactTitle: "VP of Engineering",
    contactLinkedIn: "https://linkedin.com/in/elenavolkov",
    contactEmail: "elena.volkov@deploystack.com",
    emailStatus: "verified",
    score: 83,
    scoredAt: hoursAgo(10),
    fitSignals: [
      { label: "Developer Tools", dimension: "industry" },
      { label: "VP-level", dimension: "seniorityLevels" },
      { label: "Recently migrated off Jira", dimension: "triggers" },
      { label: "North America", dimension: "geos" },
      { label: "Engineers resist PM tools", dimension: "painPoints" },
    ],
    proofPack: {
      summary:
        "Deploystack is a deployment automation company whose VP of Engineering recently led a migration off Jira. Internal blog posts reveal significant frustration with existing project management solutions across their 90-person engineering team.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 91,
          reasoning:
            "Deploystack's engineering blog published a post about migrating off Jira in March 2026, directly matching the trigger.",
          sources: [
            {
              title: "Goodbye Jira: Our Migration Story — Deploystack Blog",
              url: "https://deploystack.com/blog/goodbye-jira",
              snippet:
                "After 4 years on Jira, we finally made the switch. Here's what we learned about migrating 90 engineers off a tool they'd grown to resent.",
            },
          ],
        },
        {
          dimension: "painPoints",
          confidence: 88,
          reasoning:
            "Elena Volkov's team reported low tool adoption — only 40% of engineers were actively using Jira for daily work.",
          sources: [
            {
              title: "Elena Volkov on LinkedIn",
              url: "https://linkedin.com/in/elenavolkov/posts",
              snippet:
                "Our internal survey showed 60% of engineers were tracking work outside of Jira. That was the wake-up call.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 92,
          reasoning: "Deploystack builds deployment automation tooling for engineering teams.",
          sources: [
            {
              title: "Deploystack — Deployment automation",
              url: "https://deploystack.com",
              snippet:
                "One-click deployments for any stack. Deploystack automates your entire deployment pipeline.",
            },
          ],
        },
        {
          dimension: "seniorityLevels",
          confidence: 97,
          reasoning:
            "Elena Volkov is VP of Engineering, a key decision-maker for engineering tools.",
          sources: [
            {
              title: "Elena Volkov — VP of Engineering at Deploystack",
              url: "https://linkedin.com/in/elenavolkov",
              snippet: "VP Engineering at Deploystack. Ex-HashiCorp, ex-DigitalOcean.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-9",
    icpId: "mock-icp-1",
    company: "Gridbase",
    companyDomain: "gridbase.dev",
    contactName: "Ryan Nakamura",
    contactTitle: "Principal Engineer",
    contactLinkedIn: "https://linkedin.com/in/ryannakamura",
    contactEmail: "ryan@gridbase.dev",
    emailStatus: "verified",
    score: 79,
    scoredAt: hoursAgo(12),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "Uses GitHub + Slack", dimension: "techStack" },
      { label: "Launched new product", dimension: "triggers" },
      { label: "Sprint planning bottleneck", dimension: "painPoints" },
    ],
    proofPack: {
      summary:
        "Gridbase is a data infrastructure company that launched a new real-time analytics product last quarter. Their Principal Engineer has been active in discussions about engineering workflow improvements on Hacker News.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 85,
          reasoning:
            "Gridbase launched Gridbase Realtime, a new product line, in Q4 2025.",
          sources: [
            {
              title: "Introducing Gridbase Realtime",
              url: "https://gridbase.dev/blog/realtime-launch",
              snippet:
                "Today we're launching Gridbase Realtime — sub-millisecond analytics queries on streaming data.",
            },
          ],
        },
        {
          dimension: "painPoints",
          confidence: 80,
          reasoning:
            "Ryan Nakamura commented on Hacker News about sprint planning overhead consuming 15% of engineering time.",
          sources: [
            {
              title: "HN Discussion: Sprint planning is broken",
              url: "https://news.ycombinator.com/item?id=39012345",
              snippet:
                "rnakamura: At our scale (~70 engineers), sprint planning takes about 15% of each sprint's time. We've tried everything.",
            },
          ],
        },
        {
          dimension: "techStack",
          confidence: 83,
          reasoning:
            "Gridbase uses GitHub for source control and Slack for communication, per their open-source contributions.",
          sources: [
            {
              title: "Gridbase on GitHub",
              url: "https://github.com/gridbase",
              snippet: "Gridbase — Data infrastructure for the modern stack. 47 repositories.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 89,
          reasoning: "Gridbase is a B2B SaaS data infrastructure platform.",
          sources: [
            {
              title: "Gridbase",
              url: "https://gridbase.dev",
              snippet:
                "The data infrastructure platform for teams that need speed and reliability.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-10",
    icpId: "mock-icp-1",
    company: "Metricly",
    companyDomain: "metricly.io",
    contactName: "Camila Rodriguez",
    contactTitle: "Head of Platform",
    contactLinkedIn: "https://linkedin.com/in/camilarodriguez",
    contactEmail: "camila@metricly.io",
    emailStatus: "verified",
    score: 77,
    scoredAt: hoursAgo(18),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "Director-level", dimension: "seniorityLevels" },
      { label: "CEO posted about dev productivity", dimension: "triggers" },
      { label: "North America", dimension: "geos" },
      { label: "Uses React", dimension: "techStack" },
    ],
    proofPack: {
      summary:
        "Metricly is a business intelligence SaaS whose CEO recently discussed developer productivity challenges on a podcast. Their Head of Platform manages internal tooling for a 100+ person engineering org.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 82,
          reasoning:
            "Metricly's CEO appeared on the Engineering Leadership podcast discussing developer productivity tools and their impact on shipping velocity.",
          sources: [
            {
              title: "Engineering Leadership Podcast — Episode 142",
              url: "https://engineeringleadership.com/ep142",
              snippet:
                "Metricly CEO: 'We spend more time managing the process of building software than actually building software. That has to change.'",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 90,
          reasoning: "Metricly is a B2B SaaS business intelligence platform.",
          sources: [
            {
              title: "Metricly — BI for modern teams",
              url: "https://metricly.io",
              snippet:
                "Business intelligence that connects to your stack and gives you answers in seconds.",
            },
          ],
        },
        {
          dimension: "seniorityLevels",
          confidence: 88,
          reasoning:
            "Camila Rodriguez is Head of Platform, a Director-level role overseeing internal engineering infrastructure.",
          sources: [
            {
              title: "Camila Rodriguez — Head of Platform at Metricly",
              url: "https://linkedin.com/in/camilarodriguez",
              snippet:
                "Head of Platform at Metricly. Building the foundation that our product teams ship on.",
            },
          ],
        },
        {
          dimension: "geos",
          confidence: 94,
          reasoning: "Metricly is headquartered in San Francisco.",
          sources: [],
        },
      ],
    },
  },
  {
    id: "lead-11",
    icpId: "mock-icp-1",
    company: "Relaybox",
    companyDomain: "relaybox.io",
    contactName: "Ahmed Hassan",
    contactTitle: "Engineering Manager",
    contactEmail: "ahmed.hassan@relaybox.io",
    emailStatus: "catch-all",
    score: 78,
    scoredAt: daysAgo(1),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "Manager-level", dimension: "seniorityLevels" },
      { label: "Posted EM roles", dimension: "triggers" },
      { label: "Western Europe", dimension: "geos" },
    ],
    proofPack: {
      summary:
        "Relaybox is an Amsterdam-based API gateway company that posted 2 engineering manager roles this month. Their existing EM is looking for better tooling to coordinate a growing distributed team.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 83,
          reasoning:
            "Relaybox posted 2 engineering manager positions in the last 3 weeks.",
          sources: [
            {
              title: "Engineering Manager — Relaybox",
              url: "https://relaybox.io/careers/em",
              snippet:
                "We're hiring 2 Engineering Managers to help scale our platform and developer experience teams.",
            },
          ],
        },
        {
          dimension: "geos",
          confidence: 95,
          reasoning: "Relaybox is based in Amsterdam, Netherlands.",
          sources: [
            {
              title: "Relaybox — About",
              url: "https://relaybox.io/about",
              snippet:
                "Built in Amsterdam. Serving API-first companies worldwide.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 87,
          reasoning: "Relaybox is a B2B SaaS API gateway platform.",
          sources: [
            {
              title: "Relaybox — API Gateway",
              url: "https://relaybox.io",
              snippet:
                "The API gateway that scales with you. Route, rate-limit, and monitor your APIs in one place.",
            },
          ],
        },
        {
          dimension: "seniorityLevels",
          confidence: 85,
          reasoning: "Ahmed Hassan is an Engineering Manager, matching the Manager seniority.",
          sources: [],
        },
      ],
    },
  },
  {
    id: "lead-12",
    icpId: "mock-icp-1",
    company: "Launchpad AI",
    companyDomain: "launchpadai.com",
    contactName: "Jessica Torres",
    contactTitle: "Chief Product Officer",
    contactLinkedIn: "https://linkedin.com/in/jessicatorres-cpo",
    contactEmail: "jessica@launchpadai.com",
    emailStatus: "verified",
    score: 76,
    scoredAt: daysAgo(1),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "C-Suite", dimension: "seniorityLevels" },
      { label: "Raised Series B", dimension: "triggers" },
      { label: "No single source of truth", dimension: "painPoints" },
    ],
    proofPack: {
      summary:
        "Launchpad AI is an ML platform that raised $38M in Series B funding 4 months ago. Their CPO has publicly discussed the challenge of maintaining a single source of truth for product roadmaps across engineering and product teams.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 80,
          reasoning:
            "Launchpad AI raised a $38M Series B in December 2025.",
          sources: [
            {
              title: "Launchpad AI raises $38M Series B",
              url: "https://venturebeat.com/2025/12/05/launchpad-ai-series-b",
              snippet:
                "Launchpad AI, which builds ML deployment tools, has raised $38 million in a Series B led by Index Ventures.",
            },
          ],
        },
        {
          dimension: "painPoints",
          confidence: 78,
          reasoning:
            "Jessica Torres wrote about the roadmap fragmentation problem in a product management newsletter.",
          sources: [
            {
              title: "The Roadmap Fragmentation Problem — Product Thoughts",
              url: "https://productthoughts.substack.com/p/roadmap-fragmentation",
              snippet:
                "When engineering uses Jira, product uses Notion, and leadership uses slides, nobody has the same roadmap. We're solving this at Launchpad AI.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 86,
          reasoning: "Launchpad AI is a B2B SaaS ML deployment platform.",
          sources: [
            {
              title: "Launchpad AI",
              url: "https://launchpadai.com",
              snippet:
                "Deploy ML models to production in minutes. Launchpad AI handles the infrastructure so you can focus on the models.",
            },
          ],
        },
        {
          dimension: "seniorityLevels",
          confidence: 96,
          reasoning: "Jessica Torres is CPO, a C-Suite executive.",
          sources: [
            {
              title: "Jessica Torres — CPO at Launchpad AI",
              url: "https://linkedin.com/in/jessicatorres-cpo",
              snippet:
                "Chief Product Officer at Launchpad AI. Building the future of ML deployment.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-13",
    icpId: "mock-icp-1",
    company: "Vantage Point",
    companyDomain: "vantagepoint.dev",
    contactName: "Liam O'Brien",
    contactTitle: "Director of Engineering",
    contactLinkedIn: "https://linkedin.com/in/liamobrien-eng",
    contactEmail: "liam@vantagepoint.dev",
    emailStatus: "unknown",
    score: 74,
    scoredAt: daysAgo(1.5),
    fitSignals: [
      { label: "Developer Tools", dimension: "industry" },
      { label: "Director-level", dimension: "seniorityLevels" },
      { label: "New product launch", dimension: "triggers" },
      { label: "UK", dimension: "geos" },
    ],
    proofPack: {
      summary:
        "Vantage Point is a UK-based code review platform that launched a new team analytics feature last month. Their Director of Engineering oversees a 60-person team using a mix of internal and third-party tools.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 77,
          reasoning:
            "Vantage Point launched 'Team Insights', a new analytics product, in March 2026.",
          sources: [
            {
              title: "Introducing Team Insights — Vantage Point Blog",
              url: "https://vantagepoint.dev/blog/team-insights",
              snippet:
                "Team Insights gives engineering leaders visibility into review cycles, bottlenecks, and team health metrics.",
            },
          ],
        },
        {
          dimension: "geos",
          confidence: 93,
          reasoning: "Vantage Point is headquartered in London, UK.",
          sources: [
            {
              title: "Vantage Point — About",
              url: "https://vantagepoint.dev/about",
              snippet: "Founded in London. Making code review faster and better for teams everywhere.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 91,
          reasoning:
            "Vantage Point builds code review and engineering analytics tooling.",
          sources: [
            {
              title: "Vantage Point",
              url: "https://vantagepoint.dev",
              snippet:
                "Code review that helps your team ship with confidence. AI-powered reviews, analytics, and team insights.",
            },
          ],
        },
        {
          dimension: "seniorityLevels",
          confidence: 90,
          reasoning: "Liam O'Brien is Director of Engineering.",
          sources: [],
        },
      ],
    },
  },
  {
    id: "lead-14",
    icpId: "mock-icp-1",
    company: "Buildkraft",
    companyDomain: "buildkraft.com",
    contactName: "Nina Johansson",
    contactTitle: "Staff Engineer",
    contactLinkedIn: "https://linkedin.com/in/ninajohansson",
    contactEmail: "nina.johansson@buildkraft.com",
    emailStatus: "unknown",
    score: 68,
    scoredAt: daysAgo(1.5),
    fitSignals: [
      { label: "Developer Tools", dimension: "industry" },
      { label: "Uses Next.js + Vercel", dimension: "techStack" },
      { label: "CEO posted about productivity", dimension: "triggers" },
      { label: "Western Europe", dimension: "geos" },
    ],
    proofPack: {
      summary:
        "Buildkraft is a Stockholm-based build tooling company whose CEO discussed engineering productivity on a Swedish tech podcast. Their Staff Engineer is evaluating new project management solutions for the team.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 72,
          reasoning:
            "Buildkraft's CEO appeared on a Swedish tech podcast discussing developer productivity and tool consolidation.",
          sources: [
            {
              title: "Nordic Tech Podcast — Episode 89",
              url: "https://nordictechpodcast.se/ep89",
              snippet:
                "Buildkraft CEO: 'Swedish engineering teams are some of the most productive in the world, but we're still hampered by the same clunky tools as everyone else.'",
            },
          ],
        },
        {
          dimension: "geos",
          confidence: 94,
          reasoning: "Buildkraft is based in Stockholm, Sweden — Western Europe.",
          sources: [
            {
              title: "Buildkraft — About",
              url: "https://buildkraft.com/about",
              snippet: "Based in Stockholm. Building better build tools since 2021.",
            },
          ],
        },
        {
          dimension: "techStack",
          confidence: 79,
          reasoning: "Buildkraft's marketing site runs on Next.js and Vercel.",
          sources: [
            {
              title: "Buildkraft Engineering Blog",
              url: "https://buildkraft.com/blog/our-stack",
              snippet:
                "We dogfood our own tools for the backend, but our frontend is Next.js on Vercel with TypeScript.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 88,
          reasoning:
            "Buildkraft builds developer build tooling, placing them in the Developer Tools space.",
          sources: [
            {
              title: "Buildkraft",
              url: "https://buildkraft.com",
              snippet: "Fast, reliable builds for every team. Buildkraft makes CI/CD painless.",
            },
          ],
        },
      ],
    },
  },
  {
    id: "lead-15",
    icpId: "mock-icp-1",
    company: "Apiture",
    companyDomain: "apiture.io",
    contactName: "David Park",
    contactTitle: "Engineering Manager",
    contactEmail: "david.park@apiture.io",
    emailStatus: "invalid",
    score: 63,
    scoredAt: daysAgo(2),
    fitSignals: [
      { label: "B2B SaaS", dimension: "industry" },
      { label: "Manager-level", dimension: "seniorityLevels" },
      { label: "Posted EM roles", dimension: "triggers" },
      { label: "Fragmented tooling", dimension: "painPoints" },
    ],
    proofPack: {
      summary:
        "Apiture is an API management platform that recently posted engineering manager roles. Their existing EM has mentioned tooling fragmentation as a challenge, though evidence is thinner than other prospects.",
      dimensions: [
        {
          dimension: "triggers",
          confidence: 68,
          reasoning:
            "Apiture posted 1 engineering manager role in the past month.",
          sources: [
            {
              title: "Engineering Manager — Apiture",
              url: "https://apiture.io/careers/em",
              snippet:
                "Join our engineering team as an EM. You'll lead a squad of 6-8 engineers building our API management platform.",
            },
          ],
        },
        {
          dimension: "painPoints",
          confidence: 65,
          reasoning:
            "David Park mentioned in a Slack community that his team uses 5 different tools for project management.",
          sources: [
            {
              title: "DevTools Community Slack",
              url: "https://devtools-community.slack.com/archives/C03ABC123",
              snippet:
                "dpark: We're using Jira, Notion, Slack reminders, Google Sheets, and Linear for different things. It's chaos.",
            },
          ],
        },
        {
          dimension: "industry",
          confidence: 84,
          reasoning: "Apiture is a B2B SaaS API management platform.",
          sources: [
            {
              title: "Apiture",
              url: "https://apiture.io",
              snippet: "API management for growing teams. Design, deploy, and monitor your APIs.",
            },
          ],
        },
        {
          dimension: "seniorityLevels",
          confidence: 85,
          reasoning: "David Park is an Engineering Manager.",
          sources: [],
        },
      ],
    },
  },
];

export const mockCampaigns: Campaign[] = [
  {
    id: "campaign-1",
    name: "Linear ICP — Engineering Leaders",
    status: "active",
    icpId: "mock-icp-1",
    leadsEnrolled: 48,
    sent: 124,
    opened: 52,
    replied: 14,
    createdAt: daysAgo(6),
    sequence: [
      {
        day: 1,
        subject: "Quick question about {{company}}'s eng tooling",
        body: "Hi {{firstName}},\n\nI noticed {{company}} recently posted several engineering manager roles — congrats on the growth. When teams scale that fast, project tracking usually becomes the first bottleneck.\n\nWe built Outpulse to help engineering leaders find and fix those workflow gaps before they slow down shipping. Would it make sense to show you what we've found for teams at your stage?\n\nBest,\nIgnacio",
      },
      {
        day: 3,
        subject: "Re: Quick question about {{company}}'s eng tooling",
        body: "Hi {{firstName}},\n\nWanted to follow up with something specific — we ran an analysis on {{company}}'s public signals and found 3 areas where teams your size typically see a 2x improvement in sprint velocity.\n\nHappy to share the full breakdown if you're curious. Takes 15 minutes.\n\nIgnacio",
      },
      {
        day: 7,
        subject: "One thing I noticed about {{company}}",
        body: "Hi {{firstName}},\n\nI came across {{company}}'s engineering blog and the migration story resonated. A lot of the teams we work with went through similar growing pains.\n\nIf you're evaluating new approaches to project tracking, I'd love to share what's working for teams at your scale. No pitch — just patterns we're seeing.\n\nIgnacio",
      },
      {
        day: 14,
        subject: "Last note from me",
        body: "Hi {{firstName}},\n\nI know timing is everything. If project tracking isn't a priority right now, totally get it.\n\nIf it becomes one, here's a quick way to see what Outpulse surfaces for companies like {{company}}: outpulse.com/demo\n\nWishing you and the team a great quarter.\n\nIgnacio",
      },
    ],
  },
  {
    id: "campaign-2",
    name: "EM Outreach — Q4",
    status: "warming",
    icpId: "mock-icp-1",
    leadsEnrolled: 12,
    sent: 0,
    opened: 0,
    replied: 0,
    createdAt: daysAgo(2),
    sequence: [
      {
        day: 1,
        subject: "Saw {{company}} is hiring EMs — quick thought",
        body: "Hi {{firstName}},\n\nNoticed {{company}} is scaling the engineering management layer. In our experience, that's exactly when project tracking tools start breaking down.\n\nWe've been helping similar teams get ahead of that problem. Worth a 10-minute chat?\n\nIgnacio",
      },
      {
        day: 4,
        subject: "Re: Saw {{company}} is hiring EMs",
        body: "Hi {{firstName}},\n\nQuick follow-up — we put together a brief analysis of {{company}}'s growth signals and how similar companies approached their tooling decisions at this stage.\n\nWould you find that useful? Happy to send it over.\n\nIgnacio",
      },
      {
        day: 10,
        subject: "Closing the loop",
        body: "Hi {{firstName}},\n\nTotally understand if now's not the right time. If tooling comes up in your planning, we're at outpulse.com.\n\nGood luck with the hiring push!\n\nIgnacio",
      },
    ],
  },
  {
    id: "campaign-3",
    name: "Staff Engineers — Warm Intro",
    status: "paused",
    icpId: "mock-icp-1",
    leadsEnrolled: 30,
    sent: 87,
    opened: 31,
    replied: 4,
    createdAt: daysAgo(14),
    sequence: [
      {
        day: 1,
        subject: "Fellow engineer → quick question",
        body: "Hi {{firstName}},\n\nI'm an engineer who got frustrated with how broken lead generation tools are, so I built one that actually works. Not the usual sales pitch — I wanted to reach out engineer-to-engineer.\n\nI noticed {{company}} is growing fast. Have you run into project tracking pain as the team scales? Curious if what we're seeing across the industry matches your experience.\n\nIgnacio",
      },
      {
        day: 3,
        subject: "Re: Fellow engineer → quick question",
        body: "Hi {{firstName}},\n\nOne thing I forgot to mention — we found some interesting public signals about {{company}} that suggest your team might be evaluating new approaches to engineering workflows.\n\nWould love to compare notes if you have 10 minutes. No slides, just a conversation.\n\nIgnacio",
      },
      {
        day: 7,
        subject: "Something you might find useful",
        body: "Hi {{firstName}},\n\nI put together a short analysis of how companies at {{company}}'s stage typically approach the tooling question. It's based on patterns we've seen across ~200 engineering teams.\n\nHappy to share if you're interested. Either way, hope the scaling is going well.\n\nIgnacio",
      },
      {
        day: 12,
        subject: "One last thing",
        body: "Hi {{firstName}},\n\nI'll keep this short — if {{company}} ever evaluates project management tools, I'd love to be in the conversation. We've helped teams similar to yours cut sprint planning time by 60%.\n\noutpulse.com/demo if you ever want to take a look.\n\nIgnacio",
      },
      {
        day: 21,
        subject: "Breakup email (but make it engineering)",
        body: "Hi {{firstName}},\n\nThis is my last reach-out. I know engineers hate getting cold emails (I do too).\n\nIf project tracking or engineering workflow ever becomes a priority, you know where to find us. Until then, I'll stop filling your inbox.\n\nShip fast,\nIgnacio",
      },
    ],
  },
];

export const mockSearchHistory: SearchHistoryEntry[] = [
  {
    id: "search-1",
    icpId: "mock-icp-1",
    sourceUrl: "https://linear.app",
    sourceCompanyName: "Linear",
    leadCount: 15,
    runAt: hoursAgo(2),
  },
  {
    id: "search-2",
    icpId: "mock-icp-1",
    sourceUrl: "https://notion.so",
    sourceCompanyName: "Notion",
    leadCount: 22,
    runAt: daysAgo(1),
  },
  {
    id: "search-3",
    icpId: "mock-icp-1",
    sourceUrl: "https://figma.com",
    sourceCompanyName: "Figma",
    leadCount: 31,
    runAt: daysAgo(2),
  },
  {
    id: "search-4",
    icpId: "mock-icp-1",
    sourceUrl: "https://vercel.com",
    sourceCompanyName: "Vercel",
    leadCount: 19,
    runAt: daysAgo(4),
  },
  {
    id: "search-5",
    icpId: "mock-icp-1",
    sourceUrl: "https://supabase.com",
    sourceCompanyName: "Supabase",
    leadCount: 27,
    runAt: daysAgo(6),
  },
  {
    id: "search-6",
    icpId: "mock-icp-1",
    sourceUrl: "https://railway.app",
    sourceCompanyName: "Railway",
    leadCount: 14,
    runAt: daysAgo(9),
  },
  {
    id: "search-7",
    icpId: "mock-icp-1",
    sourceUrl: "https://resend.com",
    sourceCompanyName: "Resend",
    leadCount: 11,
    runAt: daysAgo(11),
  },
  {
    id: "search-8",
    icpId: "mock-icp-1",
    sourceUrl: "https://planetscale.com",
    sourceCompanyName: "PlanetScale",
    leadCount: 18,
    runAt: daysAgo(13),
  },
];

export const mockNotifications: Notification[] = [
  {
    id: "notif-1",
    title: "New lead matched your ICP",
    body: "Nodecraft posted an engineering manager role matching 3 of your triggers",
    createdAt: minutesAgo(20),
    read: false,
  },
  {
    id: "notif-2",
    title: "Campaign reached reply milestone",
    body: "Linear ICP — Engineering Leaders hit 14 replies (11.3% reply rate)",
    createdAt: hoursAgo(4),
    read: true,
  },
];
